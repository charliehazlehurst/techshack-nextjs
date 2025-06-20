import React from 'react';
import { Suspense } from 'react';
import ResetPasswordPage from './ResetPasswordPage';

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-lg">Loading...</div>}>
      <ResetPasswordPage />
    </Suspense>
  );
}

