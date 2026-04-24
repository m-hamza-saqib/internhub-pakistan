import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/types/database.types';

import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Plus, Edit, Eye, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import DeleteInternshipButton from '@/components/admin/DeleteInternshipButton';

export const metadata = {
  title: 'Manage Internships — Admin',
};
export const dynamic = 'force-dynamic';

export default async function AdminInternshipsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profileRaw } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  const adminProfile = profileRaw as { role: string } | null;

  if (!adminProfile || adminProfile.role !== 'admin') redirect('/dashboard');

  const { data: internships } = await supabase
    .from('internships')
    .select('*')
    .order('created_at', { ascending: false });

  const list = (internships as Database['public']['Tables']['internships']['Row'][]) || [];


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Internship Programs</h1>
          <p className="text-sm text-gray-500 mt-1">
            Create and manage remote internship tracks for Pakistani students.
          </p>
        </div>
        <Link href="/admin/internships/new" className="btn-primary flex items-center gap-2">
          <Plus className="h-4 w-4" /> New Internship
        </Link>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Title & Category</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Difficulty</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Duration</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Enrollment</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-right font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {list.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{item.title}</div>
                    <div className="text-xs text-gray-500 mt-0.5 uppercase tracking-wider">{item.category}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "badge text-[10px]",
                      item.difficulty === 'beginner' ? "bg-green-100 text-green-700" :
                      item.difficulty === 'intermediate' ? "bg-blue-100 text-blue-700" :
                      "bg-purple-100 text-purple-700"
                    )}>
                      {item.difficulty.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-medium">
                    {item.duration_weeks} Weeks
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-bold text-gray-900">{item.spots_filled}</div>
                      <div className="text-xs text-gray-400">/ {item.spots_total}</div>
                    </div>
                    <div className="w-16 h-1 mt-1 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary-500" 
                        style={{ width: `${(item.spots_filled / item.spots_total) * 100}%` }}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {item.is_published ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-600">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400">
                        <XCircle className="h-3.5 w-3.5" /> Draft
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Link 
                      href={`/internships/${item.slug}`} 
                      target="_blank"
                      className="inline-flex p-2 text-gray-400 hover:text-primary-500 transition-colors"
                      title="Preview Public Page"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <Link 
                      href={`/admin/internships/${item.id}/edit`} 
                      className="inline-flex p-2 text-primary-400 hover:text-primary-600 transition-colors"
                      title="Edit Internship"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <DeleteInternshipButton id={item.id} />
                  </td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 italic">
                    No internships created yet. Click "New Internship" to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
