import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { serviceId, bookingDate } = req.body;

  if (!serviceId || !bookingDate) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const { data, error } = await supabase.from('bookings').insert([
    {
      service_id: serviceId,
      booking_date: bookingDate,
    },
  ]);

  if (error) {
    console.error(error);
    return res.status(500).json({ error: 'Database insertion failed' });
  }

  return res.status(200).json({ message: 'Booking successful', data });
}
