'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FileText, Briefcase, FolderOpen,
  Award, Bell, User, Settings, X, LogOut, ChevronRight,
  ExternalLink
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Logo from './Logo';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

const SIDEBAR_LINKS = [
  { href: '/dashboard',       label: 'Overview',      icon: LayoutDashboard },
  { href: '/applications',    label: 'Applications',  icon: FileText },
  { href: '/my-internship',   label: 'My Internship', icon: Briefcase },
  { href: '/projects',        label: 'Active Projects', icon: FolderOpen },
  { href: '/certificates',    label: 'Certificates',  icon: Award },
];

interface DashboardSidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export default function DashboardSidebar({ open = true, onClose }: DashboardSidebarProps) {
  const pathname = usePathname();
  const supabase = createClient();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let channel: any;
    let isMounted = true;

    const loadCount = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !isMounted) return;

      const { count } = await supabase
        .from('notifications')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (isMounted) setUnreadCount(count || 0);

      // Unique channel name to prevent collisions during fast re-renders
      const channelId = `sb-notifs-${Math.random().toString(36).substring(2)}`;
      
      channel = supabase
        .channel(channelId)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`,
          },
          async () => {
            if (!isMounted) return;
            const { count: newCount } = await supabase
              .from('notifications')
              .select('id', { count: 'exact', head: true })
              .eq('user_id', user.id)
              .eq('is_read', false);
            if (isMounted) setUnreadCount(newCount || 0);
          }
        )
        .subscribe();
    };

    loadCount();

    return () => {
      isMounted = false;
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const BOTTOM_LINKS = [
    { href: '/notifications', label: 'Notifications', icon: Bell, badge: unreadCount },
    { href: '/profile',       label: 'Profile',       icon: User },
    { href: '/settings',      label: 'Settings',      icon: Settings },
  ];

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-white border-r border-gray-100 shadow-sm">
      {/* Header / Logo */}
      <div className="flex flex-col px-6 py-10">
        <div className="flex items-center justify-between mb-2">
          <Logo className="scale-110 origin-left" />
          {onClose && (
            <button 
              onClick={onClose} 
              className="rounded-full p-2 text-gray-400 hover:bg-gray-50 lg:hidden transition-all active:scale-95"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mt-1 ml-0.5">
          Student Portal
        </p>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 space-y-1 custom-scrollbar">
        <div className="px-3 mb-4 text-[10px] font-bold uppercase tracking-widest text-gray-400/80">
          Navigation
        </div>
        
        {SIDEBAR_LINKS.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
          
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={cn(
                "group relative flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200",
                isActive 
                  ? "bg-primary-500 text-white shadow-lg shadow-primary-500/25" 
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <div className={cn(
                "flex h-5 w-5 items-center justify-center transition-transform duration-300 group-hover:scale-110",
                isActive ? "text-white" : "text-gray-400 group-hover:text-primary-500"
              )}>
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              
              <span className="flex-1">{link.label}</span>
              
              {isActive ? (
                <ChevronRight size={14} className="opacity-50" />
              ) : (
                <div className="h-1.5 w-1.5 rounded-full bg-primary-500 opacity-0 transition-opacity group-hover:opacity-20" />
              )}
            </Link>
          );
        })}

        {/* External Link Section */}
        <div className="mt-8 px-3">
          <div className="rounded-2xl bg-gray-50 p-4 border border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight mb-2">Support</p>
            <Link href="/faq" className="flex items-center justify-between text-xs font-bold text-gray-600 hover:text-primary-600 transition-colors">
              Help Center <ExternalLink size={12} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Account Section */}
      <div className="p-4 space-y-1">
        <div className="px-3 mb-3 text-[10px] font-bold uppercase tracking-widest text-gray-400/80">
          Account Settings
        </div>
        
        {BOTTOM_LINKS.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={cn(
                "group flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200",
                isActive 
                  ? "bg-primary-50 text-primary-600 border border-primary-100" 
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Icon size={18} className={isActive ? "text-primary-600" : "text-gray-400 group-hover:text-gray-600"} />
              <span className="flex-1">{link.label}</span>
              
              {'badge' in link && link.badge > 0 && (
                <span className="flex h-5 min-w-5 px-1 items-center justify-center rounded-lg bg-rose-500 text-[10px] font-black text-white shadow-sm shadow-rose-200">
                  {link.badge > 99 ? '99+' : link.badge}
                </span>
              )}
            </Link>
          );
        })}

        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-bold text-rose-500 transition-all hover:bg-rose-50 hover:text-rose-600 active:scale-[0.98]"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden w-72 shrink-0 lg:block bg-white h-screen sticky top-0">
        <SidebarContent />
      </aside>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-40 bg-gray-900/60 backdrop-blur-md lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed left-0 top-0 z-50 h-full w-72 lg:hidden shadow-[20px_0_50px_rgba(0,0,0,0.2)]"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
