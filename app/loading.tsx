'use client';

import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 backdrop-blur-md">
      <div className="flex flex-col items-center">
        {/* Animated Logo Mark */}
        <div className="relative mb-8">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [1, 0.8, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="h-20 w-20 flex items-center justify-center rounded-3xl bg-gray-900 shadow-2xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
            <span className="relative z-10 text-2xl font-black italic text-white tracking-tighter">AWH</span>
          </motion.div>
          
          {/* Circular Pulse */}
          <motion.div
            animate={{
              scale: [1, 1.5],
              opacity: [0.5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut"
            }}
            className="absolute inset-0 rounded-3xl bg-indigo-500 -z-10"
          />
        </div>

        {/* Loading Text */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Loading</span>
          <motion.div 
            className="flex gap-1"
            initial="initial"
            animate="animate"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                variants={{
                  initial: { opacity: 0.3 },
                  animate: { opacity: 1 }
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: i * 0.2
                }}
                className="h-1 w-1 rounded-full bg-indigo-500"
              />
            ))}
          </motion.div>
        </div>
        <p className="mt-2 text-[8px] font-bold text-indigo-400/60 uppercase tracking-widest">
          Building Excellence
        </p>
      </div>
    </div>
  );
}
