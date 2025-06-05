import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase'; // public client for auth
import supabaseAdmin from '@/lib/supabaseAdmin'; // admin client for bypassing RLS
import { pwnedPassword } from 'hibp';

export async function POST(req) {
  try {
    const { username, email, password } = await req.json();

    // Basic validation
    if (!username || !email || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password too short' }, { status: 400 });
    }

    // Optional: check password against HaveIBeenPwned
    const breachCount = await pwnedPassword(password);
    if (breachCount > 0) {
      return NextResponse.json({
        error: `This password has appeared in ${breachCount} data breaches. Please use a more secure password.`,
      }, { status: 400 });
    }

    // Step 1: Sign up the user using the public client
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    const user = authData?.user;
    if (!user) {
      return NextResponse.json({ error: 'Signup failed.' }, { status: 500 });
    }

    // Step 2: Insert into `profiles` using the admin client (bypasses RLS)
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert([{ id: user.id, email, username, role: 'user' }]);

    if (profileError) {
      console.error('Profile insert error:', profileError);
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    // Success
    return NextResponse.json(
      {
        message: user.confirmed_at
          ? 'User registered and confirmed!'
          : 'Signup successful — please verify your email.',
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('Unexpected signup error:', err);
    return NextResponse.json({ error: 'Unexpected error during signup.' }, { status: 500 });
  }
}



