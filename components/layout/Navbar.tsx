'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Bell, ChevronDown, LogOut, User, Settings, LayoutDashboard } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { getInitials } from '@/lib/utils';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import Logo from './Logo';

const NAV_LINKS = [
  { href: '/',            label: 'Home' },
  { href: '/internships', label: 'Internships' },
  { href: '/about',       label: 'About' },
  { href: '/faq',         label: 'FAQ' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const supabase = createClient();

  const isHeroPage = pathname === '/';

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('full_name, avatar_url, role, is_lifetime_member')
          .eq('id', user.id)
          .single();
        setProfile(data);
      }
    };
    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) setProfile(null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const navBg = isHeroPage
    ? scrolled ? 'bg-white/70 backdrop-blur-xl border-b border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.03)]' : 'bg-transparent'
    : 'bg-white/70 backdrop-blur-xl border-b border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)]';

  const textColor = isHeroPage && !scrolled ? 'text-white' : 'text-gray-600';
  const logoVariant = isHeroPage && !scrolled ? 'light' : 'dark';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
      <div className="container">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <Logo variant={logoVariant} />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-sm font-semibold transition-colors hover:text-primary-500 ${textColor} ${pathname === link.href ? 'text-primary-500' : ''}`}
              >
                {link.label}
                {pathname === link.href && (
                  <motion.div layoutId="nav-pill" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary-500 rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="hidden items-center gap-4 lg:flex">
            {user ? (
              <>
                <Link href="/notifications" className={`relative p-2.5 rounded-xl hover:bg-black/5 transition-colors ${textColor}`}>
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border-2 border-white" />
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className={`flex items-center gap-3 rounded-xl border border-transparent px-2 py-1.5 transition-all hover:bg-black/5 ${textColor}`}
                  >
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="Avatar" className="h-8 w-8 rounded-xl object-cover shadow-sm" />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-500 text-white text-[10px] font-bold shadow-lg shadow-primary-500/20">
                        {getInitials(profile?.full_name || user.email || 'U')}
                      </div>
                    )}
                    <ChevronDown className={`h-4 w-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                        className="absolute right-0 mt-3 w-64 origin-top-right rounded-2xl border border-gray-100 bg-white p-2 shadow-2xl"
                        onMouseLeave={() => setDropdownOpen(false)}
                      >
                        <div className="px-4 py-3 mb-2 border-b border-gray-50">
                          <p className="text-sm font-bold text-gray-900 truncate">{profile?.full_name || 'My Account'}</p>
                          <p className="text-[10px] font-medium text-gray-400 truncate uppercase tracking-widest">{profile?.role || 'Intern'}</p>
                        </div>
                        {(profile?.is_lifetime_member || profile?.role === 'admin') && (
                          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-colors" onClick={() => setDropdownOpen(false)}>
                            <LayoutDashboard className="h-4 w-4 text-primary-500" />
                            Dashboard
                          </Link>
                        )}
                        {profile?.role === 'admin' && (
                          <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-colors" onClick={() => setDropdownOpen(false)}>
                            <Settings className="h-4 w-4 text-accent-500" />
                            Admin Panel
                          </Link>
                        )}
                        <Link href="/profile" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-colors" onClick={() => setDropdownOpen(false)}>
                          <User className="h-4 w-4 text-blue-500" />
                          My Profile
                        </Link>
                        <div className="my-1 border-t border-gray-50" />
                        <button onClick={handleSignOut} className="flex w-full items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-colors">
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className={`text-sm font-semibold transition-colors hover:text-primary-500 ${textColor}`}>Login</Link>
                <Link href="/register" className="btn-primary">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`rounded-xl p-2.5 transition-colors hover:bg-black/5 lg:hidden ${textColor}`}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute left-0 right-0 top-20 border-t border-gray-100 bg-white shadow-2xl lg:hidden"
          >
            <div className="container py-6 space-y-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block rounded-xl px-4 py-3.5 text-sm font-bold tracking-tight transition-colors ${pathname === link.href ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-gray-100 pt-4 mt-4 space-y-3">
                {user ? (
                  <>
                    {(profile?.is_lifetime_member || profile?.role === 'admin') && (
                      <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-bold text-gray-900 bg-gray-50">
                        <LayoutDashboard className="h-5 w-5 text-primary-500" />
                        Go to Dashboard
                      </Link>
                    )}
                    <button onClick={handleSignOut} className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-bold text-red-600 hover:bg-red-50">
                      <LogOut className="h-5 w-5" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setMobileOpen(false)} className="block text-center rounded-xl px-4 py-3.5 text-sm font-bold text-gray-900 hover:bg-gray-50">Login</Link>
                    <Link href="/register" onClick={() => setMobileOpen(false)} className="btn-primary w-full shadow-lg shadow-primary-500/20">Get Started Now</Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
