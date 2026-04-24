'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { cn, formatDate } from '@/lib/utils';
import { APPLICATION_STATUS_LABELS } from '@/lib/constants';
import { Eye, Search, Filter, ArrowUpDown, ChevronRight, UserCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminApplicationsPage() {
  const [loading, setLoading] = useState(true);
  const [apps, setApps] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchApps = async () => {
      const { data } = await supabase
        .from('applications')
        .select('*, applicant:profiles!applications_user_id_fkey(full_name, email, university, city, profile_completeness), internships(title, category, duration_weeks)')
        .order('applied_at', { ascending: false });
      
      if (data) setApps(data);
      setLoading(false);
    };
    fetchApps();
  }, []);

  const stats = {
    total: apps.length,
    pending: apps.filter(a => a.status === 'pending').length,
    accepted: apps.filter(a => a.status === 'accepted').length,
    rejected: apps.filter(a => a.status === 'rejected').length,
  };

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
    </div>
  );

  return (
    <div className="space-y-8 animate-in">
      {/* Header & Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Requests', value: stats.total, color: 'bg-primary-50 text-primary-600 border-primary-100' },
          { label: 'Pending Review', value: stats.pending, color: 'bg-amber-50 text-amber-600 border-amber-100' },
          { label: 'Accepted', value: stats.accepted, color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
          { label: 'Rejected', value: stats.rejected, color: 'bg-rose-50 text-rose-600 border-rose-100' },
        ].map((stat, i) => (
          <div key={i} className={cn("p-5 rounded-2xl border transition-all hover:shadow-md", stat.color)}>
            <div className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">{stat.label}</div>
            <div className="text-2xl font-black">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="card overflow-hidden shadow-xl border-white/40">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96 group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search by name, email or university..." 
              className="w-full pl-10 pr-4 py-2.5 text-xs font-medium rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
              <Filter className="h-3.5 w-3.5" /> Filter Status
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#fcfcfd] border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Applicant Profile</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Program Info</th>
                <th className="px-6 py-4 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">Readiness</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Applied On</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Lifecycle</th>
                <th className="px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {apps.map((app, idx) => {
                const appUser = app.applicant;
                const internship = app.internships;
                const statusInfo = APPLICATION_STATUS_LABELS[app.status];
                
                return (
                  <motion.tr 
                    key={app.id} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="group hover:bg-primary-50/30 transition-all cursor-default"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-gray-100 text-gray-500 font-bold group-hover:bg-primary-100 group-hover:text-primary-600 transition-colors">
                          {appUser?.full_name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 group-hover:text-primary-700 transition-colors">{appUser?.full_name}</div>
                          <div className="text-[10px] text-gray-400 font-medium tracking-tight lowercase">{appUser?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="font-bold text-gray-700 leading-tight">{internship?.title}</div>
                      <div className="text-[10px] font-black text-gray-300 uppercase mt-1 tracking-tight">{internship?.category}</div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black border",
                        appUser?.profile_completeness >= 70 
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                          : "bg-orange-50 text-orange-600 border-orange-100"
                      )}>
                        {appUser?.profile_completeness}% <UserCheck size={10} strokeWidth={3} />
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-xs font-bold text-gray-500">{formatDate(app.applied_at)}</div>
                      <div className="text-[10px] text-gray-300 uppercase font-bold tracking-tighter mt-0.5">Time Period</div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={cn('badge text-[9px] font-black px-2.5 py-1', statusInfo?.color)}>
                        {statusInfo?.label.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <Link 
                        href={`/admin/applications/${app.id}`}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-gray-900 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-gray-900/10 hover:bg-primary-600 hover:shadow-primary-500/20 active:scale-95 transition-all"
                      >
                        Review <ChevronRight className="h-3.5 w-3.5" />
                      </Link>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
          {apps.length === 0 && (
            <div className="py-24 text-center">
               <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-gray-50 text-gray-300 mb-6">
                 <Search size={40} />
               </div>
               <h3 className="text-lg font-bold text-gray-900">No applications found</h3>
               <p className="text-sm text-gray-500 mt-1">Pending requests will appear here once students apply.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
