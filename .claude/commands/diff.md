---
name: diff
description: "Smart diff grouped by task"
---

# /diff — Smart Diff

Show changes grouped by task, not by file.

## Usage

```
/diff
/diff --since [commit]
/diff --task [task-id]
```

## Output

```
Changes Grouped by Task:

Task 1: Add Stripe Schema
  ├─ packages/database/src/schema.ts
  │  └─ Added: payments, subscriptions, invoices tables
  ├─ migrations/[timestamp]_add_stripe_schema.sql
  │  └─ +50 lines

Task 2: Add Webhook Validator  
  ├─ packages/auth/stripe-webhook-validator.ts
  │  └─ New file: 120 lines
  ├─ packages/auth/index.ts
  │  └─ Export validator

Task 3: Payment API
  ├─ apps/api/src/routes/payments.ts
  │  └─ New file: POST /payments, GET /payments/:id
  ├─ apps/api/src/actions/payment.ts
  │  └─ New file: Server Actions

Total: 3 tasks, 12 files, 280 lines added
```

Much clearer than file-by-file diff for multi-task work.

