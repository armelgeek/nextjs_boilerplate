---
name: drift-executor
description: Execute task in a loop until complete (no interruptions)
---

# drift-executor

Loop execution. Keep working until task is done.

## Usage

```
/drift-executor "add Stripe subscription"
/drift-executor "fix payment bug" --max-iterations 25
/drift-executor "implement auth" --criteria "all tests pass + deploy succeeds"
```

## What It Does

Executes in a loop until **completion criteria met**:

1. **Understand** — What's done? What's left? What's blocking?
2. **Step** — Code, test, verify, commit (one step forward)
3. **Check** — Completion criteria satisfied?
4. **Loop** — If not done, repeat (no pause, no ask)

Stops when:
- ✅ Completion criteria met → DONE
- ❌ Max iterations hit → escalate
- ❌ Timeout exceeded → escalate
- ❌ Loop detected → escalate (same step 3x)

## Completion Criteria

Specify when task is done:

```
/drift-executor "add auth"
  --criteria "All tests pass + no type errors + security clean"

Loop runs until ALL three are true.
```

Common criteria:
- "All tests pass"
- "Zero type errors"
- "Security audit clean"
- "Deploy succeeds"
- "End-to-end flow works"
- "Performance < 100ms"

## Workflow

```
Iteration 1
  → Code first change
  → Test it
  → Check criteria
  → Not done? Continue

Iteration 2
  → Code next change
  → Test it
  → Check criteria
  → Not done? Continue

Iteration N
  → Code final change
  → Test it
  → Check criteria
  → ✅ DONE
  → Exit loop
```

## Vs `/ship feature`

| Aspect | /ship feature | /drift-executor |
|--------|---------------|-----------------|
| Flow | Step-by-step (ask at key points) | Loop (automated) |
| Pauses | Before each phase | Never |
| For | Planned, structured work | "Just get it done" |
| Time | Longer (reviews, checks) | Faster (uninterrupted) |
| Risk | Safe (human oversight) | Higher (no approval) |

## Example

```
/drift-executor "implement Stripe webhooks"
  --criteria "webhook handler + retry logic + tests all pass"
  --max-iterations 20

[Loop starts]

Iteration 1: Add webhook schema
  ✓ Code written, tests pass, criteria not met → continue

Iteration 2: Create webhook handler
  ✓ Code written, tests pass, criteria not met → continue

Iteration 3: Add retry logic
  ✓ Code written, tests pass, criteria not met → continue

Iteration 4: Add security validation
  ✓ Code written, tests pass
  ✓ All criteria met → EXIT LOOP

RESULT: Webhook complete in 4 iterations (no interruptions)
```

## Safety Guards

**Max iterations** (default 20)
```
If loop hits 20 iterations, stop and escalate.
Usually means criteria too complex or task too large.
```

**Timeout per iteration** (default 60s)
```
Each iteration must complete in 60s.
If timeout → escalate with current state.
```

**Loop detection** (same step 3x)
```
If same code location edited 3 times in a row → escalate.
Prevents infinite retry cycles.
```

**Token limit** (1M per task)
```
If exceeds 1M tokens → stop and escalate.
Prevents runaway costs.
```

## When to Use

✅ **Use drift-executor when:**
- Goal is crystal clear
- No architectural decisions needed
- You want it done ASAP
- You trust the loop to handle issues

❌ **Avoid when:**
- Goal is ambiguous
- Needs human judgment mid-task
- Complex tradeoffs required
- First attempt at this feature

## Example: Compare `/ship feature` vs `/drift-executor`

### /ship feature "add payments"
```
1. Clarify — What kind of payments?
   [Human decides: recurring subscriptions]
2. Scenarios — What paths?
   [Human reviews: 20 test scenarios]
3. Architect — How many tasks?
   [Human approves: 4 tasks]
4. Build task 1 — Code + review
   [Human checks each task]
5-7. Build tasks 2-4
...
Total: 2-3 hours, human supervision

Good for: Complex features, decisions needed
```

### /drift-executor "add payments"
```
1. Execute loop until all tests pass
   [No pauses, no reviews]
2. Stop when criteria met
   [Done]

Total: 30 minutes, autonomous

Good for: Clear-cut features, speed matters
```

