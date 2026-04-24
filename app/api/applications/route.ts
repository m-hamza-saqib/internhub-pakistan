import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { applicationSchema } from '@/lib/validations/schemas';

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ success: false, error: { code: 'AUTH_REQUIRED', message: 'Authentication required.' } }, { status: 401 });

  const { data, error } = await supabase
    .from('applications')
    .select('*, internships(title, category, duration_weeks, difficulty)')
    .eq('user_id', user.id)
    .order('applied_at', { ascending: false });

  if (error) return NextResponse.json({ success: false, error: { code: 'INTERNAL_ERROR', message: error.message } }, { status: 500 });
  return NextResponse.json({ success: true, data });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ success: false, error: { code: 'AUTH_REQUIRED', message: 'Authentication required.' } }, { status: 401 });
  }

  // Parse and validate body
  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid request body.' } }, { status: 400 });
  }

  const parsed = applicationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: parsed.error.errors[0].message } }, { status: 400 });
  }

  const { internship_id, motivation_letter, relevant_experience, hours_per_week, linkedin_url } = parsed.data;

  // 1. Check profile completeness >= 70
  const { data: profile } = await supabase
    .from('profiles')
    .select('profile_completeness, is_suspended')
    .eq('id', user.id)
    .single();

  if (!profile) return NextResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'Profile not found.' } }, { status: 404 });
  if (profile.is_suspended) return NextResponse.json({ success: false, error: { code: 'FORBIDDEN', message: 'Your account is suspended.' } }, { status: 403 });
  if (profile.profile_completeness < 70) {
    return NextResponse.json({
      success: false,
      error: { code: 'PROFILE_INCOMPLETE', message: 'Your profile must be at least 70% complete before applying.', details: { completeness: profile.profile_completeness, required: 70 } }
    }, { status: 400 });
  }

  // 2. Check no active enrollment
  const { data: activeEnrollment } = await supabase
    .from('enrollments')
    .select('id')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .maybeSingle();

  if (activeEnrollment) {
    return NextResponse.json({ success: false, error: { code: 'ACTIVE_ENROLLMENT_EXISTS', message: 'You already have an active internship. Complete it first before applying to another.' } }, { status: 400 });
  }

  // 3. Check for duplicate application
  const { data: existing } = await supabase
    .from('applications')
    .select('id, status, reviewed_at')
    .eq('user_id', user.id)
    .eq('internship_id', internship_id)
    .maybeSingle();

  if (existing) {
    if (existing.status !== 'rejected') {
      return NextResponse.json({ success: false, error: { code: 'DUPLICATE_APPLICATION', message: 'You already have an application for this internship.' } }, { status: 400 });
    }
    // 4. Check 30-day cooldown on rejection
    if (existing.reviewed_at) {
      const daysSince = (Date.now() - new Date(existing.reviewed_at).getTime()) / (1000 * 60 * 60 * 24);
      if (daysSince < 30) {
        return NextResponse.json({ success: false, error: { code: 'COOLDOWN_ACTIVE', message: `You can reapply after ${Math.ceil(30 - daysSince)} more days.` } }, { status: 400 });
      }
    }
  }

  // 5. Verify internship exists and is published
  const { data: internship } = await supabase
    .from('internships')
    .select('id, spots_total, spots_filled, is_published')
    .eq('id', internship_id)
    .single();

  if (!internship || !internship.is_published) {
    return NextResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'Internship not found or not available.' } }, { status: 404 });
  }

  if (internship.spots_filled >= internship.spots_total) {
    return NextResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'This internship is full. Please try another.' } }, { status: 400 });
  }

  // 6. Insert application
  const { data: application, error: insertError } = await supabase
    .from('applications')
    .insert({
      user_id: user.id,
      internship_id,
      motivation_letter,
      relevant_experience,
      hours_per_week,
      linkedin_url,
      status: 'pending',
    })
    .select()
    .single();

  if (insertError) {
    return NextResponse.json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to submit application.' } }, { status: 500 });
  }

  // 7. Create notification
  await supabase.from('notifications').insert({
    user_id: user.id,
    type: 'application_update',
    title: 'Application Submitted',
    body: 'Your internship application has been submitted. We\'ll review it within 2–5 business days.',
    link: '/applications',
    is_read: false,
  });

  return NextResponse.json({ success: true, data: application }, { status: 201 });
}
