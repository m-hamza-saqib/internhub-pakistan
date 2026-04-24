'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, AlertCircle, Mail, Lock, Sparkles } from 'lucide-react';
import { loginSchema, type LoginInput } from '@/lib/validations/schemas';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import Logo from '@/components/layout/Logo';

export default function LoginPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const supabase = createClient();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    setLoading(false);
    if (error) {
      toast.error(error.message === 'Invalid login credentials' ? 'Invalid email or password.' : error.message);
      return;
    }
    toast.success('Welcome back!');
    router.push('/dashboard');
    router.refresh();
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) toast.error(error.message);
    setGoogleLoading(false);
  };

  return (
    <div className="w-full max-w-md relative">
      {/* Decorative Background Glows */}
      <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-primary-500/10 blur-[100px]" />
      <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-secondary-500/10 blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="card p-10 md:p-12 shadow-premium relative overflow-hidden bg-white/90 backdrop-blur-xl border-white/50"
      >
        <div className="relative z-10 flex flex-col items-center text-center mb-10">
          <Link href="/" className="mb-8 transition-transform hover:scale-105 active:scale-95">
            <Logo className="scale-125" />
          </Link>
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 text-[10px] font-black text-primary-600 uppercase tracking-[0.2em] mb-4">
             <Sparkles className="h-3.5 w-3.5" /> Secure Access
          </div>
          <h1 className="font-instrument-serif text-4xl text-gray-900 tracking-tight">
            Welcome <span className="italic opacity-80">Back</span>
          </h1>
          <p className="text-sm font-medium text-gray-500 mt-2">Resume your journey at AHWTECHNOLOGIES</p>
        </div>

        {/* Google OAuth */}
        <button
          onClick={handleGoogleLogin}
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
          <span>Continue with Google</span>
        </button>

        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100" /></div>
          <div className="relative flex justify-center text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]"><span className="bg-white/80 backdrop-blur-sm px-4">Standard Gateway</span></div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 group-focus-within:text-primary-500 transition-colors" />
              <input
                id="email"
                type="email"
                {...register('email')}
                placeholder="you@email.com"
                className={`w-full rounded-xl border border-gray-100 bg-gray-50/50 py-4 pl-12 pr-4 text-sm font-medium outline-none ring-primary-500/10 transition-all focus:border-primary-500 focus:bg-white focus:ring-4 ${errors.email ? 'border-red-200 bg-red-50/30' : ''}`}
                autoComplete="email"
              />
            </div>
            {errors.email && <p className="text-[11px] font-bold text-red-500 mt-2 px-1 flex items-center gap-1.5"><AlertCircle className="h-3.5 w-3.5"/>{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-2 px-1">
              <label htmlFor="password" className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Password</label>
              <Link href="/forgot-password" className="text-[11px] font-bold text-primary-500 hover:text-primary-600">RESET PASSWORD</Link>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 group-focus-within:text-primary-500 transition-colors" />
              <input
                id="password"
                type={showPass ? 'text' : 'password'}
                {...register('password')}
                placeholder="Your secret passphrase"
                className={`w-full rounded-xl border border-gray-100 bg-gray-50/50 py-4 pl-12 pr-12 text-sm font-medium outline-none ring-primary-500/10 transition-all focus:border-primary-500 focus:bg-white focus:ring-4 ${errors.password ? 'border-red-200 bg-red-50/30' : ''}`}
                autoComplete="current-password"
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600 transition-colors">
                {showPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && <p className="text-[11px] font-bold text-red-500 mt-2 px-1 flex items-center gap-1.5"><AlertCircle className="h-3.5 w-3.5"/>{errors.password.message}</p>}
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-base shadow-xl shadow-primary-500/20 active:scale-[0.98]">
            {loading ? <><Loader2 className="h-5 w-5 animate-spin" /> Verifying Credentials...</> : 'Sign In To Account'}
          </button>
        </form>

        <p className="text-center text-sm font-medium text-gray-500 mt-10">
          New here?{' '}
          <Link href="/register" className="font-bold text-primary-600 hover:text-primary-700 underline decoration-primary-200 underline-offset-4 hover:decoration-primary-500 transition-all">Create an account</Link>
        </p>
      </motion.div>
    </div>
  );
}
