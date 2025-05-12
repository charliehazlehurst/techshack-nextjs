'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Home() {
  const pathname = usePathname();
  const isAuthenticated = false; // Placeholder

  return (
    <main className="min-h-screen">
      {/* Logo */}
      <div className="logo">
        <Link href="/">
          <Image src="/images/logo.jpg" alt="Tech Shack Logo" width={310} height={136} />
        </Link>
      </div>

      {/* Auth Links */}
      <div className="auth-links">
        {!isAuthenticated && (
          <>
            <Link href="/signin">SIGN IN</Link> | <Link href="/signup">REGISTER</Link>
          </>
        )}
      </div>

      {/* Hero Section */}
      <div
        className="hero-image"
        style={{ backgroundImage: "url('/images/hero.jpg')" }}
      >
        <div className="hero-text">
          <h1 className="text-4xl font-bold">WELCOME TO TECH SHACK</h1>
          <p className="text-xl mt-2">RESTORING YOUR DIGITAL WORLD, ONE BYTE AT A TIME!</p>
        </div>
      </div>

      {/* Divider */}
      <div className="my-12 flex justify-center">
        <hr className="w-3/4 border-black" />
      </div>

{/* Background Section */}
<section className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-8 px-4 md:px-12 py-12 text-center md:text-left">
  <div className="flex justify-center md:justify-end w-full md:w-1/3">
    <Image
      src="/images/logo2.jpg"
      alt="TechShack Image"
      width={250}
      height={250}
      className="rounded-md object-contain"
    />
  </div>
  <div className="max-w-xl w-full md:w-2/3">
    <h1 className="text-2xl md:text-3xl font-bold mb-4">OUR BACKGROUND</h1>
    <p className="text-base md:text-lg leading-relaxed">
      SINCE 2022, TECHSHACK HAS STRIVED TO DELIVER SUPERIOR TECH SOLUTIONS. BASED IN MERSEYSIDE, WE EXCEL IN LUXURY TECH CARE, EARNING A 5-STAR RATING ON GOOGLE AND FACEBOOK. OFFERING A RANGE OF PACKAGES, FROM MAINTENANCE TO FULL OVERHAULS, WE USE TOP BRANDS LIKE INFINITY WAX & GTECHNIQ FOR UNMATCHED RESULTS. BOOK WITH US TODAY FOR A TECH EXPERIENCE LIKE NO OTHER!
    </p>
  </div>
</section>


      {/* Divider */}
      <div className="my-12 flex justify-center">
        <hr className="w-3/4 border-black" />
      </div>

      {/* Footer */}
<footer className="text-center pb-24">
  <Link href="mailto:techshack21@gmail.com">@techshack.co.uk</Link>
  <br /><br />
  <div className="flex justify-center gap-4">
    <Link href="https://www.instagram.com/techshack_uk?igsh=MWZla3MwNDRraHZk">
      <Image
        src="/images/insta.jpg"
        alt="Instagram"
        width={20}
        height={20}
        quality={100}
        className="rounded"
      />
    </Link>
    <Link href="https://www.facebook.com/profile.php?id=100092390929930">
      <Image
        src="/images/fb.jpg"
        alt="Facebook"
        width={20}
        height={20}
        quality={100}
        className="rounded"
      />
    </Link>
  </div>
  <p className="mt-4">©2025 by Tech Shack</p>
</footer>

    </main>
  );
}
