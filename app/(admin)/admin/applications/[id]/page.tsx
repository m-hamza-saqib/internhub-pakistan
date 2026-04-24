'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { 
  ChevronLeft, Loader2, User, Mail, Globe, MapPin, 
  GraduationCap, Clock, FileText, CheckCircle, XCircle,
  ExternalLink, Sparkles, Building
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { formatDate, cn } from '@/lib/utils';

export default function ApplicationReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [application, setApplication] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const supabase = createClient();

  useEffect(() => {
    async function fetchApplication() {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          applicant:profiles!applications_user_id_fkey (*),
          internship:internship_id (*)
        `)
        .eq('id', id)
        .single();

      if (error) {
        toast.error('Failed to fetch application');
        router.push('/admin/applications');
      } else {
        setApplication(data);
      }
      setLoading(false);
    }
    fetchApplication();
  }, [id, router, supabase]);

  const handleReview = async (action: 'accept' | 'reject') => {
    if (action === 'reject' && !rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/applications/${id}/review`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          rejection_reason: rejectionReason || undefined,
          admin_notes: adminNotes || undefined,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error?.message || result.error || 'Review failed');
      }

      toast.success(`Application ${action === 'accept' ? 'ACCEPTED' : 'REJECTED'}`);
      router.push('/admin/applications');
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
    </div>
  );

  const profile = application?.applicant;
  const internship = application?.internship;

  return (
    <div className="max-w-6xl mx-auto py-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/applications" 
            className="p-2 rounded-full bg-white border border-gray-200 text-gray-400 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-gray-900 leading-tight">Review Application</h1>
            <p className="text-sm text-gray-500">Evaluating student fit for {internship?.title}</p>
          </div>
        </div>
        <div className={cn(
          "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border",
          application?.status === 'pending' ? "bg-amber-50 text-amber-600 border-amber-100" :
          application?.status === 'accepted' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
          "bg-rose-50 text-rose-600 border-rose-100"
        )}>
          {application?.status}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Applicant Motivation & Profile Extra */}
        <div className="lg:col-span-2 space-y-6">
          <section className="card p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary-500" /> Motivation Letter
              </h2>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                {application?.motivation_letter?.length || 0} characters
              </div>
            </div>
            
            <div className="p-6 rounded-2xl bg-gray-50/50 border border-gray-100 text-gray-700 leading-relaxed whitespace-pre-line text-sm italic font-medium">
              "{application?.motivation_letter}"
            </div>

            {application?.relevant_experience && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Relevant Experience</h3>
                <div className="p-4 rounded-xl border border-gray-100 text-sm text-gray-600">
                  {application.relevant_experience}
                </div>
              </div>
            )}
          </section>

          <section className="card p-8 space-y-6">
            <h2 className="font-bold text-gray-900 border-b border-gray-100 pb-4">Final Decision</h2>
            
            <div className="space-y-4">
              <div>
                <label className="label">Rejection Reason <span className="text-xs text-gray-400 font-normal">(required when rejecting)</span></label>
                <textarea 
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={3}
                  placeholder="Tell the student why they were not selected this time..."
                  className="input resize-none"
                />
              </div>
              <div>
                <label className="label">Admin Notes <span className="text-xs text-gray-400 font-normal">(optional, for your records)</span></label>
                <textarea 
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={2}
                  placeholder="Internal notes about this applicant (not shown to student)..."
                  className="input resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button 
                  onClick={() => handleReview('reject')}
                  disabled={submitting || application?.status !== 'pending'}
                  className="flex items-center justify-center gap-2 rounded-xl border-2 border-rose-100 bg-rose-50 py-3.5 font-bold text-rose-600 hover:bg-rose-100 transition-all active:scale-95 disabled:opacity-50"
                >
                  <XCircle className="h-5 w-5" /> Reject Application
                </button>
                <button 
                  onClick={() => handleReview('accept')}
                  disabled={submitting || application?.status !== 'pending'}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gray-900 py-3.5 font-bold text-white shadow-xl shadow-gray-900/20 hover:bg-emerald-600 transition-all active:scale-95 disabled:opacity-50"
                >
                  <CheckCircle className="h-5 w-5" /> Accept & Enroll
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Profile Summary */}
        <div className="space-y-6">
          <section className="card p-8 space-y-6 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-3">
               <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary-50 text-[10px] font-black text-primary-600 border border-primary-100">
                 {profile?.profile_completeness}% READY
               </div>
             </div>

             <div className="flex flex-col items-center text-center pb-6 border-b border-gray-100">
               <div className="h-20 w-20 rounded-3xl bg-gray-100 flex items-center justify-center text-3xl font-bold text-gray-400 mb-4 ring-4 ring-white shadow-xl">
                 {profile?.full_name?.charAt(0)}
               </div>
               <h3 className="font-black text-xl text-gray-900 leading-tight">{profile?.full_name}</h3>
               <p className="text-xs font-medium text-gray-500 mt-1 uppercase tracking-widest">{profile?.username}</p>
             </div>

             <div className="space-y-5">
               <ProfileItem icon={Mail} label="Email Address" value={profile?.email} />
               <ProfileItem icon={MapPin} label="City / Province" value={`${profile?.city || '—'}, ${profile?.province || '—'}`} />
               <ProfileItem icon={GraduationCap} label="Academic Info" value={profile?.university || '—'} subValue={`${profile?.degree || '—'} (${profile?.graduation_year || '—'})`} />
               <ProfileItem icon={Clock} label="Availability" value={`${application?.hours_per_week} hours / week`} />
               
               {profile?.linkedin_url && (
                 <a href={profile.linkedin_url} target="_blank" className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-md transition-all group">
                   <span className="text-xs font-bold text-gray-600">LinkedIn Profile</span>
                   <ExternalLink className="h-3.5 w-3.5 text-gray-300 group-hover:text-primary-500" />
                 </a>
               )}
                {profile?.github_url && (
                 <a href={profile.github_url} target="_blank" className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-md transition-all group">
                   <span className="text-xs font-bold text-gray-600">GitHub Profile</span>
                   <ExternalLink className="h-3.5 w-3.5 text-gray-300 group-hover:text-primary-500" />
                 </a>
               )}
             </div>
          </section>

          <section className="card p-8 bg-gray-900 text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
               <Sparkles size={100} />
             </div>
             <div className="relative z-10">
               <h3 className="font-bold text-gray-300 border-b border-gray-800 pb-3 mb-4 text-xs uppercase tracking-widest">Program Details</h3>
               <div className="space-y-4">
                 <div>
                    <div className="text-lg font-bold text-white leading-snug">{internship?.title}</div>
                    <div className="text-[10px] font-black text-primary-400 uppercase mt-1 tracking-widest">{internship?.category}</div>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Duration</div>
                      <div className="text-sm font-bold">{internship?.duration_weeks} Weeks</div>
                    </div>
                    <div className="flex-1">
                      <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Difficulty</div>
                      <div className="text-sm font-bold uppercase">{internship?.difficulty}</div>
                    </div>
                 </div>
               </div>
             </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function ProfileItem({ icon: Icon, label, value, subValue }: any) {
  return (
    <div className="flex items-start gap-3">
      <div className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 shrink-0">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">{label}</div>
        <div className="text-sm font-bold text-gray-900 leading-tight">{value}</div>
        {subValue && <div className="text-[10px] text-gray-500 mt-0.5">{subValue}</div>}
      </div>
    </div>
  );
}
