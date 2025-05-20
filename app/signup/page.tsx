'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      setMessage('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('Signup error:', data.error);
        setMessage(data.error || 'Signup failed.');
        return;
      }

      // ✅ Redirect or auto-login
      setMessage('Signup successful! Redirecting...');
      setTimeout(() => {
        router.push('/'); // Change route if needed
      }, 1500);
    } catch (err) {
      console.error('Unexpected signup error:', err);
      setMessage('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-4">
      <div className="logo py-4 text-center">
        <Link href="/">
          <Image src="/images/logo.jpg" alt="Tech Shack Logo" width={310} height={136} />
        </Link>
      </div>

      <h1 className="text-center text-3xl font-bold mb-6">REGISTER</h1>

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
          placeholder="Password (min 8 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
        {message && <p className="mt-2 text-red-600">{message}</p>}
      </form>
    </main>
  );
}

