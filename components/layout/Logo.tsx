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
      <motion.div 
        className={`relative flex h-11 w-11 items-center justify-center rounded-2xl font-black shadow-2xl overflow-hidden ${
          isDark 
            ? 'bg-gradient-to-br from-primary-900 to-indigo-900 text-white' 
            : 'bg-white text-primary-900'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="relative z-10 text-xl tracking-tighter italic">IH</span>
        <div className="absolute inset-0 bg-white/5 opacity-50" />
      </motion.div>
      
      <div className="flex flex-col leading-none">
        <span className={`font-instrument-serif text-2xl tracking-tight ${isDark ? 'text-gray-900' : 'text-white'}`}>
          InternHub
        </span>
        <span className={`text-[9px] font-black uppercase tracking-[0.4em] ${isDark ? 'text-primary-500' : 'text-primary-300/80'} -mt-0.5`}>
          Pakistan
        </span>
      </div>
    </div>
  );
}
