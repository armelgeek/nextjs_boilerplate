# Next.js Boilerplate — Development Guide

Full-stack Next.js application with TypeScript, Prisma, Zod validation, better-auth, and Stripe payments.

## 🚀 Quick Start

```bash
npm install                    # Install dependencies
npm run dev                    # Start development server (port 3000)
npx prisma studio            # Open Prisma UI
```

## Project Structure

```
app/                # Next.js routes and layouts
├── (protected)/   # Auth-protected routes
├── (admin)/       # Admin routes
├── api/           # API endpoints
└── auth/          # Auth routes

actions/           # Server actions (DB + business logic)
components/        # UI components (Atomic Design)
├── atoms/
├── molecules/
├── organisms/
├── templates/
├── ui/            # Shadcn/ui components
└── skeletons/     # Loading states

lib/               # Utilities and services
├── auth/          # Authentication (better-auth)
├── client.ts      # Unified API client
├── database/      # Prisma setup
├── email/         # Email service
├── payments/      # Stripe integration
├── schemas/       # Zod validation
├── security/      # Rate limiting, audit logs
├── webhooks/      # Webhook handlers
└── utils/         # Helper functions

types/             # TypeScript type definitions
scripts/           # Utility scripts
.claude/           # Claude Code configuration
```

## Tech Stack

- **Frontend**: Next.js 16.1.6 + React
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: PostgreSQL + Prisma ORM
- **Validation**: Zod schemas
- **Auth**: better-auth with session management
- **Payments**: Stripe (subscriptions, checkout)
- **Email**: Resend (or custom)
- **Form Handling**: React Hook Form
- **Notifications**: Sonner (toasts)
- **Code Format**: Biome

## Development Commands

```bash
# Server
npm run dev                    # Start dev server
npm run build                  # Production build
npm start                      # Run production

# Database
npx prisma generate           # Generate Prisma client
npx prisma migrate dev        # Create and apply migration
npx prisma migrate deploy     # Apply migrations in prod
npx prisma studio             # UI for database

# Setup
npm run setup:admin           # Create initial admin user
npm run setup:stripe-plans    # Create Stripe subscription plans
npm run stripe:listen         # Listen to Stripe webhooks locally

# Quality
npm run lint                  # ESLint check
npm run format                # Format code with Biome
npm test                      # Run tests
```

## Environment Setup

Required variables in `.env.local`:

```env
# Database
DATABASE_URL="postgresql://..."

# Auth (better-auth)
AUTH_SECRET="..."
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Stripe
STRIPE_SECRET_KEY="sk_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email
RESEND_API_KEY="..."
FROM_EMAIL="..."

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Code Style

- **Language**: TypeScript strict mode
- **Formatting**: Biome (auto-format on save)
- **Architecture**: Server actions → API routes → Components
- **Validation**: Zod schemas on inputs
- **Error handling**: Consistent try-catch patterns
- **Naming**: kebab-case files, camelCase functions, PascalCase classes

## Database

### Prisma Workflow

```bash
# After schema changes
npx prisma migrate dev --name feature_name

# Type-safe queries
const user = await db.user.findUnique({ where: { id } })
```

### Common Patterns

- One-to-many relations with cascading deletes
- Many-to-many with junction tables
- Soft deletes via timestamps
- Audit fields (createdAt, updatedAt)

## Authentication

- **Provider**: better-auth (not NextAuth)
- **Session**: Database-backed with better-auth
- **Verification**: Email OTP + 2FA support
- **Authorization**: Role-based permissions (RBAC)

```typescript
const session = await auth.getSession()
const hasPermission = checkPermission(session.user.role, 'action')
```

## API Development

### Pattern

1. Type in `types/`
2. Zod schema for validation
3. Server action or API route
4. API client call from component

### Response Format

```typescript
// Success
{ success: true, data: T }

// Error
{ success: false, error: string }

// Paginated
{ data: T[], total: number, page: number, limit: number, totalPages: number }
```

## Testing

```bash
npm test                      # Run all tests
npm test -- --watch          # Watch mode
npm run coverage             # Coverage report
```

## Deployment

```bash
# Pre-deploy checklist
npm run build                # Must complete without errors
npm run lint                 # No linting errors
npx prisma migrate deploy   # Migrations applied

# Environment variables required in production
# DATABASE_URL, STRIPE_SECRET_KEY, NEXTAUTH_SECRET, etc.
```

## Useful Links

- See `CLAUDE.md` in project root for detailed development guide
- See `lib/README.md` for module documentation
- `.claude/BRAIN.md` — Brain knowledge graph persistence
- `.claude/WORKFLOW.md` — Drift workflow details

## Git Workflow

- Branch naming: `feature/name`, `fix/name`, `chore/name`
- Conventional commits: `feat:`, `fix:`, `refactor:`, `docs:`
- PRs required for main
- Brain automatically logs decisions

## Notes

- TypeScript strict mode enforced
- Biome formatting on save
- Prisma migrations required before deployment
- Environment variables must be set before dev/build
- Brain DB auto-saves patterns and decisions
