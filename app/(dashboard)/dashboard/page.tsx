import { createClient, checkProfileCompletion } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { formatDate, calculateDaysLeft } from '@/lib/utils';
import { ArrowRight, Bell, Briefcase, Award, FileText, Plus, Sparkles, AlertCircle, PartyPopper, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export const metadata = { title: 'Dashboard' };

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const isProfileComplete = await checkProfileCompletion(supabase, user.id);
  if (!isProfileComplete) redirect('/profile?onboard=true');

  const [profileRes, applicationsRes, enrollmentRes, notificationsRes, certificatesRes] = (await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
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

  // Check for the latest selection (accepted but not yet enrolled)
  const acceptedApplication = !enrollment ? applications.find((app: any) => app.status === 'accepted') : null;

  // Compute project completion
  let projectProgress = 0;
  let passedCount = 0;
  let totalForProgress = 0;
  if (enrollment) {
    const { count } = await supabase
      .from('internship_projects')
      .select('id', { count: 'exact', head: true })
      .eq('internship_id', enrollment.internship_id);
    totalForProgress = count || 0;

    const subs = enrollment.project_submissions as { status: string }[];
    passedCount = subs.filter((s) => s.status === 'passed').length;
    if (totalForProgress === 0) totalForProgress = subs.length;
    projectProgress = totalForProgress > 0 ? Math.round((passedCount / totalForProgress) * 100) : 0;
  }

  const QUICK_STATS = [
    { label: 'Applications', value: applications.length, icon: FileText, color: 'text-blue-500 bg-blue-50' },
    { label: 'Active Tracks', value: enrollment ? '1' : '0', icon: Briefcase, color: 'text-emerald-500 bg-emerald-50' },
    { label: 'Certificates', value: certificates.length, icon: Award, color: 'text-amber-500 bg-amber-50' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-10 px-4 mb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2 font-black text-primary-500 tracking-[0.3em] text-[10px] uppercase">
            <Sparkles className="h-3.5 w-3.5" /> Growth Dashboard
          </div>
          <h1 className="font-instrument-serif text-4xl md:text-5xl text-gray-900 tracking-tight">
            Assalam-o-Alaikum, <span className="italic opacity-80 text-primary-600">{firstName}</span>
          </h1>
          <p className="text-gray-400 mt-2 text-[10px] font-black uppercase tracking-[0.2em]">
            {new Date().toLocaleDateString('en-PK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        {!enrollment && !acceptedApplication && (
          <Link href="/internships" className="btn-primary flex items-center gap-2 shadow-lg shadow-primary-500/20">
            <Plus className="h-4 w-4" /> Browse Programs
          </Link>
        )}
      </div>

      {/* Stats Board */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 font-medium">
        {QUICK_STATS.map((stat) => (
          <div key={stat.label} className="group card p-6 flex items-center gap-5 border-none shadow-premium transition-transform hover:scale-[1.02]">
            <div className={cn('flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl', stat.color)}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div>
              <div className="text-sm text-gray-500 uppercase tracking-tight font-bold">{stat.label}</div>
              <div className="text-3xl font-bold text-gray-900 tracking-tight mt-0.5">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8 flex flex-col gap-8">
          {/* Main Content: Current State Handler */}
          <div className="card relative overflow-hidden p-8 flex-1 border-none shadow-premium bg-white">
            <div className="relative z-10">
              {enrollment ? (
                // STATE 1: Active Participation
                <div className="space-y-8">
                  <h2 className="text-xs font-bold text-primary-500 uppercase tracking-widest flex items-center gap-2 mb-6">
                    <CheckCircle2 className="h-4 w-4" /> Active Internship
                  </h2>
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div>
                      <h3 className="text-2xl font-black text-gray-900 tracking-tight">{(enrollment.internships as any)?.title}</h3>
                      <div className="flex flex-wrap gap-4 mt-3">
                         <span className="badge bg-green-50 text-green-700 text-[10px] font-black uppercase">● Currently Active</span>
                         <span className="badge bg-blue-50 text-blue-700 text-[10px] font-black uppercase"> {enrollment.internships.category}</span>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 min-w-[120px]">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Remaining</p>
                      <p className="text-sm font-bold text-gray-900">{calculateDaysLeft(enrollment.end_date)} Days</p>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-gray-50/50 border border-gray-100">
                    <div className="flex justify-between items-end mb-3">
                      <div>
                        <p className="text-sm font-black text-gray-900 uppercase tracking-tight">Project Milestone</p>
                        <p className="text-xs text-gray-500">{passedCount}/{totalForProgress} milestones unlocked</p>
                      </div>
                      <span className="text-2xl font-black text-primary-600">{projectProgress}%</span>
                    </div>
                    <div className="h-3 rounded-full bg-gray-200 overflow-hidden">
                      <div className="h-full bg-primary-500" style={{ width: `${projectProgress}%` }} />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/projects" className="btn-primary flex-1 py-4 text-base">
                      Enter Project Lab <ArrowRight className="h-5 w-5" />
                    </Link>
                    <Link href="/my-internship" className="btn-secondary flex-1 py-4 text-base bg-white">
                      Internship Details
                    </Link>
                  </div>
                </div>
              ) : acceptedApplication ? (
                // STATE 2: Selection (Action Required)
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="h-20 w-20 flex items-center justify-center rounded-3xl bg-green-50 text-green-600 mb-6 text-3xl">
                    <PartyPopper className="h-10 w-10" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-2">You've Been Selected! 🎊</h3>
                  <p className="text-sm text-gray-500 max-w-sm mx-auto mb-8 leading-relaxed">
                    Great news! You were accepted for the <strong>{acceptedApplication.internships.title}</strong> internship. Complete your enrollment to start.
                  </p>
                  <Link href="/my-internship" className="btn-primary px-10 py-4 text-base shadow-xl shadow-primary-500/20">
                    Get Offer & Unlock Dashboard
                  </Link>
                </div>
              ) : (
                // STATE 3: No Active Journey
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="h-20 w-20 flex items-center justify-center rounded-3xl bg-gray-50 text-gray-300 mb-6 border-2 border-dashed border-gray-200 text-3xl">
                    <Briefcase className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Start Your Career Journey</h3>
                  <p className="text-sm text-gray-500 max-w-xs mx-auto mb-8 leading-relaxed">
                    You don't have an active internship enrollment. Browse our professional tracks to apply today.
                  </p>
                  <Link href="/internships" className="btn-primary px-8 py-3.5 shadow-lg shadow-primary-500/20">
                    Find Opportunities
                  </Link>
                </div>
              )}
            </div>
            {/* Background Accent */}
            <div className="absolute top-0 right-0 h-48 w-48 -translate-y-16 translate-x-16 rounded-full bg-primary-100/30 blur-3xl pointer-events-none" />
          </div>

          {/* Recent Notifications */}
          <div className="card p-8 border-none shadow-premium">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xs font-bold text-primary-500 uppercase tracking-widest flex items-center gap-2">
                <Bell className="h-4 w-4" /> Pulse Feed
              </h2>
              <Link href="/notifications" className="text-[10px] font-black text-gray-400 hover:text-primary-500 transition-colors uppercase tracking-widest">See All</Link>
            </div>
            {notifications.length === 0 ? (
               <p className="text-sm text-gray-400 text-center py-8 italic font-medium">Your inbox is clear.</p>
            ) : (
              <div className="divide-y divide-gray-50">
                {notifications.map((n: any) => (
                  <Link key={n.id} href={n.link || '/notifications'} className="block py-4 group transition-all">
                    <div className="flex items-start gap-4">
                      <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border border-gray-100", !n.is_read ? "bg-primary-50 text-primary-600 border-primary-100 shadow-sm" : "bg-white text-gray-400")}>
                         <Bell className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 pr-4">
                        <p className={cn("text-sm transition-colors", !n.is_read ? "font-bold text-gray-900" : "font-medium text-gray-600 group-hover:text-gray-900")}>{n.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{n.body}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-8">
           {/* Application Status Widget */}
           <div className="card p-7 border-none shadow-premium">
            <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 px-1">Application Track</h2>
            {applications.length === 0 ? (
                 <p className="text-sm text-gray-400 italic px-1">No pending applications.</p>
            ) : (
              <div className="space-y-4">
                {applications.slice(0, 3).map((app: any) => (
                  <div key={app.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors border border-gray-100">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-900 truncate">{(app.internships as any)?.title}</p>
                      <p className="text-[10px] text-gray-400 uppercase font-black tracking-tighter mt-0.5">{formatDate(app.applied_at)}</p>
                    </div>
                    <span className={cn('text-[9px] px-2 py-1 rounded-md font-black uppercase tracking-[0.1em] shadow-sm', 
                       app.status === 'accepted' ? 'bg-emerald-500 text-white' : 
                       app.status === 'rejected' ? 'bg-red-500 text-white' : 'bg-primary-500 text-white'
                    )}>
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
             <Link href="/applications" className="btn-secondary w-full mt-6 py-3 text-[10px] font-black uppercase tracking-widest border-none bg-gray-50 text-gray-500 hover:text-primary-600">
                View Full Logs
             </Link>
          </div>

          <div className="rounded-3xl bg-indigo-950 p-8 text-white relative overflow-hidden shadow-2xl">
             <div className="relative z-10">
               <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/10 mb-4">
                 <AlertCircle className="h-5 w-5" />
               </div>
               <h3 className="text-lg font-black tracking-tight mb-2 uppercase">Need Help?</h3>
               <p className="text-[11px] text-indigo-200/70 leading-relaxed font-medium mb-6">
                 Have questions about your enrollment or projects? 
               </p>
               <Link href="mailto:support@ahwtechnologies.com" className="inline-flex items-center justify-center w-full rounded-xl bg-white text-indigo-950 px-4 py-3.5 text-xs font-black transition-all hover:bg-indigo-50">
                 CONTACT SUPPORT
               </Link>
             </div>
             <div className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-white/5 blur-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
