import supabase from '/lib/supabase.js'; // Adjust if needed

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Please provide both email and password.' });
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error('[SIGNIN] Error:', error.message);
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  return res.status(200).json({ message: 'Login successful', user: data.user });
}

