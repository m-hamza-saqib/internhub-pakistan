'use client';

import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, SlidersHorizontal, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import InternshipCard from '@/components/cards/InternshipCard';
import { INTERNSHIP_CATEGORIES, DURATION_OPTIONS, DIFFICULTY_OPTIONS } from '@/lib/constants';
import type { Database } from '@/types/database.types';

type Internship = Database['public']['Tables']['internships']['Row'];

interface Filters {
  search: string;
  categories: string[];
  duration: number | null;
  difficulty: string | null;
  sort: 'newest' | 'popular';
}

const DEFAULT_FILTERS: Filters = {
  search: '',
  categories: [],
  duration: null,
  difficulty: null,
  sort: 'newest',
};

function useInternships(filters: Filters) {
  const supabase = createClient();
  return useQuery({
    queryKey: ['internships', filters],
    queryFn: async () => {
      // DEBUG: We loosen the filter to see if ANYTHING comes back
      let query = supabase.from('internships').select('*');

      if (filters.search) {
        query = query.textSearch('title', filters.search, { type: 'websearch' });
      }
      if (filters.categories.length > 0) {
        query = query.in('category', filters.categories);
      }
      if (filters.duration) {
        query = query.eq('duration_weeks', filters.duration);
      }
      if (filters.difficulty) {
        query = query.eq('difficulty', filters.difficulty);
      }
      if (filters.sort === 'newest') {
        query = query.order('created_at', { ascending: false });
      } else {
        query = query.order('spots_filled', { ascending: false });
      }

      const { data, error } = await query.limit(30);
      
      if (error) {
        console.error('Supabase Query Error:', error);
        throw error;
      }
      
      return (data as Internship[]) || [];
    },
    staleTime: 1000, 
    retry: false,
  });
}

export default function InternshipsPage() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    if (mobileFiltersOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileFiltersOpen]);
  const [searchInput, setSearchInput] = useState('');
  const { data: internships = [], isLoading, error } = useInternships(filters);

  const updateFilter = useCallback(<K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const toggleCategory = useCallback((cat: string) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter((c) => c !== cat)
        : [...prev.categories, cat],
    }));
  }, []);

  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setSearchInput('');
  };

  const activeFilterCount = [
    filters.categories.length > 0,
    filters.duration !== null,
    filters.difficulty !== null,
  ].filter(Boolean).length;

  // Debounced search
  const handleSearchChange = (val: string) => {
    setSearchInput(val);
    clearTimeout((window as unknown as { _searchTimer?: number })._searchTimer);
    (window as unknown as { _searchTimer?: number })._searchTimer = window.setTimeout(() => {
      updateFilter('search', val);
    }, 400);
  };

  const FilterContent = () => (
    <div className="space-y-10">
      {/* Sort */}
      <div>
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-5">Sort Results</h3>
        <div className="space-y-3">
          {[{ value: 'newest', label: 'Recently Added' }, { value: 'popular', label: 'Highest Demand' }].map((opt) => (
            <label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
              <div className={cn(
                "flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all",
                filters.sort === opt.value ? "border-primary-500 bg-primary-500" : "border-gray-200 group-hover:border-gray-300"
              )}>
                {filters.sort === opt.value && <div className="h-2 w-2 rounded-full bg-white shadow-sm" />}
              </div>
              <input
                type="radio"
                name="sort"
                value={opt.value}
                checked={filters.sort === opt.value}
                onChange={() => updateFilter('sort', opt.value as Filters['sort'])}
                className="sr-only"
              />
              <span className={cn("text-xs font-bold transition-colors", filters.sort === opt.value ? "text-primary-900" : "text-gray-500 group-hover:text-gray-900")}>
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Category */}
      <div>
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-5">Categories</h3>
        <div className="space-y-3">
          {INTERNSHIP_CATEGORIES.map((cat) => (
            <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
              <div className={cn(
                "flex h-5 w-5 items-center justify-center rounded-md border-2 transition-all",
                filters.categories.includes(cat.id) ? "border-primary-500 bg-primary-500" : "border-gray-200 group-hover:border-gray-300"
              )}>
                {filters.categories.includes(cat.id) && (
                  <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <input
                type="checkbox"
                checked={filters.categories.includes(cat.id)}
                onChange={() => toggleCategory(cat.id)}
                className="sr-only"
              />
              <span className={cn("text-xs font-bold transition-colors", filters.categories.includes(cat.id) ? "text-primary-900" : "text-gray-500 group-hover:text-gray-900")}>
                {cat.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Difficulty */}
      <div>
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-5">Experience Level</h3>
        <div className="flex flex-wrap gap-2">
          {DIFFICULTY_OPTIONS.map((d) => (
            <button
              key={d.value}
              onClick={() => updateFilter('difficulty', filters.difficulty === d.value ? null : d.value)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all",
                filters.difficulty === d.value
                  ? "bg-primary-500 border-primary-500 text-white shadow-md shadow-primary-500/20"
                  : "bg-white border-gray-100 text-gray-500 hover:border-gray-200 hover:text-gray-900"
              )}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {activeFilterCount > 0 && (
        <button 
          onClick={clearFilters} 
          className="w-full mt-4 flex items-center justify-center gap-2 py-3 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 rounded-xl transition-all active:scale-95"
        >
          <X className="h-3 w-3" /> Reset Preferences
        </button>
      )}
    </div>
  );

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="gradient-hero py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        
        <div className="container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 mb-4 text-primary-300 font-black text-[10px] uppercase tracking-[0.3em]"
          >
            <Sparkles className="h-3 w-3" /> Career Exploration
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-instrument-serif text-5xl md:text-7xl text-white mb-4 tracking-tight"
          >
            Browse <span className="italic opacity-80">Internships</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-blue-200/80 text-lg mb-10 font-medium max-w-2xl mx-auto"
          >
            Find the perfect remote track, master industry tools, and earn a verified certificate from Pakistan's leading career hub.
          </motion.p>
          
          {/* Search */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mx-auto max-w-2xl relative"
          >
            <div className="group relative">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary-500 to-accent-500 opacity-20 blur transition duration-1000 group-hover:opacity-40" />
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search by role, skill or category..."
                  className="w-full rounded-2xl border-0 py-5 pl-14 pr-6 text-sm shadow-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white/95 backdrop-blur-sm"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container py-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden w-60 shrink-0 lg:block">
            <div className="card p-5 sticky top-24">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4" /> Filters
                  {activeFilterCount > 0 && (
                    <span className="badge bg-primary-500 text-white">{activeFilterCount}</span>
                  )}
                </h2>
              </div>
              <FilterContent />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile filter bar */}
            <div className="flex items-center justify-between mb-6 lg:hidden">
              <p className="text-sm text-gray-600">{internships.length} internships found</p>
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="flex items-center gap-2 btn-secondary text-sm"
              >
                <Filter className="h-4 w-4" />
                Filters
                {activeFilterCount > 0 && <span className="badge bg-primary-500 text-white">{activeFilterCount}</span>}
              </button>
            </div>

            {/* Results count */}
            <p className="hidden lg:block text-sm text-gray-500 mb-6">
              Showing <span className="font-semibold text-gray-900">{internships.length}</span> internships
              {filters.search && <> matching "<em>{filters.search}</em>"</>}
            </p>

            {/* Grid */}
            {error ? (
              <div className="p-6 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-sm">
                 <p className="font-bold mb-1">Database Error:</p>
                 <p>{(error as any).message || 'Failed to fetch internships. Please check your Supabase connection and RLS policies.'}</p>
              </div>
            ) : isLoading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="card animate-pulse">
                    <div className="h-40 bg-gray-200 rounded-t-xl" />
                    <div className="p-5 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-100 rounded w-1/2" />
                      <div className="h-8 bg-gray-100 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : internships.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No internships found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters or search query.</p>
                <button onClick={clearFilters} className="btn-secondary">Clear All Filters</button>
              </div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
              >
                <AnimatePresence>
                  {internships.map((internship) => (
                    <motion.div
                      key={internship.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <InternshipCard internship={internship} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed right-0 top-0 z-50 h-full w-80 overflow-y-auto bg-white p-6 shadow-xl lg:hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-gray-900">Filters</h2>
                <button onClick={() => setMobileFiltersOpen(false)} className="p-1 rounded-lg hover:bg-gray-100">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <FilterContent />
              <button onClick={() => setMobileFiltersOpen(false)} className="mt-6 w-full btn-primary">
                Apply Filters
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
