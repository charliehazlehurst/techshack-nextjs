'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SigninPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage('Signin failed: ' + (data.error || 'Invalid credentials'));
        toast.error(data.error || 'Invalid credentials');
        return;
      }

      if (data.emailConfirmed === false) {
        setMessage('Please verify your email before signing in.');
        toast.error('Please verify your email before signing in.');
        return;
      }

      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      toast.success('Signed in successfully!');

      const userRole = data.role;
      if (userRole === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/app/page.tsx'); // Redirect non-admin users to homepage
      }
    } catch (error) {
      console.error('Error during signin:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  const handleMagicLink = async () => {
    try {
      const res = await fetch('/api/magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error('Failed to send magic link: ' + (data.error || 'Unknown error'));
        return;
      }

      toast.success('Magic link sent! Please check your email.');
    } catch (error) {
      console.error('Error sending magic link:', error);
      toast.error('An error occurred. Please try again.');
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

        <div className="flex items-center justify-center">
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="rememberMe">Remember Me</label>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Sign In
        </button>

        <button
          type="button"
          onClick={handleMagicLink}
          className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Send Magic Link
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





