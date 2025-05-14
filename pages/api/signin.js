// pages/api/signin.js
import supabase from '/lib/supabase.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'; // Replace in production!

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Please provide both email and password.' });
  }

  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, username, email, password')
      .eq('email', email)
      .single();

    if (error || !user) {
      console.warn('[SIGNIN] User not found or Supabase error:', error);
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      console.warn('[SIGNIN] Incorrect password for:', email);
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // ✅ Create JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      JWT_SECRET,
      { expiresIn: '7d' } // 1 week
    );

    // ✅ Optionally set cookie
    res.setHeader(
      'Set-Cookie',
      serialize('token', token, {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      })
    );

    return res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    console.error('[SIGNIN] Internal error:', err);
    return res.status(500).json({ error: 'An internal server error occurred.' });
  }
}


