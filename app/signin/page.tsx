'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import from 'next/compat/router' for pages directory

export default function Signin() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [isClient, setIsClient] = useState(false); // Track if component is mounted on the client
  const router = useRouter(); // This will now work because it's called inside the functional component

  useEffect(() => {
    setIsClient(true); // Set this flag when the component mounts in the client
  }, []); // Empty dependency array means it runs once after the component is mounted

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

  // We don't render anything until we're on the client side
  if (!isClient) {
    return null; // Render nothing while waiting for client-side rendering
  }

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

    </main>
  );
}
