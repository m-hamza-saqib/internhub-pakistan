import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createClient();
    const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && session?.user) {
      const user = session.user;
      // Ensure profile exists (Sync logic for OAuth and Email signups)
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (!profile) {
        await (supabase.from('profiles') as any).insert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          role: 'intern',
          profile_completeness: 0,
          updated_at: new Date().toISOString(),
        });
      }
      
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Fallback to home page
  return NextResponse.redirect(`${origin}/`);
}
