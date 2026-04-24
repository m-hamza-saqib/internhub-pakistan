'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Bell, CheckCheck, Circle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  link: string | null;
  is_read: boolean;
  created_at: string;
}

const TYPE_ICONS: Record<string, string> = {
  application_update: '📋',
  project_update:     '📁',
  announcement:       '📢',
  payment:            '💳',
  certificate:        '🏆',
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs  = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1)   return 'Just now';
  if (mins < 60)  return `${mins}m ago`;
  if (hrs  < 24)  return `${hrs}h ago`;
  return `${days}d ago`;
}

export default function NotificationsClient({ notifications: initial, userId }: { notifications: Notification[]; userId: string }) {
  const [notifications, setNotifications] = useState<Notification[]>(initial);
  const supabase = createClient();

  // Subscribe to real-time notification changes for this user
  useEffect(() => {
    const channelId = `notifs-pg-${Math.random().toString(36).substring(2)}`;
    const channel = supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setNotifications((prev) => [payload.new as Notification, ...prev]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setNotifications((prev) =>
            prev.map((n) => (n.id === payload.new.id ? (payload.new as Notification) : n))
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const unread = notifications.filter((n) => !n.is_read);

  const markAllRead = async () => {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);
    if (!error) {
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      toast.success('All notifications marked as read');
    }
  };

  const markRead = async (id: string) => {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, is_read: true } : n));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Bell className="h-6 w-6 text-primary-500" /> Notifications
          </h1>
          {unread.length > 0 && (
            <p className="text-sm text-gray-500 mt-1">{unread.length} unread</p>
          )}
        </div>
        {unread.length > 0 && (
          <button onClick={markAllRead} className="btn-ghost text-sm flex items-center gap-2">
            <CheckCheck className="h-4 w-4" /> Mark all read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="card p-12 text-center">
          <Bell className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-gray-700 mb-1">No notifications</h2>
          <p className="text-sm text-gray-400">You're all caught up!</p>
        </div>
      ) : (
        <div className="card divide-y divide-gray-100 overflow-hidden">
          {notifications.map((n, i) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <div
                onClick={() => { if (!n.is_read) markRead(n.id); }}
                className={cn(
                  'flex items-start gap-4 p-4 transition-colors cursor-pointer',
                  !n.is_read ? 'bg-primary-50 hover:bg-primary-100/60' : 'hover:bg-gray-50'
                )}
              >
                <span className="text-2xl mt-0.5 shrink-0">{TYPE_ICONS[n.type] || '🔔'}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={cn('text-sm font-semibold', !n.is_read ? 'text-gray-900' : 'text-gray-700')}>
                      {n.title}
                    </p>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-gray-400">{timeAgo(n.created_at)}</span>
                      {!n.is_read && <Circle className="h-2 w-2 fill-primary-500 text-primary-500" />}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.body}</p>
                  {n.link && (
                    <Link
                      href={n.link}
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs font-semibold text-primary-500 hover:underline mt-1.5 inline-block"
                    >
                      View →
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
