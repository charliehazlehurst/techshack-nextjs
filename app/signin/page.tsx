'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // ✅ Correct for App Router

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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/'); // ✅ Works in App Router
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
      {/* UI code here */}
    </main>
  );
}
