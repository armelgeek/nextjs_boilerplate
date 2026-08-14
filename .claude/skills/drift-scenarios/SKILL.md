---
name: drift-scenarios
description: Analyze all scenarios, edge cases, and failure modes for a feature
---

# drift-scenarios

Find every possible path, failure mode, and edge case before building.

## Usage

```
/drift-scenarios "add Stripe subscriptions"
/drift-scenarios [feature-name]
```

Auto-triggered in `/ship feature` after drift-clarify.

## What It Generates

### 1. Nominal Path
Happy path. Everything works. User succeeds.

```
User clicks subscribe
  → Card accepted
  → Confirmation email sent
  → Feature enabled
  ✓ Done
```

### 2. Alternative Paths
Valid variations. Different user flows.

```
User upgrades from free → different UX
User is already subscribed → show "already subscribed"
User has coupon → apply discount
User chooses annual vs monthly → different price
```

### 3. Error Scenarios
What can go wrong. How to recover.

```
Card declined → show specific error + allow retry
Timeout during payment → idempotency prevents double-charge
Email fails → user may not see confirmation (retry in background)
Database fails → webhook catches it later
```

### 4. Edge Cases
Boundaries. Limits. Corner cases.

```
Free trial expiring → charge on day 15
Timezone issues → when does renewal happen?
Large numbers → 100K users renewing same second
Tax by country → EUR vs USD pricing
```

### 5. Security/Compliance
Vulnerabilities. Regulations. Gotchas.

```
PCI-DSS → never store card numbers
Rate limiting → prevent card brute force
Idempotency → duplicate requests safe
Logging → no sensitive data in logs
```

## Output

```
Scenario Matrix: Add Subscriptions

Nominal:      ✓ 1 path, 4 test cases
Alternative:  ✓ 4 paths, 6 test cases
Error:        ✓ 4 scenarios, 8 test cases
Edge cases:   ✓ 4 cases, 4 test cases
Security:     ✓ 4 risks, 4 test cases

Total: 26 test cases needed
High risk: 3 (card security, rate limit, idempotency)

Recommendation:
  40% of feature time = test/scenario planning
  60% of feature time = implementation
  
Better to find issues now than in production.
```

## Usage Pattern

```
/ship feature "add Stripe subscriptions"

1. drift-clarify
   → What is "subscriptions"? Recurring? Tiers?
   → User confirms: Pro/Basic/Free, monthly/annual

2. drift-scenarios ← NEW
   → Generate test matrix
   → Identify 26 scenarios
   → Flag 3 high-risk items
   → Suggest 40% time for tests/planning

3. drift-scout
   → Find Stripe integration points
   → Find database schema changes needed

4. drift-architect
   → Create 5 tasks (schema, payment, email, API, UI)
   → Each task has scenarios to test

5. drift-builder
   → Implement tasks
   → Tests already planned (from scenarios)

6. drift-test
   → Run the 26 test cases
   → All green (or identified before coding)

7. Review/Ship
```

## Benefits

✅ **No surprises** — All scenarios identified before coding  
✅ **Better design** — Architecture accounts for failures  
✅ **Focused testing** — Know exactly what to test  
✅ **Risk aware** — High-risk items flagged early  
✅ **Quality higher** — Tests written with scenarios in mind  

## Questions Answered

- What can go wrong?
- What edge cases exist?
- What security risks?
- What integrations matter?
- How many test cases needed?
- Which scenarios are high-risk?

