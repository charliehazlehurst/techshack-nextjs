'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Example: check for auth token in localStorage
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token);
  }, []);

  return (
    <div className="py-4 text-center">
      {/* Logo */}
      <div className="logo mb-2">
        <Link href="/">
          <Image src="/images/logo.jpg" alt="Tech Shack Logo" width={310} height={136} />
        </Link>
      </div>

      {/* Auth Links */}
      <div className="auth-links">
        {!isAuthenticated ? (
          <>
            <Link href="/signin" className="mr-2">SIGN IN</Link> |{' '}
            <Link href="/signup" className="ml-2">REGISTER</Link>
          </>
        ) : (
          <Link href="/my_account">MY ACCOUNT</Link>
        )}
      </div>
    </div>
  );
}
