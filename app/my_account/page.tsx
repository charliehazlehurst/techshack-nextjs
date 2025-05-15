'use client';

import React, { useState } from 'react';

export default function MyAccount() {
  const [stage, setStage] = useState<'verify' | 'update'>('verify');
  const [currentEmail, setCurrentEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');

  // For update stage
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setMessage('');
    const res = await fetch('/api/verify-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: currentEmail, password: currentPassword }),
    });
    const data = await res.json();
    setLoading(false);

    if (res.ok && data.userId) {
      setStage('update');
      setMessage('');
    } else {
      setMessage(data.error || 'Invalid credentials.');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newUsername && !newEmail && !newPassword) {
      setMessage('Please enter at least one field to update.');
      return;
    }

    setLoading(true);
    setMessage('');

    const res = await fetch('/api/update-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: currentEmail,       // current email to identify user
        username: newUsername || undefined,
        newEmail: newEmail || undefined,
        password: newPassword || undefined,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setMessage('User details updated successfully!');

      // Clear inputs after success
      setNewUsername('');
      setNewEmail('');
      setNewPassword('');

      // Optional: auto-logout or redirect user for security after email/password change
      if (newEmail || newPassword) {
        // You can redirect to login or clear session here
        setTimeout(() => {
          window.location.href = '/login'; // adjust route as needed
        }, 2500);
      }
    } else {
      setMessage(data.error || 'Failed to update user.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">My Account</h1>

      {stage === 'verify' ? (
        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="email"
            placeholder="Current Email"
            value={currentEmail}
            onChange={(e) => setCurrentEmail(e.target.value)}
            required
            className="w-full p-2 border rounded"
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className="w-full p-2 border rounded"
            disabled={loading}
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded"
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Verify Account'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleUpdate} className="space-y-4">
          <input
            type="text"
            placeholder="New Username"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            className="w-full p-2 border rounded"
            disabled={loading}
          />
          <input
            type="email"
            placeholder="New Email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="w-full p-2 border rounded"
            disabled={loading}
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 border rounded"
            disabled={loading}
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Details'}
          </button>
        </form>
      )}

      {message && <p className="mt-4 text-center text-red-600">{message}</p>}
    </div>
  );
}


