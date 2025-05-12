// /pages/api/signup.js

import supabase from '../../lib/supabase';

export async function POST(req) {
  const { username, email, password } = await req.json();

  if (!username || !email || !password) {
    return NextResponse.json({ error: 'Please provide all required fields' }, { status: 400 });
  }

  try {
    // Insert the user into the 'users' table
    const { data, error } = await supabase
      .from('users')
      .insert([{ username, email, password }]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'User registered successfully!' }, { status: 201 });

  } catch (error) {
    console.error('Error during signup:', error);
    return NextResponse.json({ error: 'An error occurred during registration' }, { status: 500 });
  }
}
