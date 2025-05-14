'use client';

import React, { useState } from 'react';

export default function MyAccount() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [message, setMessage] = useState('');

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('email', email);
    formData.append('username', username);
    formData.append('password', password);
    if (profilePicture) {
      formData.append('profilePicture', profilePicture);
    }

    const response = await fetch('/api/update-profile', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    if (response.ok) {
      setMessage('Profile updated successfully!');
    } else {
      setMessage(result.error || 'An error occurred while updating your profile.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-center text-3xl font-bold">My Account</h1>
      <form onSubmit={handleProfileUpdate} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="file"
          onChange={(e) => setProfilePicture(e.target.files ? e.target.files[0] : null)}
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
          Update Profile
        </button>
      </form>
      {message && <p className="text-center text-red-600 mt-4">{message}</p>}
    </div>
  );
}
