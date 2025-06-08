// app/signup/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '@/app/components/auth-context';

export default function RegisterPage() {
  const router = useRouter();
  const { signIn } = useAuth();      // ✅ Use context
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      setMessage('Password must be at least 8 characters.');
      return;
    }

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage('Signup failed: ' + (data.error || 'Unknown error'));
        toast.error(data.error || 'Registration failed');
        return;
      }

      // ✅ Auto-sign-in after successful registration
      signIn(data.user);
      toast.success('Welcome! You are now signed in.');

      // Redirect to homepage
      router.push('/');
    } catch (error) {
      console.error('Error during registration:', error);
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

      <h1 className="text-center text-3xl font-bold mb-6">REGISTER</h1>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto text-center space-y-4 bg-white p-6 rounded shadow-md">
        <input
          type="text"
          placeholder="Username"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full p‑2 border rounded"
        />
        <input
          type="email"
          placeholder="Email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p‑2 border rounded"
        />
        <input
          type="password"
          placeholder="Password (min 8 chars)"
          autoComplete="new‑password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p‑2 border rounded"
        />
        <button type="submit" className="w-full bg-blue‑600 text-white px‑4 py‑2 rounded hover:bg-blue‑700">
          Register
        </button>
        {message && <p className="mt-2 text-red-600">{message}</p>}
      </form>
    </main>
  );
}




