import { createAdminClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// POST - Create a new announcement
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const adminClient = await createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profileRaw } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  const adminProfile = profileRaw as { role: string } | null;
  if (!adminProfile || adminProfile.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  let body: any;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const { title, body: msgBody, link, type = 'announcement' } = body;

  if (!title?.trim() || !msgBody?.trim()) {
    return NextResponse.json({ error: 'Title and body are required.' }, { status: 400 });
  }

  // Get ALL registered users except the current admin
  const { data: allUsers } = await (adminClient.from('profiles') as any)
    .select('id')
    .neq('id', user.id); // Exclude the admin sending the announcement

  if (!allUsers || allUsers.length === 0) {
    return NextResponse.json({ success: true, sent: 0 });
  }

  // Bulk insert notifications for all users
  const notifications = allUsers.map((recipient: any) => ({
    user_id: recipient.id,
    type,
    title: title.trim(),
    body: msgBody.trim(),
    link: link?.trim() || null,
    is_read: false,
  }));

  const { error } = await (adminClient.from('notifications') as any).insert(notifications);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, sent: allUsers.length });
}

// GET - List recent announcements (notifications of type 'announcement')
export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const adminClient = await createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profileRaw } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  const adminProfile = profileRaw as { role: string } | null;
  if (!adminProfile || adminProfile.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { data, error } = await (adminClient.from('notifications') as any)
    .select('*')
    .eq('type', 'announcement')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data });
}
