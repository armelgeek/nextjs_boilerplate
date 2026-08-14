---
name: drift-verify
description: "Verify system coherence: tasks ↔ commits ↔ learnings"
---

# /drift-verify

Audit that GitHub ↔ brain.db ↔ git are in sync.

## Usage

```
/drift-verify                   # Full audit
/drift-verify --commits         # Each task has commit?
/drift-verify --github          # Issues match tasks?
/drift-verify --learnings       # Learnings linked to tasks?
/drift-verify --fix             # Auto-repair divergences
```

## What It Checks

### 1. Commits Coherence
✓ Every completed task in brain.db has a commit_sha
✓ Every commit has a task ID in message
✓ No orphaned tasks (pending but has commit)

Output:
```
✅ Commits coherent (24/24 tasks have commits)
⚠️ Orphaned: task_007 marked pending but has commit abc123
❌ Missing: task_015 marked completed but no commit found
```

### 2. GitHub Sync
✓ Every task with github_issue field has issue existing
✓ Issue title matches task name
✓ Issue status matches task status

Output:
```
✅ GitHub in sync (12/12 issues exist)
⚠️ Stale: Issue #45 closed but task still 'in_progress'
❌ Broken link: task_003 references issue #999 (deleted)
```

### 3. Learnings Traceability
✓ Every learning has a source_task_id pointing to real task
✓ Task exists and has matching commit
✓ No learning orphans

Output:
```
✅ Learnings traceable (8/8 have source tasks)
⚠️ Orphaned learning: "webhook-retry" → task_004 (not found)
```

### 4. Status Coherence
✓ brain.db status matches reality:
  - pending: no commit
  - in_progress: has commit but not all files done
  - completed: has commit + all files touched

Output:
```
✅ Status coherent (18/18 tasks)
❌ Diverged: task_012 marked completed but missing schema.ts
```

## Auto-Repair

```
/drift-verify --fix
```

Fixes common issues:
- ✓ Updates status based on commit history
- ✓ Removes broken GitHub links
- ✓ Re-links orphaned learnings
- ✓ Creates missing task records from commits

**Warning**: Always review before fixing production data.

## When to Run

- After manual git operations (rebase, reset, force-push)
- Before deploying to production
- If you suspect data drift
- Weekly audit (add to calendar)

## Success = Everything Linked

```
Epic #123
  ↔ Task task_001 (github_issue=#123)
  ↔ Commit abc123
  ↔ Learning "pattern-1"
```

No orphans. No divergences. All traceable.

