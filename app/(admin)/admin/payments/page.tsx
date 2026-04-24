import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { CreditCard, DollarSign, CheckCircle2, Clock, XCircle, Search, Download } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';

export const metadata = {
  title: 'Revenue & Payments — Admin',
};
export const dynamic = 'force-dynamic';

export default async function AdminPaymentsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: adminProfileRaw } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  const adminProfile = adminProfileRaw as { role: string } | null;
  if (!adminProfile || adminProfile.role !== 'admin') redirect('/dashboard');

  const { data: paymentRows } = await supabase
    .from('payments')
    .select(`
      *,
      profiles!payments_user_id_fkey (full_name, email),
      enrollments:enrollment_id (internships (title))
    `)
    .order('created_at', { ascending: false });
  
  const list = (paymentRows as any[]) || [];
  const totalRevenuePKR = list.filter(p => p.status === 'completed' && p.currency === 'PKR').reduce((acc, p) => acc + p.amount, 0);
  const totalRevenueUSD = list.filter(p => p.status === 'completed' && p.currency === 'USD').reduce((acc, p) => acc + p.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Ledger</h1>
          <p className="text-sm text-gray-500 mt-1">
            Tracking all certification fee transactions across all gateways.
          </p>
        </div>
        <button className="btn-secondary flex items-center gap-2 py-2 text-sm">
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-6 border-l-4 border-l-green-500">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total PKR Revenue</div>
          <div className="text-2xl font-black text-gray-900">Rs. {totalRevenuePKR.toLocaleString()}</div>
        </div>
        <div className="card p-6 border-l-4 border-l-blue-500">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total USD Revenue</div>
          <div className="text-2xl font-black text-gray-900">${totalRevenueUSD.toLocaleString()}</div>
        </div>
        <div className="card p-6 border-l-4 border-l-yellow-500">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Pending Txns</div>
          <div className="text-2xl font-black text-gray-900">{list.filter(p => p.status === 'pending').length}</div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Transaction ID</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">User / Program</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Amount</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Method</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Date</th>
                <th className="px-6 py-4 text-right font-semibold text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {list.map((p) => {
                const user = p.profiles as any;
                const program = (p.enrollments as any)?.internships as any;

                return (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors text-xs">
                    <td className="px-6 py-4">
                      <div className="font-mono text-gray-400">#{p.id.slice(0, 8)}...</div>
                      <div className="text-[10px] text-gray-500 mt-1">{p.gateway_transaction_id || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{user?.full_name}</div>
                      <div className="text-xs text-gray-500 truncate max-w-[150px]">{program?.title}</div>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      {p.currency === 'PKR' ? `Rs. ${p.amount}` : `$${p.amount}`}
                    </td>
                    <td className="px-6 py-4">
                      <span className="capitalize text-gray-600">{p.method?.replace(/_/g, ' ')}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {formatDate(p.created_at)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {p.status === 'completed' && (
                        <span className="inline-flex items-center gap-1 text-green-600 font-bold">
                          <CheckCircle2 className="h-3 w-3" /> PAID
                        </span>
                      )}
                      {p.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 text-yellow-600 font-bold">
                          <Clock className="h-3 w-3" /> PENDING
                        </span>
                      )}
                      {p.status === 'failed' && (
                        <span className="inline-flex items-center gap-1 text-red-600 font-bold">
                          <XCircle className="h-3 w-3" /> FAILED
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {list.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 italic">
                    No transactions found in the ledger.
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
