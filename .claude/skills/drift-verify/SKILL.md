---
name: drift-verify
description: Verify coherence between GitHub issues, brain.db tasks, and git commits
---

# drift-verify

Audit system coherence. Ensure GitHub ↔ brain.db ↔ git are always in sync.

## Usage

```
/drift-verify
/drift-verify --commits
/drift-verify --github
/drift-verify --learnings
/drift-verify --fix
```

## What Gets Verified

### Commits Check
- Every completed task has a commit_sha
- Every commit references a task ID
- No orphaned tasks

### GitHub Check
- Every issue exists
- Issue status matches task status
- No deleted issues referenced

### Learnings Check
- Every learning links to a real task
- Task has matching commit
- No floating patterns

### Status Coherence
- pending = no commit yet
- in_progress = commit exists, work ongoing
- completed = commit exists, all done

## Repair Mode

```
/drift-verify --fix
```

Auto-fixes:
- Updates status from git history
- Removes broken links
- Re-anchors orphaned learnings
- Creates missing records

## Output

```
Full Audit
─────────
✅ Commits: 18/18 coherent
✅ GitHub: 12/12 in sync
✅ Learnings: 8/8 traceable
✅ Status: 26/26 correct

Overall: COHERENT ✓
```

Or if problems:

```
ISSUES FOUND
────────────
❌ Orphaned task: task_007 (pending but has commit)
❌ Broken link: Issue #45 deleted but in brain.db
⚠️  Stale issue: #32 closed but task in_progress

Recommend: Run /drift-verify --fix
```

## When to Run

- After manual git operations
- Pre-deployment audit
- Weekly health check
- If you suspect data divergence

## The Goal

Perfect traceability: Epic → Task → Commit → Learning

Everything linked, nothing lost, always know where you are.

