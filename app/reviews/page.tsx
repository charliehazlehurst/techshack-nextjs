'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

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
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_name: userName,
          user_review: userReview,
          rating,
        }),
      });

      if (res.ok) {
        const newReview = await res.json();
        setReviews(prev => [
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

  const renderStars = (value: number) => '★'.repeat(value) + '☆'.repeat(5 - value);

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
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div key={index} className="mb-4 border-b pb-2">
              <p className="font-bold">{review.userName}</p>
              <p>{renderStars(review.rating)}</p>
              <p>{review.userReview}</p>
            </div>
          ))
        ) : (
          <p className="text-center">No reviews yet.</p>
        )}
      </div>
    </main>
  );
}

