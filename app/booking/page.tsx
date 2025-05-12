'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import { loadStripe } from '@stripe/stripe-js';


const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx'); // Replace with your real key in prod

const mockServices = [
  { id: 1, name: 'GENERAL ASSESSMENT', price: 20 },
  { id: 2, name: 'GENERAL MAINTENANCE', price: 30 },
  { id: 3, name: 'SCREEN REPAIR', price: 50 },
];

export default function BookingPage() {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [stripe, setStripe] = useState(null);
  const [elements, setElements] = useState(null);
  const [card, setCard] = useState(null);
  const [cardError, setCardError] = useState('');

   const isAuthenticated = false;

  useEffect(() => {
    setServices(mockServices);
  }, []);

  useEffect(() => {
    async function initStripe() {
      const stripeInstance = await stripePromise;
      const elementsInstance = stripeInstance.elements();
      const cardElement = elementsInstance.create('card');
      cardElement.mount('#card-element');
      setStripe(stripeInstance);
      setElements(elementsInstance);
      setCard(cardElement);
    }
    initStripe();
  }, []);

  const handleServiceChange = (e) => {
    const id = parseInt(e.target.value);
    const service = services.find((s) => s.id === id);
    setSelectedService(service);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    const bookingData = {
      serviceId: selectedService.id,
      bookingDate,
    };

    const res = await fetch('/api/booking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData),
    });

    const data = await res.json();
    console.log('Booking response:', data);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    const { token, error } = await stripe.createToken(card);
    if (error) {
      setCardError(error.message);
    } else {
      console.log('Stripe Token:', token.id);
      // Send token to your server here if needed
    }
  };

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

      <h1 className="text-3xl font-bold text-center mb-10">Book a Service</h1>

      <div className="max-w-xl mx-auto space-y-10">
        {/* Payment Form */}
        <form onSubmit={handlePaymentSubmit} className="p-6 border rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Payment</h2>
          <label htmlFor="card-element" className="block mb-2">Card Details</label>
          <div id="card-element" className="border rounded p-3" />
          {cardError && <p className="text-red-500 mt-2">{cardError}</p>}
          <button type="submit" className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">Submit Payment</button>
        </form>

        {/* Booking Form */}
        <form onSubmit={handleBookingSubmit} className="p-6 border rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Book a Service</h2>
          <label className="block mb-2">Select a Service:</label>
          <select onChange={handleServiceChange} className="w-full p-2 mb-4 border rounded">
            <option>Select a service</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>{service.name}</option>
            ))}
          </select>

          {selectedService && (
            <div className="mb-4 text-lg font-medium">Price: £{selectedService.price}</div>
          )}

          <label className="block mb-2">Choose a Date and Time:</label>
          <input
            type="datetime-local"
            className="w-full p-2 border rounded mb-4"
            value={bookingDate}
            onChange={(e) => setBookingDate(e.target.value)}
          />

          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Book Now</button>
        </form>
      </div>

      {/* Stripe Script */}
      <Script src="https://js.stripe.com/v3/" strategy="beforeInteractive" />
    </main>
  );
}
