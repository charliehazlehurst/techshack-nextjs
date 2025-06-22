import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';
import { pwnedPassword } from 'hibp';

export async function POST(req) {
  try {
    const { email, username: newUsername, newEmail, password } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Current email is required.' }, { status: 400 });
    }

    const updates = {};
    if (newUsername) updates.username = newUsername;
    if (newEmail) updates.email = newEmail;

    if (password) {
      if (password.length < 8) {
        return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
      }

      const isPwned = await pwnedPassword(password);
      if (isPwned) {
        return NextResponse.json({ error: 'Please choose a more secure password.' }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      updates.password = hashedPassword;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No fields to update.' }, { status: 400 });
    }

    const { error } = await supabase
      .from('users')
      .update(updates)
      .eq('email', email);

    if (error) {
      console.error('Supabase update error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'User updated successfully.' }, { status: 200 });
  } catch (err) {
    console.error('Update error:', err);
    return NextResponse.json({ error: 'Server error during update.' }, { status: 500 });
  }
}


