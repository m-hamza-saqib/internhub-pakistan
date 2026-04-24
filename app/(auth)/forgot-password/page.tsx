'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Mail, Loader2, AlertCircle, ArrowLeft, CheckCircle } from 'lucide-react';
import { forgotPasswordSchema } from '@/lib/validations/schemas';
import { createClient } from '@/lib/supabase/client';
import { z } from 'zod';

type ForgotInput = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const { register, handleSubmit, getValues, formState: { errors } } = useForm<ForgotInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotInput) => {
    setLoading(true);
    await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    setLoading(false);
    setSent(true);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
      <div className="card p-8">
        {sent ? (
          <div className="text-center py-4">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-7 w-7 text-green-600" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Check your email</h1>
            <p className="text-sm text-gray-500 mb-6">
              We've sent a password reset link to <strong>{getValues('email')}</strong>. Check your inbox (and spam folder).
            </p>
            <Link href="/login" className="btn-primary w-full text-center">Back to Login</Link>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-500 mb-6">
                <ArrowLeft className="h-4 w-4" /> Back to login
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Reset password</h1>
              <p className="text-sm text-gray-500 mt-1">Enter your email and we'll send you a reset link.</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="email" className="label">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input id="email" type="email" {...register('email')} placeholder="you@example.com" className={`input pl-10 ${errors.email ? 'border-red-400' : ''}`} />
                </div>
                {errors.email && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3"/>{errors.email.message}</p>}
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-3">
                {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</> : 'Send Reset Link'}
              </button>
            </form>
          </>
        )}
      </div>
    </motion.div>
  );
}
