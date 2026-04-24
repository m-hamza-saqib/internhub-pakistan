import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createClient();
    const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && session?.user) {
      // Ensure profile exists (Sync logic for OAuth users)
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', session.user.id)
        .single();

      if (!profile) {
        const emailBase = session.user.email?.split('@')[0] || 'user';
        const username = `${emailBase}_${Math.random().toString(36).slice(2, 7)}`;
        await (supabase.from('profiles') as any).insert({
          id: session.user.id,
          username,
          full_name: session.user.user_metadata.full_name || emailBase || 'User',
          email: session.user.email!,
          role: 'intern',
          avatar_url: session.user.user_metadata.avatar_url || null,
          profile_completeness: 0,
        });
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
