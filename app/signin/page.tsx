'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function SigninPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage('Signin failed: ' + (data.error || 'Invalid credentials'));
        return;
      }

      setMessage('');
      router.push('/dashboard'); // Redirect on success
    } catch (error) {
      console.error('Error during signin:', error);
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <main className="min-h-screen p-4 bg-gray-50">
      <div className="logo py-4 text-center">
        <Link href="/">
          <Image src="/images/logo.jpg" alt="Tech Shack Logo" width={310} height={136} />
        </Link>
      </div>

      <h1 className="text-center text-3xl font-bold mb-6">SIGN IN</h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto text-center space-y-4 bg-white p-6 rounded shadow-md"
      >
        <input
          type="email"
          placeholder="Email"
          autoComplete="email"
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

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Sign In
        </button>

        <p className="text-sm text-gray-600">
          Don’t have an account?{' '}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Register here
          </Link>
        </p>

        {message && <p className="mt-2 text-red-600">{message}</p>}
      </form>
    </main>
  );
}




