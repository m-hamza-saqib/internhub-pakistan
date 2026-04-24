'use client';

import Link from 'next/link';
import { INTERNSHIP_CATEGORIES } from '@/lib/constants';
import Logo from './Logo';
import { MessageCircle, Mail } from 'lucide-react';

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);
const TwitterIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
);
const LinkedinIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);

const COMPANY_LINKS = [
  { href: '/about',   label: 'About Us' },
  { href: '/contact', label: 'Contact' },
  { href: '/faq',     label: 'FAQ' },
];

const LEGAL_LINKS = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms',   label: 'Terms of Service' },
  { href: '/refund',  label: 'Refund Policy' },
];

export default function Footer() {
  return (
    <footer className="bg-[#0A1628] text-gray-400 border-t border-white/5">
      <div className="container py-20">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-2 lg:grid-cols-12">
          {/* Brand & Mission */}
          <div className="lg:col-span-5">
            <Link href="/" className="inline-block mb-8 transition-opacity hover:opacity-90">
              <Logo variant="light" className="scale-110 origin-left" />
            </Link>
            <p className="text-sm font-medium leading-relaxed mb-10 max-w-sm text-gray-400/80">
              Empowering the next generation of Pakistani talent through verified remote internships, real-world industry projects, and internationally recognized certification.
            </p>
            
            <div className="flex items-center gap-4">
               <a href="#" className="group h-11 w-11 flex items-center justify-center rounded-xl bg-white/5 border border-white/5 transition-all hover:bg-white hover:text-primary-900 border-white/10">
                 <LinkedinIcon />
               </a>
               <a href="#" className="group h-11 w-11 flex items-center justify-center rounded-xl bg-white/5 border border-white/5 transition-all hover:bg-white hover:text-primary-900 border-white/10">
                 <InstagramIcon />
               </a>
               <a href="#" className="group h-11 w-11 flex items-center justify-center rounded-xl bg-white/5 border border-white/5 transition-all hover:bg-white hover:text-primary-900 border-white/10">
                 <TwitterIcon />
               </a>
            </div>
          </div>

          {/* Quick Links Grouping */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-10">
            {/* Categories */}
            <div>
              <h3 className="mb-6 text-[10px] font-black uppercase tracking-[0.2em] text-white">
                Core Tracks
              </h3>
              <ul className="space-y-4">
                {INTERNSHIP_CATEGORIES.slice(0, 5).map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={`/internships?category=${cat.id}`}
                      className="text-sm font-medium transition-all hover:text-white hover:translate-x-1 inline-block"
                    >
                      {cat.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="mb-6 text-[10px] font-black uppercase tracking-[0.2em] text-white">
                Quick Access
              </h3>
              <ul className="space-y-4">
                {COMPANY_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm font-medium transition-all hover:text-white hover:translate-x-1 inline-block">
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/register" className="text-sm font-bold text-primary-400 transition-all hover:text-white">
                    Join Platform
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="mb-6 text-[10px] font-black uppercase tracking-[0.2em] text-white">
                Contact & Help
              </h3>
              <div className="space-y-5">
                 <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/10">
                       <MessageCircle className="h-4 w-4" />
                    </div>
                    <div>
                       <p className="text-[10px] font-bold text-gray-500 uppercase">WhatsApp</p>
                       <p className="text-xs font-bold text-gray-200">+92 300 0000000</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/10">
                       <Mail className="h-4 w-4" />
                    </div>
                    <div>
                       <p className="text-[10px] font-bold text-gray-500 uppercase">Email Support</p>
                       <p className="text-xs font-bold text-gray-200">hello@ahwtechnologies.com</p>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 flex flex-col items-center justify-between gap-6 border-t border-white/5 pt-10 sm:flex-row">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-xs font-medium">
            <p>© {new Date().getFullYear()} AHWTECHNOLOGIES.</p>
            <div className="hidden sm:block h-3 w-px bg-white/10" />
            <div className="flex items-center gap-4">
              {LEGAL_LINKS.map(link => (
                <Link key={link.href} href={link.href} className="hover:text-white transition-colors">{link.label}</Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-emerald-500/5 px-3 py-1 border border-emerald-500/10">
            <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">
              Live Systems Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
