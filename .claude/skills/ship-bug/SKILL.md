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

## Workflow

1. **Root Cause Analysis** (drift-rca)
   - Reproduce the bug
   - Trace the code
   - Find root cause
   - Propose fix

2. **Fix** (drift-nextjs-ui)
   - Implement the fix
   - Add test case
   - Verify it passes

3. **Verify** (drift-readiness)
   - All tests pass
   - No regressions
   - Types check

4. **Ship** (drift-ccpm)
   - Close GitHub issue
   - Merge to main
   - Deploy hotfix

---

## Time estimate: 30 min - 2 hours

Depends on bug complexity and whether it's in a shared module.
