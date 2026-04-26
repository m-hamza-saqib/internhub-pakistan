import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createAdminClient();

    // The service role key bypasses RLS, so it will accurately fetch all profiles
    const { data, error } = await supabase
      .from('applications')
      .select('*, applicant:profiles!applications_user_id_fkey(full_name, email, university, city, province, profile_completeness), internships(title, category, duration_weeks)')
      .order('applied_at', { ascending: false });

    if (error) throw error;

    const { data: authUsersRes } = await supabase.auth.admin.listUsers();
    const authUsers = authUsersRes.users || [];

    const augmentedData = (data as any[])?.map((app: any) => {
      let applicant = app.applicant;
      if (!applicant) {
        const authUser = authUsers.find(u => u.id === app.user_id);
        applicant = {
          full_name: authUser?.user_metadata?.full_name || 'Anonymous User',
          email: authUser?.email || 'Unknown',
          university: null,
          city: null,
          province: null,
          profile_completeness: 0,
        };
      }
      return {
        ...app,
        applicant
      };
    });

    return NextResponse.json(augmentedData);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
