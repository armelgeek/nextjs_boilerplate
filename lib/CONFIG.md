# Configuration & Environment

Application configuration and environment variables management.

## Files

- **config.ts** - Runtime configuration (feature flags, URLs, endpoints)
- **env.ts** - Environment variable validation using Zod

## Environment Variables

Validated and typed environment variables with Zod schema. Each variable has:
- Type validation
- Default values (where applicable)
- Required/optional status

### Required Variables

- `DATABASE_URL` - PostgreSQL connection string
- `AUTH_SECRET` - Secret for session signing
- `NEXT_PUBLIC_APP_URL` - Public application URL

### Optional Variables

- Email provider credentials (Resend, SendGrid, etc.)
- Stripe keys
- Payment webhook secrets
- Feature flags

## Usage

```typescript
import { env } from '@/lib/env'
import { config } from '@/lib/config'

// Type-safe access
const dbUrl = env.DATABASE_URL
const appUrl = config.appUrl

// All variables are validated at startup
```

## Setup

1. Copy `.env.example` to `.env.local`
2. Fill in required values
3. Variables are validated on application startup
4. Type-safe in entire application
