# Types Organization

All TypeScript types and interfaces are organized in this directory by category for better maintainability and discoverability.

## Category Structure

### `api.ts` - API & Response Types
- `ApiResponse<T>` - Standard API response format
- `PaginatedResponse<T>` - Paginated data response
- `ErrorResponse` - Error response format
- `ActionResult<T>` - Server action result type

### `auth.ts` - Authentication Types
- `TwoFactorSecret` - 2FA configuration
- `ResetPasswordToken` - Password reset tokens
- `LoginAttempt` - Login tracking
- `AuthSession` - Session management
- `AuthError` & `AuthErrorCode` - Error handling

### `blog.ts` - Blog & Content Types
- `Blog` - Blog post entity
- `BlogPost` - Extended blog post with relations
- `BlogFilter` - Filter configuration
- `BlogStats` - Statistics

### `crud.ts` - CRUD Operations
- `CrudColumn<T>` - Table column configuration
- `CrudTableProps<T>` - Table component props
- `CrudFilterConfig` - Filter configuration
- `CrudFormField` - Form field configuration
- `CrudListResponse<T>` - List response format
- `CrudListOptions` - Query options

### `email.ts` - Email Types
- `EmailType` - Email types union
- `SendEmailRequest` - Email request format
- Various email data types (OTP, Reset, Subscription, etc.)

### `payment.ts` - Payment & Billing
- Stripe integration types
- Subscription types
- Invoice types

### `security.ts` - Security & Audit
- `AuditEventType` - Event enumeration
- `AuditLogEntry` - Audit log structure
- `RateLimitResult` - Rate limiting
- `WebhookEventGuard` - Webhook security

### `seo.ts` - SEO & Metadata
- `SEOMetadata` - Page metadata
- `OpenGraphData` - OG tags
- `TwitterCardData` - Twitter cards
- `StructuredData` - JSON-LD schema

### `ui.ts` - UI & Component Types
- `NavItem` - Navigation configuration
- `TabItem` - Tab configuration
- `AlertConfig` - Alert styling
- `ToastMessage` - Toast notifications
- Type utilities (Size, Variant)

### `user.ts` - User & Authorization
- `User` - User entity
- `Role` - Role entity
- `Permission` - Permission entity
- `UserSession` - Session data
- `UserProfile` - Extended profile

## Usage

### Import from central index
```typescript
import { User, Blog, ApiResponse } from '@/types';
```

### Import from specific category
```typescript
import { User, Permission } from '@/types/user';
import { SendEmailRequest } from '@/types/email';
```

## Guidelines

1. **Keep types organized** - Add new types to the appropriate category file
2. **Use semantic names** - Type names should be descriptive and self-documenting
3. **Document complex types** - Add JSDoc comments for complex types
4. **Export everything** - All types must be exported from their category file
5. **Update index.ts** - Central index auto-exports all categories
6. **Avoid circular dependencies** - Design types to avoid circular imports

## Adding New Types

1. Determine the appropriate category
2. Add the type to the category file (e.g., `types/user.ts`)
3. The central `types/index.ts` automatically exports it
4. Document in this README if it's a major type

## Example: Adding a new payment type

```typescript
// types/payment.ts
export interface Invoice {
  id: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
}

// Usage anywhere in the app
import { Invoice } from '@/types';
```
