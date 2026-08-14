---
name: drift-saas-arch
description: Design tech architecture matched to your scale and budget. Reads strategy, recommends proportional stack, database design, and deployment for solo founders.
---

# SaaS Architect

Don't over-engineer. Build proportional to your scale.

This skill reads your business strategy (from solo-founder-strategy) and designs a tech stack that:
1. Fits your budget (as a solo dev)
2. Handles your projected scale (year 1)
3. Can evolve as you grow
4. Minimizes operational overhead

**Prerequisite:** Run `/solo-founder-strategy` first to generate `docs/strategy/`

## Core Principle

Technology is a tool. Pick the MINIMAL stack that solves your problem.

### Common Mistakes

**Over-engineer (❌ waste of time):**
```
"I'll build with microservices"
"I'll design for 1M users"
"I'll use Kubernetes"
→ Months of setup for a project with 100 users
```

**Under-engineer (❌ future pain):**
```
"I'll build a PHP script"
"I'll use a spreadsheet for DB"
"I'll deploy on shared hosting"
→ Breaks when you hit 1000 users
```

**Right-engineer (✅ smart):**
```
"I'll build monolith on "
"I'll use PostgreSQL + Drizzle"
"I'll deploy serverless"
→ Handles 100-10,000 users, scales when needed
```

## How It Works

### Step 1: Understand Your Scale

Reads `docs/strategy/`:
- Year 1 revenue goal (e.g., $12k MRR)
- ICP size (e.g., 500 customers)
- Feature complexity
- Technical requirements (payments, real-time, etc.)

Translates to infrastructure needs:
```
$12k MRR × typical SaaS 10% CAC ratio
= $1200 customer acquisition spend
= ~100-500 customers acquired in year 1

Infrastructure for 500 customers:
- 500-1000 concurrent users (peak)
- 100-1000 GB storage
- 1-10M API calls/month
= Small infrastructure budget ($300-500/month)
```

### Step 2: Recommend Stack

**For Ticket Marketplace example:**

**Tier 1: If you have $0-100/month budget**
```
Frontend:  (free tier)
Backend:  Edge Functions (free tier)
Database: SQLite locally (NOT for production)
Status: Don't do this (no real DB)
```

**Tier 2: If you have $100-300/month budget (RECOMMENDED)**
```
Frontend: Next.js on  ($0-20/month)
Backend: Next.js API routes (included)
Database: PostgreSQL on Neon ($50-100/month)
ORM: Drizzle (free, type-safe)
Storage:  Blob ($5-20/month)
Payments: Stripe (free, pay commission)
Deploy:  (auto, included)
Monitoring: PostHog (free tier)

Why: 
- Monolith is perfect for year 1
-  handles scaling to 10k users
- Neon serverless PostgreSQL (no ops)
- Total: $300-400/month for full stack
```

**Tier 3: If you have $500+/month budget (ONLY if scale demands)**
```
Frontend: Next.js on 
Backend: Separate Node.js on Railway ($50)
Database: PostgreSQL on Railway ($50-100)
Cache: Redis ($20/month)
CDN: Cloudflare ($200/month)
Monitoring: Datadog/New Relic

Why: Only if you have 1000+ concurrent users
Status: Don't start here, scale here
```

### Step 3: Design Database

From `docs/product/08-data-model.md`, creates actual schema:

**Example: Ticket Marketplace**

```
docs/architecture/database-design.md

Tables needed:
- users (id, email, password_hash, name)
- events (id, organizer_id, title, capacity)
- tickets (id, event_id, buyer_id, status, qr_code)
- payments (id, user_id, amount, stripe_payment_id, status)
- payouts (id, organizer_id, amount, stripe_payout_id)

Relationships:
- User → Events (1-to-many organizer)
- User ← Tickets (1-to-many buyer)
- Event → Tickets (1-to-many)
- Ticket → Payment (1-to-1)

Indexes needed:
- organizer_id on events
- buyer_id on tickets
- event_id on tickets
- stripe_payment_id on payments

Why this schema:
- Minimal fields (only what's needed)
- Indexes on hot queries (finding tickets by event)
- Soft-deletes on payments (audit trail)
```

### Step 4: Design APIs

From functional requirements, specifies endpoints:

```
docs/architecture/api-design.md

Public endpoints:
POST /api/events
GET /api/events/:id
GET /api/events/:id/tickets

Protected endpoints (organizer):
POST /api/events
PATCH /api/events/:id
GET /api/events/:id/analytics

Protected endpoints (buyer):
POST /api/tickets/purchase
GET /api/orders
GET /api/orders/:id

Webhook endpoints:
POST /api/webhooks/stripe
- Handles payment_intent.succeeded
- Handles charge.refunded
```

### Step 5: Design Deployment

Production-ready from day 1:

```
docs/architecture/deployment-plan.md

Development:
- Local PostgreSQL (docker-compose)
- Local Stripe test API keys
- npm run dev

Staging:
- Deploy to  preview
- Neon staging database
- Stripe test keys

Production:
- Deploy to  (git push)
- Neon production database
- Stripe live keys
- Auto-scaling ( handles it)
- Backups (Neon auto-backups)

CI/CD:
- GitHub Actions (free)
- Run tests on PR
- Auto-deploy on merge to main
```

## Key Principles

### 1. Monolith First

Not:
```
❌ "I'll build microservices"
❌ "I'll split frontend/backend"
```

But:
```
✅ Full-stack monolith (Next.js)
✅ Tight coupling = fast iteration
✅ Split only when it hurts
```

**When to split:** >10 team members or >100k concurrent users
(Year 3+, not year 1)

### 2. Serverless by Default

Not:
```
❌ "I'll manage a VPS"
❌ "I'll set up Docker/Kubernetes"
```

But:
```
✅  (auto-scaling, deploys, CDN)
✅ PostgreSQL (serverless, auto-backup)
✅ Stripe webhooks via Svix (hosted)
```

**Ops: Zero.** You deploy;  runs it.

### 3. Minimal Database

Not:
```
❌ "I'll design for all possible queries"
❌ "I'll add 20 tables just in case"
```

But:
```
✅ Only tables you need right now
✅ Indexes only on hot queries
✅ Add tables as features launch
```

### 4. Production-Ready from Day 1

Not:
```
❌ "I'll add security later"
❌ "I'll handle errors later"
```

But:
```
✅ Type-safe code (TypeScript)
✅ Input validation (Zod)
✅ Error boundaries
✅ Logging (PostHog)
✅ Secrets management (.env)
```

## Examples by Scale

### 100-500 Users (Year 1)

**Stack:**
```
Frontend: Next.js on 
Backend: Next.js API routes
Database: PostgreSQL + Drizzle
Payments: Stripe
Storage:  Blob (for user uploads)
Emails: Resend
Analytics: PostHog

Budget: $300-500/month
Setup time: 2-4 weeks
Ops load: 0 ( manages)
```

### 500-2000 Users (Year 2)

**Stack:**
```
(same monolith, just scales)

Database: PostgreSQL (Neon pro, $100)
Cache: Redis Upstash ($20/month, add if slow)
Background jobs: Bull Queue (free, runs on )
Storage:  Blob ($20-50)
Emails: Resend ($100 + usage)

Budget: $500-800/month
Setup time: 0 (no code changes)
Ops load: Still 0
```

### 2000-10k Users (Year 3+)

**Stack:**
```
(split if needed, but usually don't)

Consider only if you have:
- >1000 concurrent users, OR
- >1000 requests/second, OR
- >500GB database

Most successful SaaS scale monolith to $100k+ ARR.
```

## Technology Choices (Justified)

### Why Next.js?
```
- Full-stack (no context switching)
- React Server Components (modern)
- Built-in API routes
-  deployment (free tier)
- Type-safe with TypeScript
- Tailwind CSS (styling)
```

### Why PostgreSQL?
```
- Free, open-source
- ACID transactions (payments need this)
- JSON support (flexible data)
- Proven at scale
- Neon serverless option (no ops)
```

### Why Drizzle?
```
- Type-safe queries (catch bugs early)
- Not ORM overhead (thin layer)
- SQL-like (easy to learn)
- Migrations built-in
- TypeScript first
```

### Why ?
```
- Free tier for bootstrapped founders
- Auto-scaling (no DevOps)
- Global CDN (fast)
- Preview deployments
- Zero-downtime deploys
```

### Why Stripe?
```
- Industry standard (customers expect it)
- Webhooks via Svix (reliable)
- Connect for marketplace payments
- PCI-compliant (you don't handle cards)
- Excellent documentation
```

## Output Files

```
docs/architecture/
├── stack-recommendation.md
│   └── Specific choice per tier
│   └── Why (not generic, but specific to your scale)
│   └── Budget breakdown
│
├── database-design.md
│   └── Tables with schema
│   └── Relationships
│   └── Indexes
│
├── api-design.md
│   └── Endpoints per feature
│   └── Authentication
│   └── Rate limiting
│
├── deployment-plan.md
│   └── Dev → Staging → Production
│   └── CI/CD pipeline
│   └── Database migrations
│
├── security.md
│   └── Auth (Better Auth)
│   └── Payment (Stripe PCI)
│   └── Data protection (encryption, backups)
│   └── Rate limiting
│
└── scaling-plan.md
    └── Current (100-500 users)
    └── Year 2 (500-2000 users)
    └── Year 3 (2000-10k users)
    └── When to split architecture (probably never in year 1)
```

---

## Next Step

After architecture ✅, move to: `/project-manager`

The project manager will read your strategy + architecture and create a development roadmap.
