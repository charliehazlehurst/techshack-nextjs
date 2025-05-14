'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <div className="py-4 text-center">
      {/* Logo */}
      <div className="logo mb-2">
        <Link href="/">
          <Image src="/images/logo.jpg" alt="Tech Shack Logo" width={310} height={136} />
        </Link>
      </div>
    </div>
  );
}
