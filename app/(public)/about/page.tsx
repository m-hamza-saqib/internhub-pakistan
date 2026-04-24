import type { Metadata } from 'next';
import { TRUSTED_UNIVERSITIES, INTERNSHIP_CATEGORIES } from '@/lib/constants';
import { CheckCircle, Globe, Shield, Award, Sparkles, Users, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'About Us — InternHub Pakistan',
  description: 'Learn about InternHub Pakistan — our mission, vision, and the team behind Pakistan\'s premier remote internship platform.',
};

export default function AboutPage() {
  const VALUES = [
    { icon: Globe,        title: 'Accessibility',  desc: 'Every Pakistani student, regardless of city or background, deserves access to quality internship experiences.' },
    { icon: Shield,       title: 'Integrity',       desc: 'We verify every certificate. Every ID is unique and publicly verifiable. No fake certificates, ever.' },
    { icon: Award,        title: 'Quality',         desc: 'Our projects are designed by industry professionals. Admin feedback is constructive and detailed.' },
    { icon: CheckCircle,  title: 'Affordability',   desc: 'The internship is free. Only a small PKR 300 fee for your certificate — less than a restaurant burger.' },
  ];

  return (
    <div className="pt-16 min-h-screen">
      {/* Hero */}
      <section className="gradient-hero py-24 relative overflow-hidden text-center">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        
        <div className="container relative z-10 max-w-4xl">
          <div className="flex items-center justify-center gap-2 mb-6 text-primary-300 font-black text-[10px] uppercase tracking-[0.3em]">
            <Globe className="h-3 w-3" /> Our Mission & Vision
          </div>
          <h1 className="font-instrument-serif text-5xl md:text-7xl text-white mb-6 uppercase tracking-tight">
            The Hub of <span className="italic opacity-80">Empowerment</span>
          </h1>
          <p className="text-blue-100/80 text-lg md:text-xl font-medium leading-relaxed max-w-3xl mx-auto">
            We believe every Pakistani student deserves verifiable professional experience, not just theory. 
            We bridge the gap between education and employment — 100% remotely.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="section bg-white py-24">
        <div className="container max-w-6xl">
          <div className="grid grid-cols-1 gap-16 md:grid-cols-2 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4 text-primary-500 font-bold text-[10px] uppercase tracking-widest">
                <Sparkles className="h-3 w-3" /> Core Foundation
              </div>
              <h2 className="section-title mb-6">
                Pakistan ke talent ko duniya mein <span className="text-secondary-500">pehchaan</span> dilana
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6 font-medium">
                Millions of Pakistani graduates face the same paradox: employers want experience, but how do you get experience without a job? 
                InternHub Pakistan breaks this cycle by providing structured, verified, remote internship programs.
              </p>
              <p className="text-gray-600 leading-relaxed font-normal">
                Our certificates are publicly verifiable, LinkedIn-shareable, and respected by employers across Pakistan and internationally.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[
                { value: '500+', label: 'Interns Served', icon: Users, color: 'text-blue-500 bg-blue-50' },
                { value: '10+',  label: 'Categories', icon: Briefcase, color: 'text-emerald-500 bg-emerald-50' },
                { value: '95%',  label: 'Completion', icon: Award, color: 'text-amber-500 bg-amber-50' },
                { value: '35+',  label: 'Cities', icon: Globe, color: 'text-primary-500 bg-primary-50' },
              ].map((stat) => (
                <div key={stat.label} className="card p-8 border-none shadow-premium hover:shadow-2xl transition-all group">
                   <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110", stat.color)}>
                      <stat.icon className="h-5 w-5" />
                   </div>
                   <div className="text-3xl font-black text-gray-900 tracking-tight mb-1">{stat.value}</div>
                   <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section bg-gray-50/50 py-24 border-y border-gray-100">
        <div className="container">
          <div className="text-center mb-16">
            <div className="text-[10px] font-black text-primary-500 uppercase tracking-[0.3em] mb-4">Our Integrity</div>
            <h2 className="section-title">Values That Drive Us</h2>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="card p-8 border-none shadow-premium hover:shadow-2xl transition-all flex flex-col items-center text-center bg-white group h-full">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 text-primary-500 mb-6 transition-all group-hover:bg-primary-500 group-hover:text-white group-hover:scale-110">
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="font-black text-gray-900 mb-3 tracking-tight">{v.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed font-medium">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trusted by */}
      <section className="section bg-white">
        <div className="container text-center">
          <h2 className="section-title mb-3">Trusted by Students From</h2>
          <p className="text-gray-500 mb-10">Pakistan's top universities trust InternHub for their students' career development</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {TRUSTED_UNIVERSITIES.map((uni) => (
              <span key={uni} className="rounded-full border border-gray-200 bg-white px-5 py-2 text-sm font-semibold text-gray-600 shadow-sm">
                {uni}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-hero section text-center">
        <div className="container max-w-xl">
          <h2 className="text-3xl font-bold text-white mb-4">Join InternHub Today</h2>
          <p className="text-blue-100 mb-8">Free to apply. PKR 300 for your certificate. Start your career journey now.</p>
          <a href="/register" className="btn-primary px-8 py-3.5 text-base inline-flex">
            Create Free Account →
          </a>
        </div>
      </section>
    </div>
  );
}
