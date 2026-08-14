# Webhook Handlers

Webhook processing for external services, primarily Stripe.

## Directory

- **webhooks/stripe/** - Stripe webhook handlers
  - handlers/
    - checkout-session.ts - Checkout session completion
    - invoice.ts - Invoice events (payment success/failure)
    - subscription.ts - Subscription lifecycle events
    - index.ts - Handler exports
  - Other webhooks (auth, email, etc.) as needed

## Stripe Webhooks

Handles events from Stripe for:
- Payment completions
- Subscription creation/updates/cancellation
- Invoice generation & payment failures
- Customer updates

## Usage

```typescript
import { handleStripeWebhook } from '@/lib/webhooks/stripe'

// In API route handler
const signature = request.headers.get('stripe-signature')
const body = await request.text()

const event = handleStripeWebhook(body, signature)

switch (event.type) {
  case 'checkout.session.completed':
    // Handle successful payment
    break
  case 'customer.subscription.updated':
    // Handle subscription update
    break
}
```

## Security

- Always validate webhook signatures
- Use `STRIPE_WEBHOOK_SECRET` from Stripe dashboard
- Implement idempotency (same event can arrive multiple times)
- Log all webhook events for debugging

## Best Practices

- Process webhooks asynchronously
- Return 200 OK immediately
- Retry failed operations
- Store webhook data for audit trails
- Never trust client-provided data; validate with Stripe API
