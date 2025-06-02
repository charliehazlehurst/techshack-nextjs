'use client';

import { AuthProvider } from './components/auth-context'; // Relative to app/AuthProviderWrapper.tsx
import React, { ReactNode } from 'react';

export default function AuthProviderWrapper({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

