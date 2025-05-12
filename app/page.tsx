'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const isAuthenticated = false; // TEMP: Replace with real auth check later

  return (
    <main>
      {/* Logo */}
      <div className="logo p-4">
        <Link href="/">
          <Image src="/images/logo.jpg" alt="Tech Shack Logo" width={150} height={75} />
        </Link>
      </div>

      {/* Auth Links */}
      <div className="auth-links text-right p-4">
        {!isAuthenticated && (
          <>
            <Link href="/signin">SIGN IN</Link> | <Link href="/signup">REGISTER</Link>
          </>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex justify-center gap-4 text-lg font-semibold p-4">
        <Link href="/" className="text-blue-500">HOME</Link>
        <Link href="/about">ABOUT</Link>
        <Link href="/services">SERVICES</Link>
        <Link href="/booking">BOOK NOW</Link>
        <Link href="/reviews">REVIEWS</Link>
        <Link href="/contact">CONTACT US</Link>
        {isAuthenticated && <Link href="/my_account">MY ACCOUNT</Link>}
      </nav>

      {/* Hero Section */}
      <div className="hero-image relative h-[400px] bg-cover bg-center" style={{ backgroundImage: "url('/images/hero.jpg')" }}>
        <div className="hero-text absolute inset-0 flex flex-col justify-center items-center text-white text-center">
          <h1 className="text-4xl font-bold">WELCOME TO TECH SHACK</h1>
          <p className="text-xl mt-2">RESTORING YOUR DIGITAL WORLD, ONE BYTE AT A TIME!</p>
        </div>
      </div>

      {/* Divider */}
      <div className="my-12 flex justify-center">
        <hr className="w-3/4 border-black" />
      </div>

      {/* Background Section */}
      <section className="flex flex-col md:flex-row items-center gap-6 px-8">
        <div className="left-img">
          <Image src="/images/logo2.jpg" alt="TechShack Image" width={250} height={250} />
        </div>

        <div className="blocktext max-w-xl text-center md:text-left">
          <h1 className="text-2xl font-bold mb-4">OUR BACKGROUND</h1>
          <p>SINCE 2022, TECHSHACK HAS STRIVED TO DELIVER SUPERIOR TECH SOLUTIONS. BASED IN MERSEYSIDE, WE EXCEL IN LUXURY TECH CARE, EARNING A 5-STAR RATING ON GOOGLE AND FACEBOOK. OFFERING A RANGE OF PACKAGES, FROM MAINTENANCE TO FULL OVERHAULS, WE USE TOP BRANDS LIKE INFINITY WAX & GTECHNIQ FOR UNMATCHED RESULTS. BOOK WITH US TODAY FOR A TECH EXPERIENCE LIKE NO OTHER!</p>
        </div>
      </section>

      {/* Divider */}
      <div className="my-12 flex justify-center">
        <hr className="w-3/4 border-black" />
      </div>

      {/* Footer */}
      <footer className="text-center pb-24">
        <Link href="mailto:techshack21@gmail.com">@techshack.co.uk</Link> <br /><br />
        <div className="flex justify-center gap-4">
          <Link href="https://www.instagram.com/techshack_uk?igsh=MWZla3MwNDRraHZk">
            <Image src="/images/insta.jpg" alt="Instagram" width={40} height={40} />
          </Link>
          <Link href="https://www.facebook.com/profile.php?id=100092390929930">
            <Image src="/images/fb.jpg" alt="Facebook" width={40} height={40} />
          </Link>
        </div>
        <p className="mt-4">©2025 by Tech Shack</p>
      </footer>
    </main>
  );
}
