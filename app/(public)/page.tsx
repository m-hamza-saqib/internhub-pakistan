'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight, CheckCircle, Star, ChevronDown, Award,
  Users, TrendingUp, Globe, FileText, Briefcase, Shield, Sparkles,
} from 'lucide-react';
import { INTERNSHIP_CATEGORIES, FAQ_ITEMS, TRUSTED_UNIVERSITIES, TESTIMONIALS, STEPS } from '@/lib/constants';

import { cn } from '@/lib/utils';

/* ─── Counter Animation Hook ─── */
function useCounter(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return { count, ref };
}

/* ─── Stat Counter ─── */
function StatCounter({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { count, ref } = useCounter(value);
  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl font-bold text-white md:text-5xl">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="mt-1 text-sm text-blue-200">{label}</div>
    </div>
  );
}

/* ─── FAQ Item ─── */
function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="border-b border-gray-200 last:border-0"
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-5 text-left text-sm font-semibold text-gray-900 hover:text-primary-500 transition-colors"
      >
        {q}
        <ChevronDown className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="pb-5 text-sm text-gray-600 leading-relaxed"
        >
          {a}
        </motion.div>
      )}
    </motion.div>
  );
}

import { createClient } from '@/lib/supabase/client';
import InternshipCard from '@/components/cards/InternshipCard';

/* ─── Main Page ─── */
export default function HomePage() {
  const [featuredInternships, setFeaturedInternships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchLatest = async () => {
      const { data } = await supabase
        .from('internships')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (data) setFeaturedInternships(data);
      setLoading(false);
    };
    fetchLatest();
  }, []);

  return (

    <>
      {/* ── HERO ── */}
      <section className="gradient-hero relative min-h-screen flex items-center overflow-hidden">
        {/* Background dots */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

        <div className="container relative z-10 pt-24 pb-20">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1.5 text-xs font-medium text-blue-200 mb-6">
                🇵🇰 Pakistan&apos;s #1 Free Remote Internship Platform
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
              className="font-instrument-serif text-5xl font-bold text-white leading-[1.1] md:text-6xl lg:text-8xl tracking-tight"
            >
              Launch Your Career{' '}
              <span className="italic text-primary-300 opacity-90">From Home</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8 text-lg md:text-xl text-blue-100/80 leading-relaxed max-w-2xl mx-auto font-medium"
            >
              100% free internships. Real projects. Verified certificates. Pay a one-time PKR 300 community fee — get <strong className="text-white">lifetime dashboard access</strong> and your certificate for free after completion.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5"
            >
              <Link href="/internships" className="btn-primary px-10 py-4 text-base shadow-[0_20px_50px_rgba(28,59,120,0.3)] hover:shadow-[0_20px_50px_rgba(28,59,120,0.5)]">
                Browse Internships <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/about" className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 backdrop-blur-md px-10 py-4 text-base font-bold text-white transition-all hover:bg-white/10 hover:border-white/40 active:scale-95">
                Learn More
              </Link>
            </motion.div>

            {/* Hero Stats - Glassmorphic */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6, type: 'spring' }}
              className="mt-20 grid grid-cols-3 gap-8 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-2xl"
            >
              <StatCounter value={500}  suffix="+" label="Interns Enrolled" />
              <StatCounter value={10}   suffix="+" label="Internship Tracks" />
              <StatCounter value={95}   suffix="%" label="Completion Rate" />
            </motion.div>

            {/* Lifetime Access Value Prop Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
              className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm"
            >
              <span className="flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 text-emerald-300 font-semibold">
                <CheckCircle className="h-4 w-4" /> Internship is 100% FREE
              </span>
              <span className="flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-500/20 px-4 py-2 text-amber-300 font-semibold">
                💳 PKR 300 one-time community fee
              </span>
              <span className="flex items-center gap-2 rounded-full bg-blue-500/10 border border-blue-500/20 px-4 py-2 text-blue-300 font-semibold">
                🔓 Lifetime dashboard access
              </span>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40"
        >
          <ChevronDown className="h-6 w-6" />
        </motion.div>
      </section>

      {/* ── TRUST BAR ── */}
      <section className="border-y border-gray-200 bg-gray-50 py-6 overflow-hidden">
        <div className="flex items-center gap-3 mb-3 justify-center">
          <div className="h-px flex-1 bg-gray-200 max-w-xs" />
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Trusted by students from</span>
          <div className="h-px flex-1 bg-gray-200 max-w-xs" />
        </div>
        <div className="relative overflow-hidden">
          <div className="animate-marquee flex gap-12 whitespace-nowrap">
            {[...TRUSTED_UNIVERSITIES, ...TRUSTED_UNIVERSITIES].map((uni, i) => (
              <span key={i} className="text-sm font-semibold text-gray-500 hover:text-primary-500 transition-colors cursor-default">
                {uni}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section bg-white py-24 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-3/4 bg-gradient-to-r from-transparent via-gray-100 to-transparent" />
        
        <div className="container">
          <div className="text-center mb-20">
            <div className="flex items-center justify-center gap-2 mb-4 text-primary-500 font-black text-[10px] uppercase tracking-[0.3em]">
              <Sparkles className="h-3 w-3" /> Seamless Lifecycle
            </div>
            <h2 className="font-instrument-serif text-4xl md:text-6xl text-gray-900 tracking-tight mb-4">
              Pathway to <span className="italic opacity-80 text-primary-600">Growth</span>
            </h2>
            <p className="text-gray-500 font-medium max-w-xl mx-auto">
              Master industry-standard tools and build a professional portfolio through our streamlined 4-step remote internship process.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 relative">
            {/* Connecting Line */}
            <div className="absolute top-12 left-0 w-full h-px bg-gray-100 hidden lg:block -z-10" />
            
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group"
                >
                  <div className="flex flex-col items-center md:items-start">
                    <div className="relative mb-8">
                       <div className="absolute inset-0 bg-primary-500/10 rounded-2xl blur-lg transition-all group-hover:bg-primary-500/20" />
                       <div className="relative h-20 w-20 flex items-center justify-center rounded-2xl bg-white border border-gray-100 shadow-xl text-primary-600 transition-transform group-hover:-translate-y-1">
                          <Icon size={32} strokeWidth={1.5} />
                       </div>
                       <div className="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-primary-900 text-white flex items-center justify-center text-xs font-black shadow-lg">
                          0{i + 1}
                       </div>
                    </div>
                    <h3 className="text-lg font-black text-gray-900 mb-3 tracking-tight group-hover:text-primary-600 transition-colors uppercase">{step.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed font-medium text-center md:text-left">{step.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="section bg-gray-50/50 py-24 border-y border-gray-100">
        <div className="container">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-4 text-primary-500 font-black text-[10px] uppercase tracking-[0.3em]">
              <Globe className="h-4 w-4" /> Domain Specializations
            </div>
            <h2 className="font-instrument-serif text-4xl md:text-6xl text-gray-900 tracking-tight mb-4">
              Explore <span className="italic opacity-80">Categories</span>
            </h2>
            <p className="text-gray-500 font-medium max-w-xl mx-auto">
              Choose from 10+ industry-relevant tracks designed to fast-track your professional journey.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
            {INTERNSHIP_CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={`/internships?category=${cat.id}`}
                  className="card flex flex-col items-center gap-4 p-8 text-center group border-none shadow-premium hover:shadow-2xl transition-all hover:bg-white active:scale-95 h-full"
                >
                  <span className="text-4xl group-hover:scale-110 transition-transform grayscale group-hover:grayscale-0">{cat.icon}</span>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-tight group-hover:text-primary-600 transition-colors">
                    {cat.label}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="mt-16 text-center">
            <Link href="/internships" className="btn-primary px-10 py-4 shadow-xl shadow-primary-500/10">
              Browse All Slots <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURED INTERNSHIPS ── */}
      <section className="section bg-white py-24 relative">
        <div className="container">
           <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div className="max-w-xl">
                 <div className="flex items-center gap-2 mb-4 text-primary-500 font-black text-[10px] uppercase tracking-[0.3em]">
                    <TrendingUp className="h-4 w-4" /> Fresh Opportunities
                 </div>
                 <h2 className="font-instrument-serif text-4xl md:text-6xl text-gray-900 tracking-tight">
                    Featured <span className="italic opacity-80 text-primary-600">Programs</span>
                 </h2>
              </div>
              <Link href="/internships" className="btn-secondary group">
                 View All Openings <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
           </div>

           {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {[1,2,3].map(i => <div key={i} className="h-[400px] rounded-3xl bg-gray-50 animate-pulse border border-gray-100" />)}
              </div>
           ) : featuredInternships.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {featuredInternships.map((internship, i) => (
                    <motion.div
                       key={internship.id}
                       initial={{ opacity: 0, y: 20 }}
                       whileInView={{ opacity: 1, y: 0 }}
                       viewport={{ once: true }}
                       transition={{ delay: i * 0.1 }}
                    >
                       <InternshipCard internship={internship} />
                    </motion.div>
                 ))}
              </div>
           ) : (
              <div className="text-center py-20 rounded-3xl border-2 border-dashed border-gray-100 bg-gray-50/30">
                 <p className="text-gray-400 font-medium">New internship tracks are coming soon!</p>
              </div>
           )}
        </div>
      </section>

      {/* ── WHAT YOU GET ── */}
      <section className="section bg-white py-24 relative overflow-hidden">
        <div className="container">
          <div className="text-center mb-20">
            <div className="flex items-center justify-center gap-2 mb-4 text-primary-500 font-black text-[10px] uppercase tracking-[0.3em]">
              <Award className="h-4 w-4" /> Professional Assets
            </div>
            <h2 className="font-instrument-serif text-4xl md:text-6xl text-gray-900 tracking-tight mb-4">
              What You <span className="italic opacity-80 text-primary-600">Earn</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                icon: FileText, color: 'bg-blue-50 text-blue-600',
                title: 'Official Offer Letter',
                desc: 'A professionally formatted PDF offer letter sent to your email on acceptance. Use it to show your family, or add it to your portfolio.',
                items: ['PDF format with company letterhead', 'Unique reference number', 'Delivered via email instantly'],
              },
              {
                icon: Briefcase, color: 'bg-emerald-50 text-emerald-600',
                title: 'Project Portfolio',
                desc: 'Work on actual industry-relevant projects. Get reviewed by professionals and receive detailed feedback to grow.',
                items: ['4–8 weeks of guided projects', 'Admin feedback on submissions', 'Industry-standard assignments'],
              },
              {
                icon: Award, color: 'bg-amber-50 text-amber-600',
                title: 'Verified Certificate',
                desc: 'A stunning A4 landscape certificate with QR verification. Add it to LinkedIn in one click.',
                items: ['QR-verified unique certificate ID', 'LinkedIn add-credential deep link', 'Publicly verifiable via URL'],
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="card p-10 border-none shadow-premium bg-white hover:shadow-2xl transition-all h-full flex flex-col group"
                >
                  <div className={cn("inline-flex h-14 w-14 items-center justify-center rounded-2xl mb-8 group-hover:scale-110 transition-transform", item.color)}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-4 tracking-tight uppercase leading-none">{item.title}</h3>
                  <p className="text-sm text-gray-500 mb-8 leading-relaxed font-medium">{item.desc}</p>
                  <ul className="space-y-4 mt-auto">
                    {item.items.map((point, j) => (
                      <li key={j} className="flex items-center gap-3 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary-500 shadow-sm shadow-primary-500/50" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="gradient-hero section">
        <div className="container">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {[
              { value: 500,  suffix: '+', label: 'Graduates', icon: '🎓' },
              { value: 450,  suffix: '+', label: 'Certificates Issued', icon: '📜' },
              { value: 4.9,  suffix: '/5', label: 'Average Rating', icon: '⭐' },
              { value: 35,   suffix: '+', label: 'Cities Reached', icon: '🌍' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-4xl font-bold text-white">{stat.value}{stat.suffix}</div>
                <div className="text-sm text-blue-200 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="section gradient-subtle">
        <div className="container">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary-500">Reviews</span>
            <h2 className="section-title mt-2">What Students Say</h2>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="card p-8 border-none shadow-premium hover:shadow-2xl transition-all h-full flex flex-col"
              >
                <div className="flex items-center gap-1 mb-5">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-auto italic">"{t.text}"</p>
                <div className="flex items-center gap-4 mt-8 pt-6 border-t border-gray-100">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 text-sm font-black shadow-inner">
                    {t.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="text-sm font-black text-gray-900">{t.name}</div>
                    <div className="text-[10px] font-bold text-primary-500 uppercase tracking-widest">{t.role}</div>
                    <div className="text-[10px] text-gray-400 font-medium">{t.uni} · {t.city}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="section bg-white">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <div className="text-center mb-12">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary-500">FAQ</span>
              <h2 className="section-title mt-2">Frequently Asked Questions</h2>
            </div>
            <div className="divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white px-6 shadow-card">
              {FAQ_ITEMS.map((item, i) => (
                <FaqItem key={i} q={item.q} a={item.a} index={i} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="gradient-hero section">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Launch Your Career?
            </h2>
            <p className="text-lg text-blue-100 mb-2">
              Join thousands of Pakistani students on <strong>AHWTECHNOLOGIES</strong>.
            </p>
            <p className="text-base text-blue-200/80 mb-8">
              Internships are <strong className="text-white">100% free</strong>. Pay a one-time PKR 300 community fee and get <strong className="text-white">lifetime dashboard access</strong> — your certificate is issued free after completing your projects.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register" className="btn-primary px-8 py-3.5 text-base">
                Register Free <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/internships" className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-8 py-3.5 text-base font-semibold text-white hover:bg-white/10 transition-colors">
                Browse Internships
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: '🎓', label: 'Internship FREE', sub: 'No tuition, no hidden fees' },
                { icon: '💳', label: 'PKR 300 once', sub: 'Community fee, covers everything' },
                { icon: '♾️', label: 'Forever Access', sub: 'Dashboard never expires' },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl bg-white/5 border border-white/10 p-4 text-center">
                  <div className="text-2xl mb-1">{item.icon}</div>
                  <div className="text-sm font-bold text-white">{item.label}</div>
                  <div className="text-xs text-blue-300 mt-0.5">{item.sub}</div>
                </div>
              ))}
            </div>
            <p className="mt-6 text-xs text-blue-200 flex items-center justify-center gap-2">
              <Shield className="h-4 w-4" />
              Transparent pricing. No surprises. Ever.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
