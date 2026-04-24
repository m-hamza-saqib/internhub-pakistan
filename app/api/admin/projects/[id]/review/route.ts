import { createClient, createAdminClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { reviewProjectSchema } from '@/lib/validations/schemas';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const adminClient = await createAdminClient();

  // 1. Verify Admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: adminProfileRaw } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  const adminProfile = adminProfileRaw as { role: string } | null;
  if (!adminProfile || adminProfile.role !== 'admin') {

    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // 2. Parse Body
  let body: any;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Invalid body' }, { status: 400 }); }

  const parsed = reviewProjectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: (parsed.error as any).errors[0].message }, { status: 400 });
  }


  const { action, feedback } = parsed.data;

  // 3. Get Submission Details
  const { data: submissionRaw } = await adminClient
    .from('project_submissions')
    .select('user_id, status, attempt_number, enrollment_id, project_id, internship_projects(title)')
    .eq('id', id)
    .single();

  const submission = submissionRaw as any;


  if (!submission) return NextResponse.json({ error: 'Submission not found' }, { status: 404 });

  const newStatus = action === 'pass' ? 'passed' : 'failed';
  const projectTitle = (submission.internship_projects as any)?.title || 'Project';

  // 4. Update Submission
  const { error: updateError } = await (adminClient.from('project_submissions') as any)
    .update({
      status: newStatus,
      feedback,
      reviewed_at: new Date().toISOString(),
      reviewed_by: user.id,
      // If failed, we don't automatically increment attempt here, user handles resubmit in form
    })
    .eq('id', id);


  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

  // 5. Notify Intern
  await (adminClient.from('notifications') as any).insert({
    user_id: submission.user_id,
    type: 'project_update',
    title: action === 'pass' ? 'Project Passed! 🎉' : 'Project Needs Work ✍️',
    body: action === 'pass' 
      ? `Great job! Your submission for "${projectTitle}" has been approved.`
      : `Admin has provided feedback on "${projectTitle}". Please read the comments and resubmit.`,
    link: '/projects',
    is_read: false,
  });

  // 6. If passed, check if this was the last project to unlock certificate
  if (action === 'pass') {
    const { data: totalProjects } = await adminClient
      .from('project_submissions')
      .select('id', { count: 'exact' })
      .eq('enrollment_id', submission.enrollment_id);

    const { data: passedProjects } = await adminClient
      .from('project_submissions')
      .select('id', { count: 'exact' })
      .eq('enrollment_id', submission.enrollment_id)
      .eq('status', 'passed');

    if (totalProjects?.length === passedProjects?.length) {
      // Potentially notify user that they are eligible for certificate
      await (adminClient.from('notifications') as any).insert({
        user_id: submission.user_id,
        type: 'certificate',
        title: 'All Projects Completed! 🏆',
        body: `Congratulations! You've finished all projects. Click here to pay the certification fee and unlock your certificate.`,
        link: '/certificates',
        is_read: false,
      });

    }
  }

  return NextResponse.json({ success: true, status: newStatus });
}
