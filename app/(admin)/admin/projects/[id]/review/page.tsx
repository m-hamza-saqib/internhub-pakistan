'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { 
  ChevronLeft, Loader2, Send, CheckCircle, XCircle, 
  ExternalLink, FileText, User as UserIcon, Calendar, BookOpen, Code
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { formatDate, cn } from '@/lib/utils';

export default function ReviewProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submission, setSubmission] = useState<any>(null);
  const [feedback, setFeedback] = useState('');
  const supabase = createClient();

  useEffect(() => {
    async function fetchSubmission() {
      const { data, error } = await supabase
        .from('project_submissions')
        .select(`
          *,
          profiles!project_submissions_user_id_fkey (*),
          internship_projects:project_id (*),
          enrollments:enrollment_id (internships (*))
        `)
        .eq('id', id)
        .single();

      if (error) {
        toast.error('Failed to fetch submission');
        router.push('/admin/projects');
      } else {
        setSubmission(data as any);
        if ((data as any).feedback) setFeedback((data as any).feedback);
      }
      setLoading(false);
    }
    fetchSubmission();
  }, [id, router, supabase]);

  const handleReview = async (action: 'pass' | 'fail') => {
    if (!feedback.trim()) {
      toast.error('Please provide some feedback for the intern.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/projects/${id}/review`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, feedback }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Review failed');
      }

      toast.success(`Project marked as ${action === 'pass' ? 'PASSED' : 'FAILED'}`);
      router.push('/admin/projects');
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

  const intern = submission?.profiles;
  const project = submission?.internship_projects;
  const internship = submission?.enrollments?.internships;

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/projects" 
          className="p-2 rounded-full bg-white border border-gray-200 text-gray-400 hover:text-gray-900 transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-gray-900">Review Submission</h1>
          <p className="text-sm text-gray-500">Evaluating work for {project?.title}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Submission Content */}
        <div className="lg:col-span-2 space-y-6">
          <section className="card p-6 space-y-6">
            <h2 className="font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
              <FileText className="h-4 w-4 text-primary-500" /> Intern's Content
            </h2>
            
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 min-h-[200px] whitespace-pre-line text-gray-700 leading-relaxed">
                {submission?.submission_text || "No descriptive text provided."}
              </div>

              {submission?.file_urls?.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Submitted Links / Files</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {submission.file_urls.map((url: string, i: number) => {
                      const isGithub = url.includes('github.com');
                      return (
                        <a 
                          key={i} 
                          href={url} 
                          target="_blank"
                          rel="noreferrer"
                          className={cn(
                            'flex items-center justify-between p-3 rounded-lg border transition-all group',
                            isGithub
                              ? 'border-gray-800 bg-gray-900 hover:bg-gray-800 text-white'
                              : 'border-gray-200 bg-white hover:border-primary-300 hover:bg-primary-50'
                          )}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            {isGithub
                              ? <Code className="h-4 w-4 shrink-0 text-white" />
                              : <ExternalLink className="h-4 w-4 shrink-0 text-gray-400" />
                            }
                            <span className={cn('text-sm truncate max-w-[80%]', isGithub ? 'text-gray-200 font-semibold' : 'text-gray-600')}>
                              {isGithub ? 'GitHub Repository' : url}
                            </span>
                          </div>
                          <span className={cn('text-[10px] font-black uppercase tracking-widest shrink-0', isGithub ? 'text-gray-400' : 'text-primary-400')}>
                            {isGithub ? 'View Code →' : 'Open'}
                          </span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </section>

          <section className="card p-6 space-y-4">
            <h2 className="font-bold text-gray-900 border-b border-gray-100 pb-3 mb-4">Grading & Feedback</h2>
            
            <div>
              <label className="label">Comments for Intern <span className="text-red-500">*</span></label>
              <textarea 
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={5}
                placeholder="Write constructive feedback here. If failing, explain exactly what needs to be fixed..."
                className="input resize-none"
              />
              <p className="text-[10px] text-gray-400 mt-2 flex items-center gap-1">
                <InfoIcon className="h-2.5 w-2.5" /> Intern will see these comments in their dashboard.
              </p>
            </div>

            <div className="pt-4 flex gap-4">
              <button 
                onClick={() => handleReview('fail')}
                disabled={submitting}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl border-2 border-red-100 bg-red-50 py-3 font-bold text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50"
              >
                <XCircle className="h-5 w-5" /> Mark as Failed
              </button>
              <button 
                onClick={() => handleReview('pass')}
                disabled={submitting}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl border-2 border-green-100 bg-green-50 py-3 font-bold text-green-600 hover:bg-green-100 transition-colors disabled:opacity-50"
              >
                <CheckCircle className="h-5 w-5" /> Mark as Passed
              </button>
            </div>
          </section>
        </div>

        {/* Right: Metadata */}
        <div className="space-y-6">
          <section className="card p-6 space-y-6">
            <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-3">Submission Details</h3>
            
            <div className="space-y-4">
              <DetailRow icon={UserIcon} label="Intern" value={(intern as any)?.full_name} subValue={(intern as any)?.email} />
              <DetailRow icon={BookOpen} label="Program" value={(internship as any)?.title} />
              <DetailRow icon={Calendar} label="Submitted" value={submission?.submitted_at ? formatDate(submission.submitted_at) : '—'} />
              <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100">
                <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Attempt Number</div>
                <div className="text-2xl font-black text-indigo-700">#{submission?.attempt_number}</div>
              </div>
            </div>
          </section>

          <section className="card p-6 bg-gray-900 text-white">
            <h3 className="font-bold border-b border-gray-800 pb-3 mb-4">Project Guidelines</h3>
            <div className="text-xs text-gray-400 space-y-4 leading-relaxed">
              <p><strong>Title:</strong> {project?.title}</p>
              <p><strong>Description:</strong> {project?.description}</p>
              {project?.resources_url && (
                <a href={project.resources_url} target="_blank" className="flex items-center gap-1.5 text-primary-400 hover:underline">
                  <ExternalLink className="h-3 w-3" /> View Project Resources
                </a>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value, subValue }: any) {
  return (
    <div className="flex items-start gap-3">
      <div className="p-2 rounded-lg bg-gray-50 text-gray-400">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <div className="text-xs text-gray-400 font-bold uppercase tracking-widest">{label}</div>
        <div className="text-sm font-bold text-gray-900">{value}</div>
        {subValue && <div className="text-[10px] text-gray-500 truncate max-w-[150px]">{subValue}</div>}
      </div>
    </div>
  );
}

function InfoIcon({ className }: any) {
    return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
}
