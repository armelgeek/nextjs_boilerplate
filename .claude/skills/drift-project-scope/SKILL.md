---
name: drift-project-scope
description: Decompose large projects into phases with REQ-ID tracing
---

# Project Scope & Phases

Break down large, complex projects into phased milestones. Each phase is shippable independently.

## When to Use

- Building a new domain (payments, bookings, admin panel)
- Migrating systems (auth overhaul, database migration)
- Large features with >6 implementation tasks
- Multi-week projects needing dependency tracking

## How It Works

1. **Understand the goal** — What's the end state?
2. **Identify constraints** — Timeline, team, dependencies
3. **Decompose into phases** — Each phase is shippable, independent
4. **Define phase dependencies** — What must run before what?
5. **Assign REQ-IDs** — Trace features to requirements through phases
6. **Create phase milestones** — Track progress

## Phase Structure

Each phase has:
- **Goal** (what this phase ships)
- **Requirements** (features/tasks that phase must deliver)
- **Dependencies** (prior phases or external blockers)
- **Effort** (rough T-shirt size: XS, S, M, L, XL)
- **Owners** (who builds it)

## Example: Building a Billing System

```
REQ-001: Stripe account setup
  Phase 1: Integration Foundation
    ├─ Connect Stripe account
    ├─ Store API keys securely
    └─ Verify connection (sandbox)
    Effort: S, Depends: none

REQ-002: Product pricing models
  Phase 2: Core Pricing
    ├─ Define pricing tiers
    ├─ Create products in Stripe
    ├─ Store products in database
    └─ Expose pricing API
    Effort: M, Depends: Phase 1

REQ-003: Checkout flow
  Phase 3: Customer Checkout
    ├─ Stripe Checkout session creation
    ├─ Webhook handling
    ├─ Order creation on success
    └─ Email confirmation
    Effort: L, Depends: Phase 2

REQ-004: Subscription management
  Phase 4: Self-Service Portal (Parallel with Phase 3)
    ├─ View active subscriptions
    ├─ Change plan (upgrade/downgrade)
    ├─ Cancel subscription
    └─ Invoice history
    Effort: M, Depends: Phase 2
```

## REQ-ID Format

`REQ-NNN: [feature description]`

- Incremental numbering (001, 002, 003...)
- Mapped to each phase where it's implemented
- Traced through tasks and PRs

**Tracing:** REQ-002 is implemented in Phase 2 across 4 tasks:
- `npm run db:create-products-table` (database)
- `packages/payments/stripe-products.ts` (integration)
- `apps/app/src/api/pricing.ts` (API)
- `apps/web/src/pricing.tsx` (UI)

## Dependencies & Ordering

Phases can be:
- **Sequential** — Phase 2 starts after Phase 1 ships
- **Parallel** — Phases 3 & 4 can run together (no shared files)
- **Blocked** — Phase N waits on external decision/feedback

Visualize as DAG:
```
Phase 1 → Phase 2 ─┬→ Phase 3 (Checkout)
                   └→ Phase 4 (Portal, parallel)
                        ↓
                   Phase 5 (Analytics, depends on 3&4)
```

## Shipping Phases

Each phase ships independently:
1. Run full workflow: clarify → scout → architect → builder → reviewer → ship
2. Create PR with phase summary
3. Merge to main when reviewed
4. Next phase can depend on deployed Phase N

This allows:
- Faster feedback cycles
- Parallelizable work
- Risk mitigation (smaller deployments)
- Stakeholder demos per phase

## Timeline & Estimation

For each phase:
- **Effort**: T-shirt size (XS=1h, S=4h, M=8h, L=16h, XL=32h+)
- **Duration**: effort + review time + testing
- **Blockers**: external dependencies, design decisions, data migrations
- **Owner**: who's responsible for phase

Aggregate to project timeline:
```
Phase 1 (S): Week 1
Phase 2 (M): Week 1–2
Phases 3 & 4 (L + M, parallel): Weeks 2–3
Phase 5 (M): Week 3–4
Total: ~4 weeks
```

## Commands

After scoping project:
```bash
/drift-architect phase:1  # Plan Phase 1 in detail
/ship-feature [REQ-NNN]   # Ship REQ-NNN (maps to phase)
/drift-project-scope --status  # Show phase progress
```

## Recording

Project scope is saved to `.claude/epics/[project-name].md`:
```markdown
# [Project Name]

## Overview
[goal, constraints, timeline]

## Requirements
- REQ-001: [feature]
- REQ-002: [feature]

## Phases
### Phase 1: [goal]
- REQ-IDs: 001, 002
- Effort: S
- Depends: none

### Phase 2: [goal]
...

## Timeline
- Phase 1: Week 1
- Phase 2–3: Weeks 2–3
```

$ARGUMENTS
