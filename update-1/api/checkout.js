// Vercel serverless function: /api/checkout
// Requires env: STRIPE_SECRET_KEY, optionally SUCCESS_URL, CANCEL_URL

const Stripe = require('stripe');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' });
    const q = req.method === 'GET' ? req.query : (req.body || {});
    let cart = q.cart;
    if (typeof cart === 'string') cart = JSON.parse(cart);

    if (!Array.isArray(cart) || !cart.length) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const line_items = cart.map((item) => {
      if (item.priceId) {
        return { price: item.priceId, quantity: Math.max(1, parseInt(item.qty, 10) || 1) };
      }
      throw new Error('Cart item missing Stripe priceId. Update the site products array.');
    });

    const origin = (req.headers.origin || req.headers.referer || 'https://vintageof4seasons.com').replace(/\/$/, '');
    const success = process.env.SUCCESS_URL || `${origin}/?paid=1`;
    const cancel = process.env.CANCEL_URL || `${origin}/#checkout`;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      success_url: success,
      cancel_url: cancel,
      customer_email: q.email || undefined,
      shipping_address_collection: { allowed_countries: ['US'] },
      phone_number_collection: { enabled: true },
      metadata: {
        name: q.name || '',
        phone: q.phone || '',
        addr: q.addr || '',
        zip: q.zip || '',
      },
    });

    res.writeHead(303, { Location: session.url });
    return res.end();
  } catch (err) {
    console.error(err);
    return res.status(500).send(`Checkout error: ${err.message}`);
  }
};
