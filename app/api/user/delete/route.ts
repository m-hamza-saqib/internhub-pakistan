import { createClient, createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminClient = await createAdminClient();

    // 1. Delete the user from Supabase Auth
    // This will trigger CASCADE deletion of profile and related data 
    // IF the database foreign keys are set up with ON DELETE CASCADE.
    const { error: deleteError } = await adminClient.auth.admin.deleteUser(user.id);

    if (deleteError) {
      console.error('Error deleting user:', deleteError);
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    // 2. Clear the session on the client by returning a successful response
    // The middleware or client-side logic should redirect to home.
    return NextResponse.json({ message: 'Account deleted successfully' });
  } catch (err: any) {
    console.error('Unexpected error during account deletion:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
