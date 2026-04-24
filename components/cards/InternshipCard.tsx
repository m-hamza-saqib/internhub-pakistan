'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Clock, BarChart2, Users, ArrowRight, Sparkles } from 'lucide-react';
import { DIFFICULTY_OPTIONS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/database.types';

type Internship = Database['public']['Tables']['internships']['Row'];

interface InternshipCardProps {
  internship: Internship;
}

export default function InternshipCard({ internship }: InternshipCardProps) {
  const difficulty = DIFFICULTY_OPTIONS.find((d) => d.value === internship.difficulty);
  const supabase = createClient();

  // Local state for real-time slot updates
  const [spotsFilled, setSpotsFilled] = useState(internship.spots_filled);

  useEffect(() => {
    // Subscribe to real-time updates for this specific internship
    const channelId = `intern-slots-${Math.random().toString(36).substring(2)}`;
    const channel = supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'internships',
          filter: `id=eq.${internship.id}`,
        },
        (payload) => {
          const updated = payload.new as Internship;
          if (typeof updated.spots_filled === 'number') {
            setSpotsFilled(updated.spots_filled);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [internship.id]);

  const spotsLeft = internship.spots_total - spotsFilled;
  const spotsPercent = Math.round((spotsFilled / internship.spots_total) * 100);
  const isFull = spotsLeft <= 0;

  return (
    <div className="group card flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-primary-100">
      {/* Thumbnail / Header Gradient */}
      <div className="relative h-44 w-full overflow-hidden bg-gradient-to-br from-indigo-900 via-primary-900 to-primary-700">
        {internship.thumbnail_url ? (
          <img
            src={internship.thumbnail_url}
            alt={internship.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:opacity-90"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
             <span className="text-8xl font-black text-white italic tracking-tighter mix-blend-overlay">IH</span>
          </div>
        )}
        
        {/* Chips */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className="inline-flex items-center rounded-lg bg-white/10 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-white uppercase tracking-widest border border-white/20">
            {internship.category.replace(/-/g, ' ')}
          </span>
        </div>

        <div className="absolute top-4 right-4">
          <div className={cn('h-2.5 w-2.5 rounded-full ring-4 ring-black/10', 
             difficulty?.value === 'beginner' ? 'bg-emerald-400' : 
             difficulty?.value === 'intermediate' ? 'bg-amber-400' : 'bg-rose-400'
          )} title={difficulty?.label} />
        </div>

        {/* Full badge */}
        {isFull && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[2px]">
            <span className="rounded-full bg-red-500 px-4 py-1.5 text-xs font-black text-white uppercase tracking-widest">
              Fully Enrolled
            </span>
          </div>
        )}

        {/* Floating Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
      </div>

      {/* Body Content */}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-2 mb-3">
           <span className="flex h-5 w-5 items-center justify-center rounded-md bg-emerald-50 text-emerald-600">
             <Sparkles className="h-3 w-3" />
           </span>
           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Verified Internship</span>
        </div>

        <Link href={`/internships/${internship.slug}`} className="block">
          <h3 className="text-xl font-black text-gray-900 leading-tight mb-4 group-hover:text-primary-600 transition-colors line-clamp-2 tracking-tight">
            {internship.title}
          </h3>
        </Link>

        {/* Meta Grid */}
        <div className="grid grid-cols-3 gap-2 mb-6 border-y border-gray-50 py-4">
          <div className="flex flex-col">
             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight mb-1 flex items-center gap-1">
               <Clock className="h-2.5 w-2.5" /> Duration
             </span>
             <span className="text-xs font-bold text-gray-700">{internship.duration_weeks} Weeks</span>
          </div>
          <div className="flex flex-col">
             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight mb-1 flex items-center gap-1">
               <BarChart2 className="h-2.5 w-2.5" /> Level
             </span>
             <span className="text-xs font-bold text-gray-700 capitalize">{difficulty?.label}</span>
          </div>
          <div className="flex flex-col">
             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight mb-1 flex items-center gap-1">
               <Users className="h-2.5 w-2.5" /> Stability
             </span>
             <span className="text-xs font-bold text-gray-700">Remote</span>
          </div>
        </div>

        {/* Availability Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
             <span className={cn('text-[11px] font-bold', isFull ? 'text-red-500' : 'text-gray-500')}>
               {isFull ? 'All slots filled' : `${spotsLeft} slots left`}
             </span>
             <span className="text-[10px] font-black text-primary-500 uppercase">{spotsPercent}% Limit Reached</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden shadow-inner">
             <div 
               className={cn('h-full transition-all duration-700', 
                 spotsPercent >= 100 ? 'bg-red-500' : spotsPercent > 85 ? 'bg-orange-500' : 'bg-primary-500'
               )} 
               style={{ width: `${Math.min(spotsPercent, 100)}%` }} 
             />
          </div>
        </div>

        {/* Action Section */}
        <div className="mt-auto pt-2">
           <Link
             href={`/internships/${internship.slug}`}
             className={cn(
               'inline-flex items-center justify-center gap-2 w-full btn-primary py-3.5 text-sm font-bold shadow-lg shadow-primary-500/10 active:scale-[0.98]',
               isFull && 'opacity-60 pointer-events-none cursor-not-allowed'
             )}
           >
             {isFull ? 'Slots Full' : <>Enroll Now <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></>}
           </Link>
        </div>
      </div>
    </div>
  );
}
