import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { formatDate, calculateDaysLeft, cn } from '@/lib/utils';
import { Clock, Calendar, Briefcase, BookOpen, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export const metadata = { title: 'My Internship' };

export default async function MyInternshipPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('*, internships(title, category, duration_weeks, difficulty, description, what_you_learn), project_submissions(status)')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .maybeSingle();

  // Also fetch the total number of projects for accurate progress display
  const totalProjectCount = enrollment
    ? (await supabase
        .from('internship_projects')
        .select('id', { count: 'exact', head: true })
        .eq('internship_id', (enrollment as any).internship_id)
      ).count || 0
    : 0;

  if (!enrollment) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">No Active Internship</h1>
        <p className="text-gray-500 mb-6">You're not currently enrolled in any internship.</p>
        <Link href="/internships" className="btn-primary">Browse Internships</Link>
      </div>
    );
  }

  const internship = (enrollment as any).internships as unknown as {
    title: string; category: string; duration_weeks: number;
    difficulty: string; description: string; what_you_learn: string;
  };
  const submissions = (enrollment as any).project_submissions as { status: string }[];
  const passed = submissions.filter(s => s.status === 'passed').length;
  const total = totalProjectCount > 0 ? totalProjectCount : submissions.length;
  const progress = total > 0 ? Math.round((passed / total) * 100) : 0;
  const daysLeft = calculateDaysLeft((enrollment as any).end_date);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Internship</h1>
        <p className="text-sm text-gray-500 mt-1">Currently enrolled</p>
      </div>

      {/* Main Card */}
      <div className="card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="badge bg-green-100 text-green-700 text-xs">● Active</span>
              <span className="badge bg-gray-100 text-gray-600 text-xs">{internship.category.replace(/-/g, ' ')}</span>
              <span className="badge bg-blue-100 text-blue-700 text-xs">{internship.difficulty}</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900">{internship.title}</h2>
          </div>
        </div>

        {/* Timeline */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-6">
          {[
            { icon: Calendar, label: 'Start Date',  value: formatDate((enrollment as any).start_date) },
            { icon: Calendar, label: 'End Date',    value: formatDate((enrollment as any).end_date) },
            { icon: Clock,    label: 'Days Left',   value: `${daysLeft} days` },
            { icon: BookOpen, label: 'Duration',    value: `${internship.duration_weeks} Weeks` },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-xl bg-gray-50 p-4">
              <div className="flex items-center gap-2 text-gray-400 mb-1">
                <Icon className="h-3.5 w-3.5" />
                <span className="text-xs">{label}</span>
              </div>
              <div className="text-sm font-semibold text-gray-900">{value}</div>
            </div>
          ))}
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium text-gray-700">Overall Progress</span>
            <span className="font-bold text-primary-600">{progress}% ({passed}/{total} projects)</span>
          </div>
          <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
            <div
              className={cn('h-3 rounded-full transition-all duration-700', progress === 100 ? 'bg-green-500' : 'bg-primary-500')}
              style={{ width: `${progress}%` }}
            />
          </div>
          {daysLeft <= 7 && daysLeft > 0 && (
            <p className="text-xs text-orange-600 mt-2 font-medium">⚠️ Only {daysLeft} days left! Complete your projects.</p>
          )}
        </div>

        <Link href="/projects" className="btn-primary w-full text-center flex items-center justify-center gap-2">
          <BookOpen className="h-4 w-4" /> View & Submit Projects <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {/* What You'll Learn */}
      <div className="card p-6">
        <h3 className="font-bold text-gray-900 mb-4">What You'll Learn</h3>
        <ul className="space-y-2">
          {internship.what_you_learn.split('\n').filter(Boolean).map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
              <span className="text-green-500 mt-0.5">✓</span>
              {item.replace(/^[-•*]\s*/, '')}
            </li>
          ))}
        </ul>
      </div>

      {/* Support */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 text-center">
        <p className="text-sm font-semibold text-gray-700 mb-1">Need Help?</p>
        <p className="text-xs text-gray-500 mb-3">Our program managers are here to support you.</p>
        <a href="mailto:support@internhub.pk" className="text-xs font-semibold text-primary-500 hover:underline">
          📧 support@internhub.pk
        </a>
      </div>
    </div>
  );
}
