---
name: rollback
description: "Rollback last N tasks — sequential revert"
---

# /rollback — Rollback Tasks

Revert last N tasks or everything from this session.

## Usage

```
/rollback last           # Last 1 task
/rollback 3              # Last 3 tasks
/rollback all            # Entire session
```

## How It Works

Rolls back tasks in reverse order:
- Task 3: revert changes
- Task 2: revert changes
- Task 1: revert changes

All at once, restores to clean state before session.

```
Session tasks:
1. Schema (done)
2. Service (done)
3. UI (broken)

/rollback 2
→ Revert Task 3 (broken)
→ Revert Task 2 (service)
→ Keep: Task 1 (schema)
```

## Warning

Rollback is destructive. After rollback:
- Uncommitted changes lost
- Brain state for those tasks forgotten
- To continue: /resume (restore checkpoint)

