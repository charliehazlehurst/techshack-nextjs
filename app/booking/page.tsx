'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

type Service = {
  id: string;
  name: string;
  price: number;
};

export default function BookingPage() {
  // Manually defined services (can be static or dynamic)
  const [services, setServices] = useState<Service[]>([
    { id: '1', name: 'General Assessment', price: 20 },
    { id: '2', name: 'Data Recovery', price: 25 },
    { id: '3', name: 'Hardware / Screen Repair', price: 30 },
    { id: '4', name: 'General Maintenance', price: 30 },
    { id: '5', name: 'Virus Removal', price: 30 },
  ]);

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [cardError, setCardError] = useState('');
  const [stripe, setStripe] = useState<any>(null);
  const [elements, setElements] = useState<any>(null);
  const [card, setCard] = useState<any>(null);

  // Handle Stripe elements
  useEffect(() => {
    async function initStripe() {
      const stripeInstance = await stripePromise;
      if (!stripeInstance) return;
      const elementsInstance = stripeInstance.elements();
      const cardElement = elementsInstance.create('card');
      cardElement.mount('#card-element');
      setStripe(stripeInstance);
      setElements(elementsInstance);
      setCard(cardElement);
    }
    initStripe();
  }, []);

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    const service = services.find((s) => s.id === id) || null;
    setSelectedService(service);
  };

  const handleBookingAndPaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !card) return;

    // Check if the user has selected a service, chosen a date, and provided card details
    if (!selectedService || !selectedService.price || !bookingDate) {
      alert('Please select a service, date, and enter card details.');
      return;
    }

    const { token, error } = await stripe.createToken(card);
    if (error) {
      setCardError(error.message);
    } else {
      // Send token.id to the backend to charge the customer
      const response = await fetch('/api/charge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token.id,
          amount: selectedService.price * 100, // Amount in cents
        }),
      });
      const result = await response.json();
      if (result.error) {
        setCardError(result.error);
      } else {
        // Assuming you also want to save the booking
        const bookingResponse = await fetch('/api/book-service', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            serviceId: selectedService.id,
            bookingDate,
            amount: selectedService.price,
          }),
        });
        const bookingResult = await bookingResponse.json();

        if (bookingResult.success) {
          alert('Booking and Payment Successful!');
        } else {
          alert('Booking failed!');
        }
      }
    }
  };

  return (
    <main className="min-h-screen p-6">
      <div className="logo mb-4 text-center">
        <Link href="/">
          <Image src="/images/logo.jpg" alt="Tech Shack Logo" width={310} height={136} />
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-center mb-10">Book a Service</h1>

      <div className="max-w-xl mx-auto space-y-10">
        <form onSubmit={handleBookingAndPaymentSubmit} className="p-6 border rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Select a Service</h2>
          <label className="block mb-2">Select a Service:</label>
          <select onChange={handleServiceChange} className="w-full p-2 mb-4 border rounded" required>
            <option value="">Select a service</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name} - £{service.price}
              </option>
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
            required
          />

          <h2 className="text-xl font-semibold mb-4">Payment</h2>
          <label htmlFor="card-element" className="block mb-2">Card Details</label>
          <div id="card-element" className="border rounded p-3" />
          {cardError && <p className="text-red-500 mt-2">{cardError}</p>}

          <button type="submit" className="mt-4 bg-green-600 text-white px-4 py-2 rounded">
            Book Now
          </button>
        </form>
      </div>

      <Script src="https://js.stripe.com/v3/" strategy="beforeInteractive" />
    </main>
  );
}
