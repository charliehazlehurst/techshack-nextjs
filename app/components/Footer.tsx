'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="text-center pb-24 px-4">
      <Link
        href="mailto:techshack21@gmail.com"
        className="text-sm md:text-base text-gray-600 hover:text-orange-500 transition-colors"
      >
        @techshack.co.uk
      </Link>

      <br />
      <br />

      <div className="flex justify-center gap-4">
        <Link
          href="https://www.instagram.com/techshack_uk?igsh=MWZla3MwNDRraHZk"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/images/insta.jpg"
            alt="Instagram"
            width={24}
            height={24}
            quality={100}
            className="rounded"
          />
        </Link>
        <Link
          href="https://www.facebook.com/profile.php?id=100092390929930"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/images/fb.jpg"
            alt="Facebook"
            width={24}
            height={24}
            quality={100}
            className="rounded"
          />
        </Link>
      </div>

      <p className="text-xs text-gray-500 mt-4">©2025 by Tech Shack</p>
    </footer>
  )
}
