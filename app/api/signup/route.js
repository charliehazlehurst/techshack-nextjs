import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { pwnedPassword } from 'hibp';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    // Check if password is pwned
    const isPwned = await pwnedPassword(password);
    if (isPwned) {
      return NextResponse.json({ error: 'Please choose a more secure password.' }, { status: 400 });
    }

    // Create the user (set email_confirm to false so confirmation is required)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: false,
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    const user = authData?.user;
    if (!user || !user.id) {
      return NextResponse.json({ error: 'User creation failed.' }, { status: 500 });
    }

    // Insert profile
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert([{ id: user.id, email, username, role: 'user' }]);

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    // Send magic link
    const { error: magicLinkError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
    });

    if (magicLinkError) {
      return NextResponse.json({ error: magicLinkError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Signup successful! Please check your email to confirm your account.' }, { status: 201 });

  } catch (err) {
    console.error('Unexpected signup error:', err);
    return NextResponse.json({ error: 'Unexpected error during signup.' }, { status: 500 });
  }
}





