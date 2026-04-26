'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Bell, ChevronDown, LogOut, User, Settings, LayoutDashboard, Home, Briefcase, Info, HelpCircle, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { getInitials } from '@/lib/utils';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import Logo from './Logo';

const NAV_LINKS = [
  { href: '/',            label: 'Home',        icon: Home },
  { href: '/internships', label: 'Internships', icon: Briefcase },
  { href: '/about',       label: 'About',       icon: Info },
  { href: '/faq',         label: 'FAQ',         icon: HelpCircle },
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
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const navBg = scrolled 
    ? 'bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.04)]' 
    : 'bg-white/70 backdrop-blur-xl border-b border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)]';

  const textColor = 'text-gray-600';
  const logoVariant = 'dark';

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
            {user && (
              <Link
                href="/dashboard"
                className={`relative text-sm font-semibold transition-colors hover:text-primary-500 ${textColor} ${pathname === '/dashboard' ? 'text-primary-500' : ''}`}
              >
                Dashboard
                {pathname === '/dashboard' && (
                  <motion.div layoutId="nav-pill" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary-500 rounded-full" />
                )}
              </Link>
            )}
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
                        
                        <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-colors" onClick={() => setDropdownOpen(false)}>
                          <LayoutDashboard className="h-4 w-4 text-primary-500" />
                          Dashboard
                        </Link>
                        {profile?.role === 'admin' && (
                          <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-colors" onClick={() => setDropdownOpen(false)}>
                            <Settings className="h-4 w-4 text-emerald-500" />
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
              <div className="hidden items-center gap-3 lg:flex">
                <Link href="/login" className={`text-sm font-semibold transition-colors hover:text-primary-500 ${textColor}`}>Login</Link>
                <Link href="/register" className="btn-primary">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className={`rounded-xl p-2.5 transition-colors hover:bg-black/5 lg:hidden ${textColor}`}
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-[60] bg-gray-900/40 backdrop-blur-sm lg:hidden"
            />
            
            {/* Sidebar Content */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 z-[70] h-full w-[280px] bg-white shadow-2xl p-0 lg:hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-50 bg-gray-50/50">
                <Logo variant="dark" className="scale-75 origin-left" />
                <button 
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-xl bg-white border border-gray-100 text-gray-500 shadow-sm transition-transform active:scale-90"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* User Bio (Conditional) */}
              {user && (
                <div className="p-6 bg-gradient-to-br from-primary-50 to-white border-b border-gray-50">
                  <div className="flex items-center gap-4">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="" className="h-12 w-12 rounded-2xl object-cover ring-4 ring-white shadow-lg" />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-500 text-white text-sm font-black shadow-lg shadow-primary-500/20">
                        {getInitials(profile?.full_name || user.email || 'U')}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black text-gray-900 truncate">
                        {profile?.full_name || 'My Account'}
                      </p>
                      <p className="text-[10px] font-bold text-primary-500 uppercase tracking-widest">
                        {profile?.role || 'Intern'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Links */}
              <div className="flex-1 overflow-y-auto py-8 px-4 space-y-1 min-h-0">
                <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Main Menu</p>
                {NAV_LINKS.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-4 rounded-2xl px-4 py-4 text-sm font-bold tracking-tight transition-all active:scale-95 mb-1 ${
                        isActive 
                          ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' 
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                      {link.label}
                    </Link>
                  );
                })}

                {user && (
                  <>
                    <div className="my-6 mx-4 border-t border-gray-100" />
                    <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Workspace</p>
                    
                    {profile?.role === 'admin' && (
                      <Link 
                        href="/admin" 
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-4 rounded-2xl px-4 py-4 text-sm font-bold tracking-tight transition-all active:scale-95 mb-1 ${
                          pathname === '/admin' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <Settings className="h-5 w-5" />
                        Admin Panel
                      </Link>
                    )}

                    <Link 
                      href="/dashboard" 
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-4 rounded-2xl px-4 py-4 text-sm font-bold tracking-tight transition-all active:scale-95 mb-1 ${
                        pathname === '/dashboard' || pathname === '/my-internship' ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <LayoutDashboard className="h-5 w-5" />
                      Dashboard
                    </Link>

                    <Link 
                      href="/profile" 
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-4 rounded-2xl px-4 py-4 text-sm font-bold tracking-tight transition-all active:scale-95 mb-1 ${
                        pathname === '/profile' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <User className="h-5 w-5" />
                      My Profile
                    </Link>
                  </>
                )}
              </div>

              {/* Action Area */}
              <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                {!user ? (
                  <div className="space-y-3">
                    <Link 
                      href="/login" 
                      onClick={() => setMobileOpen(false)}
                      className="flex h-12 w-full items-center justify-center rounded-2xl text-sm font-bold text-gray-900 bg-white border border-gray-200 shadow-sm"
                    >
                      Sign In
                    </Link>
                    <Link 
                      href="/register" 
                      onClick={() => setMobileOpen(false)}
                      className="btn-primary w-full h-12"
                    >
                      Get Started <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                ) : (
                  <button 
                    onClick={handleSignOut}
                    className="flex h-12 w-full items-center justify-center gap-3 rounded-2xl text-sm font-bold text-rose-600 bg-rose-50 border border-rose-100 hover:bg-rose-100 transition-colors shadow-sm"
                  >
                    <LogOut className="h-5 w-5" />
                    Sign Out
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
