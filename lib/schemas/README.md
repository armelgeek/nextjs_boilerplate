# Validation Schemas

This directory contains all Zod validation schemas for form data, API requests, and data validation throughout the application.

## Structure

### `auth.ts` - Authentication Schemas
- `loginSchema` - Login form validation
- `signupSchema` - Registration form validation
- `resetPasswordSchema` - Password reset form
- `changePasswordSchema` - Change password form
- `emailChangeSchema` - Email change request

### `blog.ts` - Blog Post Schemas
- `createBlogSchema` - Create new blog post
- `updateBlogSchema` - Update existing blog post
- `publishBlogSchema` - Publish/unpublish blog

### `contact.ts` - Contact Schemas
- `contactFormSchema` - Contact form submission
- `subscribeSchema` - Email subscription

### `user.ts` - User & Role Schemas
- `userProfileSchema` - User profile update
- `createRoleSchema` - Create new role
- `updateRoleSchema` - Update role
- `createPermissionSchema` - Create permission
- `permissionSchema` - Permission data
- `roleSchema` - Role data

## Usage

### In Server Actions
```typescript
import { loginSchema } from '@/lib/schemas';

export async function loginAction(data: unknown) {
  const validated = loginSchema.parse(data);
  // Use validated data
}
```

### In Components (Client-side)
```typescript
import { signupSchema } from '@/lib/schemas';

export function SignupForm() {
  const form = useForm({
    resolver: zodResolver(signupSchema),
  });
  // Use form
}
```

### With Error Handling
```typescript
import { createBlogSchema } from '@/lib/schemas';

try {
  const validated = createBlogSchema.parse(formData);
  // Use validated data
} catch (error) {
  if (error instanceof z.ZodError) {
    // Handle validation errors
    console.error(error.errors);
  }
}
```

## Best Practices

1. **Keep schemas focused** - Each file should handle one domain
2. **Export types** - Always export Zod-inferred types for TypeScript
3. **Reuse schemas** - Extend base schemas rather than duplicating
4. **Provide defaults** - Use `.optional()` and `.default()` for better UX
5. **Clear messages** - Write user-friendly validation messages
6. **Compose schemas** - Combine smaller schemas for complex validations

## Adding New Schemas

1. Create a new file (e.g., `payment.ts`)
2. Define schemas with Zod
3. Export types with `z.infer<typeof schema>`
4. Add export to `index.ts`
5. Update this README

Example:
```typescript
// lib/schemas/payment.ts
export const paymentSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  currency: z.enum(['USD', 'EUR', 'GBP']),
  cardToken: z.string(),
});

export type Payment = z.infer<typeof paymentSchema>;
```
