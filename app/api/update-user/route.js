// app/api/update-user/route.js

import { NextResponse } from 'next/server';
import { pwnedPassword } from 'hibp';
import { createSupabaseServerClient } from '@/lib/supabaseServerClient'; // must be implemented

export async function POST(req, res) {
  const supabase = createSupabaseServerClient(req, res);

  try {
    const { username: newUsername, email: newEmail, password: newPassword } = await req.json();

    const {
      data: { user },
      error: sessionError,
    } = await supabase.auth.getUser();

    if (sessionError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updates = {};

    if (newUsername) updates.username = newUsername;

    if (newPassword) {
      if (newPassword.length < 8) {
        return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
      }

      const isPwned = await pwnedPassword(newPassword);
      if (isPwned) {
        return NextResponse.json({ error: 'Please choose a more secure password.' }, { status: 400 });
      }

      const { error: pwError } = await supabase.auth.updateUser({ password: newPassword });
      if (pwError) {
        return NextResponse.json({ error: pwError.message }, { status: 500 });
      }
    }

    if (newEmail) {
      const { error: emailError } = await supabase.auth.updateUser({ email: newEmail });
      if (emailError) {
        return NextResponse.json({ error: emailError.message }, { status: 500 });
      }
    }

    if (Object.keys(updates).length > 0) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (profileError) {
        return NextResponse.json({ error: profileError.message }, { status: 500 });
      }
    }

    return NextResponse.json({ message: 'User updated successfully.' }, { status: 200 });

  } catch (err) {
    console.error('Update error:', err);
    return NextResponse.json({ error: 'Server error during update.' }, { status: 500 });
  }
}

