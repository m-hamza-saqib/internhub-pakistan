import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const supabase = await createAdminClient();

    // The service role key bypasses RLS, resolving the profile visibility issue.
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        applicant:profiles!applications_user_id_fkey (*),
        internship:internship_id (*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    const singleData = data as any;
    if (!singleData.applicant && singleData.user_id) {
      const { data: authData } = await supabase.auth.admin.getUserById(singleData.user_id);
      if (authData.user) {
        singleData.applicant = {
          full_name: authData.user.user_metadata?.full_name || 'Anonymous User',
          email: authData.user.email || 'Unknown',
          university: null,
          city: null,
          province: null,
          profile_completeness: 0,
        };
      }
    }

    return NextResponse.json(singleData);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
