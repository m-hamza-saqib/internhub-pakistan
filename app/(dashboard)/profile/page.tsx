import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ProfileForm from '@/components/forms/ProfileForm';

export const metadata = {
  title: 'Edit Profile — AWH TECH',
};

import { AlertCircle } from 'lucide-react';

export default async function ProfilePage(
  props: {
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
  }
) {
  const searchParams = await props.searchParams;
  const isOnboarding = searchParams?.onboard === 'true';

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) {
    // Attempt auto-creation with safer type casting to avoid build errors
    const { error } = await (supabase.from('profiles') as any).insert({
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name || user.email?.split('@')[0],
      role: 'intern',
      profile_completeness: 0
    });

    if (error) {
      console.error('Manual profile creation error:', error);
      // If insertion fails (e.g. email column missing), we still want to show the page
      // so the user can fill it out manually.
    } else {
      // Redirect to self to fetch the new profile
      redirect('/profile' + (isOnboarding ? '?onboard=true' : ''));
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8 font-instrument-serif px-6 md:px-0">
        <h1 className="text-4xl text-gray-900 mb-2">Manage <span className="italic text-primary-600">Profile</span></h1>
        <p className="text-gray-500 font-medium tracking-tight">
          Keep your professional details accurate. High completeness scores improve your selection chances.
        </p>
      </div>

      {isOnboarding && (
        <div className="mb-8 p-6 rounded-2xl bg-red-50 border border-red-100 flex items-start gap-4">
          <div className="p-3 bg-red-100 text-red-600 rounded-xl shrink-0">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-red-900 text-lg mb-1">Profile Completion Required</h3>
            <p className="text-red-700 text-sm font-medium">
              You must fully complete all core profile fields (Phone, CNIC, Location, and Academic Info) before you can access the platform dashboard. Please fill out the form below.
            </p>
          </div>
        </div>
      )}

      <div className="card md:p-8 border-none shadow-premium bg-white">
        <ProfileForm initialData={profile || { id: user.id, email: user.email }} />
      </div>
    </div>
  );
}
