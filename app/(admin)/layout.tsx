import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Logo from '@/components/layout/Logo';
import Link from 'next/link';
import { LogOut, ExternalLink, ShieldCheck } from 'lucide-react';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profileRaw } = await supabase.from('profiles').select('role, full_name').eq('id', user.id).single();
  const profile = profileRaw as { role: string; full_name: string } | null;
  if (!profile || profile.role !== 'admin') redirect('/dashboard');

  const ADMIN_NAV = [
    { href: '/admin',                    label: 'Overview' },
    { href: '/admin/applications',       label: 'Applications' },
    { href: '/admin/payment-proofs',     label: 'Payment Proofs' },
    { href: '/admin/internships',        label: 'Internships' },
    { href: '/admin/users',              label: 'Users' },
    { href: '/admin/projects',           label: 'Projects' },
    { href: '/admin/payments',           label: 'Ledger' },
    { href: '/admin/announcements',      label: 'Announcements' },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Admin Top Bar */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-gray-900/95 backdrop-blur-md px-6 py-4 shadow-xl">
        <div className="flex items-center justify-between mx-auto max-w-[1600px]">
          <div className="flex items-center gap-10">
            <Link href="/admin" className="flex items-center gap-3 group">
              <Logo variant="light" className="scale-90 origin-left transition-transform group-hover:scale-95" />
              <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-black text-emerald-400 border border-emerald-500/20 uppercase tracking-widest shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Systems Operational
              </div>
            </Link>
            
            <nav className="hidden xl:flex items-center gap-1 bg-white/5 rounded-2xl p-1 border border-white/5 overflow-x-auto no-scrollbar max-w-[500px] 2xl:max-w-none">
              {ADMIN_NAV.map((link) => (
                <Link key={link.href} href={link.href}
                  className="whitespace-nowrap rounded-xl px-4 py-2 text-[11px] font-bold text-gray-400 transition-all hover:bg-white/10 hover:text-white uppercase tracking-wider"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex flex-col items-end leading-none">
              <span className="text-[9px] font-black text-primary-400 uppercase tracking-[0.2em] mb-1.5 opacity-70">Authenticated Admin</span>
              <span className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                {profile.full_name}
                <div className="h-2 w-2 rounded-full bg-primary-500" />
              </span>
            </div>
            
            <div className="flex items-center gap-3 border-l border-white/10 pl-6">
              <Link href="/dashboard" className="flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-primary-500/20 transition-all hover:bg-primary-600 active:scale-95">
                <ExternalLink className="h-3.5 w-3.5" /> Intern View
              </Link>
              <button 
                className="rounded-xl p-2.5 text-gray-400 hover:bg-rose-500/10 hover:text-rose-400 transition-all border border-transparent hover:border-rose-500/20"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-8 max-w-[1600px] mx-auto animate-in">
        <div className="mb-8">
           <h2 className="text-xs font-black text-primary-500 uppercase tracking-[0.2em] mb-1">Operational Data</h2>
           <p className="text-2xl font-black text-gray-900 tracking-tight">Management Console</p>
        </div>
        {children}
      </main>
    </div>
  );
}
