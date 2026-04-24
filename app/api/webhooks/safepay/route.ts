import { createAdminClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

function verifySafepaySignature(payload: string, signature: string): boolean {
  const secret = process.env.SAFEPAY_WEBHOOK_SECRET!;
  if (!secret) return true; // Skip in dev if not set
  const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(signature, 'hex'));
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get('x-safepay-signature') || '';

  if (!verifySafepaySignature(rawBody, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  let event: { type: string; data: { tracker: { metadata?: { enrollment_id?: string }; token: string }; payment: { net_amount: number; currency: string } } };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // Always respond quickly to webhooks
  if (event.type === 'payment:created' || event.type === 'payment:succeeded') {
    const enrollmentId = event.data?.tracker?.metadata?.enrollment_id;
    const transactionToken = event.data?.tracker?.token;

    if (!enrollmentId) {
      return NextResponse.json({ received: true });
    }

    const supabase = await createAdminClient();

    // Update payment record
    await (supabase.from('payments') as any).update({
      status: 'completed',
      gateway_transaction_id: transactionToken,
      gateway_payload: event as unknown as Record<string, unknown>,
      verified_at: new Date().toISOString(),
    }).eq('enrollment_id', enrollmentId).eq('status', 'pending');

    // Unlock certificate
    const { data: enrollment } = await (supabase.from('enrollments') as any)
      .update({ certificate_unlocked: true, status: 'completed', completion_date: new Date().toISOString() })
      .eq('id', enrollmentId)
      .select('user_id, internship_id')
      .single();

    if (enrollment) {
      // Generate certificate ID
      const { count } = await supabase.from('enrollments').select('id', { count: 'exact', head: true }).not('certificate_id', 'is', null);
      const certId = `IH-${new Date().getFullYear()}-${String((count || 0) + 1).padStart(5, '0')}`;

      await (supabase.from('enrollments') as any).update({ certificate_id: certId }).eq('id', enrollmentId);

      // Notify user
      await (supabase.from('notifications') as any).insert({
        user_id: enrollment.user_id,
        type: 'certificate',
        title: '🏆 Your Certificate is Ready!',
        body: 'Payment verified! Your certificate has been unlocked. Download it from the Certificates page.',
        link: '/certificates',
        is_read: false,
      });
    }
  }

  return NextResponse.json({ received: true });
}
