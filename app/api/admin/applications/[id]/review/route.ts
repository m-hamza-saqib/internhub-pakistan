import { createClient, createAdminClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { reviewApplicationSchema } from '@/lib/validations/schemas';
import { addDays, format } from 'date-fns';

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


  // Get application with user and internship details
  const { data: applicationRaw, error: fetchError } = await adminClient
    .from('applications')
    .select('*, applicant:profiles!applications_user_id_fkey(full_name, email, cnic), internship:internships(title, category, duration_weeks, difficulty, id)')
    .eq('id', applicationId)
    .single();
    
  if (fetchError || !applicationRaw) {
    return NextResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'Application or internship record not found.' } }, { status: 404 });
  }

  const application = applicationRaw as any;
  const internship = application.internship;
  const profile = application.applicant;

  // Fetch current enrollment status to check capacity
  const { data: currentInternship } = await adminClient
    .from('internships')
    .select('spots_filled, spots_total')
    .eq('id', internship.id)
    .single();

  if (action === 'accept') {
    if (currentInternship && currentInternship.spots_filled >= currentInternship.spots_total) {
      return NextResponse.json({ 
        success: false, 
        error: { 
          code: 'CAPACITY_REACHED', 
          message: 'This internship has reached its maximum enrollment limit.' 
        } 
      }, { status: 400 });
    }
    try {
      const startDate = new Date();
      const endDate = addDays(startDate, internship.duration_weeks * 7);

      // Update application status
      await (adminClient.from('applications') as any).update({
        status: 'accepted',
        reviewed_at: new Date().toISOString(),
        reviewed_by: user.id,
        admin_notes: admin_notes || null,
      }).eq('id', applicationId);

      // Create enrollment
      const { data: enrollment, error: enrollError } = await (adminClient.from('enrollments') as any)
        .insert({
          user_id: application.user_id,
          application_id: applicationId,
          internship_id: internship.id,
          start_date: format(startDate, 'yyyy-MM-dd'),
          end_date: format(endDate, 'yyyy-MM-dd'),
        })
        .select()
        .single();

      if (enrollError || !enrollment) {
        // Rollback application status if enrollment fails
        await (adminClient.from('applications') as any).update({ status: 'pending' }).eq('id', applicationId);
        return NextResponse.json({ 
          success: false, 
          error: { 
            code: 'ENROLLMENT_FAILED', 
            message: 'Failed to create enrollment. Application reverted to pending.',
            details: enrollError?.message 
          } 
        }, { status: 500 });
      }

      // Create project submissions for all internship projects
      const { data: projects } = await adminClient
        .from('internship_projects')
        .select('id')
        .eq('internship_id', internship.id)
        .order('order_index');

      if (projects && projects.length > 0) {
        await (adminClient.from('project_submissions') as any).insert(
          projects.map((p: any) => ({
            enrollment_id: enrollment.id,
            project_id: p.id,
            user_id: application.user_id,
            status: 'in_progress',
            file_urls: [],
            attempt_number: 1,
          }))
        );
      }

      // Create in-app notification
      await (adminClient.from('notifications') as any).insert({
        user_id: application.user_id,
        type: 'application_update',
        title: '🎉 Application Accepted!',
        body: `Congratulations! Your application for "${internship.title}" has been accepted. Check your email for the offer letter.`,
        link: '/my-internship',
        is_read: false,
      });

      // Increment spots_filled
      await adminClient
        .from('internships')
        .update({ spots_filled: (currentInternship?.spots_filled || 0) + 1 })
        .eq('id', internship.id);

      return NextResponse.json({ success: true, data: { enrollment_id: enrollment.id } });
    } catch (err: any) {
      // General safety rollback
      await (adminClient.from('applications') as any).update({ status: 'pending' }).eq('id', applicationId);
      return NextResponse.json({ 
        success: false, 
        error: { message: 'Unexpected enrollment error.', details: err.message } 
      }, { status: 500 });
    }

  } else if (action === 'reject') {
    await (adminClient.from('applications') as any).update({
      status: 'rejected',
      rejection_reason,
      admin_notes,
      reviewed_at: new Date().toISOString(),
      reviewed_by: user.id,
    }).eq('id', applicationId);

    await (adminClient.from('notifications') as any).insert({
      user_id: application.user_id,
      type: 'application_update',
      title: 'Application Update',
      body: `Your application for "${internship.title}" was not selected this time. You may reapply after 30 days.`,
      link: '/applications',
      is_read: false,
    });

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid action.' } }, { status: 400 });
}
