'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Contact() {
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  // Form validation
  const validateForm = () => {
    let valid = true;
    let newErrors = { name: '', email: '', subject: '', message: '' };

    if (!name) {
      newErrors.name = 'Name is required';
      valid = false;
    } else if (!/^[a-zA-Z ]*$/.test(name)) {
      newErrors.name = 'Only letters and white space allowed';
      valid = false;
    }

    if (!email) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email format';
      valid = false;
    }

    if (!subject) {
      newErrors.subject = 'Subject is required';
      valid = false;
    }

    if (!message) {
      newErrors.message = 'Message is required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, subject, message }),
        });

        if (response.ok) {
          alert('Message sent successfully!');
        } else {
          alert('Failed to send message');
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  return (
    <main className="min-h-screen">
      {/* Logo */}
      <div className="logo py-4">
        <Link href="/">
          <Image src="/images/logo.jpg" alt="Tech Shack Logo" width={310} height={136} />
        </Link>
      </div>

      {/* Form Section */}
      <h1 className="text-center text-4xl font-bold my-8">GET IN TOUCH!</h1>

      <form onSubmit={handleSubmit} className="contact-form text-center">
        <div>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>

        <div>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        <div>
          <input
            type="text"
            id="subject"
            name="subject"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
          {errors.subject && <span className="error">{errors.subject}</span>}
        </div>

        <div>
          <textarea
            id="message"
            name="message"
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          {errors.message && <span className="error">{errors.message}</span>}
        </div>

        <div>
          <input type="submit" value="Submit" />
        </div>
      </form>

      {/* Google Map */}
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d152269.56130959318!2d-3.0833951101175288!3d53.393149338403425!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487adf8a647060b7%3A0x42dc046f3f176e01!2sLiverpool!5e0!3m2!1sen!2suk!4v1747068245608!5m2!1sen!2suk"
        width="100%"
        height="450"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>

      {/* Opening Hours */}
      <h1 className="text-center text-2xl font-bold my-8">OPENING HOURS</h1>
      <p className="text-center">
        Mon - Fri: 8am - 6pm <br />
        Sat: 8am - 5pm <br />
        Sun: 8am - 5pm
      </p>
    </main>
  );
}


