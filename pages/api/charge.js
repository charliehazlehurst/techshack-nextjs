import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Stripe secret key is missing in environment variables.');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2020-08-27' });

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Ensure we have the necessary data
      const { token, amount } = req.body;

      if (!token || !amount) {
        return res.status(400).json({ error: 'Missing token or amount' });
      }

      // Log the incoming request to see the payload
      console.log('Received payment request:', { token, amount });

      // Create a payment intent with the amount and token
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'gbp', // You can change this to the currency of your choice
        payment_method: token,
        confirm: true,
      });

      // Respond with the payment intent status
      res.status(200).json({ success: true, paymentIntent });
    } catch (error) {
      console.error('Error processing payment:', error);
      res.status(400).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}

