import { ShieldCheck, Lock, Eye, FileText } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy — AWH TECH',
  description: 'How we handle and protect your data at AWH TECH Technologies.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gray-900 py-24 text-center">
        <div className="container">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-primary-500/10 text-primary-400 mb-6">
            <ShieldCheck size={32} />
          </div>
          <h1 className="font-instrument-serif text-5xl text-white mb-4">Privacy Policy</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Your privacy is our priority. This policy outlines how AWH TECH collects, uses, and protects your information.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container py-20">
        <div className="max-w-3xl mx-auto space-y-12">
          
          <section>
            <h2 className="flex items-center gap-3 text-2xl font-black text-gray-900 mb-6">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50 text-primary-600 text-sm">1</span>
              Information Collection
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>
                We collect information you provide directly to us when you create an account, apply for an internship, or communicate with us. This may include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Name, email address, and contact details</li>
                <li>University information and academic records</li>
                <li>CNIC or identification details for certification</li>
                <li>Profile photographs and portfolio links</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="flex items-center gap-3 text-2xl font-black text-gray-900 mb-6">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50 text-primary-600 text-sm">2</span>
              How We Use Data
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>We use the collected information for various purposes, including:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>To provide and maintain our internship platform</li>
                <li>To verify applicant eligibility and process applications</li>
                <li>To generate official offer letters and industrial certificates</li>
                <li>To communicate platform updates and announcements</li>
                <li>To optimize user experience through analytics</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="flex items-center gap-3 text-2xl font-black text-gray-900 mb-6">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50 text-primary-600 text-sm">3</span>
              Data Protection
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>
                AWH TECH implements robust security measures to protect your data from unauthorized access, alteration, or disclosure. We use industry-standard encryption protocols (SSL/TLS) and secure database architectures powered by Supabase.
              </p>
            </div>
          </section>

          <div className="rounded-3xl bg-gray-50 p-8 border border-gray-100 flex items-start gap-6">
            <div className="h-12 w-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary-500 shrink-0">
              <Lock size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Third-Party Disclosure</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties except to provide the service (e.g., certification verification links).
              </p>
            </div>
          </div>

          <div className="text-center pt-10">
            <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Last Updated: April 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
}
