---
name: drift-pr-generator
description: Auto-generate PR descriptions from commits and task context
---

# drift-pr-generator

Generate PR descriptions automatically. No manual writing needed.

## Usage

Auto-triggered after executor completes, or:
```
/drift-pr-generator feat/stripe-integration
```

## What It Generates

### PR Title
```
feat(payments): add Stripe subscription support
```

From:
- Commit type (feat/fix/docs)
- Scope (inferred from files)
- Description (from commits)

### PR Description

```markdown
## What
Adds Stripe integration for recurring subscriptions, enabling:
- Monthly and annual billing plans
- Pro-rata subscription management
- Automatic invoice handling

## Why
Complete the payment subsystem needed for SaaS monetization.
Required for Q1 revenue launch.

## How
- Added schema: payments, subscriptions, invoices tables
- Implemented webhook handler for Stripe events
- Added API endpoints: POST /payments, GET /subscriptions
- Added UI components: SubscriptionSelector, BillingDashboard

## Testing
- [x] Unit tests (12 new, all passing)
- [x] Integration tests (5 new, all passing)
- [x] Manual testing performed (local Stripe test keys)
- [x] E2E tests updated

## Checklist
- [x] Code follows project style guidelines
- [x] Self-review completed
- [x] Comments added for complex logic
- [x] Documentation updated
- [x] No new warnings introduced
- [x] Tests pass locally
- [x] Typecheck: 0 errors
- [x] Security: clean

Closes #456
```

## Auto-Populated From

**PR Title:**
- Conventional commit format

**What:**
- Task description
- Feature list (from code analysis)

**Why:**
- Issue/ticket context (from git branch name)
- Business impact (from commit messages)

**How:**
- File changes grouped by layer (schema, API, UI)
- Key implementation details

**Testing:**
- Test file count + status (✓ all passing)
- Manual testing checkbox

**Checklist:**
- Auto-check items based on what was done:
  - Tests exist? ✓
  - Typecheck passes? ✓
  - Security clean? ✓
  - Docs updated? ✓

## Output

```
✅ PR GENERATED

Title: feat(payments): add Stripe subscription support
Body: 450 words (good length)
Checklist: 8/8 complete
Ready to post.

GitHub PR link: [to be created]
```

## Integration

- Auto-runs after drift-executor (if no manual intervention)
- Can be manually invoked
- Creates draft PR (user reviews before posting)

