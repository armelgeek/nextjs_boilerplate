# Security Utilities

Security-related utilities including rate limiting, audit logging, and webhook validation.

## Files

- **rate-limiter.ts** - Rate limiting middleware to prevent abuse
- **audit-logger.ts** - Audit trail logging for sensitive operations
- **webhook-event-store.ts** - Webhook event storage and replay

## Rate Limiting

Prevents API abuse by limiting request frequency per user/IP.

```typescript
import { rateLimit } from '@/lib/security/rate-limiter'

const { success, remaining } = await rateLimit('user-id', {
  window: 60,     // seconds
  limit: 10       // max requests
})

if (!success) {
  return Response.json({ error: 'Too many requests' }, { status: 429 })
}
```

## Audit Logging

Tracks sensitive operations for security and compliance.

```typescript
import { auditLog } from '@/lib/security/audit-logger'

await auditLog({
  userId: '123',
  action: 'delete:user',
  resource: 'user:456',
  timestamp: new Date()
})
```

## Webhook Events

Stores webhook events for reliable delivery and replay capability.

```typescript
import { webhookStore } from '@/lib/security/webhook-event-store'

await webhookStore.save({
  event: 'payment.completed',
  data: paymentData
})
```

## Security Best Practices

- Always rate limit public endpoints
- Audit all admin & sensitive operations
- Validate webhooks with signatures
- Store sensitive logs securely
