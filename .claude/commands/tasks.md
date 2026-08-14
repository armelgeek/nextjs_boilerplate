---
name: tasks
description: "List pending tasks from current plan"
---

# /tasks — List Pending Tasks

Show all tasks from current plan and their status.

## Usage

```
/tasks
/tasks --status
/tasks --blocked
/tasks --completed
```

## Output

```
Current Plan: Add Stripe Integration (6 tasks)

Pending:
  [ ] Task 1: Add Stripe schema (database)
  [ ] Task 2: Add webhook validator (auth)
  [✓] Task 3: Create payment API (api)
  [ ] Task 4: Add payment UI (ui)

Completed: 1/4
Blocked: Task 4 (waiting on Task 3)
Time estimate: 3-4 hours
Tokens used: 12,500 / est 20,000
```

## Filter by Status

```
/tasks --blocked        # Show what's blocked
/tasks --ready          # Ready to start
/tasks --completed      # Already done
```

Tasks tracked in brain.db + GitHub issues (via drift-ccpm).

