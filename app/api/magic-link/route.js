import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  // Send magic link
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    console.error('Magic link error:', error);
    return NextResponse.json({ error: 'Error sending confirmation email: ' + error.message }, { status: 400 });
  }

  return NextResponse.json({ message: 'Magic link sent! Please check your email.' }, { status: 200 });
}

