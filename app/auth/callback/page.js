'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function CallbackPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const token_hash = searchParams.get('token_hash');
    const typeParam = searchParams.get('type');

    if (!token_hash || !typeParam) {
      router.push('/error');
      return;
    }

    const emailOtpTypes = ['email', 'signup', 'magiclink', 'recovery', 'invite'];

    async function verify() {
      let error = null;

      if (typeParam === 'sms') {
        // For SMS OTP, 'phone' is required instead of 'token_hash'
        const { error: smsError } = await supabase.auth.verifyOtp({
          phone: token_hash,
          type: 'sms',
        });
        error = smsError;
      } else if (emailOtpTypes.includes(typeParam)) {
        // For email OTPs, pass token_hash and type
        const { error: emailError } = await supabase.auth.verifyOtp({
          token_hash,
          type: typeParam,
        });
        error = emailError;
      } else {
        router.push('/error');
        return;
      }

      if (error) {
        console.error('Error verifying OTP:', error.message);
        router.push('/error');
      } else {
        router.push('/dashboard');
      }

      setLoading(false);
    }

    verify();
  }, [router]);

  return (
    <div style={{ textAlign: 'center', paddingTop: '50px' }}>
      {loading ? (
        <>
          <div className="spinner" />
          <p>Processing login...</p>
          <style jsx>{`
            .spinner {
              margin: 20px auto;
              width: 40px;
              height: 40px;
              border: 4px solid rgba(0, 0, 0, 0.1);
              border-top-color: #000;
              border-radius: 50%;
              animation: spin 1s linear infinite;
            }

            @keyframes spin {
              to {
                transform: rotate(360deg);
              }
            }
          `}</style>
        </>
      ) : (
        <p>Redirecting...</p>
      )}
    </div>
  );
}
