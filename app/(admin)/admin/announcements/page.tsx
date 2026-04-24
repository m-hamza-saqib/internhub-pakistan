'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Megaphone, Send, Loader2, Bell, BellOff,
  Clock, Users, CheckCircle2, AlertCircle, RefreshCw, Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDate } from '@/lib/utils';

const ANNOUNCEMENT_TYPES = [
  { value: 'announcement', label: '📢 General Announcement', color: 'bg-blue-50 text-blue-600 border-blue-100' },
  { value: 'application_update', label: '📝 Application Update', color: 'bg-yellow-50 text-yellow-600 border-yellow-100' },
  { value: 'project_update', label: '🚀 Project Update', color: 'bg-purple-50 text-purple-600 border-purple-100' },
  { value: 'certificate', label: '🏆 Certificate Notice', color: 'bg-green-50 text-green-600 border-green-100' },
  { value: 'payment', label: '💳 Payment Notice', color: 'bg-orange-50 text-orange-600 border-orange-100' },
];

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [totalInterns, setTotalInterns] = useState(0);

  const [form, setForm] = useState({
    title: '',
    body: '',
    link: '',
    type: 'announcement',
  });

  const supabase = createClient();

  const fetchAnnouncements = useCallback(async () => {
    const res = await fetch('/api/admin/announcements');
    const json = await res.json();
    if (json.data) setAnnouncements(json.data);
    setLoading(false);
  }, []);

  const fetchInternCount = useCallback(async () => {
    const { count } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('role', 'intern');
    setTotalInterns(count || 0);
  }, [supabase]);

  useEffect(() => {
    fetchAnnouncements();
    fetchInternCount();

    // Real-time subscription
    const channel = supabase
      .channel('announcements-admin')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        (payload) => {
          if (payload.new?.type === 'announcement') {
            setAnnouncements((prev) => [payload.new, ...prev]);
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchAnnouncements, fetchInternCount, supabase]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.body.trim()) {
      toast.error('Title and message body are required.');
      return;
    }
    setSending(true);
    try {
      const res = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to send');
      toast.success(`✅ Announcement sent to ${json.sent} intern${json.sent !== 1 ? 's' : ''}!`);
      setForm({ title: '', body: '', link: '', type: 'announcement' });
      fetchAnnouncements();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSending(false);
    }
  };

  const typeInfo = ANNOUNCEMENT_TYPES.find(t => t.value === form.type);

  return (
    <div className="space-y-8 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/20">
              <Megaphone className="h-5 w-5 text-white" />
            </div>
            Announcement Center
          </h1>
          <p className="text-sm text-gray-500 mt-1 ml-[52px]">
            Broadcast platform-wide messages to all interns in real-time.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </div>
            <span className="text-xs font-black uppercase tracking-widest">Live</span>
          </div>
          <button
            onClick={() => { setLoading(true); fetchAnnouncements(); }}
            className="p-2.5 rounded-xl border border-gray-200 text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-all"
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Compose Panel */}
        <div className="lg:col-span-5">
          <form onSubmit={handleSend} className="card p-8 space-y-6 sticky top-24">
            {/* Stats badge */}
            <div className="flex items-center justify-between pb-5 border-b border-gray-100">
              <h2 className="font-black text-gray-900 text-lg">Compose Message</h2>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary-50 border border-primary-100 text-primary-700 text-xs font-black">
                <Users className="h-3.5 w-3.5" />
                {totalInterns} Recipients
              </div>
            </div>

            {/* Type Selector */}
            <div className="space-y-2">
              <label className="label">Notification Type</label>
              <div className="grid grid-cols-1 gap-2">
                {ANNOUNCEMENT_TYPES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, type: t.value }))}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left text-sm font-bold transition-all ${
                      form.type === t.value
                        ? t.color + ' ring-2 ring-offset-1 ring-current/20 shadow-sm'
                        : 'bg-gray-50 text-gray-500 border-gray-100 hover:bg-gray-100'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <label className="label">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="e.g. New Project Week Released!"
                className="input"
                required
                maxLength={100}
              />
              <p className="text-[10px] text-gray-400 text-right">{form.title.length}/100</p>
            </div>

            {/* Body */}
            <div className="space-y-2">
              <label className="label">
                Message Body <span className="text-red-500">*</span>
              </label>
              <textarea
                value={form.body}
                onChange={(e) => setForm(f => ({ ...f, body: e.target.value }))}
                rows={5}
                placeholder="Write your announcement here. Be clear and concise — interns will see this in their notification feed."
                className="input resize-none"
                required
                maxLength={500}
              />
              <p className="text-[10px] text-gray-400 text-right">{form.body.length}/500</p>
            </div>

            {/* Optional Link */}
            <div className="space-y-2">
              <label className="label">Action Link <span className="text-gray-400 font-normal">(optional)</span></label>
              <input
                type="text"
                value={form.link}
                onChange={(e) => setForm(f => ({ ...f, link: e.target.value }))}
                placeholder="e.g. /projects or /internships"
                className="input"
              />
            </div>

            {/* Preview */}
            {form.title && (
              <div className="rounded-2xl border border-dashed border-gray-200 p-4 space-y-2 bg-gray-50/50">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Preview</p>
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                    <Bell className="h-4 w-4 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm leading-tight">{form.title || 'Your Title'}</p>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{form.body || 'Your message body...'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Send Button */}
            <button
              type="submit"
              disabled={sending || !form.title.trim() || !form.body.trim()}
              className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-gray-900 py-4 font-black text-white shadow-xl shadow-gray-900/20 hover:bg-primary-600 hover:shadow-primary-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? (
                <><Loader2 className="h-5 w-5 animate-spin" /> Broadcasting...</>
              ) : (
                <><Send className="h-5 w-5" /> Broadcast to All Interns</>
              )}
            </button>
          </form>
        </div>

        {/* History Panel */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-black text-gray-900 text-base">
              Broadcast History
              <span className="ml-2 px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-500 text-xs font-bold">
                {announcements.length}
              </span>
            </h2>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Auto-updating
            </div>
          </div>

          {loading ? (
            <div className="flex h-48 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
            </div>
          ) : announcements.length === 0 ? (
            <div className="card py-20 text-center">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-gray-50 text-gray-200 mb-6 mx-auto">
                <BellOff size={40} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">No announcements yet</h3>
              <p className="text-sm text-gray-500 mt-1 max-w-xs mx-auto">
                Compose your first message on the left to notify all interns.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence initial={false}>
                {announcements.map((a, i) => {
                  const typeData = ANNOUNCEMENT_TYPES.find(t => t.value === a.type);
                  return (
                    <motion.div
                      key={a.id}
                      layout
                      initial={{ opacity: 0, y: -20, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: i === 0 ? 0 : 0, duration: 0.25 }}
                      className="card p-6 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                          <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border ${typeData?.color || 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                            <Bell className="h-5 w-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span className="font-black text-gray-900 text-sm truncate">{a.title}</span>
                              <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase border ${typeData?.color || ''}`}>
                                {typeData?.label?.split(' ').slice(1).join(' ') || a.type}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{a.body}</p>
                            {a.link && (
                              <p className="text-[10px] text-primary-500 font-bold mt-1.5">
                                🔗 Link: {a.link}
                              </p>
                            )}
                            <div className="flex items-center gap-1 mt-3 text-[10px] text-gray-400 font-bold">
                              <Clock className="h-3 w-3" />
                              {formatDate(a.created_at)}
                              <span className="mx-1">•</span>
                              <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                              <span className="text-emerald-600">Delivered</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
