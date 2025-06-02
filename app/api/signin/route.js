import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing email or password.' }, { status: 400 });
    }

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 401 });
    }

    const user = authData.user;
    if (!user) {
      return NextResponse.json({ error: 'No user returned.' }, { status: 500 });
    }

    // Fetch role from profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError) {
      return NextResponse.json({ error: 'Profile fetch failed' }, { status: 500 });
    }

    return NextResponse.json(
      {
        message: 'Signin successful!',
        role: profile?.role || 'user',
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('Unexpected signin error:', err);
    return NextResponse.json({ error: 'Unexpected error during signin.' }, { status: 500 });
  }
}

