// app/auth/callback/page.js
'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
export default function CallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token_hash = searchParams.get('token_hash');
    const type = searchParams.get('type');

    if (token_hash && type) {
      supabase.auth
        .verifyOtp({ token_hash, type })
        .then(({ error }) => {
          if (error) {
            console.error('Error verifying OTP:', error.message);
            router.push('/error');
          } else {
            router.push('/dashboard');
          }
        });
    } else {
      router.push('/error');
    }
  }, [router, searchParams]);

  return <p>Processing login...</p>;
}
