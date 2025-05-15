'use client';

import { useEffect, useState } from 'react';
import { SpeedInsights } from "@vercel/speed-insights/next";
import Image from 'next/image';
import Header from '@/components/Header';

export default function Home() {
  const [signOutMessage, setSignOutMessage] = useState('');

  useEffect(() => {
    const message = localStorage.getItem('signedOutMessage');
    if (message) {
      setSignOutMessage(message);
      localStorage.removeItem('signedOutMessage');
    }
  }, []);

  return (
    <main className="min-h-screen">
      <Header />

      {signOutMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 mx-4 mt-4 rounded text-center">
          {signOutMessage}
        </div>
      )}

      {/* Hero Section */}
      <div
        className="hero-image"
        style={{ backgroundImage: "url('/images/hero.jpg')" }}
      >
        <div className="hero-text text-white text-center py-20 bg-black/40">
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
    </main>
  );
}


