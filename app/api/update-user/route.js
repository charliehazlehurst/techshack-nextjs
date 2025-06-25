import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { pwnedPassword } from 'hibp';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ error: 'Missing access token.' }, { status: 401 });
    }

    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized user.' }, { status: 401 });
    }

    const body = await req.json();
    const { username: newUsername, newEmail, password: newPassword } = body;

    const updates = {};
    const authUpdates = {};

    if (newUsername) updates.username = newUsername;
    if (newEmail) authUpdates.email = newEmail;

    if (newPassword) {
      if (newPassword.length < 8) {
        return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
      }

      const isPwned = await pwnedPassword(newPassword);
      if (isPwned) {
        return NextResponse.json({ error: 'Please choose a more secure password.' }, { status: 400 });
      }

      authUpdates.password = newPassword;
    }

    if (Object.keys(authUpdates).length > 0) {
      const { error: authUpdateError } = await supabaseAdmin.auth.admin.updateUserById(user.id, authUpdates);
      if (authUpdateError) {
        console.error('Auth update error:', authUpdateError);
        return NextResponse.json({ error: authUpdateError.message }, { status: 500 });
      }
    }

    if (Object.keys(updates).length > 0) {
      const { error: profileUpdateError } = await supabaseAdmin
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (profileUpdateError) {
        console.error('Profile update error:', profileUpdateError);
        return NextResponse.json({ error: profileUpdateError.message }, { status: 500 });
      }
    }

    return NextResponse.json({ message: 'User updated successfully.' }, { status: 200 });
  } catch (err) {
    console.error('Unexpected server error:', err);
    return NextResponse.json({ error: 'Server error during update.' }, { status: 500 });
  }
}

