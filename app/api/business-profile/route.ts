import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client (replace with your env vars or config)
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

// POST: Add a new business profile
export async function POST(req: NextRequest) {
  const data = await req.json();
  // TODO: Add authentication and role check (user/admin)
  const { error } = await supabase.from('businesses').insert([data]);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}

// PUT: Edit an existing business profile
export async function PUT(req: NextRequest) {
  const data = await req.json();
  // TODO: Add authentication and role check (user/admin)
  if (!data.id) return NextResponse.json({ error: 'Missing business id' }, { status: 400 });
  const { error } = await supabase.from('businesses').update(data).eq('id', data.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}

// DELETE: Delete a business profile
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  // TODO: Add authentication and role check (user/admin)
  if (!id) return NextResponse.json({ error: 'Missing business id' }, { status: 400 });
  const { error } = await supabase.from('businesses').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}
