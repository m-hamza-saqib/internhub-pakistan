'use client';

import { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import DashboardSidebar from '@/components/layout/DashboardSidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  return (
    <div className="flex min-h-screen bg-white">
      <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top navigation */}
        <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-gray-100 bg-white/80 backdrop-blur-md px-4 py-3 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-xl p-2 text-gray-500 hover:bg-gray-50 transition-colors"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-900 shadow-lg shadow-gray-200 transition-transform group-active:scale-90">
              <span className="text-[10px] font-black italic text-white tracking-tighter">AWH</span>
            </div>
            <span className="text-sm font-black text-gray-900 tracking-tight">AWH TECH</span>
          </Link>
        </div>

        <main className="flex-1 p-4 md:p-6 lg:p-8 xl:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
