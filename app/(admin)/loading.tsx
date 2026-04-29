import { Loader2 } from 'lucide-react';

export default function AdminLoading() {
  return (
    <div className="flex h-[80vh] w-full flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
      <div className="relative mb-8">
        <div className="absolute inset-0 rounded-full bg-emerald-100 blur-xl opacity-50" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-xl shadow-emerald-500/10 border border-gray-50">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
      </div>
      <h2 className="text-xl font-black tracking-tight text-gray-900 mb-2">Fetching Operational Data</h2>
      <p className="text-sm font-medium text-gray-500 max-w-xs">Loading secure administrative console...</p>
    </div>
  );
}
