---
name: ship-bug
description: "Bug fix workflow: RCA → Fix → Test → Deploy"
---

# /ship-bug — Fix & Ship a Bug

Identify root cause, fix, test, and deploy.

## Usage

```
/ship-bug "users can't reset password"
/ship-bug "dark mode breaks on mobile"
```

## Workflow (Mooz Brain Enhanced)

1. **Root Cause Analysis** (drift-scout + drift-rca)
   - Reproduce the bug
   - Use drift-scout to trace all affected files
   - Find root cause (using scout's 6-direction flow tracing)
   - Propose fix

2. **Plan Fix** (drift-architect)
   - From RCA findings, create fix tasks
   - Check consumers of changed functions
   - Identify test cases needed

3. **Fix** (drift-nextjs-ui + drift-builder)
   - Implement the fix using task list
   - Add test case (test-first when possible)
   - Verify consumers still work
   - All tests pass

4. **Verify** (drift-readiness + drift-critic)
   - All tests pass
   - No regressions
   - drift-critic multi-depth review
   - Types check

5. **Record** (drift-scribe)
   - Save bug pattern to brain.db (learnings)
   - Record fix for future reference
   - Note if this was a common pattern

6. **Ship** (drift-ccpm)
   - Close GitHub issue
   - Merge to main
   - Deploy hotfix

---

## Time estimate: 30 min - 2 hours

Depends on bug complexity and whether it's in a shared module.
