import { createClient, checkProfileCompletion } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { formatDate, cn } from '@/lib/utils';
import { APPLICATION_STATUS_LABELS } from '@/lib/constants';
import { FileText, Clock } from 'lucide-react';

import OfferLetterDownload from '@/components/pdf/OfferLetterDownload';

export const metadata = { title: 'My Applications' };

export default async function ApplicationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const isProfileComplete = await checkProfileCompletion(supabase, user.id);
  if (!isProfileComplete) redirect('/profile?onboard=true');

  const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).single() as any;

  const { data: applications } = await supabase
    .from('applications')
    .select('*, internships(title, category, duration_weeks, difficulty), enrollments(start_date, end_date)')
    .eq('user_id', user.id)
    .order('applied_at', { ascending: false });

  const apps = (applications as any[]) || [];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
          <p className="text-sm text-gray-500 mt-1">{apps.length} total applications</p>
        </div>
        <Link href="/internships" className="btn-primary text-sm">Browse More</Link>
      </div>

      {apps.length === 0 ? (
        <div className="card p-12 text-center">
          <FileText className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-gray-700 mb-2">No applications yet</h2>
          <p className="text-sm text-gray-400 mb-5">Start your journey by applying to an internship.</p>
          <Link href="/internships" className="btn-primary inline-flex">Browse Internships</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {apps.map((app) => {
            const internship = app.internships as unknown as { title: string; category: string; duration_weeks: number; difficulty: string };
            const statusInfo = APPLICATION_STATUS_LABELS[app.status];
            return (
              <div key={app.id} className="card p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="badge bg-gray-100 text-gray-600 text-xs">
                        {internship?.category?.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                      </span>
                      <span className="badge bg-blue-50 text-blue-700 text-xs">
                        {internship?.duration_weeks} Weeks
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900">{internship?.title}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      Applied {formatDate(app.applied_at)}
                      {app.reviewed_at && <> · Reviewed {formatDate(app.reviewed_at)}</>}
                    </div>

                    {app.rejection_reason && (
                      <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                        <strong>Feedback:</strong> {app.rejection_reason}
                      </div>
                    )}
                  </div>
                  <div className="shrink-0 text-right space-y-2">
                    <span className={cn('badge', statusInfo?.color)}>{statusInfo?.label}</span>
                    {app.status === 'accepted' && (
                      <div className="space-y-2">
                        <Link href="/my-internship" className="text-xs font-semibold text-primary-500 hover:underline block">
                          Go to Dashboard →
                        </Link>
                        {app.enrollments?.[0] && (
                          <OfferLetterDownload 
                            internName={profile?.full_name || 'Intern'}
                            internshipTitle={internship?.title || 'Internship'}
                            startDate={app.enrollments[0].start_date}
                            endDate={app.enrollments[0].end_date}
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
