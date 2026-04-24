import { createClient, createAdminClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

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

  // Fetch the proof record
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

    // 2. Set is_lifetime_member = true on the user's profile
    const { error: profileErr } = await (adminClient.from('profiles') as any)
      .update({ is_lifetime_member: true })
      .eq('id', proof.user_id);

    if (profileErr) {
      console.error('Failed to set is_lifetime_member:', profileErr);
      return NextResponse.json({ error: 'Failed to activate dashboard access.' }, { status: 500 });
    }

    // 3. AUTO-ENROLLMENT: Find the latest pending application and approve it
    const { data: latestAppRaw } = await adminClient
      .from('applications')
      .select('*, internship:internships(*)')
      .eq('user_id', proof.user_id)
      .eq('status', 'pending')
      .order('applied_at', { ascending: false })
      .limit(1)
      .single();

    if (latestAppRaw) {
      const app = latestAppRaw as any;
      const internship = app.internship;
      
      // Approve application
      await (adminClient.from('applications') as any)
        .update({ status: 'accepted', reviewed_at: new Date().toISOString(), reviewed_by: user.id })
        .eq('id', app.id);

      // Create enrollment
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + (internship.duration_weeks * 7));

      const { data: enrollment, error: enrollErr } = await (adminClient.from('enrollments') as any)
        .insert({
          user_id: proof.user_id,
          application_id: app.id,
          internship_id: internship.id,
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
        })
        .select()
        .single();

      if (enrollment && !enrollErr) {
        // Create project submissions
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

        // Update spots filled
        await (adminClient.from('internships') as any)
          .update({ spots_filled: (internship.spots_filled || 0) + 1 })
          .eq('id', internship.id);
      }
    }

    // 4. Send in-app notification to user
    await (adminClient.from('notifications') as any).insert({
      user_id: proof.user_id,
      type: 'payment_approved',
      title: '✅ Payment Approved — Welcome to AHWTECHNOLOGIES!',
      body: `Your PKR 300 community fee has been verified. Your dashboard and the "${(latestAppRaw as any)?.internship?.title || 'internship'}" enrollment are now active!`,
      link: '/dashboard',
      is_read: false,
    });

    return NextResponse.json({ success: true, message: 'Payment approved. User has lifetime dashboard access.' });

  } else {
    // Reject
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
      title: '❌ Payment Proof Rejected',
      body: `Your payment proof was rejected. Reason: ${rejection_reason || 'Invalid or unclear screenshot.'}. Please re-submit with a clear screenshot showing PKR 300, date, and transaction ID.`,
      link: '/enroll',
      is_read: false,
    });

    return NextResponse.json({ success: true, message: 'Payment rejected. User notified.' });
  }
}
