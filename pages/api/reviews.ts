import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('reviews')
      .select('user_name, user_review, rating, created_at')
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1] || '';

    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { user_name, user_review, rating } = req.body;

    if (!user_name || !user_review || !rating) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const { data, error } = await supabase
      .from('reviews')
      .insert([
        {
          user_name,
          user_review,
          rating,
        },
      ])
      .select();

    if (error || !data || data.length === 0) {
      return res.status(500).json({ error: error?.message || 'Insert failed' });
    }

    return res.status(201).json(data[0]);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}





