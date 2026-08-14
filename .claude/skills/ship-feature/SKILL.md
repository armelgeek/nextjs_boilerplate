---
name: ship-feature
description: "Fast feature delivery: Scope → PRD → Epic → Code → Deploy"
---

# /ship-feature — Ship a Feature Fast

Deliver a feature from spec to production. Scope first to kill feature creep.

## Usage

```
/ship-feature "add dark mode"
/ship-feature "implement OAuth login"
/ship-feature "add analytics dashboard with real-time charts"
```

## Workflow

0. **Scope Cut** (scope-cutter) ← AUTO FIRST
   - MVP vs V2+ breakdown
   - Solo dev time estimate
   - List gotchas to ignore
   - Forces binaries: no scope creep

1. **Write PRD** (drift-ccpm)
   - Quick spec of MVP scope
   - User stories
   - Success criteria

2. **Create Epic** (drift-ccpm)
   - Break into issues
   - Map dependencies
   - Create GitHub issues

3. **Code** (drift-nextjs-ui)
   - Start on issues
   - Build MVP incrementally
   - Push to GitHub

4. **Verify** (drift-readiness)
   - Tests pass
   - No bundle bloat
   - Types check

5. **Ship** (drift-ccpm)
   - Merge epic
   - Tag release
   - Deploy

---

## Time estimate: 1-3 days for MVP (per scope-cutter breakdown)

Actual time depends on MVP scope and parallel agent execution.

## Key flow

Feature description → **Auto-scope** → PRD (scope-aware) → Epic → Code → Ship

No waffling on scope. Scope-cutter is step 0.
