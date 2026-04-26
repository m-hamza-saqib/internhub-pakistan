import { createClient, checkProfileCompletion } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import NotificationsClient from './NotificationsClient';

export const metadata = { title: 'Notifications' };

export default async function NotificationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const isProfileComplete = await checkProfileCompletion(supabase, user.id);
  if (!isProfileComplete) redirect('/profile?onboard=true');

  const { data: notifications } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50);

  return <NotificationsClient notifications={notifications || []} userId={user.id} />;
}
