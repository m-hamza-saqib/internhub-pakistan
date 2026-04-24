import { createClient, createAdminClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { cn, formatDate } from '@/lib/utils';
import { APPLICATION_STATUS_LABELS } from '@/lib/constants';
import {
  Users, FileText, Briefcase, Award, DollarSign, Clock,
  TrendingUp, ArrowRight, CheckCircle, XCircle,
} from 'lucide-react';

export const metadata = { title: 'Admin Dashboard' };
export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('role, full_name').eq('id', user.id).single() as any;
  if (!profile || profile.role !== 'admin') redirect('/dashboard');

  const adminClient = await createAdminClient();

  const [
    usersRes, activeEnrollRes, pendingAppsRes, allAppsRes,
    certificatesRes, paymentsRes, recentAppsRes, submissionsRes,
  ] = (await Promise.all([
    adminClient.from('profiles').select('id', { count: 'exact', head: true }),
    adminClient.from('enrollments').select('id', { count: 'exact', head: true }).eq('status', 'active'),
    adminClient.from('applications').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    adminClient.from('applications').select('id', { count: 'exact', head: true }),
    adminClient.from('enrollments').select('id', { count: 'exact', head: true }).not('certificate_id', 'is', null),
    adminClient.from('payments').select('amount, currency, status').eq('status', 'completed'),
    adminClient.from('applications').select('id, status, applied_at, profiles!applications_user_id_fkey(full_name, email), internships(title)').order('applied_at', { ascending: false }).limit(10),
    adminClient.from('project_submissions').select('id', { count: 'exact', head: true }).eq('status', 'under_review'),
  ])) as any[];

  const totalRevenuePKR = (paymentsRes.data as any[] || []).filter(p => p.currency === 'PKR').reduce((sum, p) => sum + p.amount, 0);
  const totalRevenueUSD = (paymentsRes.data as any[] || []).filter(p => p.currency === 'USD').reduce((sum, p) => sum + p.amount, 0);

  const KPI_CARDS = [
    { label: 'Total Users',           value: usersRes.count || 0,        icon: Users,     color: 'bg-blue-50 text-blue-600',   trend: '+12%' },
    { label: 'Active Interns',         value: activeEnrollRes.count || 0, icon: Briefcase, color: 'bg-green-50 text-green-600', trend: '+5%' },
    { label: 'Pending Applications',   value: pendingAppsRes.count || 0,  icon: Clock,     color: 'bg-yellow-50 text-yellow-600', trend: null },
    { label: 'Certificates Issued',    value: certificatesRes.count || 0, icon: Award,     color: 'bg-purple-50 text-purple-600', trend: '+8%' },
    { label: 'Submissions to Review',  value: submissionsRes.count || 0,  icon: FileText,  color: 'bg-orange-50 text-orange-600', trend: null },
    { label: 'Revenue (PKR)',          value: `₨${totalRevenuePKR.toLocaleString()}`, icon: DollarSign, color: 'bg-emerald-50 text-emerald-600', trend: null, isText: true },
  ];

  const recentApps = recentAppsRes.data || [];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back, {profile.full_name}</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/internships" className="btn-secondary text-sm">Manage Internships</Link>
          <Link href="/admin/applications" className="btn-primary text-sm">Review Applications</Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {KPI_CARDS.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="card p-5">
              <div className={cn('inline-flex h-9 w-9 items-center justify-center rounded-xl mb-3', kpi.color)}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{kpi.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{kpi.label}</div>
              {kpi.trend && (
                <div className="text-xs text-green-600 font-medium flex items-center gap-0.5 mt-1">
                  <TrendingUp className="h-3 w-3" />{kpi.trend}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Revenue Summary */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="card p-6">
          <h2 className="text-base font-bold text-gray-900 mb-1">Total Revenue</h2>
          <p className="text-xs text-gray-500 mb-4">All-time completed payments</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
              <span className="text-sm text-gray-600">🇵🇰 Pakistani (PKR)</span>
              <span className="font-bold text-gray-900">PKR {totalRevenuePKR.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
              <span className="text-sm text-gray-600">🌍 International (USD)</span>
              <span className="font-bold text-gray-900">${totalRevenueUSD.toFixed(2)}</span>
            </div>
          </div>
          <Link href="/admin/payments" className="btn-secondary w-full text-center text-sm mt-4">
            View Payment Ledger <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="card p-6">
          <h2 className="text-base font-bold text-gray-900 mb-1">Quick Actions</h2>
          <p className="text-xs text-gray-500 mb-4">Common admin tasks</p>
          <div className="space-y-2">
            {[
              { href: '/admin/applications', label: 'Review Pending Applications', badge: pendingAppsRes.count, color: 'text-yellow-700 bg-yellow-50 hover:bg-yellow-100' },
              { href: '/admin/projects',     label: 'Review Project Submissions', badge: submissionsRes.count, color: 'text-orange-700 bg-orange-50 hover:bg-orange-100' },
              { href: '/admin/users',        label: 'Manage Users',              badge: null, color: 'text-blue-700 bg-blue-50 hover:bg-blue-100' },
              { href: '/admin/announcements', label: 'Send Announcement',        badge: null, color: 'text-purple-700 bg-purple-50 hover:bg-purple-100' },
            ].map((action) => (
              <Link key={action.href} href={action.href}
                className={cn('flex items-center justify-between rounded-lg px-4 py-2.5 text-sm font-medium transition-colors', action.color)}
              >
                {action.label}
                {action.badge !== null && action.badge !== undefined && action.badge > 0 && (
                  <span className="badge bg-red-500 text-white text-xs">{action.badge}</span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Applications Table */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-gray-900">Recent Applications</h2>
          <Link href="/admin/applications" className="text-xs text-primary-500 hover:underline">View all →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-3 text-left text-xs font-semibold text-gray-500">Applicant</th>
                <th className="pb-3 text-left text-xs font-semibold text-gray-500">Internship</th>
                <th className="pb-3 text-left text-xs font-semibold text-gray-500">Applied</th>
                <th className="pb-3 text-left text-xs font-semibold text-gray-500">Status</th>
                <th className="pb-3 text-left text-xs font-semibold text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(recentApps as any[]).map((app) => {
                const statusInfo = APPLICATION_STATUS_LABELS[app.status || 'pending'];
                const appUser = (app.profiles as any);
                const appInternship = (app.internships as any);
                return (
                  <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3">
                      <div className="font-medium text-gray-900">{appUser?.full_name}</div>
                      <div className="text-xs text-gray-500">{appUser?.email}</div>
                    </td>
                    <td className="py-3 text-gray-700 max-w-[180px] truncate">{appInternship?.title}</td>
                    <td className="py-3 text-gray-500 text-xs">{formatDate(app.applied_at)}</td>
                    <td className="py-3">
                      <span className={cn('badge', statusInfo?.color)}>{statusInfo?.label}</span>
                    </td>
                    <td className="py-3">
                      {app.status === 'pending' && (
                        <Link href={`/admin/applications/${app.id}`} className="text-xs font-semibold text-primary-500 hover:underline">
                          Review →
                        </Link>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {recentApps.length === 0 && (
            <p className="text-center text-sm text-gray-400 py-8">No applications yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
