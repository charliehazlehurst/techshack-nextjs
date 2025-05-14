'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import { loadStripe } from '@stripe/stripe-js';
import { createBrowserClient } from '@supabase/ssr';
import { type SupabaseClient } from '@supabase/supabase-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

type Service = {
  id: string;  // Change to string to match the ID from Stripe
  name: string;
  price: number;
};

export default function BookingPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [cardError, setCardError] = useState('');
  const [stripe, setStripe] = useState<any>(null);
  const [elements, setElements] = useState<any>(null);
  const [card, setCard] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);

  useEffect(() => {
    const supabaseClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    setSupabase(supabaseClient);

    // Fetch services from Stripe
    const fetchServices = async () => {
      const response = await fetch('/api/stripe-products');
      const data = await response.json();
      setServices(data); // Assuming this returns the correct product data from the backend
    };

    fetchServices();

    const fetchData = async () => {
      const { data, error } = await supabaseClient.from('booking').select('*');
      if (error) console.error('Error fetching services:', error);
      
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();
      setIsAuthenticated(!!user);
    };

    fetchData();
  }, []);

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

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    if (!selectedService || !bookingDate) {
      alert('Please select a service and date.');
      return;
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      alert('You must be signed in to book.');
      return;
    }

    const { error } = await supabase.from('booking').insert([{
      user_id: user.id,
      service_id: selectedService.id,
      booking_date: bookingDate,
    }]);

    if (error) {
      console.error('Booking error:', error);
      alert('Booking failed.');
    } else {
      alert('Booking successful!');
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !card) return;

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
        body: JSON.stringify({ token: token.id, amount: selectedService?.price * 100 }), // Amount in cents
      });
      const result = await response.json();
      if (result.error) {
        setCardError(result.error);
      } else {
        alert('Payment Successful!');
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

      <div className="auth-links text-center mb-6">
        {!isAuthenticated && (
          <>
            <Link href="/signin">SIGN IN</Link> | <Link href="/signup">REGISTER</Link>
          </>
        )}
      </div>

      <h1 className="text-3xl font-bold text-center mb-10">Book a Service</h1>

      <div className="max-w-xl mx-auto space-y-10">
        <form onSubmit={handlePaymentSubmit} className="p-6 border rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Payment</h2>
          <label htmlFor="card-element" className="block mb-2">Card Details</label>
          <div id="card-element" className="border rounded p-3" />
          {cardError && <p className="text-red-500 mt-2">{cardError}</p>}
          <button type="submit" className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">Submit Payment</button>
        </form>

        <form onSubmit={handleBookingSubmit} className="p-6 border rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Book a Service</h2>
          <label className="block mb-2">Select a Service:</label>
          <select onChange={handleServiceChange} className="w-full p-2 mb-4 border rounded" required>
            <option value="">Select a service</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
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

          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Book Now</button>
        </form>
      </div>

      <Script src="https://js.stripe.com/v3/" strategy="beforeInteractive" />
    </main>
  );
}

