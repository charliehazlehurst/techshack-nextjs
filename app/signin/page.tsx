'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '@/app/components/auth-context';

export default function SigninPage() {
  const router = useRouter();
  const { signIn } = useAuth();

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
        toast.error(data.error || 'Invalid credentials');
        return;
      }

      toast.success('Signed in successfully!');
      signIn(data.user);

      const userRole = data.role;
      if (userRole === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Error during signin:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error('Please enter your email to reset password.');
      return;
    }

    try {
      const res = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Failed to send reset link.');
        return;
      }

      toast.success('Password reset email sent!');
    } catch (error) {
      console.error('Error sending password reset email:', error);
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

        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Sign In
        </button>

        <button
          type="button"
          onClick={handleForgotPassword}
          className="text-blue-600 hover:underline mt-2"
        >
          Forgot Password?
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






