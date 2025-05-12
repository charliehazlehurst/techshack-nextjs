// pages/api/signup.js
import supabase from '../../lib/supabase';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, email, password } = req.body;

  // Input validation
  if (
    !username ||
    !email ||
    !password ||
    typeof username !== 'string' ||
    typeof email !== 'string' ||
    typeof password !== 'string'
  ) {
    return res.status(400).json({ error: 'Invalid input data.' });
  }

  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,20}$/;
  if (!passwordPattern.test(password)) {
    return res.status(400).json({
      error:
        'Password must be 8–20 characters long with uppercase, lowercase, number, and special character.',
    });
  }

  try {
    // Check if email already exists
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(409).json({ error: 'Email already in use.' });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert the new user
    const { data, error: insertError } = await supabase
      .from('users')
      .insert([{ username, email, password: hashedPassword }]);

    if (insertError) {
      return res.status(500).json({ error: insertError.message });
    }

    return res.status(201).json({ message: 'User registered successfully!' });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

