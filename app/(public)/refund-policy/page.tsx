import { Wallet, ShieldAlert, History, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Refund Policy — AWH TECH',
  description: 'Our policy regarding payments and refunds at AWH TECH.',
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Premium Hero Section */}
      <div className="relative bg-gray-950 py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #4f46e5 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="container relative z-10 text-center">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-rose-500/10 text-rose-500 mb-8 border border-rose-500/20 animate-pulse">
            <Wallet size={40} />
          </div>
          <h1 className="font-instrument-serif text-6xl text-white mb-6">Refund Policy</h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Professional clarity on our community enrollment and platform commitment.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="container py-24">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
            
            <div className="md:col-span-7 space-y-10">
              <section>
                <h2 className="text-3xl font-black text-gray-900 mb-6 tracking-tight">Hamari Refund Policy</h2>
                <div className="prose prose-gray prose-lg text-gray-600 leading-relaxed font-medium">
                  <p className="italic">
                    "AWH TECH is a premium industrial simulation platform. Hamara maqsad students ko behtareen digital environment farham karna hai."
                  </p>
                  <p className="mt-6">
                    Aap se request ki gayi <strong className="text-primary-600">enrollment fee (PKR 300)</strong> aik non-refundable community development fee hai. 
                    Yeh fee platform ki maintenance, server costs, aur aap ki professional documentation (Offer Letters & Certificates) ke liye istemal hoti hai.
                  </p>
                  <p className="mt-4 font-black text-gray-900 uppercase tracking-widest text-sm bg-gray-100 inline-block px-4 py-2 rounded-lg">
                    Is waqt hum koi refund offer nahi kar rahay.
                  </p>
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex items-start gap-4 p-6 rounded-3xl bg-gray-50 border border-gray-100">
                  <History className="h-6 w-6 text-primary-500 shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-gray-900">Aik Martaba Payment Honay Par</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Jab aap payment proof submit kar detay hain aur admin usay approve kar leta hai, aap ka dashboard hamesha ke liye unlock ho jata hai. Is stage par payment wapis hona mumkin nahi hai.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-6 rounded-3xl bg-gray-50 border border-gray-100">
                  <ShieldAlert className="h-6 w-6 text-rose-500 shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-gray-900">Technical Issues</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Agar aap ko payment ke baad dashboard access main masla aa raha hai, toh hamari support team se rabta karein. Hum aap ka access manual verify kar ke foran bahal (unlock) kar dein gay.
                    </p>
                  </div>
                </div>
              </section>
            </div>

            <div className="md:col-span-5">
              <div className="sticky top-32 card p-8 bg-primary-900 text-white shadow-2xl shadow-primary-900/20 overflow-hidden">
                <div className="absolute top-0 right-0 h-32 w-32 bg-white/5 rounded-full -translate-y-16 translate-x-16" />
                <h3 className="text-xl font-bold mb-4 relative z-10 font-instrument-serif italic">Common Questions</h3>
                
                <div className="space-y-6 relative z-10">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary-300 mb-2">Kya fee monthly hai?</p>
                    <p className="text-sm font-medium leading-relaxed">Nahi, yeh sirf aik martaba (One-time) li jati hai aap ke selected track ke liye.</p>
                  </div>
                  
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary-300 mb-2">Registration vs Enrollment?</p>
                    <p className="text-sm font-medium leading-relaxed">Registration free hai. Fee sirf tab dena hoti hai jab aap select ho jayein.</p>
                  </div>

                  <div className="pt-6 border-t border-white/10">
                    <Link href="/faq" className="flex items-center gap-2 text-sm font-bold hover:gap-3 transition-all text-primary-200">
                      Mazeed maloomat ke liye humara FAQ dekhein <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
