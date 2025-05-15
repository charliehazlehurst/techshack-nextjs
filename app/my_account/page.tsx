'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function MyAccount() {
  const [stage, setStage] = useState<'verify' | 'update'>('verify');
  const [currentEmail, setCurrentEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const router = useRouter();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('/api/verify-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: currentEmail, password: currentPassword }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok && data.userId) {
      setUserId(data.userId);
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

    setConfirming(true);
  };

  const confirmUpdate = async () => {
    setConfirming(false);
    setLoading(true);

    const res = await fetch('/api/update-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        username: newUsername || undefined,
        email: newEmail || undefined,
        password: newPassword || undefined,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      toast.success('User details updated successfully!');
      setNewUsername('');
      setNewEmail('');
      setNewPassword('');
      setMessage('');

      if (newEmail || newPassword) {
        toast('Logging out for security...');
        setTimeout(() => {
          router.push('/login'); // Or use logout logic if you have one
        }, 1500);
      }
    } else {
      toast.error(data.error || 'Failed to update user.');
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
          />
          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded"
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
          />
          <input
            type="email"
            placeholder="New Email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded"
          >
            {loading ? 'Updating...' : 'Update Details'}
          </button>
        </form>
      )}

      {message && <p className="mt-4 text-center text-red-600">{message}</p>}

      {/* Confirmation Modal */}
      {confirming && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full text-center">
            <p className="mb-4 text-lg">Are you sure you want to update your details?</p>
            <div className="flex justify-around">
              <button
                onClick={() => setConfirming(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

