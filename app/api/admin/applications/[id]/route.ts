import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const supabase = await createAdminClient();

    // Fetch application without broken profiles join
    const { data: application, error } = await supabase
      .from('applications')
      .select('*, internship:internships(*)')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    if (!application) return NextResponse.json({ error: 'Application not found' }, { status: 404 });

    const singleData = application as any;
    
    // Fetch profile separately
    if (singleData.user_id) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', singleData.user_id)
        .maybeSingle();
      
      if (profile) {
        singleData.applicant = profile;
      } else {
        // Fallback to Auth User if profile is missing
        const { data: authData } = await supabase.auth.admin.getUserById(singleData.user_id);
        if (authData?.user) {
          singleData.applicant = {
            full_name: authData.user.user_metadata?.full_name || 'Anonymous User',
            email: authData.user.email || 'Unknown',
            university: 'Profile Pending',
            city: null,
            province: null,
            profile_completeness: 0,
          };
        }
      }
    }

    return NextResponse.json(singleData);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
