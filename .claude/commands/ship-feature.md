---
name: ship-feature
description: "Ship features with Mooz Brain: auto-clarify → scout → architect → build → record"
---

# /ship-feature — Ship a Feature Fast

Deliver a feature from spec to production using Mooz Brain for smarter decisions.
The workflow now clarifies ambiguity, finds all affected files, creates precise plans, and learns from each delivery.

## Usage

```
/ship-feature "add dark mode"
/ship-feature "implement OAuth login"
/ship-feature "add analytics dashboard with real-time charts"
```

## Workflow (Mooz Brain Enhanced)

0. **Scope Cut** (scope-cutter) ← AUTO FIRST
   - MVP vs V2+ breakdown
   - Solo dev time estimate
   - List gotchas to ignore
   - Forces binaries: no scope creep

1. **Clarify** (drift-clarify) ← NEW: Brain-aware
   - Detect domain (UI/API/database/auth/infra/content)
   - Check brain.db for locked decisions (never ask same question twice)
   - Ask 3–6 targeted questions to resolve ambiguity
   - Record decisions to brain (locked, reusable)

2. **Scout** (drift-scout) ← NEW: Complete flow tracing
   - Find ALL relevant files across apps/packages
   - Trace: entry → server action → service → database
   - Tag confidence: [VERIFIED], [ASSUMED], [LINKED]
   - List consumers of exported functions/types

3. **Plan** (drift-architect) ← ENHANCED: Goal-backward methodology
   - Use Scout findings to identify files
   - Work backward from goal to observable truths
   - Create 1–6 tasks with exact file paths
   - Check consumer counts before proposing changes
   - Identify irreversibility (DB changes, breaking APIs)

4. **Write PRD** (drift-ccpm)
   - Quick spec of MVP scope
   - User stories
   - Success criteria

5. **Create Epic** (drift-ccpm)
   - Break into issues
   - Map dependencies
   - Create GitHub issues

6. **Code** (drift-nextjs-ui + drift-builder)
   - Start on issues
   - Build MVP incrementally using Architect's tasks
   - Verify consumers before changing (drift-builder checks)
   - Push to GitHub

7. **Verify** (drift-readiness + drift-critic)
   - Tests pass
   - drift-critic multi-depth review
   - No bundle bloat
   - Types check

8. **Record** (drift-scribe) ← NEW: Capture learnings
   - Save decisions to brain.db
   - Record error→fix patterns (learnings)
   - Extract conventions discovered
   - Log any deviations

9. **Ship** (drift-ccpm)
   - Merge epic
   - Tag release
   - Deploy

---

## Time estimate: 1-3 days for MVP (per scope-cutter breakdown)

Actual time depends on MVP scope and parallel agent execution.

## Key flow

Feature description → **Auto-scope** → PRD (scope-aware) → Epic → Code → Ship

No waffling on scope. Scope-cutter is step 0.
