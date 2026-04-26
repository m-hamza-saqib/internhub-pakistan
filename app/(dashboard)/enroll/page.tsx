'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Wallet, CheckCircle, Upload, ArrowLeft, ShieldCheck, Clock } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const PAYMENT_METHODS = [
  { id: 'easypaisa', label: 'Easypaisa', account: '0300-0000000', color: 'bg-green-50 border-green-200 text-green-800' },
  { id: 'jazzcash', label: 'JazzCash', account: '0300-0000000', color: 'bg-red-50 border-red-200 text-red-800' },
  { id: 'bank_transfer', label: 'Bank Transfer', account: 'HBL: 1234-5678-9012', color: 'bg-blue-50 border-blue-200 text-blue-800' },
];

export default function EnrollPage() {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState<'method' | 'details' | 'done'>('method');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [internshipTitle, setInternshipTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAcceptedApp = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      // Get accepted application to prefill internship title
      const { data: app } = await (supabase
        .from('applications') as any)
        .select('*, internships(title)')
        .eq('user_id', user.id)
        .eq('status', 'accepted')
        .order('applied_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!app) {
        toast.error('No accepted application found. Please apply first.');
        router.push('/internships');
        return;
      }

      // Check if already submitted proof
      const { data: existingProof } = await (supabase
        .from('payment_proofs') as any)
        .select('id, status')
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingProof) {
        router.push('/my-internship');
        return;
      }

      setInternshipTitle(app?.internships?.title || 'Selected Internship');
      setLoading(false);
    };
    fetchAcceptedApp();
  }, []);

  const handleSubmit = async () => {
    if (!transactionId.trim()) {
      toast.error('Please enter a transaction / reference ID.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/payments/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payment_method: selectedMethod,
          transaction_id: transactionId.trim(),
          screenshot_url: screenshotUrl.trim() || null,
          amount: 300,
          internship_applied: internshipTitle,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed');
      setStep('done');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
    </div>
  );

  if (step === 'done') return (
    <div className="max-w-lg mx-auto text-center py-20 px-4 space-y-6">
      <div className="h-24 w-24 bg-emerald-100 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/10">
        <CheckCircle className="h-12 w-12" />
      </div>
      <h1 className="text-3xl font-black text-gray-900">Payment Submitted!</h1>
      <p className="text-gray-500 leading-relaxed max-w-sm mx-auto">
        Your payment proof has been received. Our admin team will verify your transaction within <strong>24–48 hours</strong> and unlock your full dashboard.
      </p>
      <div className="card p-5 bg-amber-50/50 border-amber-100 text-left space-y-2">
        <p className="text-xs font-black text-amber-800 uppercase tracking-widest">What Happens Next</p>
        <div className="space-y-1.5 text-sm text-amber-900/70 font-medium">
          <p>● Admin verifies your transaction ID</p>
          <p>● Projects &amp; community access unlocks automatically</p>
          <p>● You'll receive an in-app notification</p>
        </div>
      </div>
      <Link href="/my-internship" className="btn-primary inline-flex w-full justify-center">
        <Clock className="h-4 w-4" /> Track Verification Status
      </Link>
    </div>
  );

  return (
    <div className="max-w-xl mx-auto space-y-6 py-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/my-internship" className="p-2 rounded-full bg-white border border-gray-200 text-gray-400 hover:text-gray-900 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-gray-900">One-Time Enrollment Fee</h1>
          <p className="text-sm text-gray-500 mt-0.5">PKR 300 community fee to unlock your full dashboard</p>
        </div>
      </div>

      {/* Security Note */}
      <div className="flex items-center gap-3 bg-primary-50 border border-primary-100 rounded-2xl p-4">
        <ShieldCheck className="h-5 w-5 text-primary-500 shrink-0" />
        <p className="text-xs font-medium text-primary-800">
          This is a one-time fee per internship track. It covers platform maintenance, project evaluation, and your industrial certificate upon completion.
        </p>
      </div>

      {step === 'method' && (
        <div className="card p-6 space-y-5">
          <h2 className="font-bold text-gray-900">Step 1 — Choose Payment Method</h2>
          <div className="space-y-3">
            {PAYMENT_METHODS.map((m) => (
              <button
                key={m.id}
                onClick={() => { setSelectedMethod(m.id); setStep('details'); }}
                className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 text-left transition-all hover:scale-[1.01] active:scale-[0.99] ${
                  selectedMethod === m.id ? 'border-primary-500 bg-primary-50' : 'border-gray-100 bg-gray-50/50 hover:border-gray-200'
                }`}
              >
                <div>
                  <p className="font-bold text-gray-900">{m.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Send to: <span className="font-mono font-bold text-gray-700">{m.account}</span></p>
                </div>
                <span className={`text-xs font-black px-2.5 py-1 rounded-lg border ${m.color}`}>
                  {m.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 'details' && (
        <div className="card p-6 space-y-5">
          <div className="flex items-center gap-3">
            <button onClick={() => setStep('method')} className="text-sm text-gray-400 hover:text-gray-700 transition-colors">← Back</button>
            <h2 className="font-bold text-gray-900">Step 2 — Submit Proof</h2>
          </div>

          {/* Selected method reminder */}
          <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Send PKR 300 to</p>
            {PAYMENT_METHODS.filter(m => m.id === selectedMethod).map(m => (
              <div key={m.id}>
                <p className="font-bold text-gray-900 text-lg">{m.label}</p>
                <p className="font-mono text-sm text-gray-600">{m.account}</p>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div>
              <label className="label">Transaction / Reference ID <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={transactionId}
                onChange={e => setTransactionId(e.target.value)}
                placeholder="e.g. TXN-12345678 or reference number"
                className="input font-mono"
              />
              <p className="text-xs text-gray-400 mt-1.5">Find this in your payment confirmation SMS or app receipt.</p>
            </div>

            <div>
              <label className="label flex items-center gap-1.5">
                <Upload className="h-3.5 w-3.5" /> Screenshot URL <span className="text-xs text-gray-400 font-normal">(optional but recommended)</span>
              </label>
              <input
                type="url"
                value={screenshotUrl}
                onChange={e => setScreenshotUrl(e.target.value)}
                placeholder="https://drive.google.com/... or any public image link"
                className="input"
              />
              <p className="text-xs text-gray-400 mt-1.5">Upload to Google Drive or ImgBB and paste the link here.</p>
            </div>

            <div>
              <label className="label">Internship Applied For</label>
              <input
                type="text"
                value={internshipTitle}
                readOnly
                className="input bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting || !transactionId.trim()}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {submitting ? (
              <><div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> Submitting...</>
            ) : (
              <><Wallet className="h-4 w-4" /> Submit Payment Proof</>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
