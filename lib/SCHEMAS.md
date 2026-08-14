# Validation Schemas

Zod schemas for runtime validation of data across the application.

## Directory

- **schemas/** - Organized validation schemas
  - auth.ts - Authentication related schemas (login, signup, password reset)
  - user.ts - User profile & account schemas
  - blog.ts - Blog post & article schemas
  - contact.ts - Contact form schemas
  - index.ts - Central exports

## Features

- Runtime type validation
- Type inference for TypeScript
- Composable schema definitions
- Error messages & custom validators

## Usage

```typescript
import { loginSchema, signupSchema } from '@/lib/schemas/auth'

// Validate data
const result = loginSchema.safeParse(formData)
if (!result.success) {
  console.error(result.error.issues)
  return
}

// Type-safe after validation
const validated = result.data // typed as LoginType
```

## Common Patterns

```typescript
// Basic validation
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

// Custom validation
const passwordSchema = z.string()
  .min(8, 'Too short')
  .refine(val => /[A-Z]/.test(val), 'Missing uppercase')
  .refine(val => /[0-9]/.test(val), 'Missing number')

// Composable
const updateSchema = baseSchema.omit({ password: true }).partial()
```

## Best Practices

- Define schemas close to where they're used
- Export from index.ts for centralized imports
- Reuse schemas to avoid duplication
- Add descriptive error messages
