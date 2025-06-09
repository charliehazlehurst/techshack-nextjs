import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { pwnedPassword } from 'hibp';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Must be service role
);

export async function POST(req) {
  try {
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password too short' }, { status: 400 });
    }

    const breachCount = await pwnedPassword(password);
    if (breachCount > 0) {
      return NextResponse.json({
        error: `This password has appeared in ${breachCount} data breaches. Please use a more secure password.`,
      }, { status: 400 });
    }

    // Create auth user first
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: false, // Set to false to require email confirmation
      user_metadata: { username }, // Optional, but can store username directly in auth
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    const user = authData?.user;

    if (!user || !user.id) {
      return NextResponse.json({ error: 'User creation failed.' }, { status: 500 });
    }

    // Insert into profiles table
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert([{ id: user.id, email, username, role: 'user' }]);

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    return NextResponse.json(
      {
        message: 'Signup successful — please check your email to confirm your account.',
      },
      { status: 201 }
    );

  } catch (err) {
    console.error('Unexpected signup error:', err);
    return NextResponse.json({ error: 'Unexpected error during signup.' }, { status: 500 });
  }
}



