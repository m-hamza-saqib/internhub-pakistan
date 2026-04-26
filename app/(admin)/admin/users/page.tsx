import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/types/database.types';
import { redirect } from 'next/navigation';
import { Search, User as UserIcon, Shield, ShieldOff, Mail, MapPin } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';

export const metadata = {
  title: 'Manage Users — Admin',
};
export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profileRaw } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  const adminProfile = profileRaw as { role: string } | null;
  if (!adminProfile || adminProfile.role !== 'admin') redirect('/dashboard');

  const { createAdminClient } = await import('@/lib/supabase/server');
  const adminSupabase = await createAdminClient();

  const { data: authUsersRes } = await adminSupabase.auth.admin.listUsers();
  const authUsers = authUsersRes.users || [];

  const { data: profiles } = await adminSupabase
    .from('profiles')
    .select('*') as { data: Database['public']['Tables']['profiles']['Row'][] | null };

  const list = authUsers.map((authUser) => {
    const profile = profiles?.find((p) => p.id === authUser.id);
    return {
      id: authUser.id,
      email: authUser.email,
      full_name: profile?.full_name || authUser.user_metadata?.full_name || 'User',
      university: profile?.university || null,
      degree: profile?.degree || null,
      city: profile?.city || null,
      profile_completeness: profile?.profile_completeness || 0,
      created_at: authUser.created_at,
      is_suspended: profile?.is_suspended || false,
    };
  }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            View all registered interns and manage their access.
          </p>
        </div>
        <div className="flex items-center gap-3">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input 
                    placeholder="Search users..." 
                    className="input pl-9 py-2 text-sm max-w-[250px]"
                />
            </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">User</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Education</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Location</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Completeness</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Joined</th>
                <th className="px-6 py-4 text-right font-semibold text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {list.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xs">
                            {u.full_name?.charAt(0) || 'U'}
                        </div>
                        <div>
                            <div className="font-bold text-gray-900">{u.full_name}</div>
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                                <Mail className="h-3 w-3" /> {u.email}
                            </div>
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900 font-medium">{u.university || '—'}</div>
                    <div className="text-xs text-gray-500">{u.degree || '—'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-600 flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {u.city || '—'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                        <div className="flex-1 w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                                className={cn(
                                    "h-full transition-all",
                                    u.profile_completeness >= 70 ? "bg-green-500" : "bg-yellow-500"
                                )} 
                                style={{ width: `${u.profile_completeness}%` }}
                            />
                        </div>
                        <span className="text-[10px] font-bold text-gray-500">{u.profile_completeness}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-xs">
                    {formatDate(u.created_at)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {u.is_suspended ? (
                        <button className="badge bg-red-100 text-red-700 border-red-200">
                            Suspended
                        </button>
                    ) : (
                        <button className="badge bg-green-100 text-green-700 border-green-200">
                            Active
                        </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
