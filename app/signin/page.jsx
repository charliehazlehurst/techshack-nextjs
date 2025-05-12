'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/router'; // for navigation

export default function Signin() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic form validation (optional, can be extended)
    if (!username || !email || !password) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/signin', { // Replace with your backend API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Redirect to home page or user account page after successful sign-in
        router.push('/'); // Change '/my_account' if you want to redirect to user account page
      } else {
        setErrorMessage(data.error || 'An error occurred. Please try again.');
      }
    } catch (error) {
      console.error('Sign-in error:', error);
      setErrorMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-4">
      <div className="logo py-4 text-center">
        <a href="/">
          <img src="/images/logo.jpg" alt="Tech Shack Logo" width={310} height={136} />
        </a>
      </div>

      <div className="auth-links text-center mb-4">
        <span className="font-bold">SIGN IN</span> | <a href="/signup">REGISTER</a>
      </div>

      <h1 className="text-center text-3xl font-bold mb-6">SIGN IN</h1>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto text-center space-y-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className={`bg-blue-600 text-white px-4 py-2 rounded ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>

        {errorMessage && <p className="mt-2 text-red-600">{errorMessage}</p>}
      </form>

      <footer className="text-center mt-12">
        <a href="mailto:techshack21@gmail.com">@techshack.co.uk</a> <br /> <br />
        <a href="https://www.instagram.com/techshack_uk?igsh=MWZla3MwNDRraHZk">
          <img src="/images/insta.jpg" alt="Tech Shack Instagram" />
        </a>
        <a href="https://www.facebook.com/profile.php?id=100092390929930">
          <img src="/images/fb.jpg" alt="Tech Shack Facebook" />
        </a>
        <p>©2024 by Tech Shack</p>
      </footer>
    </main>
  );
}
