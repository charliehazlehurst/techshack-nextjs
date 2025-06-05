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
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password too short' }, { status: 400 });
    }

    const breachCount = await pwnedPassword(password);
    if (breachCount > 0) {
      return NextResponse.json({
        error: `This password has appeared in ${breachCount} data breaches. Please use a more secure password.`,
      }, { status: 400 });
    }

    // ✅ Check if user already exists
    const { data: users, error: fetchError } = await supabaseAdmin.auth.admin.listUsers({ email });
    if (fetchError) {
      return NextResponse.json({ error: 'Error checking user existence.' }, { status: 500 });
    }

    let user;

    if (users?.users?.length > 0) {
      user = users.users[0]; // 👈 Use existing user
    } else {
      // 👤 Create new user
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

      if (authError || !authData?.user) {
        return NextResponse.json({ error: authError?.message || 'Signup failed.' }, { status: 400 });
      }

      user = authData.user;
    }

    // 🔍 Check if profile already exists
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .maybeSingle();

    if (!existingProfile) {
      // 🧾 Create missing profile
      const { error: insertError } = await supabaseAdmin
        .from('profiles')
        .insert([{ id: user.id, email, username, role: 'user' }]);

      if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }
    }

    return NextResponse.json({
      message: user.confirmed_at
        ? 'User registered and confirmed!'
        : 'Signup successful — please verify your email.',
    }, { status: 201 });

  } catch (err) {
    console.error('Signup error:', err);
    return NextResponse.json({ error: 'Unexpected error during signup.' }, { status: 500 });
  }
}



