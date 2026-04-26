import { createClient, checkProfileCompletion } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { formatDate, calculateDaysLeft, cn } from '@/lib/utils';
import { Clock, Calendar, Briefcase, BookOpen, ChevronRight, Download, Share2, Wallet, PartyPopper, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata = { title: 'My Internship' };

export default async function MyInternshipPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const isProfileComplete = await checkProfileCompletion(supabase, user.id);
  if (!isProfileComplete) redirect('/profile?onboard=true');

  // 1. Fetch active enrollment
  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('*, internships(title, category, duration_weeks, difficulty, description, what_you_learn), project_submissions(status)')
    .eq('user_id', user.id)
    .maybeSingle();

  // 1b. Check if payment proof is pending
  const { data: pendingProof } = await supabase
    .from('payment_proofs')
    .select('id, status')
    .eq('user_id', user.id)
    .eq('status', 'pending')
    .maybeSingle();

  // 2. If no active enrollment, fetch the latest accepted application
  const acceptedAppRes = !enrollment ? await supabase
    .from('applications')
    .select('*, internships(title, category, duration_weeks, difficulty, description, what_you_learn)')
    .eq('user_id', user.id)
    .eq('status', 'accepted')
    .order('applied_at', { ascending: false })
    .limit(1)
    .maybeSingle() : { data: null };
  const acceptedApplication = acceptedAppRes.data as any;

  // 3. If no accepted app, check for any pending app
  const pendingAppRes = (!enrollment && !acceptedApplication) ? await supabase
    .from('applications')
    .select('*, internships(title, category)')
    .eq('user_id', user.id)
    .in('status', ['pending', 'under_review'])
    .order('applied_at', { ascending: false })
    .limit(1)
    .maybeSingle() : { data: null };
  const pendingApplication = pendingAppRes.data as any;

  // --- RENDERING LOGIC ---

  // CASE 1: Active Enrollment
  if (enrollment) {
    const internship = (enrollment as any).internships;
    const totalProjectCount = (await supabase
        .from('internship_projects')
        .select('id', { count: 'exact', head: true })
        .eq('internship_id', (enrollment as any).internship_id)
      ).count || 0;

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

          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium text-gray-700">Overall Progress</span>
              <span className="font-bold text-primary-600">{progress}% ({passed}/{total} projects)</span>
            </div>
            <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
              <div className="h-3 rounded-full transition-all duration-700 bg-primary-500" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <Link href="/projects" className="btn-primary w-full text-center flex items-center justify-center gap-2">
            <BookOpen className="h-4 w-4" /> View & Submit Projects <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* What You'll Learn */}
        <div className="card p-6">
          <h3 className="font-bold text-gray-900 mb-4">What You'll Learn</h3>
          <ul className="space-y-3">
            {(internship.what_you_learn as string).split('\n').filter(Boolean).map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                <span className="text-green-500 mt-0.5 font-bold">✓</span>
                {item.replace(/^[-•*]\s*/, '')}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  // CASE 1.5: Payment Proof Pending
  if (pendingProof && !enrollment) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 px-4">
        <div className="h-20 w-20 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Clock className="h-10 w-10 animate-spin" style={{ animationDuration: '3s' }} />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-3">Verification in Progress</h1>
        <p className="text-gray-500 mb-8 max-w-sm mx-auto leading-relaxed">
          We've received your payment proof! Our admin team is currently verifying the transaction. 
          This usually takes <strong>24–48 hours</strong>.
        </p>
        <div className="card p-6 bg-amber-50/50 border-amber-100 text-left max-w-md mx-auto">
          <p className="text-xs font-bold text-amber-800 uppercase tracking-widest mb-2">Next Steps</p>
          <ul className="space-y-2 text-sm text-amber-900/70 font-medium">
            <li className="flex items-center gap-2">● Admin checks your reference number</li>
            <li className="flex items-center gap-2">● Dashboard & projects unlock automatically</li>
            <li className="flex items-center gap-2">● You'll receive an in-app notification</li>
          </ul>
        </div>
        <div className="mt-8">
            <Link href="/dashboard" className="text-sm font-bold text-primary-600 hover:underline">← Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  // CASE 2: Selected but Pending Payment/Sharing
  if (acceptedApplication) {
    const internship = acceptedApplication.internships;
    const shareText = encodeURIComponent(`I’m thrilled to announce that I’ve been selected for the ${internship.title} internship at AWH TECH! 🚀 I'm looking forward to working on industry-grade projects and enhancing my skills. Thank you AWH TECH for this opportunity! #Internship #AWH TECH #CareerGrowth`);
    const linkedInUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${shareText}`;

    return (
      <div className="max-w-2xl mx-auto space-y-8 py-10 px-4">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-green-100 text-green-600 mb-2">
            <PartyPopper className="h-10 w-10" />
          </div>
          <h1 className="text-3xl font-black text-gray-900">Congratulations, You're Selected!</h1>
          <p className="text-gray-500 mx-auto max-w-lg">
            We are pleased to inform you that you have been accepted for the <strong>{internship.title}</strong> program. 
            Follow the steps below to unlock your dashboard and projects.
          </p>
        </div>

        <div className="grid gap-4">
          {/* Step 1: Download Offer */}
          <div className="card p-5 border-l-4 border-l-blue-500 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">1</div>
              <div>
                <h3 className="font-bold text-gray-900">Get Your Offer Letter</h3>
                <p className="text-xs text-gray-500">Official proof of your selection</p>
              </div>
            </div>
            <a href={`/offer-letter/${acceptedApplication.id}`} target="_blank" rel="noopener noreferrer" className="btn-secondary py-2 px-4 text-xs flex items-center gap-2">
              <Download className="h-3.5 w-3.5" /> Download PDF
            </a>
          </div>

          {/* Step 2: Share on LinkedIn */}
          <div className="card p-5 border-l-4 border-l-primary-500 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center font-bold">2</div>
              <div>
                <h3 className="font-bold text-gray-900">Share Your Success</h3>
                <p className="text-xs text-gray-500">Post on LinkedIn to unlock the next step</p>
              </div>
            </div>
            <a href={linkedInUrl} target="_blank" rel="noopener noreferrer" className="bg-[#0077b5] text-white py-2 px-4 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-[#006097] transition-all">
              <Share2 className="h-3.5 w-3.5" /> Post on LinkedIn
            </a>
          </div>

          {/* Step 3: Community Fee */}
          <div className="card p-5 border-l-4 border-l-secondary-500 flex items-center justify-between gap-4 opacity-50">
             <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-secondary-50 text-secondary-600 flex items-center justify-center font-bold">3</div>
              <div>
                <h3 className="font-bold text-gray-900">One-time Enrollment Fee</h3>
                <p className="text-xs text-gray-500">PKR 300 for community access</p>
              </div>
            </div>
             <Link href="/enroll" className="btn-primary py-2 px-4 text-xs flex items-center gap-2">
              <Wallet className="h-3.5 w-3.5" /> Pay & Unlock
            </Link>
          </div>
        </div>

        <div className="rounded-2xl bg-primary-50 p-6 border border-primary-100 flex gap-4">
            <AlertCircle className="h-6 w-6 text-primary-500 shrink-0" />
            <div className="text-sm">
                <p className="font-bold text-primary-900">Why the community fee?</p>
                <p className="text-primary-700/80 leading-relaxed mt-1">
                    The PKR 300 helps us maintain the platform, verify submissions, and generate your industrial certificate upon completion. It's a standard one-time fee per internship track.
                </p>
            </div>
        </div>
      </div>
    );
  }

  // CASE 3: Application Pending
  if (pendingApplication) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 px-4">
        <div className="h-16 w-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Clock className="h-8 w-8 animate-pulse" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Application Under Review</h1>
        <p className="text-gray-500 mb-8 max-w-sm mx-auto">
          We've received your application for <strong>{pendingApplication.internships.title}</strong>. 
          Our selection team is reviewing your profile. You'll be notified once you're selected!
        </p>
        <Link href="/internships" className="btn-secondary">Check Other Opportunities</Link>
      </div>
    );
  }

  // CASE 4: Nothing found (New user or rejected)
  return (
    <div className="max-w-2xl mx-auto text-center py-20 px-4">
      <Briefcase className="h-16 w-16 text-gray-200 mx-auto mb-6" />
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Kickstart Your Career</h1>
      <p className="text-gray-500 mb-10 max-w-sm mx-auto">
        You haven't applied for any internship yet. Choose a track that fits your skills and start learning today.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link href="/internships" className="btn-primary px-8">Find Internships</Link>
        <Link href="/profile" className="btn-secondary px-8">Complete Profile</Link>
      </div>
    </div>
  );
}
