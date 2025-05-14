import { loadStripe } from '@stripe/stripe-js';

// Make sure to keep your Stripe Secret Key private and secure.
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Fetch all products from Stripe
      const products = await stripe.products.list();

      // Fetch the price of each product
      const productsWithPrices = await Promise.all(
        products.data.map(async (product) => {
          const prices = await stripe.prices.list({ product: product.id });
          return {
            id: product.id,
            name: product.name,
            price: prices.data[0] ? prices.data[0].unit_amount / 100 : 0, // Price is in cents, so we divide by 100
          };
        })
      );

      res.status(200).json(productsWithPrices);
    } catch (error) {
      console.error('Error fetching Stripe products:', error);
      res.status(500).json({ error: 'Failed to fetch products from Stripe' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
