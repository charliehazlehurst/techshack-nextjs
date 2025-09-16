// app/api/signin/route.js
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const user = data.user;
    if (!user) return NextResponse.json({ error: 'No user returned' }, { status: 400 });

    // Fetch role from profiles
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError) return NextResponse.json({ error: profileError.message }, { status: 500 });

    return NextResponse.json({
      message: 'Signin successful',
      user,
      role: profile.role,
    }, { status: 200 });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Unexpected error during signin.' }, { status: 500 });
  }
}


