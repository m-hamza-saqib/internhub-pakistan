import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { Award, Briefcase, Mail, MapPin, Printer } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import Image from 'next/image';

export async function generateMetadata(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const supabase = await createClient();
  const { data: app } = await supabase
    .from('applications')
    .select('*, internships(title), profiles(full_name)')
    .eq('id', id)
    .single() as any;

  if (!app) return { title: 'Offer Letter — AWH TECH' };

  return {
    title: `Offer Letter - ${app.profiles?.full_name}`,
    description: `Official Offer Letter for ${app.internships?.title} internship at AWH TECHNOLOGIES.`,
    openGraph: {
      title: `Selected as ${app.internships?.title} Intern`,
      description: `Thrilled to join AWH TECHNOLOGIES as a ${app.internships?.title} intern!`,
      images: ['/logo.png'], // Add a fallback logo if needed
    },
  };
}

export default async function OfferLetterPage(
  props: { params: Promise<{ id: string }> }
) {
  const { id } = await props.params;
  const supabase = await createClient();

  const { data: applicationRaw } = await supabase
    .from('applications')
    .select('*, internships(*)')
    .eq('id', id)
    .single();

  if (!applicationRaw) notFound();

  const application = applicationRaw as any;

  // Fetch profile separately
  const { data: profile } = (await supabase
    .from('profiles')
    .select('*')
    .eq('id', application.user_id)
    .single()) as any;

  application.profiles = profile;

  if (!application || application.status !== 'accepted') {
    notFound();
  }

  // Use the profile fetched above
  const internship = application.internships as any;
  const issueDate = application.reviewed_at || application.applied_at;

  return (
    <div className="min-h-screen bg-gray-50 py-10 print:py-0 print:bg-white flex justify-center">
      
      {/* Print Controls (Hidden in print) */}
      <div className="fixed top-6 right-6 flex flex-col gap-3 print:hidden z-50">
        <button onClick={() => {}} className="btn-primary rounded-full px-6 shadow-xl flex items-center gap-2 group" style={{ cursor: 'pointer' }}
           // Inline script for clicking print
           ref={(btn) => { if (btn) btn.onclick = () => window.print() }}>
          <Printer className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
          Print / Save PDF
        </button>
      </div>

      {/* A4 Paper Container */}
      <div className="w-full max-w-[210mm] min-h-[297mm] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] print:shadow-none print:w-full relative overflow-hidden flex flex-col">
        
        {/* Header Ribbon graphic */}
        <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600" />
        
        {/* Header */}
        <div className="p-12 pb-8 flex justify-between items-start border-b border-gray-100">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-900 shadow-lg shadow-gray-200 mb-4">
              <span className="text-[14px] font-black italic text-white tracking-tighter">AWH</span>
            </div>
            <h1 className="font-instrument-serif text-3xl text-gray-900">AWH <span className="italic text-primary-600">TECHNOLOGIES</span></h1>
            <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 mt-1">Accelerators of the Future Workspace</p>
          </div>
          <div className="text-right space-y-1 mt-2">
            <p className="text-xs text-gray-500 flex items-center justify-end gap-1"><MapPin className="h-3 w-3" /> Lahore, Pakistan</p>
            <p className="text-xs text-gray-500 flex items-center justify-end gap-1"><Mail className="h-3 w-3" /> careers@ahwtechnologies.com</p>
            <p className="text-[10px] font-mono text-gray-400 mt-4 uppercase tracking-widest">REF: AWH-APP-{application.id.split('-')[0]}</p>
          </div>
        </div>

        {/* Body content */}
        <div className="p-12 flex-1 space-y-6">
          <div className="flex justify-between items-end mb-10">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Issue Date</p>
              <p className="text-sm font-semibold text-gray-900">{formatDate(issueDate)}</p>
            </div>
            <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100 text-xs font-black uppercase tracking-widest flex items-center gap-2">
              <Award className="h-4 w-4" /> Official Offer Letter
            </div>
          </div>

          <p className="text-base text-gray-900">
            Dear <strong className="font-bold">{profile?.full_name || 'Candidate'}</strong>,
          </p>

          <p className="text-base text-gray-600 leading-relaxed text-justify">
            We are incredibly excited to extend an offer for you to join AWH Technologies as a 
            <strong className="text-primary-700"> {internship.title} </strong> Intern. Following your superb application 
            and assessment, our technical team was thoroughly impressed by your background and potential.
          </p>

          <p className="text-base text-gray-600 leading-relaxed text-justify">
            This internship program spans exactly <strong className="text-gray-900">{internship.duration_weeks} weeks</strong>, 
            designed to heavily immerse you in our professional technology operations. 
            You will be working remotely, learning alongside industry professionals precisely aligned with 
            the <strong className="text-gray-900">{internship.category}</strong> framework.
          </p>

          <div className="my-8 rounded-xl bg-gray-50 border border-gray-100 p-6 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-widest text-primary-600 mb-4 border-b border-primary-100 pb-2">Internship Outline</h3>
            
            <div className="flex items-center justify-between border-b border-gray-200/50 pb-2">
              <span className="text-sm font-medium text-gray-500">Program Role</span>
              <span className="text-sm font-bold text-gray-900">{internship.title}</span>
            </div>
            <div className="flex items-center justify-between border-b border-gray-200/50 pb-2">
              <span className="text-sm font-medium text-gray-500">Expected Engagement</span>
              <span className="text-sm font-bold text-gray-900">{application.hours_per_week} Hours / Week</span>
            </div>
            <div className="flex items-center justify-between border-b border-gray-200/50 pb-2">
              <span className="text-sm font-medium text-gray-500">Duration</span>
              <span className="text-sm font-bold text-gray-900">{internship.duration_weeks} Weeks</span>
            </div>
            <div className="flex items-center justify-between pb-2">
              <span className="text-sm font-medium text-gray-500">Format</span>
              <span className="text-sm font-bold text-green-600">100% Remote / Flexible</span>
            </div>
          </div>

          <p className="text-base text-gray-600 leading-relaxed text-justify">
            To formally accept this position and unlock your internship dashboard, you must finalize your 
            enrollment steps via your AWH Technologies internal applicant portal. Upon activation, you will
            receive your curriculum schedules and immediate access to the internal project workspace.
          </p>

          <p className="text-base text-gray-600 leading-relaxed text-justify mb-8">
            We are confident that you will find your time at AWH Technologies incredibly rewarding. Welcome to the team!
          </p>

          <div className="mt-16 pt-8 border-t border-gray-100">
            <div className="w-48">
              <div className="font-instrument-serif text-3xl text-primary-800 -mb-2 italic">A. Hakeem</div>
              <div className="h-px bg-gray-300 my-4" />
              <p className="text-sm font-bold text-gray-900">Muhammad Hamza</p>
              <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mt-0.5">Managing Director, CEO</p>
              <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">AWH Technologies</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto bg-gray-50 p-6 flex items-center justify-between border-t border-gray-100">
          <p className="text-[9px] uppercase tracking-[0.2em] font-medium text-gray-400 font-mono">
            {application.id} // VERIFIED AUTHENTIC
          </p>
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary-100 text-primary-600">
            <Briefcase className="h-3 w-3" />
          </div>
        </div>
      </div>
    </div>
  );
}
