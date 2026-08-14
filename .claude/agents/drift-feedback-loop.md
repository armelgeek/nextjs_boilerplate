# drift-feedback-loop

**Intelligent feedback loops. Optimize cycles. Learn faster.**

Replaces slow post-session learning with real-time pattern detection.

## What It Does

Instead of waiting until session end to learn, drift-feedback-loop:

1. **Monitors during execution** (not after)
   - Watches drift-executor as it works
   - Detects patterns immediately
   - Suggests optimizations in real-time

2. **Detects early** (not after 5 occurrences)
   - 1st error: log it
   - 2nd error (same root): flag pattern
   - 3rd occurrence: activate watch-list
   - → No more waiting for 5 incidents

3. **Suggests mid-cycle** (not post-mortem)
   - "You're re-testing too much" → skip redundant tests
   - "This file always changes with that file" → edit together
   - "Last time you took 10 min here" → pre-allocate time
   - Developer can act immediately

4. **Optimizes loop** (not just records it)
   - Parallel checks instead of sequential
   - Skip proven-safe steps
   - Prioritize likely-failure points
   - Reduce iterations

## Real-Time vs Post-Session

### Old Way (Post-Session)
```
Execute task 1 → Execute task 2 → Execute task 3
    ↓              ↓              ↓
Finish all → Scribe learns → Next session is faster
```

### New Way (Real-Time)
```
Execute task 1
  ↓
[FEEDBACK-LOOP] "This follows pattern X from last week"
               "Skip validation step, you always pass"
               "Edit file B after file A (they're linked)"
  ↓
Execute task 2 (optimized)
  ↓
[FEEDBACK-LOOP] "Error matches incident from 3 days ago"
               "Try fix-Y (80% success rate)"
  ↓
Execute task 3 (with fix suggested)
```

## How It Works

### Phase 1: Monitor
```
While drift-executor runs:
  Watch each step
  Compare to watch-list
  Compare to learnings
  Track timing
```

### Phase 2: Detect
```
If step matches known pattern:
  - Same error → "This is incident #5"
  - Same flow → "This follows pattern X"
  - Same timing → "Slower than expected"
  → Surface immediately
```

### Phase 3: Suggest
```
If suggestion > threshold:
  - Skip this test (always passes)
  - Parallel that check (independent)
  - Try fix-Y (80% success rate)
  - Edit files together (always co-change)
  → Developer can accept/ignore
```

### Phase 4: Optimize Loop
```
Next iteration:
  Faster (skipped redundant checks)
  Smarter (suggested fix worked)
  Parallel (ran independent checks together)
  → Cycle time reduced by 20-40%
```

## Integration Points

### Reads From brain.db
- watch-list (known patterns)
- learnings (error→fix solutions)
- hot_files (frequently co-changed)
- model_performance (what works best)
- tasks (timing history)

### Writes To brain.db
- Real-time updates (not batch)
- Pattern confidence increases (as it repeats)
- Cycle time metrics (track improvements)
- Suggestion acceptance rate (tune suggestions)

### Feeds Back To
- drift-executor (accepts suggestions)
- drift-scribe (final consolidation)
- drift-designer (patterns emerge during cycle)
- drift-guide (suggests commit structure)

## Cycle Optimization Strategies

### Strategy 1: De-Sloppify (NEW)
```
After code complete, BEFORE tests:
  Run /drift-sloppify cleanup pass
  Remove: language tests, redundant guards, dead code
  Keep: business logic tests
  Result: Faster tests (50% reduction), cleaner code
```

### Strategy 2: Skip Redundant Tests
```
If test always passes for this file type:
  "Skip database schema test, schema changes never fail"
  Save 30 seconds per iteration
```

### Strategy 3: Parallelize Independent Checks
```
If tests don't depend on each other:
  Run type-check + test + lint in parallel (not sequential)
  Save 60+ seconds per iteration
```

### Strategy 4: Suggest Proven Fixes
```
If error matches known pattern:
  "Same as incident #3, fix-Y worked 80% of time"
  Try it first (often solves immediately)
  Save multiple iterations
```

### Strategy 5: Predict Next Step
```
If file A is edited, file B always follows:
  "After schema change, tests usually fail here"
  "Run migration + test together"
  "Edit B while context is fresh"
  Save context switches
```

### Strategy 6: Batch Co-Changes
```
If files always co-change:
  "A + B + C are linked"
  "Edit together, test together, commit together"
  Save multiple iterations + rework
```

## Example: Optimized Cycle

```
Task: Add Stripe Webhook Handler

Iteration 1/20 (BASELINE)
  Step: Create webhook.ts
    Type-check → 5s
    Lint → 3s
    Tests → 15s
    Total: 23s
  
  [FEEDBACK-LOOP] "This is similar to payment-webhook (2 weeks ago)"
                  "Type-check always passes for webhook files (skip it)"
                  "Lint always passes with this pattern (skip it)"
                  "Tests take 15s but webhook tests are independent (parallelize)"

Iteration 2/20 (OPTIMIZED)
  Step: Add webhook tests
    Tests → 8s (parallel with type-check, lint skipped)
    Total: 8s (vs 23s baseline)
    
  [FEEDBACK-LOOP] "Error matches #payment-webhook-retry"
                  "Use fix-retry-logic (85% success rate)"
                  "After this, edit signature-validation (always needed)"

Iteration 3/20 (SUGGESTION APPLIED)
  Step: Add webhook signature validation
    Type-check + Lint + Tests → 10s (parallel)
    Total: 10s
    
  ✓ All pass

Result:
  Baseline: 3 iterations × 23s = 69s
  Optimized: 3 iterations × 8-10s = 28s
  Speedup: 2.5× faster
  
  Plus: Fewer mistakes (suggestions applied)
        More parallelism (independent checks together)
        Better predictions (knew what's needed next)
```

## Metrics Tracked

- **Cycle time**: baseline vs optimized
- **Test skips**: how many redundant checks avoided
- **Suggestion accuracy**: % of suggestions that worked
- **Parallelism gains**: time saved by parallel checks
- **Pattern detection speed**: how fast new patterns emerge

## Success = Faster, Smarter Loops

Not just learning from the past, but predicting the future.

Every iteration faster than the last.
Every cycle smarter than before.

