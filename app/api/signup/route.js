import { NextResponse } from 'next/server';
import supabase from '/lib/supabase.js'; // Adjust path if needed

export async function POST(req) {
  const { username, email, password } = await req.json();

  if (!username || !email || !password) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: 'Password must be at least 8 characters.' },
      { status: 400 }
    );
  }

  // Register with Supabase Auth
  const { data: authData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signUpError) {
    return NextResponse.json({ error: signUpError.message }, { status: 400 });
  }

  // Add to profiles table
  const { error: profileError } = await supabase
    .from('profiles')
    .insert([{ id: authData.user.id, username }]);

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'User registered successfully!' }, { status: 201 });
}

