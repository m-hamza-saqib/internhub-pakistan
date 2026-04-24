import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ProfileForm from '@/components/forms/ProfileForm';

export const metadata = {
  title: 'Edit Profile — AHWTECHNOLOGIES',
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  let { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) {
    // Attempt auto-creation
    const { error } = await supabase.from('profiles').insert({
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name || user.email?.split('@')[0],
      role: 'intern',
      profile_completeness: 0
    });

    if (error) {
      console.error('Manual profile creation error:', error);
      redirect('/login');
    }

    // Redirect to self to fetch the new profile
    redirect('/profile');
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8 font-instrument-serif">
        <h1 className="text-4xl text-gray-900 mb-2">Manage <span className="italic text-primary-600">Profile</span></h1>
        <p className="text-gray-500 font-medium tracking-tight">
          Keep your professional details accurate. High completeness scores improve your selection chances.
        </p>
      </div>

      <div className="card p-8 border-none shadow-premium bg-white">
        <ProfileForm initialData={profile} />
      </div>
    </div>
  );
}
