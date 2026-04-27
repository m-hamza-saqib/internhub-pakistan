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

import Image from 'next/image';

export default function InternshipCard({ internship }: InternshipCardProps) {
  const difficulty = DIFFICULTY_OPTIONS.find((d) => d.value === internship.difficulty);
  const supabase = createClient();

  // Local state for real-time slot updates
  const [spotsFilled, setSpotsFilled] = useState(internship.spots_filled);

  useEffect(() => {
    // Subscribe to real-time updates for this specific internship
    const channelId = `intern-slots-${internship.id}`;
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
  }, [internship.id, supabase]);

  const spotsLeft = internship.spots_total - spotsFilled;
  const spotsPercent = Math.round((spotsFilled / internship.spots_total) * 100);
  const isFull = spotsLeft <= 0;

  return (
    <div className="group card flex flex-col h-full overflow-hidden border-none shadow-sm hover:shadow-xl transition-shadow duration-300">
      {/* Thumbnail / Header Gradient */}
      <div className="relative h-44 w-full overflow-hidden bg-gray-900">
        {internship.thumbnail_url ? (
          <Image
            src={internship.thumbnail_url}
            alt={internship.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority={false}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 bg-gradient-to-br from-indigo-900 to-primary-900">
             <span className="text-7xl font-black text-white italic tracking-tighter">AWH</span>
          </div>
        )}
        
        {/* Chips */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          <span className="inline-flex items-center rounded-lg bg-gray-900/40 backdrop-blur-sm px-2.5 py-1 text-[9px] font-black text-white uppercase tracking-widest border border-white/10">
            {internship.category.replace(/-/g, ' ')}
          </span>
        </div>

        <div className="absolute top-4 right-4 z-10">
          <div className={cn('h-2.5 w-2.5 rounded-full ring-4 shadow-sm', 
             difficulty?.value === 'beginner' ? 'bg-emerald-400 ring-emerald-400/20' : 
             difficulty?.value === 'intermediate' ? 'bg-amber-400 ring-amber-400/20' : 'bg-rose-400 ring-rose-400/20'
          )} title={difficulty?.label} />
        </div>

        {/* Full badge */}
        {isFull && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px] z-20">
            <span className="rounded-lg bg-white/90 px-4 py-1.5 text-[10px] font-black text-gray-900 uppercase tracking-widest shadow-xl">
              Fully Enrolled
            </span>
          </div>
        )}

        {/* Floating Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 z-0" />
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
