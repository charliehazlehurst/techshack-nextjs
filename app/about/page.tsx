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
        <section className="about-section">
          <div className="restore-img">
            <Image
              src="/images/.jpg"
              alt="TechShack Restoration"
              width={500}
              height={300}
            />
          </div>

          <h1 className="text-center">
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
        </section>
      </main>

      <footer style={{ textAlign: 'center', paddingBottom: '100px' }}>
        <a
          className="mailto"
          href="mailto:techshack21@gmail.com"
          style={{ textDecoration: 'none' }}
        >
          @techshack21@gmail.com
        </a>
        <br />
        <br />
        <a href="https://www.instagram.com/techshack_uk/">
          <Image
            src="/images/insta.jpg"
            alt="Tech Shack Instagram"
            width={40}
            height={40}
          />
        </a>
        <a href="https://www.facebook.com/people/TechShack/100092390929930/">
          <Image
            src="/images/fb.jpg"
            alt="Tech Shack Facebook"
            width={40}
            height={40}
          />
        </a>
        <p>©2025 by Tech Shack</p>
      </footer>
    </div>
  );
};

export default AboutPage;
