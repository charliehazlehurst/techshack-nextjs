import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin'; // Use service role key only in server-side code

export async function POST(req) {
  try {
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    // Create user WITHOUT email confirmation
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // <-- confirms immediately
    });

    if (authError) return NextResponse.json({ error: authError.message }, { status: 400 });

    const user = authData.user;

    // Add profile
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert([{ id: user.id, username, email, role: 'user' }]);

    if (profileError) return NextResponse.json({ error: profileError.message }, { status: 500 });

    return NextResponse.json({
      message: 'Signup successful! You can now sign in.',
      user: { id: user.id, email: user.email },
    }, { status: 201 });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Unexpected error during signup.' }, { status: 500 });
  }
}






