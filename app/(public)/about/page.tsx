import type { Metadata } from 'next';
import { TRUSTED_UNIVERSITIES } from '@/lib/constants';
import { CheckCircle, Globe, Shield, Award, Sparkles, Users, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us — AWH TECH',
  description: 'Learn about AWH TECH — our mission to empower Pakistani students with free internships and lifetime dashboard access.',
};

export default function AboutPage() {
  const VALUES = [
    { icon: Globe,        title: 'Accessibility',  desc: 'Every Pakistani student, regardless of city or background, deserves access to quality internship experiences.' },
    { icon: Shield,       title: 'Integrity',       desc: 'We verify every certificate. Every ID is unique and publicly verifiable. No fake certificates, ever.' },
    { icon: Award,        title: 'Quality',         desc: 'Our projects are designed by industry professionals. We ensure you learn real-world skills.' },
    { icon: CheckCircle,  title: 'Transparency',   desc: 'Internships are 100% free. A one-time PKR 300 community fee covers lifetime access and certificates.' },
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
          <h1 className="font-instrument-serif text-5xl md:text-7xl text-white mb-6 uppercase tracking-tight leading-tight">
            The Future of <span className="italic opacity-80">Skill Building</span>
          </h1>
          <p className="text-blue-100/80 text-lg md:text-xl font-medium leading-relaxed max-w-3xl mx-auto">
            AWH TECH is built on a simple promise: <strong className="text-white">Professional growth should be accessible to everyone.</strong> 
            We provide structured, free remote internships for Pakistani students with a focus on real-world impact.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="section bg-white py-24">
        <div className="container max-w-6xl">
          <div className="grid grid-cols-1 gap-16 md:grid-cols-2 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4 text-primary-500 font-bold text-[10px] uppercase tracking-widest">
                <Sparkles className="h-3 w-3" /> Empowering Pakistan
              </div>
              <h2 className="section-title mb-6 text-3xl md:text-4xl">
                Breaking the "Experience" Paradox for <span className="text-secondary-500">Pakistani Students</span>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6 font-medium">
                Employers want experience, but students can&apos;t get experience without a job. 
                AWH TECH breaks this cycle by providing structured, verified, remote internship programs that allow you to build a professional portfolio while you study.
              </p>
              <div className="rounded-2xl border-2 border-emerald-500/10 bg-emerald-500/5 p-6 mb-6">
                <p className="text-sm font-bold text-emerald-800 mb-2 flex items-center gap-2">
                   <Shield className="h-4 w-4" /> Lifetime Value
                </p>
                <p className="text-sm text-emerald-700 leading-relaxed">
                  Unlike platforms that charge per certificate, we believe in a <strong className="text-emerald-900">one-time community fee</strong> model. 
                  Pay PKR 300 once, and gain lifetime access to our dashboard, all upcoming projects, and free certification for every internship you complete.
                </p>
              </div>
              <p className="text-gray-600 leading-relaxed font-normal">
                Our certificates are publicly verifiable, LinkedIn-shareable, and respected by employers across Pakistan and internationally.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[
                { value: '500+', label: 'Interns Served', icon: Users, color: 'text-blue-500 bg-blue-50' },
                { value: '10+',  label: 'Domains', icon: Briefcase, color: 'text-emerald-500 bg-emerald-50' },
                { value: '95%',  label: 'Success Rate', icon: Award, color: 'text-amber-500 bg-amber-50' },
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
            <div className="text-[10px] font-black text-primary-500 uppercase tracking-[0.3em] mb-4">Our Core Values</div>
            <h2 className="section-title">What AHW Stands For</h2>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="card p-8 border-none shadow-premium hover:shadow-2xl transition-all flex flex-col items-center text-center bg-white group h-full">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 text-primary-500 mb-6 transition-all group-hover:bg-primary-500 group-hover:text-white group-hover:scale-110">
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="font-black text-gray-900 mb-3 tracking-tight uppercase leading-none">{v.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed font-medium">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-hero section text-center">
        <div className="container max-w-xl">
          <h2 className="text-4xl font-bold text-white mb-4">Start Your Career Journey</h2>
          <p className="text-blue-100 mb-8 max-w-lg mx-auto">
            One-time PKR 300 fee. Lifetime access. 100% remote internships. 
            Join AWH TECH today and build your future.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="btn-primary px-10 py-4 text-base">
              Create Free Account →
            </Link>
            <Link href="/internships" className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 backdrop-blur-md px-10 py-4 text-base font-bold text-white transition-all hover:bg-white/10 hover:border-white/40 active:scale-95">
               Browse Slots
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
