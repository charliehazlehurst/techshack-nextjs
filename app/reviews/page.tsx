'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

type Review = {
  user_name: string;
  user_review: string;
  rating: number;
};

export default function ReviewsPage() {
  const [userName, setUserName] = useState('');
  const [userReview, setUserReview] = useState('');
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch reviews
  useEffect(() => {
    fetch('/api/reviews')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch reviews');
        return res.json();
      })
      .then(data => {
        setReviews(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch reviews:', err);
        setLoading(false);
      });
  }, []);

  // Submit review
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      user_name: userName,
      user_review: userReview,
      rating,
    };

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`, // Only if required by your Supabase RLS
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Failed to submit review');
      }

      const newReview = await res.json();
      setReviews(prev => [newReview, ...prev]);
      setUserName('');
      setUserReview('');
      setRating(0);
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const renderStars = (value: number) =>
    [...Array(5)].map((_, i) => (
      <span key={i} className={i < value ? 'text-yellow-400' : 'text-gray-300'}>
        ★
      </span>
    ));

  return (
    <main className="min-h-screen p-4">
      {/* Logo */}
      <div className="logo py-4 text-center">
        <Link href="/">
          <Image src="/images/logo.jpg" alt="Tech Shack Logo" width={310} height={136} />
        </Link>
      </div>

      <h1 className="text-center text-3xl font-bold mb-6">SUBMIT A REVIEW BELOW!</h1>

      {/* Review Form */}
      <form onSubmit={handleSubmit} className="text-center max-w-md mx-auto mb-8">
        <input
          type="text"
          placeholder="Name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
          className="w-full mb-4 p-2 border rounded"
        />
        <textarea
          rows={4}
          placeholder="Review"
          value={userReview}
          onChange={(e) => setUserReview(e.target.value)}
          required
          className="w-full mb-4 p-2 border rounded"
        />
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Rating:</label>
          <div className="flex justify-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setRating(star)}
                className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
              >
                ★
              </button>
            ))}
          </div>
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Submit Review
        </button>
      </form>

      {/* Divider */}
      <hr className="w-3/4 mx-auto my-6 border-gray-400" />

      {/* Display Reviews */}
      <div className="max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold text-center mb-4">Reviews:</h2>
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div key={index} className="mb-4 border-b pb-2">
              <p className="font-bold">{review.user_name}</p>
              <p>{renderStars(review.rating)}</p>
              <p>{review.user_review}</p>
            </div>
          ))
        ) : (
          <p className="text-center">No reviews yet.</p>
        )}
      </div>
    </main>
  );
}


