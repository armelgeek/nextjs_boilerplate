---
name: ship
description: "Ship with Mooz Brain: auto-clarify → scout → architect → build → verify → deploy"
---

# /ship — Intelligent Delivery Pipeline

Ship features, bugs, chores, or incidents. Mooz Brain learns and improves every delivery.

## Usage (All-in-One)

```
/ship feature "add dark mode"          # Feature: clarify → scout → architect → build
/ship bug "users can't login"          # Bug: RCA → scout → fix → test
/ship chore "refactor auth module"    # Chore: plan → implement → test
/ship incident "payment processing down"  # Incident: RCA → postmortem → fix
```

## Full Workflow (Mooz Brain Enhanced)

```
/ship [type] [description]
  ↓
[1] Auto-Clarify (drift-clarify)
    ├─ Detect domain (ui/api/database/auth/infra/content)
    ├─ Check brain.db for locked decisions
    └─ Ask 0-10 domain-specific questions (never repeat)
  ↓
[2] Scout (drift-scout)
    ├─ Find ALL relevant files (6-direction flow)
    ├─ Tag confidence: [VERIFIED], [ASSUMED]
    └─ List all consumers
  ↓
[3] Architect (drift-architect)
    ├─ Plan backward from goal → outcomes → tasks
    ├─ Check consumer counts (prevent breaking changes)
    └─ 1-6 precise tasks with exact file paths
  ↓
[4] Build (drift-builder + drift-nextjs-ui)
    ├─ Implement per task (fresh context each)
    ├─ Verify consumers before changing
    ├─ Build + test per task
    └─ Follow existing patterns exactly
  ↓
[5] Review (drift-critic + drift-readiness)
    ├─ Multi-depth code review
    ├─ Test coverage check
    ├─ Bundle size audit
    └─ Security scan
  ↓
[6] Record (drift-scribe)
    ├─ Save decisions to brain.db (locked)
    ├─ Extract learnings (patterns)
    ├─ Record conventions
    └─ Tag deviations
  ↓
[7] Ship
    ├─ Merge to main
    ├─ Deploy
    └─ Update primer.md
```

## What Changed from Before

| Before | After (Mooz Brain) |
|--------|-------------------|
| Generic questions | Domain-specific Q&A (never repeated) |
| Manual file finding | Auto-scout (all files found) |
| Vague planning | Precise architect (exact tasks + consumers) |
| Token cost: 30K | Token cost: 8K 3rd occurrence (75% savings) |
| No learnings captured | Brain learns error→fix patterns |
| Same mistakes repeated | Locked decisions prevent re-litigating |

## Type Detection

Auto-detects type from keywords:

**Feature** (default)
- Keywords: "add", "build", "create", "implement"
- Brain learns UI/API/database decisions
- Example: `/ship feature "add payment method"`

**Bug**  
- Keywords: "fix", "bug", "broken", "error"
- Uses drift-rca first for root cause
- Brain learns error patterns
- Example: `/ship bug "users can't reset password"`

**Chore**
- Keywords: "refactor", "improve", "optimize", "cleanup"
- Planning only (no auto-build)
- Brain learns refactoring patterns
- Example: `/ship chore "refactor auth middleware"`

**Incident** 
- Keywords: "incident", "outage", "down", "critical"
- RCA → Postmortem → Fix → Deploy
- Brain records incident patterns
- Example: `/ship incident "payment processing down"`

## Examples

### Add a Feature (Full Mooz Brain)
```
/ship feature "add two-factor authentication"
→ Clarify: "JWT storage? Backup codes?" (0 questions if auth domain locked)
→ Scout: Find auth routes, schema, services
→ Architect: 4 tasks (schema → service → API → UI)
→ Build: Each task gets fresh context
→ Review: Security scan on auth code
→ Record: Save "2FA implementation" pattern
→ Ship: Merge to main
```

### Fix a Bug (RCA First)
```
/ship bug "users can't login with +gmail addresses"
→ Scout: Find email validation in 3 places
→ Architect: 1 task (update regex + consumers)
→ Fix: Implement + test
→ Review: Check all validators updated
→ Record: "Email regex +address" bug pattern
→ Ship: Deploy hotfix
```

### Quick Refactor (Planning Only)
```
/ship chore "split auth middleware into smaller functions"
→ Scout: Find middleware + consumers (auth routes)
→ Architect: 3 tasks (extract functions, update calls, test)
→ Review plan (no auto-build)
→ User implements manually
→ Record: "Middleware refactoring" pattern
```

## Performance Gains (Real Numbers)

| Scenario | Without Brain | With Brain | Savings |
|----------|--------------|-----------|---------|
| 1st feature (auth domain) | 30K tokens | 30K tokens | — |
| 2nd feature (auth domain) | 30K tokens | 15K tokens | 50% |
| 3rd feature (auth domain) | 30K tokens | 8K tokens | **75%** |
| Follow-up in same sprint | 30K tokens | 3K tokens | **90%** |

**Token savings grow as brain learns your patterns.**

## Auto-Routing (You Don't Even Need `/ship`)

Brain can auto-route on plain prompts:
```
You: "add dark mode"
→ Auto-detects: feature + ui domain
→ Auto-invokes: /ship feature "add dark mode"
→ Brain handles everything
```

Disable if you prefer explicit: `DRIFT_AUTO_ROUTING=off`

## Brain Status

Check what brain learned:
```
/drift:status                    # Full metrics
/brain-search decisions auth     # Auth decisions only
/brain-search learnings database # Database patterns
```

## Tips for Best Results

1. **Use `/ship`** — One command to rule them all
2. **Let brain clarify** — Don't pre-answer; brain remembers
3. **Run 3+ features** — Brain gets smarter after 2nd occurrence
4. **Check `/drift:status`** — See tokens saved + learnings
5. **Trust the brain** — Patterns get better, not worse, with time

## Next Level: Project Scope

For large work (multi-week projects):
```
/drift-project-scope "build customer portal"
→ Breaks into phases (Phase 1: Users, Phase 2: Analytics, etc.)
→ Maps REQ-IDs to phases
→ Estimates effort + timeline
→ Each phase ships independently
```

---

**Remember:** `/ship` learns. First feature costs 30K tokens. Third feature in same domain costs 8K. Your development gets faster and cheaper as the brain learns your patterns.
