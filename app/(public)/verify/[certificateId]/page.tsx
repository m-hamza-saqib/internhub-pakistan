import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { formatDate } from '@/lib/utils';
import { CheckCircle, Calendar, Clock, Award, QrCode, Globe, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Logo from '@/components/layout/Logo';

interface Props {
  params: Promise<{ certificateId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { certificateId } = await params;
  return {
    title: `Certificate Verification — ${certificateId}`,
    description: 'Verify the authenticity of an AHWTECHNOLOGIES certificate.',
    robots: { index: true, follow: true },
  };
}

export default async function CertificateVerificationPage({ params }: Props) {
  const { certificateId } = await params;
  const supabase = await createClient();

  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('*, profiles(full_name, university, city), internships(title, category, duration_weeks, difficulty)')
    .eq('certificate_id', certificateId)
    .eq('is_completed', true)
    .maybeSingle();

  if (!enrollment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="card p-10 text-center max-w-md w-full">
          <div className="text-5xl mb-4">❌</div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Certificate Not Found</h1>
          <p className="text-gray-500 text-sm">
            The certificate ID <strong>{certificateId}</strong> is not valid or does not exist in our system.
          </p>
          <Link href="/" className="btn-primary mt-6 inline-flex">Go to AHWTECHNOLOGIES</Link>
        </div>
      </div>
    );
  }

  // Casting to properly handle the joined data types
  const data = enrollment as any;
  const profile = data.profiles as { full_name: string; university: string; city: string };
  const internship = data.internships as { title: string; category: string; duration_weeks: number; difficulty: string };


  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-primary-500/5 blur-[120px]" />

      <div className="w-full max-w-3xl space-y-10 relative z-10">
        <div className="flex flex-col items-center">
           <Link href="/" className="mb-10 transition-transform hover:scale-105">
             <Logo className="scale-125" />
           </Link>

           {/* Verification Badge */}
           <div className="relative group">
             <div className="absolute -inset-1 rounded-full bg-emerald-500/20 blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse" />
             <div className="relative flex items-center justify-center gap-3 rounded-full border border-emerald-200 bg-white/80 backdrop-blur-md px-8 py-3.5 text-emerald-700 text-sm font-black uppercase tracking-widest shadow-xl">
               <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
               <CheckCircle className="h-5 w-5" />
               Certificate Verified ✓
             </div>
           </div>
        </div>

        {/* Certificate Preview Card */}
        <div className="card overflow-hidden border-none shadow-premium relative bg-white">
          {/* Official Pattern Overlay */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)', backgroundSize: '10px 10px' }} />
          
          {/* Gold Decorative Border */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-yellow-700 via-yellow-400 to-yellow-700" />
          <div className="absolute bottom-0 inset-x-0 h-1.5 bg-gradient-to-r from-yellow-700 via-yellow-400 to-yellow-700" />

          <div className="p-10 md:p-14 text-center relative z-10">
            <div className="flex flex-col items-center gap-4 mb-12">
               <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-900 shadow-xl">
                 <span className="text-sm font-black text-white italic">IH</span>
               </div>
               <div className="text-center">
                 <div className="font-black text-gray-900 text-xl tracking-tight uppercase">AHWTECHNOLOGIES</div>
                 <div className="text-[10px] font-black text-primary-500 uppercase tracking-[0.3em]">Official Verification Portal</div>
               </div>
            </div>

            <div className="border-y border-gray-100 py-12 mb-10">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-4">Certificate of Completion</p>
              <p className="text-sm font-medium text-gray-500 mb-6 italic">This is to certify that the candidate</p>
              
              <h1 className="font-instrument-serif text-5xl md:text-6xl text-gray-900 mb-6 tracking-tight">
                {profile.full_name}
              </h1>
              
              <p className="text-gray-500 text-sm mb-4 font-medium italic">has demonstrated proficiency by successfully completing</p>
              
              <h2 className="text-2xl font-black text-gray-900 mb-8 uppercase tracking-tight">{internship.title}</h2>
              
              <div className="flex flex-wrap items-center justify-center gap-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <span className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg">
                  <Clock className="h-3 w-3 text-primary-500" />
                  {internship.duration_weeks} Weeks
                </span>
                <span className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg">
                  <Calendar className="h-3 w-3 text-primary-500" />
                  Completed {data.completion_date ? formatDate(data.completion_date) : '—'}
                </span>
                <span className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg">
                  <Award className="h-3 w-3 text-primary-500" />
                  {internship.difficulty} Track
                </span>
              </div>
            </div>

            {/* Verification Metadata Grid */}
            <div className="grid grid-cols-1 gap-4 text-left sm:grid-cols-2 mb-10">
              {[
                { label: 'Blockchain ID',   value: data.certificate_id, icon: CheckCircle },
                { label: 'Domain Core',     value: internship.category.replace(/-/g, ' '), icon: Award },
                { label: 'Organization',    value: profile.university || 'Independent Track', icon: Globe },
                { label: 'Auth Status',     value: 'Verified by AHWTECH', icon: Sparkles },
              ].map((row) => (
                <div key={row.label} className="rounded-2xl border border-gray-50 bg-gray-50/30 p-5 flex items-start gap-4 transition-colors hover:border-primary-100">
                  <div className="h-8 w-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-primary-500 shrink-0">
                    <row.icon size={16} />
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{row.label}</div>
                    <div className="text-xs font-bold text-gray-900 truncate">{row.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-3 py-6 bg-primary-900 rounded-2xl text-white shadow-lg shadow-primary-900/10">
              <QrCode className="h-5 w-5 text-primary-400" />
              <div className="text-[10px] font-black uppercase tracking-[0.2em]">
                Authenticity Key: <span className="text-primary-300">{data.certificate_id}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center space-y-4">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-relaxed max-w-md mx-auto">
            This digital record is protected by AHWTECHNOLOGIES verification protocol. 
            Unauthorized duplication or tampering is strictly prohibited.
          </p>
          <div className="h-8 w-px bg-gray-200 mx-auto" />
          <Link href="/" className="inline-flex text-[10px] font-black text-primary-500 uppercase tracking-[0.3em] hover:text-primary-600 transition-colors">
            Back to Platform Home
          </Link>
        </div>
      </div>
    </div>
  );
}
