# Checkout fix — Stripe price IDs

## Problem
- Live site products had no Stripe `priceId`s
- Checkout sent product *names* to `/api/checkout`
- `/api/checkout` returns 404 on the current host (no serverless function deployed)

## What was fixed in these files

### 1. `products-with-stripe.js`
Replace the site's `const products=[...];` with this file's contents.
Every product now has:
- `stripePrice` — Stripe Price ID (use in Checkout)
- `stripeProduct` — Stripe Product ID

### 2. `submitCheckout-fixed.js`
Replace the site's `function submitCheckout(e){...}` with this function.
Cart is sent as `{ priceId, name, color, qty }` instead of bare names.

### 3. `api/checkout.js`
Deploy as **Vercel** serverless function at path `/api/checkout`.
Set env var: `STRIPE_SECRET_KEY` = your Stripe secret key (sk_live_...).

Then either:
- Point the site's `CHECKOUT_URL` to `https://YOUR-VERCEL-APP.vercel.app/api/checkout`, or
- Proxy `/api/checkout` from Cloudflare to that Vercel URL.

## Apply on live site
1. Open `index.html`
2. Find `const products=[` ... `];` and replace with `products-with-stripe.js`
3. Find `function submitCheckout(e){` ... and replace with `submitCheckout-fixed.js`
4. Deploy the API and set `CHECKOUT_URL` if needed
