import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req) {
  const { accessToken, newPassword } = await req.json();

  if (!accessToken || !newPassword) {
    return NextResponse.json({ error: 'Missing token or new password.' }, { status: 400 });
  }

  // Attach the token to Supabase client to perform the update
  const { error } = await supabase.auth.updateUser(
    { password: newPassword },
    { access_token: accessToken }
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ message: 'Password updated successfully.' }, { status: 200 });
}
