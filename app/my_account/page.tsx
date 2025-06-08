'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/components/auth-context';
import { toast } from 'react-toastify';

export default function MyAccount() {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [newUsername, setNewUsername] = useState(user?.user_metadata?.username || '');
  const [newEmail, setNewEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setNewUsername(user.user_metadata?.username || '');
      setNewEmail(user.email || '');
    }
  }, [user]);

  const handleUpdate = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setMessage('');

  if (!user?.email) {
    setMessage('User email not found.');
    setLoading(false);
    return;
  }

  // Prepare payload for backend
  const updates: any = {
    email: user.email, // current email to find user in DB
  };

  if (newUsername !== user.user_metadata?.username) updates.username = newUsername;
  if (newEmail !== user.email) updates.newEmail = newEmail; // send newEmail as separate field

  if (Object.keys(updates).length === 1) { // only has email (current email)
    setMessage('No changes detected.');
    setLoading(false);
    return;
  }

  try {
    const res = await fetch('/api/update-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || 'Update failed.');
      toast.error(data.error || 'Update failed.');
    } else {
      setMessage('Profile updated!');
      toast.success('Account updated.');
    }
  } catch (err) {
    setMessage('Unexpected error.');
    toast.error('Unexpected error.');
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">My Account</h1>

      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label>Email</label>
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="w-full p-2 border rounded"
            disabled={loading}
          />
        </div>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            className="w-full p-2 border rounded"
            disabled={loading}
          />
        </div>
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded" disabled={loading}>
          {loading ? 'Updating...' : 'Update Details'}
        </button>
        {message && <p className="mt-4 text-center text-red-600">{message}</p>}
      </form>
    </div>
  );
}




