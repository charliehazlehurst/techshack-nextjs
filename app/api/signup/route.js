import { NextResponse } from 'next/server';
import supabase from '/lib/supabase.js';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  const body = await req.json();
  const { username, email, password } = body;

  // Basic validation
  if (!username || !email || !password) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,20}$/;
  if (!passwordPattern.test(password)) {
    return NextResponse.json({
      error:
        'Password must be 8–20 characters with uppercase, lowercase, number, and special character.',
    }, { status: 400 });
  }

  try {
    // Step 1: Create user in Supabase Auth
    const { data: signUpData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError || !signUpData.user) {
      console.error('Auth error:', authError);
      return NextResponse.json({ error: 'Failed to create auth user.' }, { status: 500 });
    }

    const authUserId = signUpData.user.id;

    // Step 2: Hash password (for internal users table if needed)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Step 3: Insert user into your `users` table
    const { error: insertError } = await supabase
      .from('users')
      .insert([{
        username,
        email,
        password: hashedPassword,
        auth_user_id: authUserId, // This should match the FK to auth.users
      }]);

    if (insertError) {
      console.error('Insert error:', insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'User registered successfully!' }, { status: 201 });
  } catch (err) {
    console.error('Unexpected signup error:', err);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}