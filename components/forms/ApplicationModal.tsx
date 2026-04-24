'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { X, Send, Loader2, AlertCircle } from 'lucide-react';
import { applicationSchema, type ApplicationInput } from '@/lib/validations/schemas';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

interface Props {
  internshipId: string;
  internshipTitle: string;
  onClose: () => void;
}

export default function ApplicationModal({ internshipId, internshipTitle, onClose }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<ApplicationInput>({
    resolver: zodResolver(applicationSchema),
    defaultValues: { internship_id: internshipId, hours_per_week: 20 },
  });

  const motivationLength = watch('motivation_letter')?.length || 0;

  const onSubmit = async (data: ApplicationInput) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error?.message || 'Failed to submit application.');
        return;
      }

      toast.success('Application submitted! Redirecting to enrollment fee page...');
      setTimeout(() => {
        window.location.href = `/enroll?internship=${encodeURIComponent(internshipTitle)}`;
      }, 1500);
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/50"
      />
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30 }}
        className="relative w-full max-w-xl rounded-2xl bg-white shadow-modal overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="text-base font-bold text-gray-900">Apply for Internship</h2>
            <p className="text-xs text-gray-500 mt-0.5">{internshipTitle}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">
          <input type="hidden" {...register('internship_id')} />

          {/* Motivation Letter */}
          <div>
            <label htmlFor="motivation_letter" className="label">
              Motivation Letter <span className="text-red-500">*</span>
            </label>
            <textarea
              id="motivation_letter"
              {...register('motivation_letter')}
              rows={6}
              placeholder="Tell us why you're interested in this internship, what you hope to learn, and what makes you a good fit (300–2000 characters)..."
              className={`input resize-none ${errors.motivation_letter ? 'border-red-400' : ''}`}
            />
            <div className="flex justify-between mt-1">
              {errors.motivation_letter && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />{errors.motivation_letter.message}
                </p>
              )}
              <p className={`text-xs ml-auto ${motivationLength < 300 ? 'text-red-400' : 'text-gray-400'}`}>
                {motivationLength}/2000
              </p>
            </div>
          </div>

          {/* Relevant Experience */}
          <div>
            <label htmlFor="relevant_experience" className="label">
              Relevant Experience <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              id="relevant_experience"
              {...register('relevant_experience')}
              rows={3}
              placeholder="Any relevant projects, coursework, or experience..."
              className="input resize-none"
            />
          </div>

          {/* Hours per Week */}
          <div>
            <label htmlFor="hours_per_week" className="label">
              Available Hours per Week <span className="text-red-500">*</span>
            </label>
            <input
              id="hours_per_week"
              type="number"
              min={5}
              max={40}
              {...register('hours_per_week', { valueAsNumber: true })}
              className={`input ${errors.hours_per_week ? 'border-red-400' : ''}`}
            />
            {errors.hours_per_week && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />{errors.hours_per_week.message}
              </p>
            )}
          </div>

          {/* LinkedIn */}
          <div>
            <label htmlFor="linkedin_url" className="label">
              LinkedIn Profile <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              id="linkedin_url"
              type="url"
              {...register('linkedin_url')}
              placeholder="https://linkedin.com/in/yourname"
              className="input"
            />
          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
          <button onClick={onClose} type="button" className="btn-ghost" disabled={isSubmitting}>Cancel</button>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="btn-primary"
          >
            {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</> : <><Send className="h-4 w-4" /> Submit Application</>}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
