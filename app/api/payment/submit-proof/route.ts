import { createClient, createAdminClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const adminClient = await createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  }

  const formData = await req.formData();
  const fullName    = formData.get('fullName')     as string;
  const email       = formData.get('email')        as string;
  const transactionId = formData.get('transactionId') as string;
  const internship  = formData.get('internship')   as string;
  const method      = formData.get('method')       as string;
  const screenshot  = formData.get('screenshot')   as File | null;

  if (!fullName || !email || !transactionId || !method) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
  }

  // Upload screenshot to Supabase Storage if available
  let screenshotUrl: string | null = null;
  if (screenshot && screenshot.size > 0) {
    const buffer = Buffer.from(await screenshot.arrayBuffer());
    const ext = screenshot.name.split('.').pop() || 'jpg';
    const filename = `payment-proofs/${user.id}-${Date.now()}.${ext}`;

    const { error: uploadError } = await adminClient.storage
      .from('payment-screenshots')
      .upload(filename, buffer, { contentType: screenshot.type, upsert: true });

    if (uploadError) {
      console.error('Screenshot upload error:', uploadError);
      // Non-fatal — continue without screenshot URL
    } else {
      const { data: publicUrlData } = adminClient.storage
        .from('payment-screenshots')
        .getPublicUrl(filename);
      screenshotUrl = publicUrlData?.publicUrl || null;
    }
  }

  // Record the payment proof submission
  const { error: insertError } = await (adminClient.from('payment_proofs') as any).insert({
    user_id: user.id,
    full_name: fullName,
    email,
    transaction_id: transactionId,
    internship_applied: internship,
    payment_method: method,
    screenshot_url: screenshotUrl,
    status: 'pending',
    amount: 300,
    currency: 'PKR',
  });

  if (insertError) {
    console.error('Payment proof insert error:', insertError);
    return NextResponse.json({ error: 'Failed to submit proof. Please try again.' }, { status: 500 });
  }

  // Notify admin via in-app notification
  try {
    const { data: adminUsers } = await adminClient
      .from('profiles')
      .select('id')
      .eq('role', 'admin');

    if (adminUsers && adminUsers.length > 0) {
      await (adminClient.from('notifications') as any).insert(
        adminUsers.map((a: any) => ({
          user_id: a.id,
          type: 'payment_proof',
          title: '💰 New Payment Proof Submitted',
          body: `${fullName} (${email}) submitted payment proof for "${internship}". TXN: ${transactionId}`,
          link: '/admin/payment-proofs',
          is_read: false,
        }))
      );
    }
  } catch (e) {
    console.error('Failed to send admin notification:', e);
    // Non-fatal
  }

  return NextResponse.json({ success: true, message: 'Payment proof submitted successfully. Pending admin review.' });
}
