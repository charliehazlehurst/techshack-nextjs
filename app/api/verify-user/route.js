import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const { username, email, password } = await req.json();

    // Validate inputs
    if (!username || !email || !password) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    // Find the user
    const { data: user, error } = await supabase
      .from('users')
      .select('id, username, password')
      .eq('email', email)
      .eq('username', username)
      .single();

    if (error || !user) {
      return NextResponse.json({ error: 'User not found or incorrect details.' }, { status: 404 });
    }

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 });
    }

    return NextResponse.json({ userId: user.id }, { status: 200 });
  } catch (err) {
    console.error('Verification error:', err);
    return NextResponse.json({ error: 'Server error during verification.' }, { status: 500 });
  }
}
