'use client';

import { motion } from 'framer-motion';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
}

export default function Logo({ className = '', variant = 'dark' }: LogoProps) {
  const isDark = variant === 'dark';
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logomark - the "AWH" part as requested */}
      <motion.div 
        className={`relative flex h-11 w-11 items-center justify-center rounded-2xl font-black shadow-2xl overflow-hidden ${
          isDark 
            ? 'bg-gradient-to-br from-indigo-950 via-gray-900 to-black text-white border border-white/10' 
            : 'bg-white text-indigo-950 border border-gray-100'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none" />
        <span className="relative z-10 text-xl tracking-[-0.1em] font-extrabold italic select-none">
          AWH
        </span>
        <div className="absolute top-0 right-0 h-4 w-4 bg-white/5 rotate-45 translate-x-3 -translate-y-3" />
      </motion.div>
      
      {/* Textmark */}
      <div className="flex flex-col leading-none">
        <div className="flex items-center">
          <span className={`font-instrument-serif text-2xl font-black tracking-tight ${isDark ? 'text-gray-900' : 'text-white'}`}>
            AWH
          </span>
          <span className={`font-instrument-serif text-2xl font-light tracking-tight ml-1 ${isDark ? 'text-indigo-600' : 'text-indigo-200'}`}>
            TECH
          </span>
        </div>
        <span className={`text-[8px] font-black uppercase tracking-[0.25em] ${isDark ? 'text-gray-400' : 'text-white/60'} mt-0.5`}>
          Delivering Excellence
        </span>
      </div>
    </div>
  );
}
