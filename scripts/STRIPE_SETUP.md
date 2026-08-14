# Stripe Plans Setup

Automated script to create subscription plans in Stripe and seed the database with pricing IDs.

## Prerequisites

1. **Stripe Account** - Get one at https://stripe.com
2. **Stripe API Key** - Set `STRIPE_SECRET_KEY` in `.env`
3. **Database Connection** - Ensure `DATABASE_URL` is configured

## Usage

### Setup All Stripe Plans

```bash
npm run stripe:setup
# or
npm run setup:stripe-plans
```

This will:
1. Create 3 subscription products in Stripe (Starter, Professional, Enterprise)
2. Create monthly & yearly pricing tiers for each
3. Update the database with Stripe product and price IDs

### What Gets Created

| Plan | Monthly | Yearly | Features |
|------|---------|--------|----------|
| **Starter** | $29/mo | $299/yr | 1K API calls, basic support |
| **Professional** | $79/mo | $799/yr | 100K API calls, priority support |
| **Enterprise** | $299/mo | $2,999/yr | Unlimited, dedicated support |

## Database Schema

The script updates the `Plan` table with:
- `stripeProductId` - Stripe product ID (prod_...)
- `stripePriceId` - Stripe price ID (price_...)

## Customization

Edit `scripts/setup-stripe-plans.ts` to:
- Add/remove plans
- Change pricing
- Modify features
- Adjust intervals (monthly/yearly)

## Verification

Check the Stripe Dashboard:
1. Go to Products → All products
2. Verify all products are created
3. Check pricing tiers

Or view database:
```bash
npm run studio  # Opens Prisma Studio
# Navigate to Plan table to see prices
```

## Troubleshooting

**Error: "Invalid API Key"**
- Verify `STRIPE_SECRET_KEY` in `.env`
- Key should start with `sk_live_` or `sk_test_`

**Error: "Plan not found in database"**
- Ensure Prisma migrations are up to date
- Run: `npx prisma migrate deploy`

**Duplicate plans created**
- Script checks for existing plans before creating
- Delete from Stripe Dashboard and re-run if needed

## Notes

- Test mode: Use `sk_test_*` keys for development
- Live mode: Use `sk_live_*` keys for production
- Prices are in cents (2900 = $29.00)
