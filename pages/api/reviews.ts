import type { NextApiRequest, NextApiResponse } from 'next';
import { createServerClient } from '@supabase/ssr';
import { type CookieOptions } from '@supabase/ssr';

type Review = {
  id: string;
  user_name: string;
  user_review: string;
  created_at: string;
};

type NewReview = {
  id: string;
  user_name: string;
  user_review: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!,
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
      .select('user_name, user_review, created_at')
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    if (!session) return res.status(401).json({ error: 'Unauthorized' });

    const { user_name, user_review } = req.body;
    if (!user_name || !user_review) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const { data, error } = await supabase
      .from('reviews')
      .insert<NewReview>([
        {
          user_name,
          user_review,
          id: session.user.id,
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
