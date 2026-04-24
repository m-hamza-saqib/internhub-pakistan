'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Copy, Upload, Loader2, AlertCircle, Banknote, Phone, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

const PAYMENT_ACCOUNTS = [
  {
    method: 'EasyPaisa',
    icon: '📱',
    color: 'from-green-500 to-emerald-600',
    border: 'border-green-200',
    bg: 'bg-green-50',
    number: '0300-0000000',
    name: 'AHWTECHNOLOGIES',
  },
  {
    method: 'JazzCash',
    icon: '🔴',
    color: 'from-red-500 to-rose-600',
    border: 'border-red-200',
    bg: 'bg-red-50',
    number: '0300-0000001',
    name: 'AHWTECHNOLOGIES',
  },
  {
    method: 'Bank Transfer',
    icon: '🏦',
    color: 'from-blue-500 to-indigo-600',
    border: 'border-blue-200',
    bg: 'bg-blue-50',
    number: 'PK000000000000000000',
    name: 'AHWTECHNOLOGIES — HBL / Meezan Bank',
  },
];

export default function EnrollPage() {
  const [step, setStep] = useState<'instructions' | 'proof' | 'submitted'>('instructions');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    transactionId: '',
    internship: '',
    method: '',
  });
  const [screenshot, setScreenshot] = useState<File | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!screenshot) { toast.error('Please upload your payment screenshot.'); return; }
    if (!form.transactionId.trim()) { toast.error('Please enter your Transaction ID.'); return; }
    if (!form.method) { toast.error('Please select your payment method.'); return; }

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('fullName', form.fullName);
      fd.append('email', form.email);
      fd.append('transactionId', form.transactionId);
      fd.append('internship', form.internship);
      fd.append('method', form.method);
      fd.append('screenshot', screenshot);

      const res = await fetch('/api/payment/submit-proof', { method: 'POST', body: fd });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Submission failed');

      setStep('submitted');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (step === 'submitted') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center"
        >
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Proof Submitted! 🎉</h1>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            Your payment proof has been submitted. Our admin team will review it within <strong>24–48 hours</strong>. Once approved, your dashboard access will be activated automatically.
          </p>
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 mb-6 text-left">
            <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-1">Your Status</p>
            <p className="text-sm text-amber-800">⏳ Pending Admin Approval</p>
          </div>
          <p className="text-xs text-gray-400">
            Questions? Email us at{' '}
            <a href="mailto:support@ahwtechnologies.com" className="text-primary-500 hover:underline">
              support@ahwtechnologies.com
            </a>
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
      {/* Header */}
      <div className="border-b border-white/10 bg-white/5 backdrop-blur-sm px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary-500 flex items-center justify-center">
              <span className="text-xs font-bold text-white">AHW</span>
            </div>
            <span className="text-sm font-bold text-white">AHWTECHNOLOGIES</span>
          </Link>
          <span className="text-xs text-white/40">One-Time Community Fee</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 space-y-10">
        {/* Hero */}
        <div className="text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary-500/20 text-primary-300 text-xs font-bold uppercase tracking-widest mb-4 border border-primary-500/30">
              One-Time · Forever Access
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
              Pay Once, Access Forever
            </h1>
            <p className="text-lg text-white/60 max-w-xl mx-auto leading-relaxed">
              A one-time <span className="text-white font-bold">PKR 300</span> community fee gives you lifetime dashboard access, all internship projects, and your verified certificate — completely free after that.
            </p>
          </motion.div>
        </div>

        {/* Value Props */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: '🚀', title: 'Lifetime Dashboard', desc: 'Never lose access. Log in anytime, forever.' },
            { icon: '📋', title: 'Real Projects', desc: 'Industry-grade weekly projects with admin feedback.' },
            { icon: '🎓', title: 'Free Certificate', desc: 'Verified certificate issued at no extra cost after graduation.' },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl bg-white/5 border border-white/10 p-5 text-center backdrop-blur-sm">
              <div className="text-3xl mb-3">{item.icon}</div>
              <div className="text-sm font-bold text-white mb-1">{item.title}</div>
              <div className="text-xs text-white/50">{item.desc}</div>
            </div>
          ))}
        </div>

        {step === 'instructions' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Amount Banner */}
            <div className="rounded-2xl bg-gradient-to-r from-primary-600 to-indigo-600 p-6 flex items-center justify-between shadow-xl shadow-primary-900/40">
              <div>
                <p className="text-primary-200 text-sm font-semibold">Community Fee (One-Time)</p>
                <p className="text-4xl font-black text-white mt-1">PKR 300</p>
                <p className="text-primary-200 text-xs mt-1">No hidden charges. No recurring fees. Ever.</p>
              </div>
              <Banknote className="h-16 w-16 text-white/20" />
            </div>

            {/* Payment Methods */}
            <div>
              <h2 className="text-lg font-bold text-white mb-4">Choose Your Payment Method</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {PAYMENT_ACCOUNTS.map((acc) => (
                  <div key={acc.method} className={`rounded-2xl border ${acc.border} ${acc.bg} bg-opacity-10 p-5`}>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">{acc.icon}</span>
                      <span className="font-bold text-gray-900">{acc.method}</span>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Account Number</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="font-mono font-bold text-gray-900 text-sm">{acc.number}</p>
                          <button
                            onClick={() => copyToClipboard(acc.number)}
                            className="text-gray-400 hover:text-gray-700 transition-colors"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Account Name</p>
                        <p className="text-xs text-gray-700 font-medium mt-1">{acc.name}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Steps */}
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
              <h3 className="text-white font-bold mb-4">How to Complete Enrollment</h3>
              <ol className="space-y-3">
                {[
                  'Send PKR 300 to any of the accounts above',
                  'Take a clear screenshot of the payment confirmation',
                  'Click "Submit Payment Proof" below',
                  'Fill in your details and upload the screenshot',
                  'Our admin will approve within 24–48 hours',
                  'You\'ll get instant dashboard access once approved!',
                ].map((s, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-white/70">
                    <span className="flex-shrink-0 h-5 w-5 rounded-full bg-primary-500/30 text-primary-300 text-[10px] font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                    {s}
                  </li>
                ))}
              </ol>
            </div>

            <button
              onClick={() => setStep('proof')}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary-500 to-indigo-600 text-white font-bold text-lg shadow-xl shadow-primary-900/40 hover:shadow-primary-900/60 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              I've Paid — Submit Proof →
            </button>
          </motion.div>
        )}

        {step === 'proof' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-2xl p-8 space-y-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Submit Payment Proof</h2>
                <p className="text-sm text-gray-500 mt-1">Fill in your details and upload the screenshot.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label">Full Name *</label>
                  <input
                    required
                    type="text"
                    className="input"
                    placeholder="Muhammad Ali Khan"
                    value={form.fullName}
                    onChange={e => setForm({ ...form, fullName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label">Email Address *</label>
                  <input
                    required
                    type="email"
                    className="input"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label">Internship You're Applying For *</label>
                  <input
                    required
                    type="text"
                    className="input"
                    placeholder="e.g. Full Stack Web Development"
                    value={form.internship}
                    onChange={e => setForm({ ...form, internship: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label">Payment Method *</label>
                  <select
                    required
                    className="input"
                    value={form.method}
                    onChange={e => setForm({ ...form, method: e.target.value })}
                  >
                    <option value="">Select method...</option>
                    <option value="easypaisa">EasyPaisa</option>
                    <option value="jazzcash">JazzCash</option>
                    <option value="bank_transfer">Bank Transfer</option>
                  </select>
                </div>
                <div>
                  <label className="label">Transaction ID / Reference Number *</label>
                  <input
                    required
                    type="text"
                    className="input"
                    placeholder="e.g. TXN123456789"
                    value={form.transactionId}
                    onChange={e => setForm({ ...form, transactionId: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label">Payment Screenshot *</label>
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-primary-400 transition-colors"
                    onClick={() => document.getElementById('screenshot-upload')?.click()}
                  >
                    {screenshot ? (
                      <div className="text-green-600 font-semibold text-sm flex items-center justify-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        {screenshot.name}
                      </div>
                    ) : (
                      <div className="text-gray-400">
                        <Upload className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm font-medium">Click to upload screenshot</p>
                        <p className="text-xs mt-1">PNG, JPG, JPEG up to 5MB</p>
                      </div>
                    )}
                    <input
                      id="screenshot-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => setScreenshot(e.target.files?.[0] || null)}
                    />
                  </div>
                </div>

                <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 flex gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-amber-700">
                    Make sure the screenshot clearly shows the transaction amount (PKR 300), date, and reference number.
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setStep('instructions')} className="btn-ghost flex-1">
                    ← Back
                  </button>
                  <button type="submit" disabled={submitting} className="btn-primary flex-1 flex items-center justify-center gap-2">
                    {submitting ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</>
                    ) : (
                      'Submit Proof'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
