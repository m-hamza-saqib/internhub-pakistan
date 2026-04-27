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

import Image from 'next/image';

/* ─── Counter Animation Hook (Optimized) ─── */
function useCounter(target: number, duration = 1500) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!inView) return;
    
    let startTime: number | null = null;
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      const currentCount = Math.floor(target * percentage);
      setCount(currentCount);

      if (percentage < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [inView, target, duration]);

  return { count, ref };
}

/* ─── Stat Counter ─── */
function StatCounter({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { count, ref } = useCounter(value);
  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-black text-white tracking-tighter tabular-nums">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="mt-2 text-[9px] font-black text-blue-200/50 uppercase tracking-[0.3em] leading-none">{label}</div>
    </div>
  );
}

/* ─── FAQ Item ─── */
function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      className="border-b border-gray-200 last:border-0"
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-6 text-left text-sm font-bold text-gray-900 hover:text-primary-500 transition-colors"
      >
        <span className="max-w-[85%]">{q}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-gray-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="pb-6 text-sm text-gray-600 leading-relaxed overflow-hidden"
          >
            {a}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

import { createClient } from '@/lib/supabase/client';
import InternshipCard from '@/components/cards/InternshipCard';
import { AnimatePresence } from 'framer-motion';

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
  }, [supabase]);

  return (

    <>
      {/* ── HERO ── */}
      <section className="gradient-hero relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background dots (Optimized) */}
        <div className="absolute inset-0 opacity-[0.03] select-none pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1.5px, transparent 1.5px)', backgroundSize: '40px 40px' }} />

        <div className="container relative z-10 pt-20 pb-16">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-1.5 text-[10px] font-black text-blue-200 mb-8 uppercase tracking-[0.2em]">
                <Sparkles className="h-3 w-3" /> Building solutions delivering excellence
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
              className="font-instrument-serif text-5xl font-bold text-white leading-[1.05] md:text-7xl lg:text-9xl tracking-tight"
            >
              Master Your Future{' '}
              <span className="italic text-indigo-300">With AWH TECH</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-10 text-base md:text-lg text-blue-100/70 leading-relaxed max-w-2xl mx-auto font-medium"
            >
              Start-up powered remote internships. Real-world projects. Industry-grade certification. Join AWH TECH for an immersive professional journey with <strong className="text-white">lifetime access</strong> to elite technical paths.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/internships" className="btn-primary px-10 py-4.5 text-base shadow-xl">
                Start Exploring <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/about" className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 py-4.5 px-10 text-base font-black text-white hover:bg-white/10 transition-colors">
                Our Mission
              </Link>
            </motion.div>

            {/* Hero Stats (Simple Glass) */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.8 }}
              className="mt-24 grid grid-cols-3 gap-4 md:gap-8 rounded-[2rem] border border-white/5 bg-white/[0.02] p-8 md:p-12"
            >
              <StatCounter value={1200} suffix="+" label="Identity Verified" />
              <StatCounter value={15} suffix="+" label="Innovation Paths" />
              <StatCounter value={100} suffix="%" label="Digital Reliability" />
            </motion.div>

            {/* Value Prop Banner */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
              className="mt-10 flex flex-wrap items-center justify-center gap-3 text-[10px]"
            >
              <span className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/10 px-4 py-2 text-emerald-300 font-bold uppercase tracking-widest">
                <CheckCircle className="h-3 w-3" /> Zero-Tuition Learning
              </span>
              <span className="flex items-center gap-2 rounded-lg bg-indigo-500/10 border border-indigo-500/10 px-4 py-2 text-indigo-300 font-bold uppercase tracking-widest">
                💳 PKR 300 Community Enabler
              </span>
              <span className="flex items-center gap-2 rounded-lg bg-blue-500/10 border border-blue-500/10 px-4 py-2 text-blue-300 font-bold uppercase tracking-widest">
                🔓 Permanent Dashboard Proxy
              </span>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator (Static or simple CSS) */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/20 animate-bounce">
          <ChevronDown className="h-6 w-6" />
        </div>
      </section>

      {/* ── TRUST BAR (Optimized) ── */}
      <section className="border-y border-gray-100 bg-white/80 backdrop-blur-sm py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em] shrink-0 border-r border-gray-100 pr-8 hidden md:block">
              Institutional Partners
            </span>
            <div className="w-full overflow-x-auto pb-2 no-scrollbar">
              <div className="flex gap-16 items-center justify-between min-w-max px-4">
                {TRUSTED_UNIVERSITIES.map((uni, i) => (
                  <span key={i} className="text-[11px] font-black text-gray-300 hover:text-primary-500 transition-colors cursor-default uppercase tracking-widest translate-z-0">
                    {uni}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS (Optimized) ── */}
      <section className="py-28 relative bg-white">
        <div className="container">
          <div className="text-center mb-20">
            <div className="flex items-center justify-center gap-2 mb-4 text-primary-500 font-black text-[10px] uppercase tracking-[0.3em]">
              <Sparkles className="h-3 w-3" /> Excellence Lifecycle
            </div>
            <h2 className="font-instrument-serif text-5xl md:text-7xl text-gray-900 tracking-tight mb-4">
              The Path to <span className="italic text-primary-600">Expertise</span>
            </h2>
            <p className="text-gray-500 font-medium max-w-xl mx-auto text-sm md:text-base leading-relaxed">
              AWH TECH provides a high-octane environment for technical growth, moving from selection to verified professional credentials.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'Identity Entry', desc: 'Browse innovation tracks and submit your professional application for selection.', icon: Globe },
              { title: 'AWH Selection', desc: 'Secure your spot. Receive your offer letter and join the technical community.', icon: CheckCircle },
              { title: 'Project Build', desc: 'Work on actual startup-powered projects with professional oversight.', icon: Briefcase },
              { title: 'Credentialing', desc: 'Earn your industry-verified certificate and professional recognition.', icon: Award },
            ].map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="relative flex flex-col items-center md:items-start text-center md:text-left group translate-z-0"
                >
                  <div className="mb-8 relative">
                    <div className="h-16 w-16 flex items-center justify-center rounded-2xl bg-gray-50 border border-gray-100 text-primary-600 shadow-sm transition-transform group-hover:-translate-y-1">
                      <Icon size={28} strokeWidth={1.5} />
                    </div>
                    <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-primary-600 text-white flex items-center justify-center text-[10px] font-black shadow-lg">
                      {i + 1}
                    </div>
                  </div>
                  <h3 className="text-sm font-black text-gray-900 mb-2 tracking-widest uppercase">{step.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed font-medium">{step.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES (Optimized) ── */}
      <section className="py-28 bg-gray-50 border-y border-gray-200/50">
        <div className="container">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-4 text-primary-500 font-black text-[10px] uppercase tracking-[0.4em]">
              <Globe className="h-4 w-4" /> Innovation Corridors
            </div>
            <h2 className="font-instrument-serif text-5xl md:text-7xl text-gray-900 tracking-tight mb-4">
              Explore <span className="italic">Domains</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {INTERNSHIP_CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.02 }}
                className="translate-z-0"
              >
                <Link
                  href={`/internships?category=${cat.id}`}
                  className="card flex flex-col items-center gap-4 p-8 text-center group border-none shadow-sm hover:shadow-lg transition-all bg-white h-full"
                >
                  <span className="text-4xl group-hover:scale-110 transition-transform duration-300 pointer-events-none">{cat.icon}</span>
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] group-hover:text-primary-600 transition-colors">
                    {cat.label}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="mt-16 text-center">
            <Link href="/internships" className="btn-primary">
              Launch Career <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURED INTERNSHIPS (Optimized) ── */}
      <section className="py-28 bg-white">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 mb-4 text-primary-500 font-black text-[10px] uppercase tracking-[0.4em]">
                <TrendingUp className="h-4 w-4" /> Current Openings
              </div>
              <h2 className="font-instrument-serif text-5xl md:text-7xl text-gray-900 tracking-tight">
                Premium <span className="italic text-primary-600">Tracks</span>
              </h2>
            </div>
            <Link href="/internships" className="btn-secondary">
              View All Paths <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => <div key={i} className="h-96 rounded-2xl bg-gray-50 animate-pulse border border-gray-100" />)}
            </div>
          ) : featuredInternships.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredInternships.map((internship, i) => (
                <motion.div
                  key={internship.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="translate-z-0"
                >
                  <InternshipCard internship={internship} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 rounded-2xl border-2 border-dashed border-gray-100 bg-gray-50/50">
              <p className="text-xs font-bold text-gray-400 tracking-widest uppercase">New innovation corridors opening soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── WHAT YOU GET (Optimized) ── */}
      <section className="py-28 bg-gray-50 relative overflow-hidden">
        <div className="container">
          <div className="text-center mb-20">
            <div className="flex items-center justify-center gap-2 mb-4 text-primary-500 font-black text-[10px] uppercase tracking-[0.4em]">
              <Award className="h-4 w-4" /> Technical Assets
            </div>
            <h2 className="font-instrument-serif text-5xl md:text-7xl text-gray-900 tracking-tight mb-4">
              Your Professional <span className="italic text-primary-600">Yield</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                icon: FileText, color: 'bg-primary-50 text-primary-600',
                title: 'AWH Offer Letter',
                desc: 'A premium, verified selection document sent to your identity portal on acceptance. Your official proof of selection.',
              },
              {
                icon: Briefcase, color: 'bg-emerald-50 text-emerald-600',
                title: 'Innovation Portfolio',
                desc: 'Build actual solutions delivering excellence. Every commit and solution contributes to your industry-grade portfolio.',
              },
              {
                icon: Award, color: 'bg-amber-50 text-amber-600',
                title: 'Global Credential',
                desc: 'Earn a stunning verified certificate. Recognized by industry leaders and ready for your professional networks.',
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="card p-10 border-none shadow-sm hover:shadow-lg transition-all h-full flex flex-col group bg-white translate-z-0"
                >
                  <div className={cn("inline-flex h-14 w-14 items-center justify-center rounded-2xl mb-8 transition-transform duration-300 group-hover:scale-105", item.color)}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-sm font-black text-gray-900 mb-4 tracking-widest uppercase">{item.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed font-medium">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── STATS (Optimized) ── */}
      <section className="bg-primary-900 py-32 relative overflow-hidden">
        <div className="container relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: 1500, suffix: '+', label: 'Identity Holders', icon: Users },
              { value: 900, suffix: '+', label: 'Verified Credentials', icon: Award },
              { value: 98, suffix: '%', label: 'Efficiency Quotient', icon: Star },
              { value: 50, suffix: '+', label: 'Hubs Reached', icon: Globe },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="flex flex-col items-center translate-z-0"
                >
                  <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center text-primary-300 mb-6">
                    <Icon size={24} />
                  </div>
                  <StatCounter value={stat.value} suffix={stat.suffix} label={stat.label} />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS (Optimized) ── */}
      <section className="py-28 bg-white">
        <div className="container">
          <div className="text-center mb-20 text-gray-900">
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-primary-600 leading-none mb-4 block">Feedback loops</span>
            <h2 className="font-instrument-serif text-5xl md:text-7xl tracking-tight">Intern <span className="italic text-primary-600">Insights</span></h2>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="card p-8 border-none shadow-sm hover:shadow-md transition-all h-full flex flex-col bg-gray-50/50 translate-z-0"
              >
                <div className="flex items-center gap-1 mb-6">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className={cn("h-3 w-3", j < t.rating ? "fill-amber-400 text-amber-400" : "text-gray-200")} />
                  ))}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed font-medium italic mb-10 shrink-0">"{t.text}"</p>
                <div className="mt-auto flex items-center gap-3">
                   <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary-600 text-white text-[10px] font-black shadow-inner">
                      {t.name.substring(0, 2).toUpperCase()}
                   </div>
                   <div>
                      <div className="text-[11px] font-black text-gray-900 uppercase tracking-wider">{t.name}</div>
                      <div className="text-[9px] font-bold text-primary-500 uppercase tracking-widest">{t.role}</div>
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ (Optimized) ── */}
      <section className="py-28 bg-gray-50">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <div className="text-center mb-16 text-gray-900">
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-primary-600 mb-4 block">Precision support</span>
              <h2 className="font-instrument-serif text-5xl md:text-7xl tracking-tight">Common <span className="italic text-primary-600">Questions</span></h2>
            </div>
            <div className="space-y-2">
              {FAQ_ITEMS.map((item, i) => (
                <FaqItem key={i} q={item.q} a={item.a} index={i} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA (Optimized) ── */}
      <section className="bg-primary-950 py-32 relative overflow-hidden">
        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-none">
              Apply For Excellence
            </h2>
            <p className="text-sm md:text-base text-primary-100/60 mb-12 leading-relaxed max-w-xl mx-auto font-medium uppercase tracking-[0.1em]">
               Building Solutions · Delivering Excellence across every technical speciality. Onboard today and lock in your professional growth.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register" className="btn-primary bg-white text-primary-900 hover:bg-gray-100 shadow-2xl px-12 py-5 font-black uppercase tracking-widest">
                Get Started <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/internships" className="btn-secondary bg-transparent border-white/20 text-white hover:bg-white/5 px-12 py-5 font-black uppercase tracking-widest">
                Tracks
              </Link>
            </div>
            <div className="mt-20 pt-10 border-t border-white/5">
               <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.5em] flex items-center justify-center gap-3">
                 <Shield className="h-3 w-3" /> Secure Access Verified
               </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
