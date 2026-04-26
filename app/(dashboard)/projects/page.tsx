import { createClient, checkProfileCompletion } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ProjectsClient from './ProjectsClient';

export const metadata = { title: 'My Projects' };

export default async function ProjectsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const isProfileComplete = await checkProfileCompletion(supabase, user.id);
  if (!isProfileComplete) redirect('/profile?onboard=true');

  const { data: enrollmentRaw } = await supabase
    .from('enrollments')
    .select('id, internship_id, start_date, end_date, internships(title)')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .maybeSingle();

  const enrollment = enrollmentRaw as any;

  if (!enrollment) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="text-5xl mb-4">📋</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">No Active Internship</h1>
        <p className="text-gray-500 mb-6">You need to be enrolled in an internship to access projects.</p>
        <a href="/internships" className="btn-primary">Browse Internships</a>
      </div>
    );
  }

  // Fetch all projects for this internship
  const { data: allProjectsRaw } = await supabase
    .from('internship_projects')
    .select('*')
    .eq('internship_id', enrollment.internship_id)
    .order('order_index');

  const allProjects = allProjectsRaw as any[];

  // Fetch submissions for this enrollment
  const { data: submissionsRaw } = await supabase
    .from('project_submissions')
    .select('*')
    .eq('enrollment_id', enrollment.id);
    
  const submissions = submissionsRaw as any[];

  // Map projects to their submissions
  const mappedSubmissions = (allProjects || []).map(project => {
    const submission = (submissions || []).find(s => s.project_id === project.id);
    return {
      ...(submission || {
        id: project.id, // Fallback ID for UI state
        status: 'in_progress',
        submission_text: null,
        file_urls: [],
        submitted_at: null,
        feedback: null,
        attempt_number: 1,
      }),
      internship_projects: project,
      project_id: project.id,
    };
  });

  return (
    <ProjectsClient
      enrollment={enrollment as unknown as { id: string; internship_id: string; start_date: string; end_date: string; internships: { title: string } }}
      submissions={mappedSubmissions as unknown as ProjectSubmission[]}
      totalProjects={allProjects?.length || 0}
    />
  );
}

interface ProjectSubmission {
  id: string;
  project_id: string;
  status: string;
  submission_text: string | null;
  file_urls: string[];
  submitted_at: string | null;
  feedback: string | null;
  attempt_number: number;
  internship_projects: {
    id: string;
    title: string;
    description: string;
    week_number: number;
    order_index: number;
    resources_url: string | null;
  };
}
