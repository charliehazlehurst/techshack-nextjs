import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase'; // Public client
import supabaseAdmin from '@/lib/supabaseAdmin'; // Service role client

// GET: Fetch all reviews
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Fetch error:', error.message);
      return NextResponse.json({ error: 'Failed to fetch reviews.' }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error('Unexpected error fetching reviews:', err);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}

// POST: Submit a new review
export async function POST(req) {
  try {
    const { user_name, user_review, rating } = await req.json();

    if (!user_name || !user_review || typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'All fields are required and rating must be between 1-5.' },
        { status: 400 }
      );
    }

    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('username', user_name)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Username not found.' }, { status: 404 });
    }

    const userId = profile.id;

    const { data: insertedReview, error: insertError } = await supabaseAdmin
      .from('reviews')
      .insert([
        {
          user_id: userId,
          user_name,
          user_review,
          rating,
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError.message);
      return NextResponse.json({ error: 'Failed to submit review.' }, { status: 500 });
    }

    return NextResponse.json(insertedReview, { status: 200 });
  } catch (err) {
    console.error('Unexpected error in POST /reviews:', err);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
