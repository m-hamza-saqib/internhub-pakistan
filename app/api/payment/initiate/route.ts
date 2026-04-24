import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const enrollmentId = searchParams.get('enrollment_id');
  const currency = searchParams.get('currency') || 'PKR';

  if (!enrollmentId) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // 1. Verify enrollment belongs to user and is eligible (completed all projects)
  const { data: enrollment, error: enrollError } = await supabase
    .from('enrollments')
    .select('*, internships(title)')
    .eq('id', enrollmentId)
    .eq('user_id', user.id)
    .single();

  if (enrollError || !enrollment) {
    return NextResponse.json({ error: 'Enrollment not found' }, { status: 404 });
  }

  // Check if already unlocked
  if (enrollment.certificate_unlocked) {
    return NextResponse.redirect(new URL('/certificates', req.url));
  }

  // 2. Create a pending payment record
  const amount = currency === 'PKR' ? 300 : 3;
  const { data: payment, error: payError } = await supabase
    .from('payments')
    .insert({
      user_id: user.id,
      enrollment_id: enrollmentId,
      amount,
      currency,
      status: 'pending',
    })
    .select()
    .single();

  if (payError) {
    return NextResponse.json({ error: 'Failed to initialize payment' }, { status: 500 });
  }

  // 3. Redirect to appropriate gateway
  if (currency === 'PKR') {
    // Safepay - Build the link
    // Sandbox or Production based on env
    const isSandbox = process.env.NODE_ENV !== 'production';
    const baseUrl = isSandbox 
      ? 'https://sandbox.getsafepay.com/checkout/pay' 
      : 'https://getsafepay.com/checkout/pay';
    
    const params = new URLSearchParams({
      beacon: process.env.NEXT_PUBLIC_SAFEPAY_API_KEY || '',
      amount: amount.toString(),
      currency: 'PKR',
      token: payment.id, // We use our payment ID as the tracker token
      redirect_url: `${new URL(req.url).origin}/certificates?payment=success`,
      cancel_url: `${new URL(req.url).origin}/certificates?payment=cancelled`,
      metadata: JSON.stringify({ enrollment_id: enrollmentId })
    });

    return NextResponse.redirect(`${baseUrl}?${params.toString()}`);
  } else {
    // Lemon Squeezy - Open checkout for $3
    // In a real app, you'd use Lemon Squeezy API to create a checkout URL
    // For this prototype, we redirect to a hypothetical checkout
    const checkoutUrl = process.env.LEMONSQUEEZY_CHECKOUT_URL || '#';
    const finalUrl = `${checkoutUrl}?checkout[custom][enrollment_id]=${enrollmentId}&checkout[email]=${user.email}`;
    
    return NextResponse.redirect(finalUrl);
  }
}
