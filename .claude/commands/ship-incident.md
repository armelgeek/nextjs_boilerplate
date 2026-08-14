---
name: ship-incident
description: "Incident response: RCA → postmortem → fix → deploy → learn"
---

# /ship incident — Incident Response

Respond to incidents systematically. RCA → Fix → Postmortem → Learn.

## Usage

```
/ship incident "payment processing down"
/ship incident "database migrations failed overnight"
/ship incident "auth tokens not refreshing"
```

## Workflow

```
/ship incident [description]
  ↓
[1] Context Gathering (drift-scout + drift-rca)
    ├─ When did it start? (timestamp)
    ├─ How many users affected?
    ├─ Current system state? (error messages, logs)
    ├─ Is it still happening?
    └─ If yes, go to MITIGATION (2), else go to RCA (3)
  ↓
[2] MITIGATION (if still ongoing)
    ├─ Immediate action to stop bleeding
    ├─ Rollback? Disable feature? Scale down?
    ├─ Quick fix? (reboot, clear cache, etc.)
    └─ Confirm status: resolved or still broken?
  ↓
[3] Root Cause Analysis (drift-rca)
    ├─ Trace the code path that broke
    ├─ Recent changes? (git log last 24h)
    ├─ Environment changes? (config, deployment, traffic spike)
    ├─ Dependency failures? (external service, database, cache)
    ├─ Scout: Find all affected systems/files
    └─ Hypothesis: What actually broke it?
  ↓
[4] Timeline Reconstruction (drift-scribe)
    ├─ Deployment time
    ├─ First user report
    ├─ Detection time
    ├─ Mitigation time (if applied)
    ├─ Root cause identified time
    └─ Resolution time
  ↓
[5] Fix Planning (drift-architect)
    ├─ Immediate fix (hotfix to main branch)
    ├─ Permanent fix (prevent recurrence)
    ├─ Rollback vs forward? (usually forward if fix is quick)
    ├─ Consumer impact (what breaks if we fix this way?)
    └─ 1-3 implementation tasks
  ↓
[6] Fix Implementation (drift-builder)
    ├─ Code change (minimal, focused)
    ├─ Test: Reproduce bug FIRST
    ├─ Test: Verify fix works
    ├─ Verify: No regressions
    └─ NO ASSUMPTIONS (test every claim)
  ↓
[7] Urgent Validation (drift-critic)
    ├─ Does fix actually solve the problem?
    ├─ Any new risks introduced?
    ├─ Performance impact?
    └─ Security implications?
  ↓
[8] Deploy Hotfix
    ├─ Build + deploy (ASAP, high risk tolerance)
    ├─ Notify stakeholders: "Fix deployed"
    ├─ Monitor metrics (is incident resolved?)
    └─ Confirm: All systems green
  ↓
[9] Postmortem (drift-scribe + team)
    ├─ What was the incident?
    ├─ Root cause (technical)
    ├─ Why wasn't it caught? (testing gap)
    ├─ Why wasn't it mitigated? (observability gap)
    ├─ What will prevent recurrence? (3 action items)
    ├─ Owner per action item
    └─ Due date per action
  ↓
[10] Record to Brain (drift-scribe)
    ├─ Save error pattern: "payment-webhook-timeout"
    ├─ Problem: "External payment service timeout on webhook ACK"
    ├─ Solution: "Implement timeout + retry + DLQ"
    ├─ Confidence: 0.95 (production-verified fix)
    ├─ Severity: Critical (payment processing)
    └─ Domain: infra + api
  ↓
[11] Action Items (GitHub Issues)
    ├─ Issue 1: Add webhook timeout monitoring
    ├─ Issue 2: Implement dead-letter queue for failed webhooks
    ├─ Issue 3: Add e2e test for webhook failure scenarios
    └─ All assigned + deadline = next sprint
  ↓
[12] Ship Postmortem Document
    ├─ Merge postmortem to docs/incidents/
    ├─ Tag with #incident #critical #resolved
    └─ Share with team (GitHub wiki, email)
```

## Severity Levels

### Critical (P0)
- Users can't transact
- Data loss risk
- Security breach
- Mitigation: ASAP, even if partial
- Postmortem: Same day
- Example: Payment processing down

### High (P1)
- Feature broken for subset of users
- Performance degraded significantly
- Mitigation: Within 1 hour
- Postmortem: Next day
- Example: Login 50% failure rate

### Medium (P2)
- Feature partially broken
- Minor performance impact
- Users have workaround
- Mitigation: Within 4 hours
- Postmortem: Within 2 days
- Example: Dark mode button not responsive

### Low (P3)
- Cosmetic issue
- Rare user impact
- No workaround needed
- Postmortem: Optional (if pattern emerges)
- Example: Typo in error message

## Postmortem Template (Brain Records)

```markdown
# Incident: [Title]

**Date**: [YYYY-MM-DD]
**Severity**: P0 | P1 | P2 | P3
**Duration**: [HH:MM] (start to resolution)
**Impact**: [X users affected | Y revenue impact | Z transactions failed]

## What Happened
[1-2 paragraph incident description]

## Root Cause
[Technical root cause, not symptoms]

## Timeline
- HH:MM - Deployment
- HH:MM - First user report
- HH:MM - Detection (monitoring)
- HH:MM - Mitigation (if applied)
- HH:MM - Fix deployed
- HH:MM - Verified resolved

## Why It Wasn't Caught
[Test gap | Monitoring gap | Process gap]

## Detection Improvement
[What alerts should have fired]

## Recurrence Prevention
1. [Action] - Owner: @username - Due: [date]
2. [Action] - Owner: @username - Due: [date]
3. [Action] - Owner: @username - Due: [date]

## Lessons Learned
[What will we do differently next time]

## Brain Learning
Pattern: [short-id]
Problem: [what broke]
Solution: [what fixed it]
Confidence: 0.95 (production-verified)
```

## Incident Command Best Practices

1. **No blame** — Focus on systems, not people
2. **Depth over speed** — Postmortem teaches the team
3. **Action items** — Not just "we'll be more careful"
4. **Brain learns** — Every incident prevents 10 future ones
5. **Share widely** — Postmortem documents are team education

## What Brain Learns

Brain captures:
- **Error patterns** (webhook timeout, database connection, etc.)
- **Detection gaps** (alert should have fired X minutes earlier)
- **Testing gaps** (test should catch this scenario)
- **Architecture weaknesses** (redundancy, monitoring, etc.)
- **Difficulty level** (how hard was RCA?)
- **Resolution time** (how fast did we fix?)

Next time similar incident occurs → brain provides patterns → faster resolution.

## Examples

### Incident: Payment Processing Down
```
/ship incident "payment processing failing"

[RCA] Webhook timeout from Stripe → no ACK → retry storm
[Fix] Add timeout + exponential backoff + DLQ
[Deploy] Hotfix in 45 min
[Postmortem] Add monitoring + e2e test for webhook failures
[Brain Records] "webhook-timeout" pattern, confidence 0.95
```

### Incident: Database Migrations Failed
```
/ship incident "database down after deployment"

[RCA] Migration added NOT NULL column without default
[Fix] Rollback + add default + re-migrate
[Deploy] 2-step deploy (add column + add constraint)
[Postmortem] Add migration validation to CI
[Brain Records] "migration-validation" pattern, prevention step added
```

### Incident: Auth Tokens Not Refreshing
```
/ship incident "users logged out unexpectedly"

[RCA] Refresh token cookie lost on new deployment
[Fix] Preserve cookie value across deployments
[Deploy] Hotfix + clear user session cache
[Postmortem] Add sticky session testing
[Brain Records] "session-persistence" pattern
```

## Post-Incident Follow-Up

1. **Action items tracked** — All 3 items in GitHub
2. **Brain learns** — Pattern recorded, reusable for future
3. **Team discusses** — Postmortem shared async (async first)
4. **Metrics updated** — Incident tracked in metrics.jsonl
5. **Staging test** — Reproduce incident in staging before next deploy

