import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;

  const { data: { session }, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !session) {
    return res.status(401).json({ error: error?.message || 'Invalid credentials' });
  }

  // Set the Supabase session in a cookie
  res.setHeader('Set-Cookie', `sb:token=${session.access_token}; Path=/; HttpOnly; Secure; SameSite=Lax`);

  // Fetch user role from your database or Supabase user metadata
  const { data: { user } } = await supabase.auth.getUser(session.access_token);
  const userRole = user?.user_metadata?.role || 'user';

  return res.status(200).json({ role: userRole });
}
