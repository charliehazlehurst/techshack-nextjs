import { NextResponse } from 'next/server';
import supabase from '/lib/supabase.js';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  const body = await req.json();
  const { userId, username, email, password } = body;

  const updates = {};
  if (username) updates.username = username;
  if (email) updates.email = email;
  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    updates.password = hashedPassword;
  }

  const { error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'User updated successfully' }, { status: 200 });
}
