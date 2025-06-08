import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const { email, username, newEmail, password } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Current email is required' }, { status: 400 });
    }

    const updates = {};
    if (username) updates.username = username;
    if (newEmail) updates.email = newEmail; // update email if provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updates.password = hashedPassword;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    // Update user where email equals current email
    const { error } = await supabase
      .from('users')
      .update(updates)
      .eq('email', email);

    if (error) {
      console.error('Supabase update error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'User updated successfully' }, { status: 200 });

  } catch (err) {
    console.error('Update error:', err);
    return NextResponse.json({ error: 'Server error during update' }, { status: 500 });
  }
}


