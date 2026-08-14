---
name: undo
description: "Undo specific task — revert changes from one task"
---

# /undo — Undo Task

Revert changes from a specific task without affecting others.

## Usage

```
/undo [task-id]
/undo --list
```

## How It Works

Brain tracks each task's changes:
- Files modified
- Lines added/removed
- Commits created
- Dependencies

Undo reverts ONE task while keeping others intact.

```
Task 1: Add schema ✓
Task 2: Add service ✗ (broken)
Task 3: Add UI ✓

/undo task-2
→ Reverts Task 2 changes
→ Keeps Tasks 1 & 3
→ Re-runs tests
```

## List Tasks

```
/undo --list
→ Shows all tasks:
  - ID
  - Status (done/failed)
  - Files touched
  - Can undo? (yes/no)
```

Only undo recently-completed tasks (not yet deployed).

## Compare with /rollback

- **undo**: Revert ONE specific task
- **rollback**: Revert last N tasks (sequential)

