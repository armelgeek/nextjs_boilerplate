# Payment Processing

Stripe integration for handling payments, subscriptions, and billing.

## Directory

- **payments/stripe/** - Stripe configuration and utilities
  - config.ts - Stripe keys & initialization
  - plans.ts - Subscription plans & pricing
  - utils.ts - Helper functions for payment operations

## Features

- Stripe integration (checkout, payments, subscriptions)
- Multiple subscription plans
- Webhook handling for Stripe events
- Payment receipt generation
- Subscription management

## Stripe Setup

1. Get Stripe API keys from dashboard
2. Set `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` in env
3. Configure webhook endpoint for Stripe events

## Usage

```typescript
import { stripe } from '@/lib/payments/stripe/config'
import { subscriptionPlans } from '@/lib/payments/stripe/plans'

// Create checkout session
const session = await stripe.checkout.sessions.create({
  customer: 'cus_123',
  line_items: [{ price: 'price_123', quantity: 1 }],
  mode: 'subscription',
  success_url: '...',
  cancel_url: '...'
})

// Get available plans
const plans = subscriptionPlans.filter(p => p.active)
```

## Webhook Events

Handled in `lib/webhooks/stripe/`:
- checkout.session.completed
- customer.subscription.updated
- customer.subscription.deleted
- invoice.payment_succeeded
- invoice.payment_failed

## Best Practices

- Always validate webhook signatures
- Store payment intent IDs for idempotency
- Handle failed payments gracefully
- Sync subscription status regularly
