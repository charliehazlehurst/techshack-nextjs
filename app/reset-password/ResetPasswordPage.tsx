'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { Loader2 } from 'lucide-react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    if (!searchParams) return;

    const token = searchParams.get('access_token');

    if (token) {
      setAccessToken(token);
    } else {
      toast.error('Invalid or missing reset token.');
      router.push('/signin');
    }
  }, [searchParams, router]);

  const validatePassword = (pwd: string) => {
    const minLength = 8;
    const hasNumber = /\d/.test(pwd);
    const hasSpecial = /[!@#$%^&*]/.test(pwd);

    if (pwd.length < minLength) return 'Password must be at least 8 characters.';
    if (!hasNumber) return 'Password must contain at least one number.';
    if (!hasSpecial) return 'Password must contain at least one special character.';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (password !== confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setFormError(passwordError);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken, newPassword: password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.error || 'Password reset failed.');
        setLoading(false);
        return;
      }

      setResetSuccess(true);
      setLoading(false);
    } catch (error) {
      console.error('Error resetting password:', error);
      setFormError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  if (resetSuccess) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white p-6 rounded shadow space-y-4 text-center">
          <h1 className="text-2xl font-bold text-green-600">Password Reset Successful!</h1>
          <p className="text-gray-700">You can now sign in with your new password.</p>
          <button
            onClick={() => router.push('/signin')}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Go to Sign In
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-md w-full bg-white p-6 rounded shadow space-y-4 text-center"
      >
        <h1 className="text-2xl font-bold mb-4">Reset Your Password</h1>

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 border rounded"
          disabled={loading}
        />

        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full p-2 border rounded"
          disabled={loading}
        />

        {formError && (
          <p className="text-red-600 text-sm">{formError}</p>
        )}

        <button
          type="submit"
          className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded text-white ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin w-4 h-4" />
              Resetting...
            </>
          ) : (
            'Reset Password'
          )}
        </button>
      </form>
    </main>
  );
}
