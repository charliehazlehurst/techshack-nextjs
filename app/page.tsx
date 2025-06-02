'use client';

import { useEffect, useState } from 'react';
import { SpeedInsights } from "@vercel/speed-insights/next"
import Image from 'next/image';
import Link from 'next/link';
import Header from './components/Header';

export default function Home() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const signedOutMessage = localStorage.getItem('signedOutMessage');
    if (signedOutMessage) {
      setMessage(signedOutMessage);
      localStorage.removeItem('signedOutMessage');
    }
  }, []);

  return (
    <main className="min-h-screen">
      <Header />

      {message && (
        <div className="bg-green-100 text-green-800 p-4 text-center font-semibold">
          {message}
        </div>
      )}


        <div className="hero-text text-white text-center py-20 bg-black/40">
          <h1 className="text-4xl font-bold">WELCOME TO TECH SHACK</h1>
          <p className="text-xl mt-2">RESTORING YOUR DIGITAL WORLD, ONE BYTE AT A TIME!</p>
        </div>

      <div className="my-12 flex justify-center">
        <hr className="w-3/4 border-black" />
      </div>

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
            SINCE 2022, TECHSHACK HAS STRIVED TO DELIVER SUPERIOR TECH SOLUTIONS. BASED IN MERSEYSIDE, WE EXCEL IN LUXURY TECH CARE. OFFERING A RANGE OF SERVICES, FROM ASSESSMENTS TO SCREEN REPAIRS, BOOK WITH US TODAY FOR A TECH EXPERIENCE LIKE NO OTHER!
          </p>
        </div>
      </section>

      <div className="my-12 flex justify-center">
        <hr className="w-3/4 border-black" />
      </div>
    </main>
  );
}


