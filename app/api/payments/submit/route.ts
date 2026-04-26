import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const adminClient = await createAdminClient();

    // Verify user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    // Verify user has an accepted application
    const { data: acceptedApp } = await (supabase
      .from('applications') as any)
      .select('id, internships(title)')
      .eq('user_id', user.id)
      .eq('status', 'accepted')
      .limit(1)
      .maybeSingle();

    if (!acceptedApp) {
      return NextResponse.json({ error: 'No accepted application found.' }, { status: 403 });
    }

    // Check for duplicate submission
    const { data: existingProof } = await (supabase
      .from('payment_proofs') as any)
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (existingProof) {
      return NextResponse.json({ error: 'You have already submitted a payment proof.' }, { status: 409 });
    }

    const body = await req.json();
    const { payment_method, transaction_id, screenshot_url, amount, internship_applied } = body;

    if (!payment_method || !transaction_id) {
      return NextResponse.json({ error: 'Payment method and transaction ID are required.' }, { status: 400 });
    }

    // Get user profile for name display
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, email')
      .eq('id', user.id)
      .single();

    // Insert payment proof
    const { error: insertError } = await (adminClient
      .from('payment_proofs') as any)
      .insert({
        user_id: user.id,
        payment_method,
        transaction_id,
        screenshot_url: screenshot_url || null,
        amount: amount || 300,
        internship_applied: internship_applied || (acceptedApp.internships as any)?.title || 'Unknown',
        status: 'pending',
        full_name: (profile as any)?.full_name || '',
        email: (profile as any)?.email || user.email || '',
      });

    if (insertError) {
      console.error('[Payment Submit Error]:', insertError.message);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    // Send notification to confirm receipt
    await (adminClient.from('notifications') as any).insert({
      user_id: user.id,
      type: 'payment',
      title: '💳 Payment Proof Received',
      body: 'We\'ve received your payment proof! Our team will verify and unlock your dashboard within 24–48 hours.',
      link: '/my-internship',
      is_read: false,
    });

    return NextResponse.json({ success: true, message: 'Payment proof submitted successfully.' });
  } catch (error: any) {
    console.error('[Payment Submit Error]:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
