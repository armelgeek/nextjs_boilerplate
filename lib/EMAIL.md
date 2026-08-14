# Email Service

Email sending and templating system.

## Files

- **email-service.ts** - Core email sending service
- **email-templates/** - HTML email templates
  - base-template.ts - Base layout wrapper
  - welcome-template.ts - Welcome/signup emails
  - reset-password-template.ts - Password reset instructions
  - otp-template.ts - One-time password emails
  - email-change-verification-template.ts - Email change verification
  - email-change-notification-template.ts - Email change confirmation
  - contact-form-template.ts - Contact form submission emails
  - booking-confirmation-template.ts - Booking confirmations
  - booking-update-template.ts - Booking update notifications
  - payment-receipt-template.ts - Payment receipts
  - subscription-template.ts - Subscription notifications

## Email Service

Handles sending emails with proper configuration, error handling, and retry logic.

## Templates

Email templates use a base layout with consistent styling. Each template is a function that returns HTML content.

## Usage

```typescript
import { emailService } from '@/lib/email-service'
import { welcomeTemplate } from '@/lib/email-templates'

const html = welcomeTemplate({ name: 'John', verificationUrl: '...' })
await emailService.send({
  to: 'user@example.com',
  subject: 'Welcome!',
  html
})
```

## Configuration

Email provider (Resend, SendGrid, etc.) configured via environment variables.
