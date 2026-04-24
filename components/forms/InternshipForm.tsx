'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Plus, Trash2, Save, Info, Link as LinkIcon } from 'lucide-react';
import { internshipSchema, type InternshipInput } from '@/lib/validations/schemas';
import { INTERNSHIP_CATEGORIES, DURATION_OPTIONS, DIFFICULTY_OPTIONS } from '@/lib/constants';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { slugify } from '@/lib/utils';

export default function InternshipForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<InternshipInput>({
    resolver: zodResolver(internshipSchema),
    defaultValues: initialData || {
      title: '',
      category: '',
      description: '',
      requirements: '',
      what_you_learn: '',
      duration_weeks: 4,
      difficulty: 'beginner',
      spots_total: 50,
      projects: [{ title: '', description: '', week_number: 1, resources_url: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'projects',
  });

  const onSubmit = async (data: InternshipInput) => {
    setLoading(true);
    const slug = slugify(data.title);

    try {
      if (initialData?.id) {
        // 1. Update Internship
        const { error: intError } = await (supabase.from('internships') as any)
          .update({
            title: data.title,
            slug,
            category: data.category,
            description: data.description,
            requirements: data.requirements,
            what_you_learn: data.what_you_learn,
            duration_weeks: data.duration_weeks,
            difficulty: data.difficulty,
            spots_total: data.spots_total,
            is_published: initialData.is_published ?? true,
          })
          .eq('id', initialData.id);

        if (intError) throw intError;

        // 2. Reconcile Projects (Delete old, Insert new for simplicity in this MVP)
        // In a production app, we'd do a more complex diffing/upserting
        const { error: delError } = await (supabase.from('internship_projects') as any)
          .delete()
          .eq('internship_id', initialData.id);

        if (delError) throw delError;

        const projectsToInsert = data.projects.map((p, i) => ({
          internship_id: initialData.id,
          title: p.title,
          description: p.description,
          week_number: p.week_number,
          resources_url: p.resources_url || null,
          order_index: i,
        }));

        const { error: projError } = await (supabase.from('internship_projects') as any)
          .insert(projectsToInsert);

        if (projError) throw projError;

        toast.success('Internship program updated successfully!');
      } else {
        // 1. Insert Internship
        const { data: internship, error: intError } = await (supabase.from('internships') as any)
          .insert({
            title: data.title,
            slug,
            category: data.category,
            description: data.description,
            requirements: data.requirements,
            what_you_learn: data.what_you_learn,
            duration_weeks: data.duration_weeks,
            difficulty: data.difficulty,
            spots_total: data.spots_total,
            is_published: true,
          })
          .select()
          .single();

        if (intError) throw intError;

        // 2. Insert Projects
        const projectsToInsert = data.projects.map((p, i) => ({
          internship_id: (internship as any).id,
          title: p.title,
          description: p.description,
          week_number: p.week_number,
          resources_url: p.resources_url || null,
          order_index: i,
        }));

        const { error: projError } = await (supabase.from('internship_projects') as any)
          .insert(projectsToInsert);

        if (projError) throw projError;

        toast.success('Internship program created successfully!');
      }
      router.push('/admin/internships');
      router.refresh();
    } catch (err: any) {
      console.error('Submission Error:', err);
      toast.error(err.message || 'An error occurred while saving.');
    } finally {
      setLoading(false);
    }
  };

  const onFormError = (err: any) => {
    console.warn('Form Validation Errors:', err);
    toast.error('Please fix the errors in the form before saving.');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onFormError)} className="space-y-8 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Basic Details */}
        <div className="lg:col-span-2 space-y-6">
          <section className="card p-6 space-y-4">
            <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-3 mb-4">Program Details</h3>
            
            <div>
              <label className="label">Internship Title <span className="text-red-500">*</span></label>
              <input {...register('title')} placeholder="e.g. Frontend Development (React.js)" className="input" />
              {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Category <span className="text-red-500">*</span></label>
                <select {...register('category')} className="input">
                  <option value="">Select Category</option>
                  {INTERNSHIP_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
                </select>
                {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category.message}</p>}
              </div>
              <div>
                <label className="label">Difficulty <span className="text-red-500">*</span></label>
                <select {...register('difficulty')} className="input">
                  {DIFFICULTY_OPTIONS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="label">Full Description <span className="text-red-500">*</span></label>
              <textarea {...register('description')} rows={6} className="input resize-none" />
              {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Requirements <span className="text-red-500">*</span></label>
                <textarea {...register('requirements')} rows={4} className="input resize-none" placeholder="Bullet points separated by new lines..." />
                {errors.requirements && <p className="text-xs text-red-500 mt-1">{errors.requirements.message}</p>}
              </div>
              <div>
                <label className="label">Learning Outcomes <span className="text-red-500">*</span></label>
                <textarea {...register('what_you_learn')} rows={4} className="input resize-none" placeholder="What will they learn?" />
                {errors.what_you_learn && <p className="text-xs text-red-500 mt-1">{errors.what_you_learn.message}</p>}
              </div>
            </div>
          </section>

          {/* Projects Section */}
          <section className="card p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-gray-900">Internship Projects</h3>
              <button 
                type="button" 
                onClick={() => append({ title: '', description: '', week_number: fields.length + 1, resources_url: '' })}
                className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" /> Add Project
              </button>
            </div>

            <div className="space-y-6">
              {fields.map((field, index) => (
                <div key={field.id} className="relative p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-primary-500 uppercase tracking-widest">
                      Project #{index + 1}
                    </span>
                    {index > 0 && (
                      <button 
                        type="button" 
                        onClick={() => remove(index)}
                        className="p-1.5 text-red-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    <div className="col-span-3">
                      <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Project Title</label>
                      <input {...register(`projects.${index}.title` as const)} className="input py-1.5 text-sm" />
                      {errors.projects?.[index]?.title && <p className="text-[10px] text-red-500 mt-1">{errors.projects[index]?.title?.message}</p>}
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Week</label>
                      <input type="number" {...register(`projects.${index}.week_number` as const, { valueAsNumber: true })} className="input py-1.5 text-sm" />
                       {errors.projects?.[index]?.week_number && <p className="text-[10px] text-red-500 mt-1">{errors.projects[index]?.week_number?.message}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Instructions / Description</label>
                    <textarea {...register(`projects.${index}.description` as const)} rows={2} className="input py-1.5 text-sm resize-none" />
                    {errors.projects?.[index]?.description && <p className="text-[10px] text-red-500 mt-1">{errors.projects[index]?.description?.message}</p>}
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block flex items-center gap-1">
                      <LinkIcon className="h-2.5 w-2.5" /> Resource URL (optional)
                    </label>
                    <input {...register(`projects.${index}.resources_url` as const)} className="input py-1.5 text-sm" placeholder="https://..." />
                    {errors.projects?.[index]?.resources_url && <p className="text-[10px] text-red-500 mt-1">{errors.projects[index]?.resources_url?.message}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Settings */}
        <div className="space-y-6">
          <section className="card p-6 space-y-4 sticky top-24">
            <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-3 mb-4">Settings</h3>
            
            <div>
              <label className="label">Enrollment Duration <span className="text-red-500">*</span></label>
              <select {...register('duration_weeks', { valueAsNumber: true })} className="input">
                {DURATION_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            <div>
              <label className="label">Total Slots <span className="text-red-500">*</span></label>
              <input type="number" {...register('spots_total', { valueAsNumber: true })} className="input" />
              <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                <Info className="h-2.5 w-2.5" /> Maximum number of students allowed to enroll.
              </p>
            </div>

            <div className="pt-4 space-y-3">
              <button 
                type="submit" 
                disabled={loading} 
                className="btn-primary w-full py-3"
              >
                {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : <><Save className="h-4 w-4" /> Save Program</>}
              </button>
              <button 
                type="button" 
                onClick={() => router.back()}
                className="btn-ghost w-full py-3 text-gray-500"
              >
                Cancel
              </button>
            </div>
          </section>
        </div>
      </div>
    </form>
  );
}
