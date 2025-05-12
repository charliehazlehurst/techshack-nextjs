// /pages/api/signin.js

import supabase from '../../lib/supabase';

export async function POST(req) {
  const { username, email, password } = await req.json();

  if (!username || !email || !password) {
    return NextResponse.json({ error: 'Please provide all required fields' }, { status: 400 });
  }

  try {
    // Query the 'users' table to find the user by username or email
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .or(`email.eq.${email}`)
      .single();

    if (error || !user) {
      return NextResponse.json({ error: 'Invalid username or email' }, { status: 401 });
    }

    // Validate password (you'll want to hash and compare passwords securely)
    if (password !== user.password) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    // Return success if credentials are correct
    return NextResponse.json({ message: 'Sign-in successful' }, { status: 200 });

  } catch (error) {
    console.error('Error during sign-in:', error);
    return NextResponse.json({ error: 'An error occurred during sign-in' }, { status: 500 });
  }
}

