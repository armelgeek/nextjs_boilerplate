---
name: drift-guide
description: Validate commits against plan, provide real-time navigation feedback
---

# drift-guide

Real-time validation that you're coding in the right direction.

## Usage

```
/drift-guide
/drift-guide --current
/drift-guide --status
```

## What It Does

After each commit, drift-guide:
1. **Reads the current task** from brain.db
2. **Reads the commit** (files touched, changes made)
3. **Compares** against plan (expected files, scope)
4. **Gives feedback**:
   - ✅ "On track" (files match plan)
   - ⚠️ "Mooz detected" (touching extra files or missing planned files)
   - ❌ "Off course" (significant divergence)

## Feedback Types

### ✅ On Track
```
All files in commit are in the plan.
All planned files are being touched incrementally.
Architecture respected (packages/apps separation).
Types safe, tests updated.

→ Continue
```

### ⚠️ Mooz Detected
```
You touched files not in plan:
  ⚠️ packages/database/schema.ts (unexpected)

Are you:
  a) Expanding scope intentionally? (say so, I'll log it)
  b) Fixing a bug along the way? (log as learning)
  c) Wrong file? (revert and fix)

Action: Pick a, b, or c
```

### ❌ Off Course
```
Plan says: [schema.ts, webhook.ts]
You touched: [webhook.ts, api.ts] (missing schema!)

Either:
  1. Update the plan (ask drift-architect for quick replan)
  2. Revert and implement per plan
  3. Split into two commits (schema first, then webhook)

Action: Choose 1, 2, or 3
```

## Integration

Runs automatically after each commit during `/ship-feature` workflow.

To manually check current status:
```
/drift-guide --status
```

To validate a specific commit:
```
/drift-guide --commit abc123
```

## Override

If intentionally deviating:
```
git commit --message "feat: add X [drift-guide-ok]"
# Skips validation, logs as scope expansion
```

If pivoting:
```
/drift-guide --pivot
# Pauses workflow
# Calls drift-architect for quick replan
# Resumes with updated plan
```

