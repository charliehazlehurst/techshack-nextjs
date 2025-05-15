import { NextResponse } from 'next/server';
import supabase from '/lib/supabase.js';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  const body = await req.json();
  const { username, email, password } = body;

  if (!username || !email || !password) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: 'Password must be at least 8 characters.' },
      { status: 400 }
    );
  }

  try {
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json({ error: 'Email already in use.' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { error: insertError } = await supabase
      .from('users')
      .insert([{ username, email, password: hashedPassword }]);

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'User registered successfully!' }, { status: 201 });
  } catch (err) {
    console.error('Signup error:', err);
    return NextResponse.json({ error: 'An error occurred during signup.' }, { status: 500 });
  }
}
