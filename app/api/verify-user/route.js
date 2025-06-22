// app/api/verify-user/route.js

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req) {
  try {
    const { username, email, password } = await req.json();

    // Validate inputs
    if (!username || !email || !password) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    // Try to sign in the user using Supabase Auth
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError || !signInData.user) {
      return NextResponse.json({ error: 'Incorrect email or password.' }, { status: 401 });
    }

    const userId = signInData.user.id;

    // Check username in profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', userId)
      .single();

    if (profileError || !profile || profile.username !== username) {
      return NextResponse.json({ error: 'Incorrect username.' }, { status: 401 });
    }

    return NextResponse.json({ userId }, { status: 200 });
  } catch (err) {
    console.error('Verification error:', err);
    return NextResponse.json({ error: 'Server error during verification.' }, { status: 500 });
  }
}
