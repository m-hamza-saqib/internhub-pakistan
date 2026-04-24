'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  User, Lock, Bell, Trash2, 
  CheckCircle2, AlertCircle, Loader2, Save
} from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'danger'>('profile');
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  // Tab Navigation
  const tabs = [
    { id: 'profile',      label: 'Profile Info',  icon: User },
    { id: 'security',     label: 'Security',      icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'danger',       label: 'Danger Zone',   icon: Trash2 },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Account Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your account preferences and security.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all",
                  activeTab === tab.id 
                    ? "bg-primary-500 text-white shadow-lg shadow-primary-500/20" 
                    : "text-gray-500 hover:bg-gray-100"
                )}
              >
                <Icon className={cn("h-4 w-4", activeTab === tab.id ? "animate-pulse" : "")} />
                {tab.label}
              </button>
            );
          })}
        </aside>

        {/* Content Area */}
        <main className="flex-1 space-y-6">
          {activeTab === 'profile' && (
            <div className="card p-6 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-3">Basic Information</h3>
              <p className="text-sm text-gray-400">Your profile details used for internship applications.</p>
              
              <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-blue-500 mt-0.5" />
                <p className="text-xs text-blue-700 leading-relaxed">
                  Profile data is managed in the <strong>Manage Profile</strong> section of your dashboard to ensure consistency across applications.
                </p>
              </div>
              
              <a href="/profile" className="btn-primary inline-flex">Go to Profile Editor</a>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="card p-6 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-3">Update Password</h3>
              <div className="space-y-4">
                <div>
                  <label className="label">New Password</label>
                  <input type="password" placeholder="••••••••" className="input" />
                </div>
                <div>
                  <label className="label">Confirm New Password</label>
                  <input type="password" placeholder="••••••••" className="input" />
                </div>
                <button className="btn-primary py-2.5 px-6 text-sm">Update Password</button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="card p-6 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-3">Notification Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100">
                  <div>
                    <div className="text-sm font-bold text-gray-900">Email Notifications</div>
                    <div className="text-xs text-gray-400">Receive updates about your applications via email.</div>
                  </div>
                  <div className="h-6 w-11 rounded-full bg-primary-500 relative cursor-pointer">
                    <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100">
                  <div>
                    <div className="text-sm font-bold text-gray-900">Push Notifications</div>
                    <div className="text-xs text-gray-400">In-browser alerts for project feedback.</div>
                  </div>
                  <div className="h-6 w-11 rounded-full bg-gray-200 relative cursor-pointer">
                    <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'danger' && (
            <div className="card p-6 border-2 border-red-50 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h3 className="font-bold text-red-600 border-b border-red-50 pb-3">Delete Account</h3>
              <div className="bg-red-50 p-4 rounded-xl flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                <div className="text-xs text-red-700 leading-relaxed">
                  Deleting your account will permanently remove all your progress, certificates, and application history. This action cannot be undone.
                </div>
              </div>
              <button className="btn-secondary border-red-200 text-red-600 hover:bg-red-50 py-2.5 px-6 text-sm font-bold">
                Delete My Account Permanently
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
