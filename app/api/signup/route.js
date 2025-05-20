import { NextResponse } from 'next/server';
import supabase from '/lib/supabase.js';

export async function POST(req) {
  const body = await req.json();
  const { username, email, password } = body;

  if (!username || !email || !password) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
  }

  try {
    // ✅ Sign up with Supabase Auth
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      return NextResponse.json({ error: signUpError.message }, { status: 400 });
    }

    const userId = authData.user?.id;
    if (!userId) {
      return NextResponse.json({ error: 'User ID missing after sign-up' }, { status: 500 });
    }

    // ✅ Create user profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([{ id: userId, username }]);

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'User registered successfully!' }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Unexpected signup error' }, { status: 500 });
  }
}
