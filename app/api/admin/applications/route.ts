import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createAdminClient();

    // Step 1: Fetch all applications WITHOUT the broken FK join
    const { data: applications, error } = await supabase
      .from('applications')
      .select('*, internships(title, category, duration_weeks)')
      .order('applied_at', { ascending: false });

    if (error) throw error;
    if (!applications || applications.length === 0) return NextResponse.json([]);

    // Step 2: Get unique user IDs from the applications
    const userIds = [...new Set((applications as any[]).map((a: any) => a.user_id))];

    // Step 3: Fetch profiles for those user IDs separately (no FK join needed)
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name, email, university, city, province, profile_completeness')
      .in('id', userIds as string[]);

    const profileMap: Record<string, any> = Object.fromEntries(
      (profiles || []).map((p: any) => [p.id, p])
    );

    // Step 4: Auth users as fallback for users without profiles
    const { data: authUsersRes } = await supabase.auth.admin.listUsers();
    const authUsers = authUsersRes?.users || [];
    const authMap: Record<string, any> = Object.fromEntries(
      authUsers.map((u: any) => [u.id, u])
    );

    // Step 5: Merge everything
    const augmentedData = (applications as any[]).map((app: any) => {
      let applicant = profileMap[app.user_id];
      if (!applicant) {
        const authUser = authMap[app.user_id];
        applicant = {
          full_name: authUser?.user_metadata?.full_name || 'Anonymous User',
          email: authUser?.email || 'Unknown',
          university: 'Profile Pending',
          city: null,
          province: null,
          profile_completeness: 0,
        };
      }
      return { ...app, applicant };
    });

    return NextResponse.json(augmentedData);
  } catch (error: any) {
    console.error('[Admin Applications API Error]:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
