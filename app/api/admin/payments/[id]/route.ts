import { createClient, createAdminClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { addDays } from 'date-fns';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: proofId } = await params;
  const supabase = await createClient();
  const adminClient = await createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });

  const { data: profileRaw } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if ((profileRaw as any)?.role !== 'admin') {
    return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
  }

  const body = await req.json();
  const { action, rejection_reason } = body as { action: 'approve' | 'reject'; rejection_reason?: string };

  if (!['approve', 'reject'].includes(action)) {
    return NextResponse.json({ error: 'Invalid action.' }, { status: 400 });
  }

  const { data: proofRaw, error: fetchErr } = await (adminClient.from('payment_proofs') as any)
    .select('*')
    .eq('id', proofId)
    .single();

  if (fetchErr || !proofRaw) {
    return NextResponse.json({ error: 'Payment proof not found.' }, { status: 404 });
  }

  const proof = proofRaw as any;

  if (action === 'approve') {
    // 1. Mark proof as approved
    await (adminClient.from('payment_proofs') as any)
      .update({ status: 'approved', reviewed_by: user.id, reviewed_at: new Date().toISOString() })
      .eq('id', proofId);

    // 2. Set is_lifetime_member = true (Legacy support, but primarily for dashboard access)
    await (adminClient.from('profiles') as any)
      .update({ is_lifetime_member: true })
      .eq('id', proof.user_id);

    // 3. COMPLETE ENROLLMENT: Find the latest ACCEPTED application 
    const { data: applicationRaw } = await adminClient
      .from('applications')
      .select('*, internship:internships(*)')
      .eq('user_id', proof.user_id)
      .eq('status', 'accepted')
      .order('applied_at', { ascending: false })
      .limit(1)
      .single();

    if (applicationRaw) {
        const app = applicationRaw as any;
        const internship = app.internship;
        
        // Ensure we don't duplicate enrollments for the same application
        const { data: existingEnrollment } = await adminClient
            .from('enrollments')
            .select('id')
            .eq('application_id', app.id)
            .maybeSingle();

        if (!existingEnrollment) {
            const startDate = new Date();
            const endDate = addDays(startDate, internship.duration_weeks * 7);

            const { data: enrollment, error: enrollErr } = await (adminClient.from('enrollments') as any)
                .insert({
                    user_id: proof.user_id,
                    application_id: app.id,
                    internship_id: internship.id,
                    start_date: startDate.toISOString().split('T')[0],
                    end_date: endDate.toISOString().split('T')[0],
                    status: 'active'
                })
                .select()
                .single();

            if (enrollment && !enrollErr) {
                // Initialize projects
                const { data: projects } = await adminClient
                    .from('internship_projects')
                    .select('id')
                    .eq('internship_id', internship.id);

                if (projects && projects.length > 0) {
                    await (adminClient.from('project_submissions') as any).insert(
                        projects.map((p: any) => ({
                            enrollment_id: enrollment.id,
                            project_id: p.id,
                            user_id: proof.user_id,
                            status: 'in_progress',
                            attempt_number: 1,
                        }))
                    );
                }

                // Increment internship capacity
                await (adminClient.from('internships') as any)
                    .update({ spots_filled: (internship.spots_filled || 0) + 1 })
                    .eq('id', internship.id);
            }
        }
    }

    // 4. Send approval notification
    await (adminClient.from('notifications') as any).insert({
      user_id: proof.user_id,
      type: 'payment_approved',
      title: '✅ Enrollment Complete!',
      body: `Your payment has been verified. You now have full access to your projects and dashboard!`,
      link: '/my-internship',
      is_read: false,
    });

    return NextResponse.json({ success: true, message: 'Payment approved. Enrollment activated.' });

  } else {
    // REJECT Payment Logic
    await (adminClient.from('payment_proofs') as any)
      .update({
        status: 'rejected',
        rejection_reason: rejection_reason || 'Invalid payment proof.',
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', proofId);

    await (adminClient.from('notifications') as any).insert({
      user_id: proof.user_id,
      type: 'payment_rejected',
      title: '❌ Payment Verification Failed',
      body: `Oops! We couldn't verify your payment proof. Reason: ${rejection_reason || 'Screenshot unclear'}. Please visit the payment page to try again.`,
      link: '/enroll',
      is_read: false,
    });

    return NextResponse.json({ success: true, message: 'Payment rejected. Student notified.' });
  }
}
