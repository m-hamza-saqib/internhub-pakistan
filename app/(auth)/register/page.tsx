'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, AlertCircle, User, Mail, Lock, AtSign, Sparkles } from 'lucide-react';
import { registerSchema, type RegisterInput } from '@/lib/validations/schemas';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import Logo from '@/components/layout/Logo';

export default function RegisterPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const supabase = createClient();

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    setLoading(true);
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { full_name: data.full_name, username: data.username },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    if (authData.user) {
      // Create profile record (redundancy check happens in DB triggers too, but this is explicit)
      await (supabase.from('profiles') as any).insert({
        id: authData.user.id,
        email: data.email,
        full_name: data.full_name,
        username: data.username,
        role: 'intern',
        profile_completeness: 10,
        skills: [],
        is_suspended: false,
        country: 'Pakistan',
      });
    }

    setLoading(false);
    toast.success('Account created! Please check your email to verify.');
    router.push('/login');
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) toast.error(error.message);
    setGoogleLoading(false);
  };

  return (
    <div className="w-full max-w-lg relative">
      {/* Decorative Background Glows */}
      <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-primary-500/10 blur-[120px]" />
      <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-secondary-500/10 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="card p-6 sm:p-10 md:p-12 shadow-premium relative overflow-hidden bg-white/90 backdrop-blur-xl border-white/50"
      >
        <div className="relative z-10 flex flex-col items-center text-center mb-10">
          <Link href="/" className="mb-8 transition-transform hover:scale-105 active:scale-95">
            <Logo className="scale-125" />
          </Link>
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 text-[10px] font-black text-primary-600 uppercase tracking-[0.2em] mb-4">
             <Sparkles className="h-3.5 w-3.5" /> Direct Enrollment
          </div>
          <h1 className="font-instrument-serif text-4xl text-gray-900 tracking-tight">
            Create Your <span className="italic opacity-80">Pathway</span>
          </h1>
          <p className="text-sm font-medium text-gray-500 mt-2">Join AHWTECHNOLOGIES and launch your remote career</p>
        </div>

        {/* Google OAuth */}
        <button
          onClick={handleGoogle}
          disabled={googleLoading}
          className="group relative w-full flex items-center justify-center gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-4 text-sm font-black text-gray-900 shadow-sm transition-all hover:bg-gray-50 hover:border-gray-200 hover:shadow-md active:scale-[0.98] disabled:opacity-50 mb-8"
        >
          {googleLoading ? <Loader2 className="h-5 w-5 animate-spin text-primary-500" /> : (
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          )}
          <span>Register with Google</span>
        </button>

        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100" /></div>
          <div className="relative flex justify-center text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]"><span className="bg-white/80 backdrop-blur-sm px-4">Standard Onboarding</span></div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          {/* Full Name */}
          <div className="md:col-span-2">
            <label htmlFor="full_name" className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Full Name</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 group-focus-within:text-primary-500 transition-colors" />
              <input id="full_name" type="text" {...register('full_name')} placeholder="Muhammad Bin Qasim" className={`w-full rounded-xl border border-gray-100 bg-gray-50/50 py-4 pl-12 pr-4 text-sm font-medium outline-none transition-all focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10 ${errors.full_name ? 'border-red-200 bg-red-50/30' : ''}`} />
            </div>
            {errors.full_name && <p className="text-[11px] font-bold text-red-500 mt-2 px-1">{errors.full_name.message}</p>}
          </div>

          {/* Username */}
          <div className="md:col-span-1">
            <label htmlFor="username" className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Username</label>
            <div className="relative group">
              <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 group-focus-within:text-primary-500 transition-colors" />
              <input id="username" type="text" {...register('username')} placeholder="qasim99" className={`w-full rounded-xl border border-gray-100 bg-gray-50/50 py-4 pl-12 pr-4 text-sm font-medium outline-none transition-all focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10 ${errors.username ? 'border-red-200 bg-red-50/30' : ''}`} />
            </div>
            {errors.username && <p className="text-[11px] font-bold text-red-500 mt-2 px-1">{errors.username.message}</p>}
          </div>

          {/* Email */}
          <div className="md:col-span-1">
            <label htmlFor="email" className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Email</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 group-focus-within:text-primary-500 transition-colors" />
              <input id="email" type="email" {...register('email')} placeholder="bin@example.com" className={`w-full rounded-xl border border-gray-100 bg-gray-50/50 py-4 pl-12 pr-4 text-sm font-medium outline-none transition-all focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10 ${errors.email ? 'border-red-200 bg-red-50/30' : ''}`} autoComplete="email" />
            </div>
            {errors.email && <p className="text-[11px] font-bold text-red-500 mt-2 px-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="md:col-span-2">
            <label htmlFor="password" className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Create Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 group-focus-within:text-primary-500 transition-colors" />
              <input
                id="password" type={showPass ? 'text' : 'password'}
                {...register('password')} placeholder="Minimum 8 characters"
                className={`w-full rounded-xl border border-gray-100 bg-gray-50/50 py-4 pl-12 pr-12 text-sm font-medium outline-none transition-all focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10 ${errors.password ? 'border-red-200 bg-red-50/30' : ''}`}
                autoComplete="new-password"
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600">
                {showPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && <p className="text-[11px] font-bold text-red-500 mt-2 px-1">{errors.password.message}</p>}
          </div>

          <div className="md:col-span-2 py-2">
            <p className="text-[10px] font-medium text-gray-400 leading-relaxed px-1">
              By joining, you agree to our{' '}
              <Link href="/terms" className="text-primary-500 font-bold hover:underline">Terms of Service</Link> and{' '}
              <Link href="/privacy" className="text-primary-500 font-bold hover:underline">Privacy Policy</Link>.
            </p>
          </div>

          <button type="submit" disabled={loading} className="btn-primary md:col-span-2 py-4 text-base shadow-xl shadow-primary-500/20 active:scale-[0.98]">
            {loading ? <><Loader2 className="h-5 w-5 animate-spin" /> Preparing Account...</> : 'Create Free Student Account'}
          </button>
        </form>

        <p className="text-center text-sm font-medium text-gray-500 mt-10">
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-primary-600 hover:text-primary-700 underline decoration-primary-200 underline-offset-4 hover:decoration-primary-500 transition-all">Sign in here</Link>
        </p>
      </motion.div>
    </div>
  );
}
