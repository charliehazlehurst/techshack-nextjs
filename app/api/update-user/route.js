import { NextResponse } from 'next/server';
import supabaseAdmin from '@/lib/supabaseAdmin';  // default import without {}
import { pwnedPassword } from 'hibp';

export async function POST(req) {
  try {
    const { email, username: newUsername, newEmail, password: newPassword } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Current email is required.' }, { status: 400 });
    }

    // Find the user via email using supabaseAdmin
    const { data: { user }, error: userError } = await supabaseAdmin.auth.admin.getUserByEmail(email);

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    const updates = {};
    const authUpdates = {};

    // Prepare profile updates
    if (newUsername) updates.username = newUsername;

    // Prepare auth updates
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

    // Update auth fields (email/password)
    if (Object.keys(authUpdates).length > 0) {
      const { error: authUpdateError } = await supabaseAdmin.auth.admin.updateUserById(user.id, authUpdates);
      if (authUpdateError) {
        console.error('Auth update error:', authUpdateError);
        return NextResponse.json({ error: authUpdateError.message }, { status: 500 });
      }
    }

    // Update profile (username)
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
    console.error('Update error:', err);
    return NextResponse.json({ error: 'Server error during update.' }, { status: 500 });
  }
}
