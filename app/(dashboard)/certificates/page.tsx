import { Award, Download, Share2, ExternalLink, Lock } from 'lucide-react';
import CertificateDownload from '@/components/pdf/CertificateDownload';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { formatDate } from '@/lib/utils';

export const metadata = { title: 'My Certificates' };

export default async function CertificatesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profileRaw } = await supabase.from('profiles').select('full_name').eq('id', user.id).single();
  const profile = profileRaw as any;

  const { data: enrollmentsRaw } = await supabase
    .from('enrollments')
    .select('*, internships(title, category, duration_weeks)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const enrollments = (enrollmentsRaw || []) as any[];

  const completed = enrollments.filter(e => e.status === 'completed');
  const active = enrollments.filter(e => e.status === 'active');

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Certificates</h1>
        <p className="text-sm text-gray-500 mt-1">Your earned certifications from InternHub Pakistan</p>
      </div>

      {/* Active Internship Reminder */}
      {active.map((e) => {
        const internship = e.internships as unknown as { title: string; duration_weeks: number };
        return (
          <div key={e.id} className="rounded-xl border border-blue-200 bg-blue-50 p-5 flex items-start gap-3">
            <Award className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-blue-900">Complete to earn your certificate</p>
              <p className="text-xs text-blue-700 mt-0.5">
                You're enrolled in <strong>{internship.title}</strong>. Complete all projects to unlock your certificate.
              </p>
              <a href="/projects" className="text-xs font-semibold text-blue-700 underline mt-2 inline-block">
                Go to Projects →
              </a>
            </div>
          </div>
        );
      })}

      {/* Certificates */}
      {completed.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-5xl mb-4">🎓</div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">No certificates yet</h2>
          <p className="text-gray-500 text-sm mb-6">
            Complete an internship and pay the small certification fee to earn your certificate.
          </p>
          <a href="/internships" className="btn-primary inline-flex">Browse Internships</a>
        </div>
      ) : (
        <div className="space-y-6">
          {completed.map((enrollment) => {
            const internship = enrollment.internships as unknown as { title: string; category: string; duration_weeks: number };
            const isUnlocked = enrollment.certificate_unlocked && enrollment.certificate_id;
            const verifyUrl = `${appUrl}/verify/${enrollment.certificate_id}`;
            const linkedinUrl = enrollment.certificate_id
              ? `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(internship.title)}&organizationName=InternHub+Pakistan&certUrl=${encodeURIComponent(verifyUrl)}&certId=${enrollment.certificate_id}`
              : '#';

            return (
              <div key={enrollment.id} className="card overflow-hidden">
                {/* Gold top strip */}
                <div className="h-1.5 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600" />
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-yellow-100">
                        <Award className="h-6 w-6 text-yellow-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-base">{internship.title}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {internship.duration_weeks} Weeks · Completed {enrollment.completion_date ? formatDate(enrollment.completion_date) : '—'}
                        </p>
                        {enrollment.certificate_id && (
                          <p className="text-xs font-mono text-gray-400 mt-1">ID: {enrollment.certificate_id}</p>
                        )}
                      </div>
                    </div>

                    {isUnlocked ? (
                      <span className="badge bg-green-100 text-green-700 text-xs shrink-0">✓ Unlocked</span>
                    ) : (
                      <span className="badge bg-yellow-100 text-yellow-700 text-xs shrink-0 flex items-center gap-1">
                        <Lock className="h-3 w-3" /> Payment Required
                      </span>
                    )}
                  </div>

                  {isUnlocked ? (
                    <div className="mt-5 flex flex-wrap gap-3">
                      <CertificateDownload 
                        internName={profile?.full_name || 'Intern'}
                        internshipTitle={internship?.title || 'Internship'}
                        completionDate={enrollment.completion_date}
                        certificateId={enrollment.certificate_id}
                      />
                      <a
                        href={verifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary text-sm flex items-center gap-2"
                      >
                        <ExternalLink className="h-4 w-4" /> View Certificate
                      </a>
                      <a
                        href={linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg border border-[#0077B5]/30 bg-[#0077B5]/10 px-4 py-2 text-sm font-semibold text-[#0077B5] hover:bg-[#0077B5]/20 transition-colors"
                      >
                        <Share2 className="h-4 w-4" /> Add to LinkedIn
                      </a>
                    </div>
                  ) : (
                    <div className="mt-5">
                      <div className="rounded-xl border border-orange-200 bg-orange-50 p-4 mb-4">
                        <p className="text-sm font-semibold text-orange-800">Payment Required to Unlock</p>
                        <p className="text-xs text-orange-700 mt-1">
                          Pakistani users: PKR 300 via JazzCash / EasyPaisa / Bank Card
                          <br />International users: $3 via Visa / Mastercard
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <a
                          href={`/api/payment/initiate?enrollment_id=${enrollment.id}&currency=PKR`}
                          className="btn-primary text-sm flex-1 text-center"
                        >
                          💳 Pay PKR 300 (Pakistani)
                        </a>
                        <a
                          href={`/api/payment/initiate?enrollment_id=${enrollment.id}&currency=USD`}
                          className="btn-secondary text-sm flex-1 text-center"
                        >
                          💳 Pay $3 (International)
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
