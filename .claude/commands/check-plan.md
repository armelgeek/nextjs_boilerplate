---
name: check-plan
description: "Validate plan before executing"
---

# /check-plan — Validate Plan

Review and validate Architect's plan before building.

## Usage

```
/check-plan
/check-plan --scope
/check-plan --risk
/check-plan --consumers
```

## Validates

- All consumers identified (via scout findings)
- No circular dependencies
- Task ordering is correct
- No missing prerequisites
- Risk level acceptable

## Output

```
✓ Plan is sound
  - 6 tasks, all independent
  - 15 files touched
  - 3 consumers must update
  - Risk: low

? Questions:
  - Should Task 3 be parallel with Task 2?
  - Is backfill needed for schema change?

✗ Issues:
  - Task 5 touches file also touched by Task 2 (must be sequential)
  - Task 4 has 8 consumers but only 3 in plan
```

Safe guard before executing large plans.

