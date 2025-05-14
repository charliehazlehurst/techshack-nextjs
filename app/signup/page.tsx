'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const session = sessionStorage.getItem('authenticated');
    setIsLoggedIn(session === 'true');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,20}$/;
    if (!passwordPattern.test(password)) {
      setMessage('Password must be 8–20 characters with uppercase, lowercase, number, and special character.');
      return;
    }

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const text = await res.text(); // Read response as plain text first

      if (!res.ok) {
        console.error('Error response:', text);
        setMessage('Signup failed: ' + text);
        return;
      }

      const data = text ? JSON.parse(text) : {};
      console.log('API response:', data);

      setMessage('Registration successful! You may now sign in.');
      setUsername('');
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error('Error during registration:', error);
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <main className="min-h-screen p-4">
      <div className="logo py-4 text-center">
        <Link href="/">
          <Image src="/images/logo.jpg" alt="Tech Shack Logo" width={310} height={136} />
        </Link>
      </div>

      <div className="auth-links text-center mb-4">
        {isLoggedIn ? (
          <Link href="/my_account">MY ACCOUNT</Link>
        ) : (
          <>
            <Link href="/signin">SIGN IN</Link> | <span className="font-bold">REGISTER</span>
          </>
        )}
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
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Register
        </button>
        {message && <p className="mt-2 text-red-600">{message}</p>}
      </form>
    </main>
  );
}
