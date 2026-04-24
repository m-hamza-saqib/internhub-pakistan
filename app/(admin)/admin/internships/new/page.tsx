import InternshipForm from '@/components/forms/InternshipForm';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'New Internship — Admin',
};

export default async function NewInternshipPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: adminProfile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (!adminProfile || (adminProfile as any).role !== 'admin') redirect('/dashboard');

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
          <h1 className="text-2xl font-black text-gray-900">Create New Program</h1>
          <p className="text-sm text-gray-500">Add a new internship track and define its project timeline.</p>
        </div>
      </div>

      <InternshipForm />
    </div>
  );
}
