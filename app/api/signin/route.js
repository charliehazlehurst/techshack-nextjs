import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase'; // client-side anon key

export async function POST(req) {
  const { email, password } = await req.json();

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({
      message: 'Signin successful',
      user: data.user,
    }, { status: 200 });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Unexpected error during signin.' }, { status: 500 });
  }
}


