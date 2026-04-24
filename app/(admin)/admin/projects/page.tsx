'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { cn, formatDate } from '@/lib/utils';
import { PROJECT_STATUS_LABELS } from '@/lib/constants';
import { Eye, Search, Inbox, ChevronRight, FileText, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminProjectsPage() {
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchSubmissions = async () => {
      const { data } = await supabase
        .from('project_submissions')
        .select(`
          *,
          profiles!project_submissions_user_id_fkey (full_name, email),
          internship_projects:project_id (title, week_number),
          enrollments:enrollment_id (internships (title))
        `)
        .in('status', ['pending', 'under_review', 'failed'])
        .order('submitted_at', { ascending: false });
      
      if (data) setSubmissions(data);
      setLoading(false);
    };
    fetchSubmissions();
  }, []);

  const stats = {
    total: submissions.length,
    new: submissions.filter(s => s.status === 'pending').length,
    reviewing: submissions.filter(s => s.status === 'under_review').length,
    critical: submissions.filter(s => s.status === 'failed').length,
  };

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
    </div>
  );

  return (
    <div className="space-y-8 animate-in">
      {/* Page Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Inbox Submissions', value: stats.total, icon: Inbox, color: 'bg-primary-50 text-primary-600 border-primary-100' },
          { label: 'New Today', value: stats.new, icon: FileText, color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
          { label: 'Under Review', value: stats.reviewing, icon: Clock, color: 'bg-amber-50 text-amber-600 border-amber-100' },
          { label: 'Require Attention', value: stats.critical, icon: CheckCircle, color: 'bg-rose-50 text-rose-600 border-rose-100' },
        ].map((stat, i) => (
          <div key={i} className={cn("p-6 rounded-2xl border transition-all hover:shadow-lg", stat.color)}>
             <div className="flex items-center justify-between mb-4">
               <div className="h-8 w-8 rounded-lg bg-white/50 flex items-center justify-center">
                 <stat.icon size={16} />
               </div>
               <span className="text-[10px] font-black uppercase tracking-widest opacity-70">Stats</span>
             </div>
             <div className="text-2xl font-black">{stat.value}</div>
             <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="card overflow-hidden shadow-xl border-white/40">
        {/* Table Header / Toolbar */}
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
           <div className="flex items-center gap-3">
             <div className="h-10 w-10 rounded-xl bg-primary-500 text-white flex items-center justify-center shadow-lg shadow-primary-500/20">
               <FileText size={20} />
             </div>
             <div>
               <h2 className="text-base font-black text-gray-800 tracking-tight">Project Submission Hub</h2>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Review intern progress & results</p>
             </div>
           </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#fcfcfd] border-b border-gray-100">
              <tr>
                <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Assignee</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Project Milestone</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Program Tracker</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Timeline</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Grading</th>
                <th className="px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Review</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {submissions.map((sub, idx) => {
                const intern = sub.profiles;
                const project = sub.internship_projects;
                const program = sub.enrollments?.internships;
                const statusInfo = PROJECT_STATUS_LABELS[sub.status];

                return (
                  <motion.tr 
                    key={sub.id} 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="group hover:bg-primary-50/30 transition-all cursor-default"
                  >
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 flex items-center justify-center rounded-xl bg-gray-100 text-gray-500 font-bold group-hover:bg-primary-100 group-hover:text-primary-600 transition-colors">
                          {intern?.full_name?.split(' ').map((n: string) => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 group-hover:text-primary-700 transition-colors truncate max-w-[140px]">{intern?.full_name}</div>
                          <div className="text-[10px] text-gray-400 font-medium tracking-tight lowercase">{intern?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="font-bold text-gray-800 leading-tight truncate max-w-[200px]">{project?.title}</div>
                      <div className="text-[10px] font-black text-primary-400 uppercase mt-1 tracking-tighter">PROJECT WEEK {project?.week_number}</div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="font-semibold text-gray-600 text-xs truncate max-w-[150px]">{program?.title || 'Unknown Program'}</div>
                      <div className="text-[10px] font-bold text-gray-300 uppercase mt-0.5">TRACKING TRACK</div>
                    </td>
                    <td className="px-6 py-6 font-bold text-gray-500 text-xs">
                      {sub.submitted_at ? formatDate(sub.submitted_at) : '—'}
                      <div className="text-[10px] text-gray-300 font-bold uppercase tracking-widest mt-0.5">EST. DATE</div>
                    </td>
                    <td className="px-6 py-6">
                      <div className={cn(
                        "inline-flex items-center px-2.5 py-1 rounded-lg text-[9px] font-black tracking-widest border",
                        statusInfo?.color.replace('badge', '').trim()
                      )}>
                        {statusInfo?.label.toUpperCase()}
                      </div>
                    </td>
                    <td className="px-6 py-6 text-right">
                      <Link 
                        href={`/admin/projects/${sub.id}/review`}
                        className="inline-flex items-center gap-2 rounded-xl bg-gray-100 px-5 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-900 hover:text-white transition-all active:scale-95 shadow-sm"
                      >
                         Open <ChevronRight className="h-3 w-3" />
                      </Link>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
          {submissions.length === 0 && (
            <div className="py-24 text-center">
               <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-gray-50 text-gray-300 mb-6">
                 <FileText size={40} />
               </div>
               <h3 className="text-lg font-bold text-gray-900 tracking-tight">No submissions for review</h3>
               <p className="text-sm text-gray-500 mt-1 max-w-xs mx-auto font-medium">Sit back and relax! Your inbox is empty and all intern projects are up to date.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
