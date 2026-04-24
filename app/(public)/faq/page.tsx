import { FAQ_ITEMS } from '@/lib/constants';
import type { Metadata } from 'next';
import { Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'FAQ — Frequently Asked Questions',
  description: 'Got questions about AHWTECHNOLOGIES? Find answers about the application process, payment, certificates, and more.',
};

export default function FAQPage() {
  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Header */}
      <section className="gradient-hero py-20 relative overflow-hidden text-center">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        
        <div className="container relative z-10 max-w-4xl">
          <div className="flex items-center justify-center gap-2 mb-6 text-primary-300 font-black text-[10px] uppercase tracking-[0.3em]">
            <Sparkles className="h-3 w-3" /> Help & Support Center
          </div>
          <h1 className="font-instrument-serif text-5xl md:text-7xl text-white mb-6 tracking-tight">
            Frequently <span className="italic opacity-80">Asked</span>
          </h1>
          <p className="text-blue-100/80 text-lg font-medium leading-relaxed max-w-2xl mx-auto">
            Everything you need to know about AHWTECHNOLOGIES. 
            Can't find your answer? <a href="/contact" className="text-white underline underline-offset-4 decoration-primary-400 hover:text-primary-300 transition-colors">Contact us</a>.
          </p>
        </div>
      </section>

      <div className="container max-w-4xl mx-auto -mt-10 relative z-20 pb-20">
        <div className="card border-none shadow-premium divide-y divide-gray-50 overflow-hidden bg-white/95 backdrop-blur-md">
          {FAQ_ITEMS.map((item, i) => (
            <FAQRow key={i} q={item.q} a={item.a} />
          ))}
        </div>

        <div className="mt-16 rounded-3xl bg-gradient-to-br from-primary-900 to-indigo-900 p-12 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <h2 className="text-2xl font-black mb-3 tracking-tight">Still have questions?</h2>
            <p className="text-blue-100/70 text-sm mb-10 font-medium max-w-md mx-auto">Our dedicated support team is available Monday–Friday, 9am–6pm PKT to assist you with any inquiries.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <a href="mailto:hello@ahwtechnologies.com" className="inline-flex items-center gap-3 rounded-2xl border border-white/20 bg-white/5 px-8 py-4 text-sm font-bold hover:bg-white/10 transition-all active:scale-95 backdrop-blur-sm">
                📧 Email: hello@ahwtechnologies.com
              </a>
              <a href="https://wa.me/923000000000" className="inline-flex items-center gap-3 rounded-2xl bg-white px-8 py-4 text-sm font-bold text-primary-900 hover:bg-blue-50 transition-all active:scale-95 shadow-xl">
                💬 Message on WhatsApp
              </a>
            </div>
          </div>
          <div className="absolute top-0 right-0 h-40 w-40 -translate-y-10 translate-x-10 rounded-full bg-white/5 blur-3xl" />
        </div>
      </div>
    </div>
  );
}

function FAQRow({ q, a }: { q: string; a: string }) {
  return (
    <details className="group px-6">
      <summary className="flex cursor-pointer items-center justify-between py-5 text-sm font-semibold text-gray-900 list-none select-none hover:text-primary-500 transition-colors">
        {q}
        <span className="ml-4 shrink-0 text-gray-400 transition-transform group-open:rotate-45 text-lg font-light">+</span>
      </summary>
      <div className="pb-5 text-sm text-gray-600 leading-relaxed">{a}</div>
    </details>
  );
}
