'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Clock, BarChart2, Users, Lock, CheckCircle, ArrowRight,
  BookOpen, Target, Calendar, ChevronRight, Award,
} from 'lucide-react';
import { DIFFICULTY_OPTIONS } from '@/lib/constants';
import { formatDate, cn } from '@/lib/utils';
import ApplicationModal from '@/components/forms/ApplicationModal';
import type { Database } from '@/types/database.types';

type Internship = Database['public']['Tables']['internships']['Row'];
type Project = Pick<Database['public']['Tables']['internship_projects']['Row'], 'id' | 'title' | 'week_number' | 'order_index'>;

interface Props {
  internship: Internship;
  projects: Project[];
  isLoggedIn: boolean;
  isEnrolled: boolean;
  hasApplied: boolean;
  applicationStatus: string | null;
}

const TABS = ['Overview', 'Requirements', 'Projects', 'Reviews'] as const;
type Tab = (typeof TABS)[number];

export default function InternshipDetailClient({ internship, projects, isLoggedIn, isEnrolled, hasApplied, applicationStatus }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('Overview');
  const [applyModalOpen, setApplyModalOpen] = useState(false);

  const difficulty = DIFFICULTY_OPTIONS.find((d) => d.value === internship.difficulty);
  const spotsLeft = internship.spots_total - internship.spots_filled;

  const CTAButton = () => {
    if (isEnrolled) {
      return (
        <Link href="/my-internship" className="btn-primary w-full text-center">
          Go to My Internship <ArrowRight className="h-4 w-4" />
        </Link>
      );
    }
    if (hasApplied) {
      return (
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-center">
          <p className="text-sm font-semibold text-yellow-800">Application {applicationStatus?.replace(/_/g, ' ')}</p>
          <Link href="/applications" className="text-xs text-yellow-600 underline mt-1 block">View Status</Link>
        </div>
      );
    }
    if (!isLoggedIn) {
      return (
        <Link href="/register" className="btn-primary w-full text-center">
          Register to Apply <ArrowRight className="h-4 w-4" />
        </Link>
      );
    }
    return (
      <button onClick={() => setApplyModalOpen(true)} className="btn-primary w-full">
        Apply Now <ArrowRight className="h-4 w-4" />
      </button>
    );
  };

  return (
    <>
      <div className="pt-16 min-h-screen bg-gray-50">
        {/* Hero Banner */}
        <div className="gradient-hero py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          
          <div className="container relative z-10">
            <div className="flex items-center gap-2 text-blue-100/60 text-[10px] font-black uppercase tracking-widest mb-6">
              <Link href="/internships" className="hover:text-white transition-colors">Internships Tracker</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-white">{internship.title}</span>
            </div>
            
            <div className="max-w-4xl">
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest border border-white/10">
                  {internship.category.replace(/-/g, ' ').toUpperCase()}
                </span>
                <span className={cn('inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border', difficulty?.color.replace('badge', ''))}>
                  {difficulty?.label.toUpperCase()} DEPTH
                </span>
                {spotsLeft <= 10 && spotsLeft > 0 && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-rose-500/20 text-rose-200 text-[10px] font-black uppercase tracking-widest border border-rose-500/20 animate-pulse">
                    ⚡ Priority Selection: {spotsLeft} Spots
                  </span>
                )}
              </div>
              
              <h1 className="font-instrument-serif text-4xl md:text-6xl text-white mb-6 leading-tight tracking-tight">
                {internship.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-8 text-blue-200/70 text-xs font-bold uppercase tracking-widest">
                <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary-300" />{internship.duration_weeks} Wks</span>
                <span className="flex items-center gap-2"><BarChart2 className="h-4 w-4 text-emerald-400" />{difficulty?.label} Prep</span>
                <span className="flex items-center gap-2"><Users className="h-4 w-4 text-blue-400" />{spotsLeft} Avail</span>
                <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-purple-400" />Joined {formatDate(internship.created_at)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container py-12">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Tabs */}
              <div className="border-b border-gray-200 mb-8">
                <nav className="flex gap-1 overflow-x-auto scrollbar-hide -mb-px">
                  {TABS.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={cn(
                        'px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors',
                        activeTab === tab
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      )}
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'Overview' && (
                  <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
                    <h2 className="text-lg font-bold text-gray-900 mb-3">About This Internship</h2>
                    <p className="whitespace-pre-line">{internship.description}</p>

                    <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3 flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary-500" /> What You'll Learn
                    </h2>
                    <ul className="space-y-2">
                      {internship.what_you_learn.split('\n').filter(Boolean).map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                          <span>{item.replace(/^[-•*]\s*/, '')}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeTab === 'Requirements' && (
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary-500" /> Requirements
                    </h2>
                    <ul className="space-y-3">
                      {internship.requirements.split('\n').filter(Boolean).map((req, i) => (
                        <li key={i} className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-700">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-700 text-xs font-bold">{i + 1}</span>
                          {req.replace(/^[-•*]\s*/, '')}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeTab === 'Projects' && (
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-2">Project Timeline</h2>
                    <p className="text-sm text-gray-500 mb-6">
                      {isEnrolled ? 'Your projects for this internship.' : 'Projects are revealed after enrollment.'}
                    </p>
                    <div className="space-y-4">
                      {projects.map((project, i) => (
                        <div
                          key={project.id}
                          className={cn(
                            'relative rounded-xl border p-5 transition-all',
                            isEnrolled
                              ? 'border-gray-200 bg-white'
                              : 'border-gray-200 bg-gray-50 select-none'
                          )}
                        >
                          {!isEnrolled && (
                            <div className="absolute inset-0 rounded-xl flex items-center justify-center bg-white/70 backdrop-blur-[2px] z-10">
                              <div className="flex items-center gap-2 text-gray-500 text-sm">
                                <Lock className="h-4 w-4" />
                                <span>Enroll to unlock</span>
                              </div>
                            </div>
                          )}
                          <div className="flex items-start gap-4">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700 text-sm font-bold">
                              {i + 1}
                            </div>
                            <div>
                              <div className="text-xs text-gray-400 mb-0.5">Week {project.week_number}</div>
                              <h3 className={cn('font-semibold', !isEnrolled && 'blur-[3px]')}>{project.title}</h3>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'Reviews' && (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-3">⭐</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No reviews yet</h3>
                    <p className="text-gray-500 text-sm">Be the first to complete this internship and share your experience.</p>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Sticky Sidebar CTA */}
            <div className="lg:col-span-1">
              <div className="card p-8 sticky top-24 border-none shadow-premium bg-white/50 backdrop-blur-md">
                <div className="text-center mb-8 pb-6 border-b border-gray-100">
                  <div className="text-[10px] font-black text-primary-500 uppercase tracking-widest mb-1">Registration Fee</div>
                  <p className="text-4xl font-black text-gray-900 tracking-tighter">Free Entrance</p>
                  <p className="text-[10px] font-bold text-gray-400 mt-2 flex items-center justify-center gap-1">
                    <CheckCircle className="h-3 w-3 text-emerald-500" /> PKR 300 ONLY FOR CERTIFICATE
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  {[
                    { icon: Clock,    label: `${internship.duration_weeks} Weeks Duration`, color: 'text-blue-500 bg-blue-50' },
                    { icon: BarChart2, label: `${difficulty?.label} Prep Level`, color: 'text-emerald-500 bg-emerald-50' },
                    { icon: Users,     label: `${spotsLeft} Reserved Spots`, color: 'text-purple-500 bg-purple-50' },
                    { icon: Award,     label: 'Verified Certificate', color: 'text-amber-500 bg-amber-50' },
                    { icon: BookOpen,  label: `${projects.length} Industry Projects`, color: 'text-indigo-500 bg-indigo-50' },
                  ].map(({ icon: Icon, label, color }, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs font-bold text-gray-600">
                      <div className={cn("h-7 w-7 rounded-lg flex items-center justify-center", color)}>
                        <Icon size={14} />
                      </div>
                      {label}
                    </div>
                  ))}
                </div>

                <div className="hover:scale-[1.02] transition-transform active:scale-95">
                  <CTAButton />
                </div>

                <p className="text-center text-[10px] font-bold text-gray-400 mt-5 uppercase tracking-tighter">
                  Verified remote program in Pakistan
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {applyModalOpen && (
        <ApplicationModal
          internshipId={internship.id}
          internshipTitle={internship.title}
          onClose={() => setApplyModalOpen(false)}
        />
      )}
    </>
  );
}
