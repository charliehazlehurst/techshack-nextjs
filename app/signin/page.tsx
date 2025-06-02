'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Signin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        console.log('[SIGNIN] Success:', data);

        sessionStorage.setItem('authenticated', 'true');
        localStorage.setItem('authenticated', 'true');
        window.dispatchEvent(new Event('authChanged'));

        router.push('/');
      } else {
        console.warn('[SIGNIN] Failed:', data.error);
        setErrorMessage(data.error || 'An error occurred. Please try again.');
      }
    } catch (error) {
      console.error('[SIGNIN] Fetch error:', error);
      setErrorMessage('An unexpected error occurred.');
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

      <h1 className="text-center text-3xl font-bold mb-6">SIGN IN</h1>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto text-center space-y-4">
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
          autoComplete="current-password"
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


