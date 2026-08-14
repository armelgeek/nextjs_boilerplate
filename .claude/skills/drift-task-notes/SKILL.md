---
name: drift-task-notes
description: Persistent task progress file — bridge context between executor iterations
---

# drift-task-notes

Context bridge for autonomous loops. A single Markdown file that persists state across iterations, enabling executor to maintain long-term memory without re-reading brain.db every iteration.

## What It Does

Creates and maintains `TASK_PROGRESS.md` that:
- **Bridges context** between `claude -p` invocations (each gets fresh context window)
- **Records progress** (completed steps, what's left, blockers)
- **Surfaces insights** (patterns emerging, predicted next steps, known pitfalls)
- **Prevents rework** (what was tried, what worked, what failed)
- **Maintains decisions** (made during task, not to repeat)

## Why It Exists

Every `claude -p` call or drift-executor iteration gets fresh context. Without a persistent note file:
- Executor loses track of what was tried
- Same fixes get attempted multiple times
- Patterns go undetected
- Progress becomes invisible across iterations

**With TASK_PROGRESS.md**, executor reads one file and knows:
- Completed steps (don't redo)
- Current blocker (focus here)
- Failed attempts (don't retry)
- Patterns (apply here)

## Structure

```markdown
# Task Progress: [Feature Name]

## Summary
- Status: in_progress
- Iterations completed: 5/20
- Last update: 2024-01-15 14:32 UTC

## Completed Steps
- [x] Schema creation (iteration 1)
- [x] API route scaffolding (iteration 2)
- [x] Basic tests (iteration 3)
- [ ] Error handling
- [ ] Integration tests

## Current Blocker
**Issue**: Type mismatch in payment webhook signature
- Error: "Cannot assign type X to type Y"
- Location: apps/api/src/routes/payments/webhook.ts:42
- Root cause: Stripe SDK v12 changed signature type
- Attempted fixes:
  - Fix 1: Cast to unknown (failed, type error persists)
  - Fix 2: Use Stripe types from @stripe/stripe-js (not exported)
  - Fix 3: Define custom type (works, but might diverge from Stripe)
- **Next**: Verify which approach matches Stripe's intent

## Patterns Detected
1. **Co-change pattern**: apps/api/routes/payments → packages/database/services/payment
   - These files always change together
   - Edit both in same iteration to avoid merge conflicts

2. **Migration timing**: Database changes must run BEFORE type-generation
   - Running typecheck before `npm run db:push` fails with stale schema
   - Always: `db:push` → `typecheck` → `test`

3. **Test slop**: Payment tests included 15 framework tests (type-checking, Promise behavior)
   - Cleaned up 8 redundant tests in iteration 5
   - Keep focused on business logic (webhook signature, amount validation)

## Decisions Made
- **Persist payment state in DB** (not Redis): simpler, satisfies SLA
- **Webhook verification via Stripe SDK** (not manual): less error-prone
- **Email notification on payment** (not Stripe webhook): 2-step process OK
  - Confidence: 0.9 (locked)

## Known Issues / Gotchas
1. Stripe test mode has 10-second delay before webhook delivery
   - Don't expect instant webhook callback in tests
   - Use polling or hardcoded test data instead

2. Currency formatting: Stripe uses cents, not dollars
   - amount: 1000 = $10.00
   - Multiple places forget this, easy to break

3. Customer ID required for Stripe subscriptions
   - Can't create subscription without attaching customer first
   - Schema migration must add customer_id before subscription

## Next Steps (Predicted)
- [ ] Fix webhook signature type (current blocker)
- [ ] Add webhook error handling (404, timeout, invalid sig)
- [ ] Test webhook delivery (use ngrok or Stripe CLI)
- [ ] Add payment status transitions (pending → confirmed → refunded)
- [ ] Integration test (full payment flow end-to-end)

## Metrics
- Iterations: 5/20 (25% complete)
- Files changed: 7 (4 new, 3 modified)
- Tests added: 12
- Tests removed (slop): 8
- Time per iteration: 3-5 min (average)
- Cycle time: ~25 min so far

## Brain.db Connections
- Feature ID: feature_stripe_payments_001
- Tasks:
  - task_001_stripe_schema [completed]
  - task_002_stripe_api [in_progress]
  - task_003_stripe_ui [pending]
- Decisions locked in brain: 2 (persist strategy, verification method)
- Learnings pending: payment-type-mismatch, stripe-test-delay
```

## When to Create / Update

### Create
- On `/drift-executor` start for a feature
- File: `TASK_PROGRESS.md` (root of project)
- Initialize with empty sections

### Update
- **After each iteration** (auto-triggered after drift-executor step)
- **On blocker** (executor couldn't proceed, blocked-reason goes here)
- **On pattern detection** (feedback-loop detected new pattern)
- **Before abandoning** (if stopping task, final notes for resumption)

### Read
- **Start of iteration** (executor reads file for context)
- **After error** (understand what was tried before)
- **Before committing** (make sure progress is recorded)

## Integration with Executor

### Executor Reads TASK_PROGRESS.md At Start
```
Iteration 5/20 of "Add Stripe"
  Read TASK_PROGRESS.md
  → Found: webhook signature type mismatch (iteration 4)
  → Found: payment tests need cleanup (feedback)
  → Found: schema migration must precede typecheck
  → Apply: Use schema order from previous attempt
```

### Executor Updates After Each Step
```
Step: Fix webhook signature type
  Tried: Custom type (works)
  Tests: pass
  Commit: fix: define webhook signature type
→ TASK_PROGRESS.md updated:
  Completed Steps: [..., webhook signature fixed]
  Current Blocker: [cleared, moved to "Error handling"]
  Next Steps: updated
```

### Feedback-Loop Injects Patterns
```
[FEEDBACK-LOOP] "Detected: payment + database always co-change"
                "Next iteration: edit both files, test together"
→ TASK_PROGRESS.md updated:
  Patterns Detected: [..., co-change detected]
```

## Content Guidelines

### Completed Steps
- One line per step
- Check mark when truly complete (tests pass, committed)
- Include iteration number (reference git)

### Blockers
- Explicit problem statement (not vague)
- Error message or stack trace (exact location)
- Attempted fixes (what was tried, why it failed)
- Next action (concrete, specific)

### Decisions
- What was decided?
- Why (if non-obvious)?
- Confidence (0.0-1.0)
- Locked? (true if never ask again)

### Patterns
- Clear name (dash-case)
- Specific observation (which files? which errors?)
- Implication (what to do next time)

## Why This Works

1. **Bridges context gaps** — Each executor iteration starts fresh, but reads the note file
2. **Prevents rework** — "Already tried this fix in iteration 2, failed because..."
3. **Surfaces patterns** — "Payment + database always co-change, edit together"
4. **Enables resumption** — Session crashes? New session reads progress, continues from blocker
5. **Fast feedback** — Patterns visible after iteration 2-3, not "wait for 5 occurrences"

## Anti-Patterns

❌ **Don't**: Use TASK_PROGRESS.md as a git log
❌ **Don't**: Copy-paste error messages verbatim without analysis
❌ **Don't**: Record vague blockers ("something broke")
❌ **Don't**: Store code snippets here (git keeps that)
❌ **Don't**: Mix multiple features (one file per feature)

✅ **Do**: Write for the executor reading it next iteration
✅ **Do**: Explicit root causes, not symptoms
✅ **Do**: Record what was tried AND why it failed
✅ **Do**: Keep metrics (% complete, time per iteration)
✅ **Do**: Link to brain.db (feature ID, task IDs)

## Example: Resume After Crash

**Session 1**: Working on Stripe feature, got to iteration 5
```bash
# Executor started
/drift-executor "Add Stripe integration"

# Session crashed at iteration 5
```

**Session 2**: Resumed
```bash
# New session, executor resumes
/drift-executor "Add Stripe integration"  (or /resume)

# Executor reads TASK_PROGRESS.md
→ Completed: 5 steps (schema, API scaffold, tests, type fix, refactor)
→ Blocker: webhook signature type
→ Patterns: payment + database co-change
→ Next: error handling

# Executor continues from blocker
→ Resolves webhook type issue
→ Applies co-change pattern
→ Runs error handling step
→ Updates TASK_PROGRESS.md
→ Continues until complete
```

Without TASK_PROGRESS.md, executor would re-do steps 1-5 from scratch, wasting 15+ minutes.

