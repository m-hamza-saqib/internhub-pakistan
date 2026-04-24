'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, CheckCircle2, AlertCircle, Save, User as UserIcon, Book, Briefcase, Link as LinkIcon } from 'lucide-react';
import { profileSchema, type ProfileInput } from '@/lib/validations/schemas';
import { createClient } from '@/lib/supabase/client';
import { PAKISTANI_CITIES } from '@/lib/constants';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

export default function ProfileForm({ initialData }: { initialData: any }) {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: initialData?.full_name || '',
      university: initialData?.university || '',
      city: initialData?.city || '',
      degree_title: initialData?.degree_title || '',
      current_semester: initialData?.current_semester?.toString() || '',
      skills: initialData?.skills || [],
      bio: initialData?.bio || '',
      github_url: initialData?.github_url || '',
      linkedin_url: initialData?.linkedin_url || '',
      phone: initialData?.phone || '',
      cnic: initialData?.cnic || '',
    },
  });

  const watchedFields = watch();

  // Simple completeness calculation
  const calculateCompleteness = (data: any) => {
    const fields = [
      'full_name', 'university', 'city', 'degree_title', 
      'current_semester', 'bio', 'phone', 'cnic'
    ];
    let score = 10; // Base score for registration
    fields.forEach(f => { if (data[f]) score += 10; });
    if (data.skills?.length > 0) score += 5;
    if (data.github_url || data.linkedin_url) score += 5;
    return Math.min(score, 100);
  };

  const completeness = calculateCompleteness(watchedFields);

  const onSubmit = async (data: ProfileInput) => {
    setLoading(true);
    const newCompleteness = calculateCompleteness(data);
    
    const { error } = await supabase
      .from('profiles')
      .update({
        ...data,
        current_semester: data.current_semester ? parseInt(data.current_semester) : null,
        profile_completeness: newCompleteness,
        updated_at: new Date().toISOString(),
      })
      .eq('id', initialData.id);

    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Profile updated successfully!');
      window.location.reload();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Progress Header */}
      <div className={cn(
        "card p-6 border-l-4",
        completeness >= 70 ? "border-l-green-500" : "border-l-yellow-500"
      )}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Profile Completeness</h2>
            <p className="text-sm text-gray-500">
              {completeness >= 70 
                ? "You're ready to apply for internships!" 
                : "Complete your profile to at least 70% to apply."}
            </p>
          </div>
          <span className="text-3xl font-black text-gray-900">{completeness}%</span>
        </div>
        <div className="h-3 rounded-full bg-gray-100">
          <div 
            className={cn(
              "h-3 rounded-full transition-all duration-500",
              completeness >= 70 ? "bg-green-500" : "bg-yellow-500"
            )}
            style={{ width: `${completeness}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Info */}
        <section className="card p-6 space-y-4">
          <h3 className="flex items-center gap-2 font-bold text-gray-900 mb-2">
            <UserIcon className="h-4 w-4 text-primary-500" /> Personal Information
          </h3>
          
          <div>
            <label className="label">Full Name <span className="text-red-500">*</span></label>
            <input {...register('full_name')} className="input" />
            {errors.full_name && <p className="text-xs text-red-500 mt-1">{errors.full_name.message}</p>}
          </div>

          <div>
            <label className="label">CNIC <span className="text-red-500">*</span></label>
            <input {...register('cnic')} placeholder="42101-XXXXXXX-X" className="input" />
            {errors.cnic && <p className="text-xs text-red-500 mt-1">{errors.cnic.message}</p>}
            <p className="text-[10px] text-gray-400 mt-1">Required for certificate verification</p>
          </div>

          <div>
            <label className="label">WhatsApp/Phone <span className="text-red-500">*</span></label>
            <input {...register('phone')} placeholder="03XXXXXXXXX" className="input" />
            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
          </div>

          <div>
            <label className="label">City <span className="text-red-500">*</span></label>
            <select {...register('city')} className="input">
              <option value="">Select City</option>
              {PAKISTANI_CITIES.map(city => <option key={city} value={city}>{city}</option>)}
            </select>
          </div>
        </section>

        {/* Education Info */}
        <section className="card p-6 space-y-4">
          <h3 className="flex items-center gap-2 font-bold text-gray-900 mb-2">
            <Book className="h-4 w-4 text-primary-500" /> Education
          </h3>
          
          <div>
            <label className="label">University <span className="text-red-500">*</span></label>
            <input {...register('university')} placeholder="e.g. NUST, UET, FAST" className="input" />
            {errors.university && <p className="text-xs text-red-500 mt-1">{errors.university.message}</p>}
          </div>

          <div>
            <label className="label">Degree Title <span className="text-red-500">*</span></label>
            <input {...register('degree_title')} placeholder="e.g. BS Computer Science" className="input" />
          </div>

          <div>
            <label className="label">Current Semester <span className="text-red-500">*</span></label>
            <select {...register('current_semester')} className="input">
              <option value="">Select Semester</option>
              {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>{s}</option>)}
              <option value="9">Graduated</option>
            </select>
          </div>
        </section>

        {/* About & Skills */}
        <section className="card p-6 space-y-4 md:col-span-2">
          <h3 className="flex items-center gap-2 font-bold text-gray-900 mb-2">
            <Briefcase className="h-4 w-4 text-primary-500" /> Professional Bio & Skills
          </h3>
          
          <div>
            <label className="label">Short Bio <span className="text-red-500">*</span></label>
            <textarea 
              {...register('bio')} 
              rows={4} 
              placeholder="Tell us about yourself, your interests and your career goals..."
              className="input resize-none" 
            />
            {errors.bio && <p className="text-xs text-red-500 mt-1">{errors.bio.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label flex items-center gap-2">
                <LinkIcon className="h-3 w-3" /> GitHub Profile
              </label>
              <input {...register('github_url')} placeholder="https://github.com/..." className="input" />
            </div>
            <div>
              <label className="label flex items-center gap-2">
                <LinkIcon className="h-3 w-3" /> LinkedIn Profile
              </label>
              <input {...register('linkedin_url')} placeholder="https://linkedin.com/in/..." className="input" />
            </div>
          </div>
        </section>
      </div>

      <div className="flex justify-end pt-4">
        <button 
          type="submit" 
          disabled={loading || !isDirty} 
          className="btn-primary px-10 py-3"
        >
          {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : <><Save className="h-4 w-4" /> Save Profile</>}
        </button>
      </div>
    </form>
  );
}
