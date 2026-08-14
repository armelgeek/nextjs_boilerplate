---
name: resume
description: "Resume work from last checkpoint"
---

# /resume — Resume Session

Continue from where you left off (saved checkpoint).

## Usage

```
/resume
/resume --list
/resume --checkpoint [id]
```

## How It Works

Brain saves checkpoints before:
- Session compaction (PreCompact hook)
- Major decisions
- Failed tasks

Resume restores:
- Git state (branch, uncommitted changes)
- Brain state (decisions, learnings made so far)
- Task list (what was planned)
- Context (related files in scope)

## Workflow

```
Session 1: /ship feature "add auth"
  - Brain creates checkpoint
  - Task 1: schema → done
  - Task 2: service → in progress
  - Checkpoint saved

Session 2: /resume
  - Restores: Task 2 half-done state
  - Shows: what's left, what's decided
  - Continues: from Task 2
```

## List Checkpoints

```
/resume --list
→ Shows:
  - Checkpoint ID
  - When saved
  - What task
  - Current branch
```

## Explicit Checkpoint

```
/resume --checkpoint [id]
→ Jump to specific checkpoint
→ Resets branch + brain state
→ Warning: loses any work since checkpoint
```

