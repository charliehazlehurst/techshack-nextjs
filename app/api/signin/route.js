import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req) {
  const { email, password } = await req.json();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const user = data.user;

  if (!user) {
    return NextResponse.json({ error: 'No user returned' }, { status: 400 });
  }

  if (!user.email_confirmed_at && !user.confirmed_at) {
    return NextResponse.json({
      error: 'Please verify your email before signing in.',
      emailConfirmed: false,
    }, { status: 403 });
  }

  // Fetch user's role from profiles (optional)
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  return NextResponse.json({
    message: 'Signin successful',
    role: profile.role,
    emailConfirmed: true,
  }, { status: 200 });
}


