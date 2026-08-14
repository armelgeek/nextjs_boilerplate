# Authentication & Authorization

Handles user authentication, session management, and access control using better-auth.

## Files

- **auth.ts** - Server-side auth configuration, session management, email OTP plugin
- **auth-client.ts** - Client-side auth API (useSession, signIn, signUp, signOut, changePassword)
- **auth-helpers.ts** - Helper functions for auth operations (password validation, token management)
- **auth-utils.ts** - Utility functions for auth-related operations
- **check-permission.ts** - Middleware/helper to check user permissions

## Usage

### Client-Side
```typescript
import { useSession, signIn, signOut } from '@/lib/auth-client'

const { data: session } = useSession()
await signIn.email({ email, password })
await signOut()
```

### Server-Side
```typescript
import { auth } from '@/lib/auth'

const session = await auth.getSession({ headers: request.headers })
```

## Features

- Email/password authentication
- Email OTP verification
- Two-factor authentication (optional)
- Session persistence
- Password change & reset
