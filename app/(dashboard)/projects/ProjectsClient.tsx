'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle, Clock, AlertCircle, Send, Loader2, ChevronDown, X, Code, Lock, Calendar } from 'lucide-react';
import { projectSubmissionSchema, type ProjectSubmissionInput } from '@/lib/validations/schemas';
import { PROJECT_STATUS_LABELS } from '@/lib/constants';
import { cn, formatDate, calculateDaysLeft } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

interface ProjectSubmission {
  id: string;
  project_id: string;
  status: string;
  submission_text: string | null;
  file_urls: string[];
  submitted_at: string | null;
  feedback: string | null;
  attempt_number: number;
  internship_projects: {
    id: string;
    title: string;
    description: string;
    week_number: number;
    order_index: number;
    resources_url: string | null;
  };
}

interface Props {
  enrollment: { id: string; internship_id: string; start_date: string; end_date: string; internships: { title: string } };
  submissions: ProjectSubmission[];
  totalProjects: number;
}

/**
 * Returns true if the project's week has been reached since enrollment start.
 * Week 1 unlocks immediately. Week 2 unlocks after 7 days, etc.
 */
function isWeekUnlocked(startDateStr: string, weekNumber: number): boolean {
  const startDate = new Date(startDateStr);
  const unlockDate = new Date(startDate);
  unlockDate.setDate(startDate.getDate() + (weekNumber - 1) * 7);
  return new Date() >= unlockDate;
}

/**
 * Returns the date when a week unlocks.
 */
function getWeekUnlockDate(startDateStr: string, weekNumber: number): Date {
  const startDate = new Date(startDateStr);
  const unlockDate = new Date(startDate);
  unlockDate.setDate(startDate.getDate() + (weekNumber - 1) * 7);
  return unlockDate;
}

export default function ProjectsClient({ enrollment, submissions, totalProjects }: Props) {
  const [activeSubmit, setActiveSubmit] = useState<string | null>(null);
  const [expandedFeedback, setExpandedFeedback] = useState<string | null>(null);
  const supabase = createClient();

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ProjectSubmissionInput>({
    resolver: zodResolver(projectSubmissionSchema),
  });

  const daysLeft = calculateDaysLeft(enrollment.end_date);
  const passed = submissions.filter(s => s.status === 'passed').length;
  const total = totalProjects || submissions.length;
  const progress = total > 0 ? Math.round((passed / total) * 100) : 0;

  /**
   * Determines if a project at index `i` is accessible.
   * Rules:
   *  1. Time gate: current date >= enrollmentStart + (week_number - 1) * 7 days
   *  2. Sequential gate: previous project (index i-1) must have status === 'passed'
   */
  const isProjectAccessible = (sub: ProjectSubmission, index: number): boolean => {
    const project = sub.internship_projects;

    // Time gate
    if (!isWeekUnlocked(enrollment.start_date, project.week_number)) return false;

    // Sequential gate — first project has no predecessor
    if (index === 0) return true;

    const prevSub = submissions[index - 1];
    return prevSub?.status === 'passed';
  };

  const getLockReason = (sub: ProjectSubmission, index: number): string => {
    const project = sub.internship_projects;

    if (!isWeekUnlocked(enrollment.start_date, project.week_number)) {
      const unlockDate = getWeekUnlockDate(enrollment.start_date, project.week_number);
      return `Unlocks on ${unlockDate.toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })} (Week ${project.week_number})`;
    }

    if (index > 0 && submissions[index - 1]?.status !== 'passed') {
      return 'Complete & pass the previous project first';
    }

    return 'Locked';
  };

  const handleSubmitProject = async (sub: ProjectSubmission, data: ProjectSubmissionInput) => {
    const isNew = sub.id === sub.project_id;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { toast.error('You must be logged in to submit.'); return; }

    const fileUrls = [...(sub.file_urls || [])];
    const githubUrl = data.github_url;
    const filteredUrls = fileUrls.filter(u => !u.includes('github.com'));
    filteredUrls.unshift(githubUrl);

    const payload: any = {
      submission_text: data.submission_text,
      status: 'pending',
      submitted_at: new Date().toISOString(),
      project_id: sub.project_id,
      enrollment_id: enrollment.id,
      user_id: user.id,
      attempt_number: sub.attempt_number || 1,
      file_urls: filteredUrls,
    };

    if (!isNew) payload.id = sub.id;

    let error;
    if (isNew) {
      const result = await (supabase.from('project_submissions') as any).insert(payload as any);
      error = result.error;
    } else {
      const result = await (supabase.from('project_submissions') as any)
        .update(payload as any)
        .eq('id', sub.id);
      error = result.error;
    }

    if (error) {
      console.error('Submission error:', error);
      toast.error(`Failed to submit: ${error.message}`);
      return;
    }
    toast.success('Project submitted! Admin will review it shortly.');
    setActiveSubmit(null);
    reset();
    window.location.reload();
  };

  const statusIcon = (status: string, locked: boolean) => {
    if (locked) return <Lock className="h-5 w-5 text-gray-300" />;
    if (status === 'passed') return <CheckCircle className="h-5 w-5 text-green-500" />;
    if (status === 'failed') return <AlertCircle className="h-5 w-5 text-red-500" />;
    if (status === 'pending' || status === 'submitted' || status === 'under_review')
      return <Clock className="h-5 w-5 text-blue-500" />;
    return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Projects</h1>
        <p className="text-sm text-gray-500 mt-1">{enrollment.internships.title}</p>
      </div>

      {/* Progress */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-sm font-semibold text-gray-900">{passed}/{total} Projects Passed</span>
            <span className="ml-3 text-xs text-gray-500">{daysLeft} days remaining</span>
          </div>
          <span className="text-lg font-bold text-primary-500">{progress}%</span>
        </div>
        <div className="h-2.5 rounded-full bg-gray-100">
          <div className="h-2.5 rounded-full bg-primary-500 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Lock Legend */}
      <div className="flex flex-wrap gap-3 text-xs">
        <span className="flex items-center gap-1.5 text-gray-500"><Lock className="h-3.5 w-3.5 text-gray-300" /> Locked</span>
        <span className="flex items-center gap-1.5 text-gray-500"><div className="h-3.5 w-3.5 rounded-full border-2 border-gray-300" /> Available</span>
        <span className="flex items-center gap-1.5 text-gray-500"><Clock className="h-3.5 w-3.5 text-blue-500" /> Submitted — Pending Review</span>
        <span className="flex items-center gap-1.5 text-gray-500"><CheckCircle className="h-3.5 w-3.5 text-green-500" /> Approved</span>
        <span className="flex items-center gap-1.5 text-gray-500"><AlertCircle className="h-3.5 w-3.5 text-red-500" /> Rejected — Resubmit</span>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {submissions.map((sub, i) => {
          const project = sub.internship_projects;
          const accessible = isProjectAccessible(sub, i);
          const lockReason = !accessible ? getLockReason(sub, i) : null;
          const statusInfo = PROJECT_STATUS_LABELS[sub.status];
          const canSubmit = accessible && (sub.status === 'in_progress' || sub.status === 'failed');
          const isOpen = activeSubmit === sub.id;
          const githubLink = (sub.file_urls || []).find(u => u.includes('github.com'));

          return (
            <div
              key={project.id}
              className={cn(
                'card overflow-hidden transition-all',
                !accessible && 'opacity-60 bg-gray-50',
                sub.status === 'passed' && 'border-green-200 bg-green-50/30',
              )}
            >
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div className="mt-0.5 shrink-0">{statusIcon(sub.status, !accessible)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-xs text-gray-400">Week {project.week_number} · Project {i + 1}</span>
                      {accessible ? (
                        <span className={cn('badge text-xs', statusInfo?.color)}>{statusInfo?.label}</span>
                      ) : (
                        <span className="badge bg-gray-100 text-gray-500 text-xs flex items-center gap-1">
                          <Lock className="h-3 w-3" /> Locked
                        </span>
                      )}
                      {sub.attempt_number > 1 && (
                        <span className="badge bg-orange-100 text-orange-700 text-xs">Attempt #{sub.attempt_number}</span>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900">{project.title}</h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{project.description}</p>

                    {/* Lock reason badge */}
                    {!accessible && lockReason && (
                      <div className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-amber-50 border border-amber-200 px-2.5 py-1 text-xs text-amber-700 font-medium">
                        <Calendar className="h-3 w-3" />
                        {lockReason}
                      </div>
                    )}

                    {/* GitHub Link */}
                    {githubLink && accessible && (
                      <a
                        href={githubLink}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        <Code className="h-3.5 w-3.5" />
                        View on GitHub
                      </a>
                    )}

                    {/* Feedback */}
                    {sub.feedback && accessible && (
                      <button
                        onClick={() => setExpandedFeedback(expandedFeedback === sub.id ? null : sub.id)}
                        className="mt-3 flex items-center gap-1.5 text-xs font-medium text-primary-600 hover:underline"
                      >
                        <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', expandedFeedback === sub.id && 'rotate-180')} />
                        Admin Feedback
                      </button>
                    )}
                    <AnimatePresence>
                      {expandedFeedback === sub.id && sub.feedback && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-2 rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs text-gray-700 leading-relaxed"
                        >
                          {sub.feedback}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {sub.submitted_at && accessible && (
                      <p className="text-xs text-gray-400 mt-2">Submitted: {formatDate(sub.submitted_at)}</p>
                    )}
                  </div>

                  {canSubmit && (
                    <button
                      onClick={() => setActiveSubmit(isOpen ? null : sub.id)}
                      className={cn('shrink-0 text-sm font-semibold px-4 py-2 rounded-lg transition-colors',
                        isOpen ? 'bg-gray-100 text-gray-700' : 'btn-primary'
                      )}
                    >
                      {isOpen ? <><X className="h-4 w-4 inline mr-1" />Cancel</> : <><Send className="h-4 w-4 inline mr-1" />Submit</>}
                    </button>
                  )}
                </div>
              </div>

              {/* Submission Form */}
              <AnimatePresence>
                {isOpen && canSubmit && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-gray-200 bg-gray-50 p-5"
                  >
                    <form onSubmit={handleSubmit((d) => handleSubmitProject(sub, d))} className="space-y-4">
                      <div>
                        <label htmlFor={`github-${sub.id}`} className="label flex items-center gap-1.5">
                          <Code className="h-3.5 w-3.5" /> GitHub Repository URL <span className="text-red-500">*</span>
                        </label>
                        <input
                          id={`github-${sub.id}`}
                          type="url"
                          {...register('github_url')}
                          placeholder="https://github.com/your-username/your-project"
                          className={cn('input', errors.github_url && 'border-red-400')}
                          defaultValue={(sub.file_urls || []).find(u => u.includes('github.com')) || ''}
                        />
                        {errors.github_url && (
                          <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />{errors.github_url.message}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">Upload your project to GitHub first, then paste the repository link here.</p>
                      </div>

                      <div>
                        <label htmlFor={`text-${sub.id}`} className="label">Project Description <span className="text-red-500">*</span></label>
                        <textarea
                          id={`text-${sub.id}`}
                          {...register('submission_text')}
                          rows={5}
                          placeholder="Describe your work in detail. What did you build? What challenges did you face? What did you learn? (min 50 characters)"
                          className={cn('input resize-none', errors.submission_text && 'border-red-400')}
                          defaultValue={sub.submission_text || ''}
                        />
                        {errors.submission_text && (
                          <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />{errors.submission_text.message}
                          </p>
                        )}
                      </div>

                      <div className="flex justify-end gap-3">
                        <button type="button" onClick={() => setActiveSubmit(null)} className="btn-ghost text-sm">Cancel</button>
                        <button type="submit" disabled={isSubmitting} className="btn-primary text-sm">
                          {isSubmitting
                            ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</>
                            : <><Send className="h-4 w-4" /> Submit Project</>
                          }
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* All Passed → Certificate CTA (no payment) */}
      {progress === 100 && total > 0 && (
        <div className="rounded-2xl border-2 border-yellow-400 bg-yellow-50 p-6 text-center">
          <div className="text-4xl mb-3">🏆</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">All Projects Completed!</h2>
          <p className="text-sm text-gray-700 mb-1">
            Congratulations! Our admin team will review your final submissions and issue your verified certificate.
          </p>
          <p className="text-xs text-gray-500 mb-4">No additional payment required — your PKR 300 enrollment fee covers everything.</p>
          <a href="/certificates" className="btn-primary inline-flex">
            🎓 View My Certificates
          </a>
        </div>
      )}
    </div>
  );
}
