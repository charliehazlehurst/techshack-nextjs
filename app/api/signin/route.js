import { NextResponse } from 'next/server';
import supabase from '/lib/supabase.js'; // Adjust path if your supabase.js is elsewhere

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
      console.error('Auth error:', authError);
      return NextResponse.json({ error: authError.message }, { status: 401 });
    }

    const user = authData.user;
    if (!user) {
      return NextResponse.json({ error: 'User not found after login.' }, { status: 500 });
    }

    // Look up user's role from 'profiles' table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      return NextResponse.json({ error: 'Failed to load user profile.' }, { status: 500 });
    }

    return NextResponse.json(
      {
        message: 'Signin successful!',
        role: profile?.role || 'user', // default to 'user' if not set
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('Unexpected signin error:', err);
    return NextResponse.json({ error: 'Unexpected error during signin.' }, { status: 500 });
  }
}
