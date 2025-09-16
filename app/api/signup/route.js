// app/api/signup/route.js
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase'; // regular client is fine
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req) {
  try {
    const { username, email, password } = await req.json();
    if (!username || !email || !password) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    // Create user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const userId = data.user?.id;
    if (!userId) return NextResponse.json({ error: 'User creation failed.' }, { status: 500 });

    // Insert profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([{ id: userId, username, email, role: 'user' }]);

    if (profileError) return NextResponse.json({ error: profileError.message }, { status: 500 });

    return NextResponse.json({ message: 'Signup successful!' }, { status: 201 });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Unexpected error during signup.' }, { status: 500 });
  }
}







