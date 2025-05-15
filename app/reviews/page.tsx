'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);


type Review = {
  userName: string;
  userReview: string;
  rating: number;
};

export default function ReviewsPage() {
  const [userName, setUserName] = useState('');
  const [userReview, setUserReview] = useState('');
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);

  // Fetch reviews on load
  useEffect(() => {
    fetch('/api/reviews')
      .then(res => res.json())
      .then(data => {
        const normalized = data.map((review: any) => ({
          userName: review.user_name,
          userReview: review.user_review,
          rating: review.rating || 0,
        }));
        setReviews(normalized);
      })
      .catch(err => console.error('Failed to fetch reviews:', err));
  }, []);

  // Submit review
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData?.session?.access_token;

    if (!accessToken) {
      alert('You must be signed in to submit a review.');
      return;
    }

    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        user_name: userName,
        user_review: userReview,
        rating,
      }),
    });

    if (res.ok) {
      const newReview = await res.json();
      setReviews((prev) => [
        ...prev,
        {
          userName: newReview.user_name,
          userReview: newReview.user_review,
          rating: newReview.rating || 0,
        },
      ]);
      setUserName('');
      setUserReview('');
      setRating(0);
    } else {
      alert('Failed to submit review.');
    }
  } catch (error) {
    console.error('Error submitting review:', error);
  }
};
}

