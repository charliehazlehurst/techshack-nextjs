import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase'; // For RLS-safe public use
import supabaseAdmin from '@/lib/supabaseAdmin'; // For service role, use for admin actions

// GET: Fetch reviews
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch reviews.' }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error('Unexpected error fetching reviews:', err);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}

// POST: Submit review
export async function POST(req) {
  try {
    const { user_name, user_review, rating } = await req.json();

    // Basic validation
    if (!user_name || !user_review || !rating) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    // Try to find the user by username in the profiles table
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('username', user_name)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Username not found.' }, { status: 404 });
    }

    const userId = profile.id;

    // Insert review
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
      console.error('Insert error:', insertError);
      return NextResponse.json({ error: 'Failed to submit review.' }, { status: 500 });
    }

    return NextResponse.json(insertedReview, { status: 200 });
  } catch (err) {
    console.error('Unexpected error submitting review:', err);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
