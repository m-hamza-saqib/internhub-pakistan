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

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) redirect('/login');

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900">Manage Profile</h1>
        <p className="text-sm font-bold text-gray-900">hello@ahwtechnologies.com</p>
        <p className="text-gray-500 mt-2">
          📧 Email: hello@ahwtechnologies.com
          Keep your professional profile updated to increase your chances of selection.
        </p>
      </div>

      <ProfileForm initialData={profile} />
    </div>
  );
}
