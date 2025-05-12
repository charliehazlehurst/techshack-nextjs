'use client';

import React from 'react';
import Image from 'next/image'; // Use next/image for optimized image loading
import Link from 'next/link'; // Use Link for navigation

const AboutPage = () => {
  const isAuthenticated = false; // Example, replace with actual authentication logic

  return (
    <div>
      <header>
        <div className="logo">
          <Link href="/">
            <Image
              src="/images/logo.jpg"
              alt="Tech Shack Logo"
              width={150}
              height={150}
            />
          </Link>
        </div>

        <div className="auth-links">
          {isAuthenticated ? (
            <></>
          ) : (
            <>
              <Link href="/signin">SIGN IN</Link> | <Link href="/register">REGISTER</Link>
            </>
          )}
        </div>
      </header>

      <main>
  <section className="about-section flex flex-col md:flex-row justify-center items-center py-12">
  <div className="restore-img flex justify-center items-center mb-8 md:mb-0">
    <Image
      src="/images/restore.jpg"
      alt="TechShack Restoration"
      width={250}
      height={250}
      className="rounded-md" // This will keep the image styling as you originally wanted
    />
  </div>

  <div className="text-center md:text-left max-w-lg">
    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-6">
      ALL ABOUT US!
    </h1>
    <div className="about-text">
      <h2>Welcome to TechShack – Your Digital Solutions Expert!</h2>
      <p>
        Established in Liverpool in 2022, TechShack is your one-stop destination for all things tech-related. We specialize in console repairs, restorations, PC building, device modifications, data recovery, and more.
      </p>
      <h3>Why TechShack?</h3>
      <ul>
        <li>Our skilled technicians boast years of experience and expertise, ensuring top-notch service for all your tech needs.</li>
        <li>We prioritize quick turnaround times without compromising quality, getting you back up and running swiftly.</li>
        <li>Your satisfaction is our priority. Expect personalized service tailored to your unique requirements.</li>
        <li>We stay ahead of the curve, continuously exploring new techniques to deliver cutting-edge solutions.</li>
      </ul>
      <p>
        Join the TechShack family today and experience unparalleled tech solutions with a personal touch!
      </p>
    </div>
  </div>
</section>
      </main>

    </div>
  );
};

export default AboutPage;
