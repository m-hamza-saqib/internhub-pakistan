'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Clock, Eye, ExternalLink, Search } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function AdminPaymentProofsPage() {
  const [proofs, setProofs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selected, setSelected] = useState<any | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const supabase = createClient();

  const fetchProofs = async () => {
    const { data } = await (supabase.from('payment_proofs') as any)
      .select('*, profiles!payment_proofs_user_id_fkey(full_name, email, username)')
      .order('created_at', { ascending: false });
    setProofs(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchProofs(); }, []);

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    if (action === 'reject' && !rejectReason.trim()) {
      toast.error('Please enter a rejection reason.');
      return;
    }
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/payments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, rejection_reason: rejectReason }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(action === 'approve' ? '✅ Payment approved! User now has lifetime access.' : '❌ Payment rejected.');
      setSelected(null);
      setRejectReason('');
      fetchProofs();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const stats = {
    total: proofs.length,
    pending: proofs.filter(p => p.status === 'pending').length,
    approved: proofs.filter(p => p.status === 'approved').length,
    rejected: proofs.filter(p => p.status === 'rejected').length,
  };

  const statusBadge = (status: string) => {
    if (status === 'approved') return <span className="badge bg-green-100 text-green-700 text-xs">✓ Approved</span>;
    if (status === 'rejected') return <span className="badge bg-red-100 text-red-700 text-xs">✗ Rejected</span>;
    return <span className="badge bg-yellow-100 text-yellow-700 text-xs flex items-center gap-1"><Clock className="h-3 w-3" /> Pending</span>;
  };

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
    </div>
  );

  return (
    <div className="space-y-8 animate-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payment Proof Review</h1>
        <p className="text-sm text-gray-500 mt-1">Review PKR 300 community fee submissions and grant lifetime dashboard access</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: stats.total, color: 'bg-primary-50 text-primary-700 border-primary-100' },
          { label: 'Pending', value: stats.pending, color: 'bg-amber-50 text-amber-700 border-amber-100' },
          { label: 'Approved', value: stats.approved, color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
          { label: 'Rejected', value: stats.rejected, color: 'bg-rose-50 text-rose-700 border-rose-100' },
        ].map((s) => (
          <div key={s.label} className={cn('p-5 rounded-2xl border', s.color)}>
            <div className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">{s.label}</div>
            <div className="text-2xl font-black">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Review Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 space-y-5"
          >
            <h2 className="text-xl font-bold text-gray-900">Review Payment Proof</h2>
            
            <div className="space-y-3 rounded-xl bg-gray-50 p-4 border border-gray-200 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-[10px] font-bold text-gray-400 uppercase">Full Name</p><p className="font-semibold text-gray-900">{selected.full_name}</p></div>
                <div><p className="text-[10px] font-bold text-gray-400 uppercase">Email</p><p className="font-semibold text-gray-900 truncate">{selected.email}</p></div>
                <div><p className="text-[10px] font-bold text-gray-400 uppercase">Method</p><p className="font-semibold text-gray-900 capitalize">{selected.payment_method?.replace('_', ' ')}</p></div>
                <div><p className="text-[10px] font-bold text-gray-400 uppercase">Amount</p><p className="font-semibold text-gray-900">PKR {selected.amount}</p></div>
                <div className="col-span-2"><p className="text-[10px] font-bold text-gray-400 uppercase">Transaction ID</p><p className="font-mono font-semibold text-gray-900">{selected.transaction_id}</p></div>
                <div className="col-span-2"><p className="text-[10px] font-bold text-gray-400 uppercase">Internship Applied For</p><p className="font-semibold text-gray-900">{selected.internship_applied}</p></div>
              </div>

              {selected.screenshot_url && (
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Payment Screenshot</p>
                  <a href={selected.screenshot_url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary-600 text-xs font-semibold hover:underline">
                    <ExternalLink className="h-3.5 w-3.5" /> View Screenshot
                  </a>
                  <img src={selected.screenshot_url} alt="Payment proof" className="mt-2 rounded-xl border border-gray-200 max-h-48 object-contain w-full" />
                </div>
              )}
            </div>

            {selected.status === 'pending' && (
              <>
                <div>
                  <label className="label">Rejection Reason <span className="text-gray-400 font-normal">(required only when rejecting)</span></label>
                  <textarea
                    value={rejectReason}
                    onChange={e => setRejectReason(e.target.value)}
                    rows={2}
                    placeholder="e.g. Screenshot unclear, amount incorrect..."
                    className="input resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleAction(selected.id, 'reject')}
                    disabled={!!actionLoading}
                    className="flex items-center justify-center gap-2 rounded-xl border-2 border-rose-200 bg-rose-50 py-3 font-bold text-rose-600 hover:bg-rose-100 transition-all disabled:opacity-50"
                  >
                    <XCircle className="h-4 w-4" /> Reject
                  </button>
                  <button
                    onClick={() => handleAction(selected.id, 'approve')}
                    disabled={!!actionLoading}
                    className="flex items-center justify-center gap-2 rounded-xl bg-gray-900 py-3 font-bold text-white hover:bg-emerald-600 transition-all disabled:opacity-50"
                  >
                    <CheckCircle className="h-4 w-4" /> Approve & Grant Access
                  </button>
                </div>
              </>
            )}

            <button onClick={() => { setSelected(null); setRejectReason(''); }} className="w-full btn-ghost text-sm">
              Close
            </button>
          </motion.div>
        </div>
      )}

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Applicant</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Internship</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Method</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">TXN ID</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Submitted</th>
                <th className="px-6 py-4 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {proofs.map((p, idx) => (
                <motion.tr
                  key={p.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="hover:bg-primary-50/20 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{p.full_name}</div>
                    <div className="text-xs text-gray-400">{p.email}</div>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-600 max-w-[140px] truncate">{p.internship_applied || '—'}</td>
                  <td className="px-6 py-4 text-xs capitalize text-gray-600">{p.payment_method?.replace('_', ' ')}</td>
                  <td className="px-6 py-4 font-mono text-xs text-gray-500">{p.transaction_id}</td>
                  <td className="px-6 py-4 text-xs text-gray-500">{formatDate(p.created_at)}</td>
                  <td className="px-6 py-4 text-center">{statusBadge(p.status)}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelected(p)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-gray-900 px-4 py-2 text-xs font-bold text-white hover:bg-primary-600 transition-all active:scale-95"
                    >
                      <Eye className="h-3.5 w-3.5" /> Review
                    </button>
                  </td>
                </motion.tr>
              ))}
              {proofs.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-gray-400 italic text-sm">
                    No payment proofs submitted yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
