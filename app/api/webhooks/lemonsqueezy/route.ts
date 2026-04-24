import { createAdminClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

function verifyLemonSqueezySignature(payload: string, signature: string): boolean {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET!;
  if (!secret) return true;
  const hmac = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(signature));
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get('x-signature') || '';

  if (!verifyLemonSqueezySignature(rawBody, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  let event: { meta: { event_name: string; custom_data?: { enrollment_id?: string } }; data: { attributes: { order_number: number; total: number } } };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (event.meta?.event_name === 'order_created') {
    const enrollmentId = event.meta?.custom_data?.enrollment_id;
    if (!enrollmentId) return NextResponse.json({ received: true });

    const supabase = await createAdminClient();

    await (supabase.from('payments') as any).update({
      status: 'completed',
      gateway_transaction_id: String(event.data?.attributes?.order_number),
      gateway_payload: event as unknown as Record<string, unknown>,
      verified_at: new Date().toISOString(),
    }).eq('enrollment_id', enrollmentId).eq('status', 'pending');

    const { data: enrollment } = await (supabase
      .from('enrollments') as any)
      .update({ certificate_unlocked: true, status: 'completed', completion_date: new Date().toISOString() })
      .eq('id', enrollmentId)
      .select('user_id')
      .single();

    if (enrollment) {
      const { count } = await (supabase.from('enrollments') as any).select('id', { count: 'exact', head: true }).not('certificate_id', 'is', null);
      const certId = `IH-${new Date().getFullYear()}-${String((count || 0) + 1).padStart(5, '0')}`;
      await (supabase.from('enrollments') as any).update({ certificate_id: certId }).eq('id', enrollmentId);

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
