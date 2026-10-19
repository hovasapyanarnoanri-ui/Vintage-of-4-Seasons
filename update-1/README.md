# Update 1 — Stripe catalog sync

**Date:** 2026-10-18

## What this update does

- Syncs Stripe products with the live website catalog (`vintageof4seasons.com`)
- Adds 10 new products that were on the site but missing in Stripe
- Updates prices on existing products to match the site (e.g. $84.99 instead of $85.00)

## Files

- `stripe-products.json` — Full mapping of product name → Stripe `productId` + `priceId`

## How to use for checkout

When creating a Stripe Checkout Session, use the `priceId` values from `stripe-products.json` as `line_items[].price`.

Example:

```js
line_items: [
  { price: 'price_1US47KHfCTsHIXuK8XoJy398', quantity: 1 } // Handcrafted Winter Angel
]
```

## Notes

- Ornament Gift Box is variable-priced on the website; Stripe still has a fixed $190 starting price.
- Cross Ornament and Mother Mary and Baby Jesus Ornament remain in Stripe even if not shown on the current homepage.
