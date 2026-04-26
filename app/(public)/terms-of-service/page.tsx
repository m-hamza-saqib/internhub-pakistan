import { FileText, CheckCircle2, AlertTriangle, Scale } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service — AWH TECH',
  description: 'Operating rules and legal agreements for using the AWH TECH platform.',
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-primary-900 py-24 text-center">
        <div className="container">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 text-primary-200 mb-6 backdrop-blur-md">
            <Scale size={32} />
          </div>
          <h1 className="font-instrument-serif text-5xl text-white mb-4">Terms of Service</h1>
          <p className="text-primary-100 max-w-2xl mx-auto">
            By accessing AWH TECH, you agree to comply with our professional standards and regulations.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container py-20">
        <div className="max-w-3xl mx-auto space-y-12">
          
          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-6 font-instrument-serif italic">Platform Usage</h2>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>
                AWH TECH provides an industrial internship simulation platform. Users are expected to maintain professional integrity throughout their participation. Unauthorized use of platform resources or duplication of content is strictly prohibited.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-6 font-instrument-serif italic">Enrollment & Fees</h2>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>
                Acceptance into a program is subject to profile verification. Upon selection, a one-time community enrollment fee is required to unlock projects and the official dashboard. This fee supports platform maintenance and certification processing.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-6 font-instrument-serif italic">Certification Integrity</h2>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>
                Certificates are only issued upon successful completion and approval of all assigned projects. AWH TECH reserves the right to revoke certification if plagiarism or unethical conduct is detected.
              </p>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-10">
            <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-100">
               <CheckCircle2 className="text-emerald-500 mb-4" size={28} />
               <h3 className="font-bold text-gray-900 mb-2">Code of Conduct</h3>
               <p className="text-xs text-emerald-800/80 leading-relaxed font-medium">
                 Students must respect peer contributions and adhere to deadline protocols.
               </p>
            </div>
            <div className="p-6 rounded-3xl bg-amber-50 border border-amber-100">
               <AlertTriangle className="text-amber-500 mb-4" size={28} />
               <h3 className="font-bold text-gray-900 mb-2">Legal Liability</h3>
               <p className="text-xs text-amber-800/80 leading-relaxed font-medium">
                 AWH TECH is an educational platform and does not guarantee employment post-internship.
               </p>
            </div>
          </div>

          <div className="text-center pt-10">
            <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Effective Date: April 25, 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
}
