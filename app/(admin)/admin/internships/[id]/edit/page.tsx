import InternshipForm from '@/components/forms/InternshipForm';
import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: 'Edit Internship — Admin',
};

export default async function EditInternshipPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: adminProfile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (!adminProfile || (adminProfile as any).role !== 'admin') redirect('/dashboard');

  // Fetch internship and its projects
  const [internshipRes, projectsRes] = await Promise.all([
    supabase.from('internships').select('*').eq('id', id).single(),
    supabase.from('internship_projects').select('*').eq('internship_id', id).order('order_index', { ascending: true }),
  ]);

  if (!internshipRes.data) notFound();

  const initialData = {
    ...(internshipRes as any).data,
    projects: (projectsRes as any).data || [],
  };

  return (
    <div className="max-w-6xl mx-auto py-6">
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/admin/internships" 
          className="p-2 rounded-full bg-white border border-gray-200 text-gray-400 hover:text-gray-900 transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-gray-900">Edit Program</h1>
          <p className="text-sm text-gray-500">Modify the internship track details and project milestones.</p>
        </div>
      </div>

      <InternshipForm initialData={initialData} />
    </div>
  );
}
