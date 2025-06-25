'use client';

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function MyAccount() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const router = useRouter();

  // Step 1
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Step 2
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/verify-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || 'Verification failed.');
        toast.error(data.error || 'Verification failed.');
      } else {
        toast.success('User verified. You can now update your details.');
        setStep(2);
      }
    } catch (err) {
      setMessage('Unexpected error.');
      toast.error('Unexpected error.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (!newUsername && !newEmail && !newPassword) {
      setMessage('Please enter at least one field to update.');
      setLoading(false);
      return;
    }

    if (newPassword && newPassword.length < 8) {
      setMessage('Password must be at least 8 characters.');
      toast.error('Password must be at least 8 characters.');
      setLoading(false);
      return;
    }

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.access_token) {
        throw new Error('User session not found');
      }

      const res = await fetch('/api/update-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          email, // for identification
          username: newUsername,
          newEmail,
          password: newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || 'Update failed.');
        toast.error(data.error || 'Update failed.');
      } else {
        toast.success('Details successfully updated.');
        setMessage('Details successfully updated.');

        setTimeout(async () => {
          await supabase.auth.signOut();
          router.push('/');
        }, 2000);
      }
    } catch (err) {
      console.error(err);
      setMessage('Unexpected error.');
      toast.error('Unexpected error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">My Account</h1>

      {step === 1 ? (
        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border rounded"
              disabled={loading}
              required
            />
          </div>
          <div>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              disabled={loading}
              required
            />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              disabled={loading}
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify Account'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label>New Username</label>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="w-full p-2 border rounded"
              disabled={loading}
            />
          </div>
          <div>
            <label>New Email</label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full p-2 border rounded"
              disabled={loading}
            />
          </div>
          <div>
            <label>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border rounded"
              disabled={loading}
            />
          </div>
          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded" disabled={loading}>
            {loading ? 'Updating...' : 'Update Account'}
          </button>
        </form>
      )}

      {message && <p className="mt-4 text-center text-red-600">{message}</p>}
    </div>
  );
}


