import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { formatDate, calculateDaysLeft } from '@/lib/utils';
import { APPLICATION_STATUS_LABELS } from '@/lib/constants';
import { ArrowRight, Bell, Briefcase, Award, FileText, Plus, Sparkles, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export const metadata = { title: 'Dashboard' };

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const [profileRes, applicationsRes, enrollmentRes, notificationsRes, certificatesRes] = (await Promise.all([
    supabase.from('profiles').select('full_name, profile_completeness, avatar_url').eq('id', user.id).single(),
    supabase.from('applications').select('id, status, applied_at, internships(title)').eq('user_id', user.id).order('applied_at', { ascending: false }).limit(5),
    supabase.from('enrollments').select('*, internships(title, duration_weeks, category), project_submissions(status)').eq('user_id', user.id).eq('status', 'active').maybeSingle(),
    supabase.from('notifications').select('id, title, body, type, is_read, created_at, link').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
    supabase.from('enrollments').select('certificate_id').eq('user_id', user.id).eq('status', 'completed').not('certificate_id', 'is', null),
  ])) as any[];

  const profile = profileRes.data;
  const applications = applicationsRes.data || [];
  const enrollment = enrollmentRes.data;
  const notifications = notificationsRes.data || [];
  const certificates = certificatesRes.data || [];

  const firstName = profile?.full_name?.split(' ')[0] || 'there';

  // Fetch total project count for enrolled internship (for proper progress display)
  const enrollmentAny = enrollment as any;
  let totalProjectCount = 0;
  if (enrollmentAny?.internship_id) {
    const { count } = await supabase
      .from('internship_projects')
      .select('id', { count: 'exact', head: true })
      .eq('internship_id', enrollmentAny.internship_id);
    totalProjectCount = count || 0;
  }

  // Compute project completion
  let projectProgress = 0;
  let passedCount = 0;
  let totalForProgress = totalProjectCount;
  if (enrollment?.project_submissions) {
    const subs = enrollment.project_submissions as { status: string }[];
    passedCount = subs.filter((s) => s.status === 'passed').length;
    if (totalForProgress === 0) totalForProgress = subs.length;
    projectProgress = totalForProgress > 0 ? Math.round((passedCount / totalForProgress) * 100) : 0;
  }

  const QUICK_STATS = [
    { label: 'Applications', value: applications.length, icon: FileText, color: 'text-blue-500 bg-blue-50' },
    { label: 'Active Tasks', value: enrollment ? '1' : '0', icon: Briefcase, color: 'text-emerald-500 bg-emerald-50' },
    { label: 'Certificates', value: certificates.length, icon: Award, color: 'text-amber-500 bg-amber-50' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2 font-black text-primary-500 tracking-[0.3em] text-[10px] uppercase">
            <Sparkles className="h-3.5 w-3.5" /> Core Workspace
          </div>
          <h1 className="font-instrument-serif text-4xl md:text-5xl text-gray-900 tracking-tight">
            Assalam-o-Alaikum, <span className="italic opacity-80 text-primary-600">{firstName}</span>
          </h1>
          <p className="text-gray-400 mt-2 text-[10px] font-black uppercase tracking-[0.2em]">
            Digital Ledger — {new Date().toLocaleDateString('en-PK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        {!enrollment && (
          <Link href="/internships" className="btn-primary flex items-center gap-2 shadow-lg shadow-primary-500/20">
            <Plus className="h-4 w-4" /> Find Internships
          </Link>
        )}
      </div>

      {/* Profile Completeness Alert */}
      {profile && profile.profile_completeness < 70 && (
        <div className="group relative overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-white px-6 py-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 relative z-10">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-amber-900">Your profile is missing some details</h3>
              <p className="text-xs text-amber-800/80 mt-1 max-w-lg">
                Your profile is {profile.profile_completeness}% complete. You need at least **70%** to be eligible for premium remote internships.
              </p>
              <div className="mt-4 h-1.5 w-full max-w-md overflow-hidden rounded-full bg-amber-200/50">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-500" 
                  style={{ width: `${profile.profile_completeness}%` }} 
                />
              </div>
            </div>
            <Link href="/profile" className="inline-flex items-center justify-center rounded-xl bg-amber-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-amber-600/20 transition-all hover:bg-amber-700 active:scale-95">
              Complete Now →
            </Link>
          </div>
          <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-amber-100/30 blur-3xl" />
        </div>
      )}

      {/* Stats Board */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {QUICK_STATS.map((stat) => (
          <div key={stat.label} className="group card p-6 flex items-center gap-5">
            <div className={cn('flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl transition-transform group-hover:scale-110', stat.color)}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-gray-500 group-hover:text-gray-900 transition-colors">{stat.label}</div>
              <div className="text-3xl font-bold text-gray-900 tracking-tight mt-0.5">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Main Focus: Active Internship */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          <div className="card relative overflow-hidden p-8 flex-1">
            <div className="relative z-10">
              <h2 className="text-xs font-bold text-primary-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Briefcase className="h-4 w-4" /> Your Active Journey
              </h2>
              {enrollment ? (
                <div className="space-y-8">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div>
                      <h3 className="text-2xl font-extrabold text-gray-900">{(enrollment.internships as unknown as { title: string })?.title}</h3>
                      <div className="flex flex-wrap gap-4 mt-3">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                           <span className="h-1.5 w-1.5 rounded-full bg-green-500" /> Remote Internship
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" /> {enrollment.internships.duration_weeks} Weeks
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Time Remaining</p>
                      <p className="text-sm font-bold text-gray-900">{calculateDaysLeft(enrollment.end_date)} Days left</p>
                    </div>
                  </div>

                  {/* Progress Section */}
                  <div className="p-6 rounded-2xl bg-gray-50/50 border border-gray-100">
                    <div className="flex justify-between items-end mb-3">
                      <div>
                        <p className="text-sm font-bold text-gray-900">Project Milestone</p>
                        <p className="text-xs text-gray-500">{passedCount}/{totalForProgress} projects passed</p>
                      </div>
                      <span className="text-2xl font-black text-primary-600">{projectProgress}%</span>
                    </div>
                    <div className="h-3 rounded-full bg-gray-200 shadow-inner overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-1000 ease-out"
                        style={{ width: `${projectProgress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/projects" className="btn-primary flex-1 py-4 text-base">
                      Access Project Hub <ArrowRight className="h-5 w-5" />
                    </Link>
                    <Link href="/my-internship" className="btn-secondary flex-1 py-4 text-base">
                      Internship Contract
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200">
                  <div className="h-20 w-20 flex items-center justify-center rounded-3xl bg-white shadow-premium mb-6 text-3xl">☕</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Ready to kickstart?</h3>
                  <p className="text-sm text-gray-500 max-w-xs mx-auto mb-8">
                    You don't have an active internship yet. Start applying to get real-world projects today.
                  </p>
                  <Link href="/internships" className="btn-primary shadow-lg shadow-primary-500/20 px-8 py-3.5">
                    Browse Internships
                  </Link>
                </div>
              )}
            </div>
            {/* Background Accent */}
            <div className="absolute top-0 right-0 h-40 w-40 -translate-y-12 translate-x-12 rounded-full bg-primary-50/50 blur-3xl pointer-events-none" />
          </div>

          {/* Activity Section */}
          <div className="card p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xs font-bold text-primary-500 uppercase tracking-widest flex items-center gap-2">
                <FileText className="h-4 w-4" /> Application History
              </h2>
              <Link href="/applications" className="text-xs font-bold text-gray-400 hover:text-primary-500 transition-colors">View All Applications</Link>
            </div>
            {applications.length === 0 ? (
              <div className="text-center py-10 opacity-50">
                <p className="text-sm font-medium">No previous data found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((app: any) => (
                  <div key={app.id} className="group flex items-center gap-5 p-4 rounded-2xl border border-gray-50 hover:border-gray-100 hover:bg-gray-50/50 transition-all">
                    <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-white border border-gray-100 shadow-sm text-lg">📁</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{(app.internships as unknown as { title: string })?.title || '—'}</p>
                      <p className="text-[11px] font-medium text-gray-400 mt-0.5 uppercase tracking-wide">Applied {formatDate(app.applied_at)}</p>
                    </div>
                    <div>
                      <span className={cn('badge text-[10px] uppercase font-heavy tracking-wider', 
                         app.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' : 
                         app.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                      )}>
                        {app.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar content: Notifications & Quick Access */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <div className="card p-7 shadow-premium">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-bold text-primary-500 uppercase tracking-widest flex items-center gap-2">
                <Bell className="h-4 w-4" /> Inbox
              </h2>
              <Link href="/notifications" className="text-[10px] font-bold text-gray-400 hover:text-primary-500">MARK ALL READ</Link>
            </div>
            {notifications.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-12">All caught up!</p>
            ) : (
              <div className="space-y-3">
                {notifications.map((n: any) => (
                  <Link
                    key={n.id}
                    href={n.link || '/notifications'}
                    className={cn(
                      'block rounded-2xl p-4 transition-all hover:bg-gray-50 border border-transparent',
                      !n.is_read ? 'bg-primary-50/50 border-primary-50' : ''
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn("h-7 w-7 rounded-lg flex items-center justify-center shrink-0", !n.is_read ? "bg-primary-100 text-primary-600" : "bg-gray-100 text-gray-400")}>
                         <Bell className="h-3.5 w-3.5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-bold text-gray-900 leading-snug">{n.title}</p>
                        <p className="text-[11px] font-medium text-gray-500 mt-1 line-clamp-2">{n.body}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            <Link href="/notifications" className="btn-secondary w-full mt-6 py-3 text-xs bg-gray-50 border-none hover:bg-gray-100">
               View All Notifications
            </Link>
          </div>

          {/* Quick Support Card */}
          <div className="rounded-3xl bg-gradient-to-br from-indigo-900 to-primary-900 p-8 text-white relative overflow-hidden">
             <div className="relative z-10">
               <h3 className="text-lg font-bold mb-2">Need Support?</h3>
               <p className="text-xs text-blue-200/80 leading-relaxed mb-6">
                 Having trouble with your project or payment? Our support team is here to help.
               </p>
               <Link href="/faq" className="inline-flex items-center justify-center w-full rounded-xl bg-white/10 backdrop-blur-md px-4 py-3 text-xs font-bold transition-all hover:bg-white/20">
                 Read Documentation
               </Link>
             </div>
             <div className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-white/5 blur-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
