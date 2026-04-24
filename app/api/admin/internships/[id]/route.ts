import { createAdminClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const adminClient = await createAdminClient();

  // Delete internship projects first
  await adminClient.from('internship_projects').delete().eq('internship_id', id);
  // Then delete the internship
  const { error } = await adminClient.from('internships').delete().eq('id', id);

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
