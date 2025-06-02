import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req) {
  try {
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password too short' }, { status: 400 });
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    const user = authData.user;
    if (!user) {
      return NextResponse.json({ error: 'Signup failed.' }, { status: 500 });
    }

    // Insert into profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([{ id: user.id, email, username, role: 'user' }]);

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

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


