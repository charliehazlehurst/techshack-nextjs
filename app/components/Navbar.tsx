'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Retrieve 'authenticated' flag from sessionStorage
    const token = sessionStorage.getItem('authenticated');
    setIsAuthenticated(!!token);
    setHasMounted(true);
  }, []);

  const navItems = [
    { href: '/', label: 'HOME' },
    { href: '/about', label: 'ABOUT' },
    { href: '/services', label: 'SERVICES' },
    { href: '/booking', label: 'BOOK NOW' },
    { href: '/reviews', label: 'REVIEWS' },
    { href: '/contact', label: 'CONTACT US' },
  ];

  const handleSignOut = () => {
    sessionStorage.removeItem('authenticated'); // Clear the session
    setIsAuthenticated(false); // Update the state to reflect logged-out status
  };

  return (
    <nav className="w-full flex flex-wrap justify-center gap-4 text-lg font-semibold p-4 bg-white z-50 shadow-md">
      {navItems.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={`${
            pathname === href ? 'text-orange-500' : 'text-black'
          } hover:text-orange-500 transition-colors duration-300`}
        >
          {label}
        </Link>
      ))}

      {hasMounted && (
        isAuthenticated ? (
          <>
            <Link
              href="/my_account"
              className={`${
                pathname === '/my_account' ? 'text-orange-500' : 'text-black'
              } hover:text-orange-500 transition-colors duration-300`}
            >
              MY ACCOUNT
            </Link>
            <button
              onClick={handleSignOut}
              className="text-black hover:text-orange-500 transition-colors duration-300"
            >
              SIGN OUT
            </button>
          </>
        ) : (
          <>
            <Link
              href="/signin"
              className={`${
                pathname === '/signin' ? 'text-orange-500' : 'text-black'
              } hover:text-orange-500 transition-colors duration-300`}
            >
              SIGN IN
            </Link>
            <Link
              href="/signup"
              className={`${
                pathname === '/signup' ? 'text-orange-500' : 'text-black'
              } hover:text-orange-500 transition-colors duration-300`}
            >
              REGISTER
            </Link>
          </>
        )
      )}
    </nav>
  );
};

export default Navbar;




