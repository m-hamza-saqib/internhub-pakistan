import { createClient, createAdminClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { reviewApplicationSchema } from '@/lib/validations/schemas';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: applicationId } = await params;
  const supabase = await createClient();
  const adminClient = await createAdminClient();

  // Verify admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ success: false, error: { code: 'AUTH_REQUIRED', message: 'Authentication required.' } }, { status: 401 });

  const { data: profileRaw } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  const adminProfile = profileRaw as { role: string } | null;
  if (!adminProfile || adminProfile.role !== 'admin') {
    return NextResponse.json({ success: false, error: { code: 'FORBIDDEN', message: 'Admin access required.' } }, { status: 403 });
  }

  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid body.' } }, { status: 400 });
  }

  const parsed = reviewApplicationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: (parsed.error as any).errors[0].message } }, { status: 400 });
  }

  const { action, rejection_reason, admin_notes } = parsed.data;

  // Get application without broken profiles join
  const { data: applicationRaw, error: fetchError } = await adminClient
    .from('applications')
    .select('*, internship:internships(title, category, duration_weeks, difficulty, id)')
    .eq('id', applicationId)
    .maybeSingle();
    
  if (fetchError || !applicationRaw) {
    return NextResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'Application not found.' } }, { status: 404 });
  }

  const application = applicationRaw as any;

  // Fetch applicant separately
  const { data: profile } = await adminClient
    .from('profiles')
    .select('full_name, email')
    .eq('id', application.user_id)
    .maybeSingle();

  application.applicant = profile || { full_name: 'Unknown User', email: 'Unknown' };
  const internship = application.internship;

  if (action === 'accept') {
    try {
      // 1. Update application status to ACCEPTED
      const { error: updateError } = await (adminClient.from('applications') as any).update({
        status: 'accepted',
        reviewed_at: new Date().toISOString(),
        reviewed_by: user.id,
        admin_notes: admin_notes || 'Selected for next batch.',
        offer_letter_url: application.offer_letter_url || 'https://internhub-pakistan.vercel.app/offer-letter-template.pdf'
      }).eq('id', applicationId);

      if (updateError) {
        console.error('Core Accept Update Failed, trying fallback:', updateError);
        // Fallback: update only status if extra columns fail
        const { error: fallbackError } = await (adminClient.from('applications') as any)
          .update({ status: 'accepted' })
          .eq('id', applicationId);
          
        if (fallbackError) throw fallbackError;
      }

      // 2. Create selection notification
      const { error: notifyError } = await (adminClient.from('notifications') as any).insert({
        user_id: application.user_id,
        type: 'application_update',
        title: '🎉 Congratulations! You are Selected!',
        body: `You have been selected for the "${internship.title}" internship. Please check your dashboard to download your offer letter and pay the community fee.`,
        link: '/my-internship',
        is_read: false,
      });
      // We don't throw for notifications to avoid breaking the core flow

      return NextResponse.json({ success: true, message: 'Application accepted. Student notified.' });
    } catch (err: any) {
      console.error('Accept Action Error:', err);
      return NextResponse.json({ success: false, error: { message: 'Failed to accept application.', details: err.message } }, { status: 500 });
    }

  } else if (action === 'reject') {
    try {
      const { error: updateError } = await (adminClient.from('applications') as any).update({
        status: 'rejected',
        rejection_reason,
        admin_notes,
        reviewed_at: new Date().toISOString(),
        reviewed_by: user.id,
      }).eq('id', applicationId);

      if (updateError) {
        console.error('Core Reject Update Failed, trying fallback:', updateError);
        const { error: fallbackError } = await (adminClient.from('applications') as any)
          .update({ status: 'rejected' })
          .eq('id', applicationId);
          
        if (fallbackError) throw fallbackError;
      }

      await (adminClient.from('notifications') as any).insert({
        user_id: application.user_id,
        type: 'application_update',
        title: 'Application Update',
        body: `Your application for "${internship.title}" was not selected this time. However, you can apply again for our upcoming batches!`,
        link: '/internships',
        is_read: false,
      });

      return NextResponse.json({ success: true, message: 'Application rejected.' });
    } catch (err: any) {
      console.error('Reject Action Error:', err);
      return NextResponse.json({ success: false, error: { message: 'Failed to reject application.', details: err.message } }, { status: 500 });
    }
  }

  return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid action.' } }, { status: 400 });
}
