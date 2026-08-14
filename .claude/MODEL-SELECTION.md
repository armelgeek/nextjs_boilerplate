# Mooz Model Selection Strategy

Auto-select best model (haiku/sonnet/opus) per agent + domain based on success rates.

## Philosophy

**Cost scales with confidence, not tasks.**

- First task in domain: Use Sonnet (unknown patterns)
- 2nd task (90%+ success): Downgrade to Haiku (cheap)
- Task fails: Upgrade next attempt to Opus (best reasoning)
- After 10+ successes: Stay Haiku (established pattern)

Models track success across your sessions. Brain learns which model works best for YOUR codebase.

## Models Available

| Model | Speed | Cost | Reasoning | When to Use |
|-------|-------|------|-----------|------------|
| **Haiku** | Fast | Cheap | Basic | Well-known domains, high confidence |
| **Sonnet** | Normal | Medium | Good | Standard tasks, unknown domains |
| **Opus** | Slow | Expensive | Best | Complex reasoning, high stakes |

## Success Rates per Domain

Brain tracks: `success_count / (success_count + failure_count) = confidence`

```
Auth Domain (10 tasks completed):
  - Haiku: 7 successes, 1 failure = 87.5% ✓ Use Haiku next
  - Sonnet: 2 successes, 0 failures = 100% (but less needed)
  - Opus: 0 uses (not needed yet)

Database Domain (3 tasks):
  - Haiku: 0 successes, 2 failures = 0% ✗ Don't use
  - Sonnet: 3 successes, 0 failures = 100% ✓ Use Sonnet
  - Opus: 0 uses

UI Domain (1 task):
  - Haiku: 0 uses (unknown)
  - Sonnet: 0 uses (unknown)
  - Opus: 0 uses
  → Use Sonnet (default for unknown)
```

## Selection Logic

```typescript
// When selecting model for task in domain X:

function selectModel(agent: string, domain: string): 'haiku' | 'sonnet' | 'opus' {
  const haikuRate = getSuccessRate(agent, domain, 'haiku');
  const sonnetRate = getSuccessRate(agent, domain, 'sonnet');
  const opusRate = getSuccessRate(agent, domain, 'opus');

  const totalTasks = haikuRate.count + sonnetRate.count + opusRate.count;

  // Unknown domain: use sonnet
  if (totalTasks === 0) {
    return 'sonnet';
  }

  // Very confident with haiku: use haiku
  if (haikuRate.successPct >= 90 && haikuRate.count >= 5) {
    return 'haiku';
  }

  // Low confidence with haiku: avoid it
  if (haikuRate.successPct < 70) {
    return 'sonnet';
  }

  // Standard: use sonnet
  if (sonnetRate.successPct >= 80) {
    return 'sonnet';
  }

  // Struggling with sonnet: escalate to opus
  if (sonnetRate.successPct < 70) {
    return 'opus';
  }

  return 'sonnet';  // Default
}
```

## Tracking Success/Failure

After each task, update brain:

```
Task completed successfully:
  → model_performance: {agent, domain, model, success_count++}

Task failed:
  → model_performance: {agent, domain, model, failure_count++}

Example:
  Agent: drift-architect
  Domain: database
  Model: haiku
  Failure: "Generated plan with missing consumer checks"
  → haiku success_rate for drift-architect:database drops
```

## Real-World Example

### Session 1: First Time Building Payment Feature
```
Task: "Add Stripe integration"
Domain: Detected = infra
Model selected: sonnet (unknown domain, default)
Result: ✓ Successful plan + implementation
Brain records: drift-architect:infra:sonnet = 1 success

Task: "Add subscription webhooks"
Domain: infra (same)
Model selected: sonnet (1 success, 100%, still learning)
Result: ✓ Successful
Brain records: drift-architect:infra:sonnet = 2 successes

Task: "Add payment receipts API"
Domain: api (new)
Model selected: sonnet (unknown domain, default)
Result: ✓ Successful
Brain records: drift-architect:api:sonnet = 1 success
```

### Session 2: Second Time Building Payment Feature
```
Task: "Add invoice management"
Domain: infra
Model selected: haiku (2 successes, 100%, ready to try)
Result: ✓ Successful plan (haiku can handle it now)
Brain records: drift-architect:infra:haiku = 1 success

Token cost: -30% vs first time (haiku is cheaper)
```

### Session 3: Complex Refactoring in Auth
```
Task: "Split auth middleware into 5 functions"
Domain: auth
Prior model performance:
  - haiku: 6 successes (auth domain)
  - sonnet: 1 success
Model selected: haiku (80%+ confidence)
Result: ✗ Failed (too complex, haiku can't split 5 functions well)
Brain records: drift-architect:auth:haiku = 6 successes, 1 failure = 85.7%

Token cost: Still low (haiku cost), risk accepted
```

### Session 4: Complex Auth Task Again
```
Task: "Implement custom OIDC provider"
Domain: auth
Prior model performance:
  - haiku: 6 success, 1 fail = 85.7% (lower confidence now)
Model selected: sonnet (failed haiku before, complex task)
Result: ✓ Successful
Brain records: drift-architect:auth:sonnet = 2 successes

Message: "Haiku struggled with custom OIDC last time. Using Sonnet for confidence."
```

## Per-Agent Model Strategies

### drift-scout (Research)
- Haiku often handles simple searches
- Sonnet needed for complex flow tracing
- Opus rarely needed

Strategy:
```
Simple search (1-2 files): haiku
Normal search (3-10 files): sonnet
Complex flow (10+ files, circular deps): sonnet/opus
```

### drift-architect (Planning)
- Haiku: Well-known patterns, single task
- Sonnet: Standard multi-task plans, new domains
- Opus: Complex multi-area, high-stakes refactoring

Strategy:
```
1-task plan: haiku (if confident)
3-6 task plan: sonnet (default)
7+ tasks or complex dep: opus
```

### drift-builder (Execution)
- Haiku: Simple implementations
- Sonnet: Standard implementations
- Opus: Rarely needed (not a reasoning task)

Strategy:
```
Simple change (1-2 files): haiku
Normal change (3-6 files): sonnet
Complex multi-area: sonnet (builder isn't reasoning)
```

### drift-critic (Review)
- Haiku: Quick scan (10-20 lines)
- Sonnet: Standard review (20-100 lines)
- Opus: Deep security review

Strategy:
```
<20 lines: haiku
20-100 lines: sonnet
>100 lines or security: sonnet/opus
```

### drift-scribe (Documentation)
- Always Haiku (documentation is simple)
- Simple task, consistent output needed
- No reasoning required

Strategy:
```
All tasks: haiku (safe, consistent, cheap)
Except: Large free-form summaries → sonnet
```

## Viewing Model Performance

```bash
/drift:status
# Shows model selection per domain

/brain-search model-performance
# Detailed table: agent × domain × model success rates

/brain-search model-performance domain:auth
# Auth-specific models: which model best for auth tasks?
```

## Admin: Reset Model Performance

If results are skewed (e.g., bad haiku run in early session):

```bash
/drift:status --reset-models auth
# Clear auth domain performance, go back to defaults
```

## Tuning Over Time

Brain learns your patterns and your style:

1. **Week 1**: All sonnet (learning phase)
2. **Week 2**: Haiku for familiar domains (30% token savings)
3. **Week 3+**: Haiku for everything, sonnet fallback (70% token savings)

Your first feature costs 30K tokens. Third feature costs 8K (haiku + patterns cached).

Savings compound: First payment feature (Stripe integration) → All payment features after that cost less.

## Edge Cases

### What if haiku keeps failing?

```
Haiku:sonnet success ratio < 70%
→ Automatically escalate to sonnet next attempt
→ Brain won't suggest haiku for this domain
→ Keeps trying after 5 sonnet successes (maybe haiku improved)
```

### What if all models fail?

```
sonnet fails on complex task
→ Escalate to opus
→ If opus succeeds: record "task needed opus", suggest opus for similar tasks
→ If opus fails: STOP, report BLOCKER (not a model issue)
```

### What about budget concerns?

If monthly budget is tight:

```
/drift:config token-budget 100k
# Brain targets haiku-first strategy
# Only uses sonnet/opus if confidence <70%
```

Then:
- Less money spent ✓
- Slightly slower iterations (more haiku=false-positives)
- More session checkpoints (careful budget spending)

## Next: AI Cost Visibility

Future: Show per-task cost + predicted total cost:

```
Plan for "Add subscription billing":
  - Task 1 (database schema): sonnet (estimated 3K tokens)
  - Task 2 (webhook handler): sonnet (estimated 4K tokens)
  - Task 3 (API endpoints): haiku (estimated 2K tokens, high confidence)
  - Task 4 (UI components): haiku (estimated 1.5K tokens, ui domain known)
  
Total: ~10.5K tokens (cheaper than first time: 30K)
```

This is tracked after first feature, gets more accurate.

