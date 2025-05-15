import type { NextApiRequest, NextApiResponse } from 'next';
import { createServerClient } from '@supabase/ssr';
import { type CookieOptions } from '@supabase/ssr';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies[name];
        },
        set(name: string, value: string, options: CookieOptions) {
          res.setHeader('Set-Cookie', `${name}=${value}; Path=/; HttpOnly`);
        },
        remove(name: string, options: CookieOptions) {
          res.setHeader('Set-Cookie', `${name}=; Path=/; Max-Age=0`);
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('reviews')
      .select('user_name, user_review, rating, created_at')
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    if (!session) return res.status(401).json({ error: 'Unauthorized' });

    const { user_name, user_review, rating } = req.body;

    if (!user_name || !user_review || typeof rating !== 'number') {
      return res.status(400).json({ error: 'Missing or invalid fields' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const { data, error } = await supabase
      .from('reviews')
      .insert([
        { user_name, user_review, rating }
      ])
      .select();

    if (error || !data || data.length === 0) {
      return res.status(500).json({ error: error?.message || 'Insert failed' });
    }

    return res.status(201).json(data[0]);
  }

  // Default fallback for unsupported HTTP methods
  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}

