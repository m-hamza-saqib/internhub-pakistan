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

    const augmentedData = await Promise.all((data as any[])?.map(async (app: any) => {
      let applicant = app.applicant;
      if (!applicant && app.user_id) {
        // Try finding in current page of listUsers
        let authUser = authUsers.find(u => u.id === app.user_id);
        
        // If not in page, fetch individually (fallback for large user bases)
        if (!authUser) {
          try {
            const { data: singleUser } = await supabase.auth.admin.getUserById(app.user_id);
            authUser = singleUser.user as any;
          } catch (e) {
            console.error('Failed to fetch individual user for fallback:', e);
          }
        }

        applicant = {
          full_name: authUser?.user_metadata?.full_name || 'Anonymous User',
          email: authUser?.email || 'Unknown',
          university: 'Profile Pending',
          city: null,
          province: null,
          profile_completeness: 0,
        };
      }
      return {
        ...app,
        applicant: applicant || { full_name: 'Unknown User', email: 'Unknown' }
      };
    }));

    return NextResponse.json(augmentedData);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
