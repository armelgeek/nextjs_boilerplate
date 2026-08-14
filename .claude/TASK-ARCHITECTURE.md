# Task Architecture

How tasks are stored, tracked, and managed across Mooz Brain.

## Task Storage Layers

### 1. Brain.db (Core)
```sql
Table: tasks
  id: TEXT (unique ID)
  name: TEXT (task description)
  files: TEXT (CSV paths touched)
  verify_command: TEXT (how to verify completion)
  commit_sha: TEXT (git commit)
  tokens_used: INTEGER
  status: TEXT (completed, failed, deferred)
  created_at: TEXT (timestamp)
```

Single source of truth for task metadata.

### 2. GitHub Issues (Visibility)
Tasks also created as GitHub issues via drift-ccpm:
```
Title: [REQ-001] Add Stripe webhook validator
Description:
  - Task 2 from plan
  - Files: packages/auth/stripe-webhook.ts
  - Verify: npm test --filter 
  - Depends on: Task 1
```

Issue tracking for team visibility + collaboration.

### 3. Git Commits (History)
Each task's changes recorded as commit(s):
```
f4e93de feat: add Stripe webhook validator

- Implements task 2 of Stripe integration
- Validates incoming webhooks
- Tests webhook signatures (HMAC)
```

Commit message links to task ID for traceability.

## Integration Points

### drift-ccpm Skill
Creates the initial plan + GitHub issues:
```
Input: Feature description
Output:
  - Epic (GitHub)
  - Issues per task
  - Dependencies mapped
```

**Stores**: High-level structure in GitHub.

### drift-architect Skill  
Creates the detailed task plan:
```
Input: Scout findings
Output:
  - Task list with exact file paths
  - Consumer lists
  - Verification commands
```

**Stores**: Task details in brain.db (tasks table).

### drift-builder Skill
Executes each task:
```
Per task:
  1. Read plan
  2. Implement changes
  3. Run verify command
  4. Commit to git
  5. Update brain.db status
```

**Stores**: Commit SHA + status in brain.db.

### drift-scribe Skill
Records learnings after tasks complete:
```
Input: Completed tasks
Output:
  - Decisions (locked)
  - Learnings (patterns)
  - Conventions (detected)
```

**Stores**: decisions + learnings tables in brain.db.

## Task Lifecycle

```
1. Plan Created (drift-ccpm)
   └─ GitHub epic created
   └─ Issues created per task

2. Plan Detailed (drift-architect)
   └─ Tasks inserted into brain.db
   └─ Status: "pending"

3. Task Execution (drift-builder)
   For each task:
     └─ Status: "in_progress"
     └─ Make changes
     └─ Verify
     └─ Commit
     └─ Status: "completed"
     └─ Record commit_sha

4. Learning Capture (drift-scribe)
   └─ Extract decisions from session
   └─ Extract error→fix patterns
   └─ Store in brain.db learnings

5. Retrospective (/wrap-up)
   └─ Summary of tasks done
   └─ Decisions recorded
   └─ primer.md updated
```

## Consistency Rules

### Rule 1: Single Source Per Level
- **Strategy**: GitHub epic (only)
- **Tasks**: brain.db tasks table (only)
- **Code**: Git commits (only)
- **Learnings**: brain.db learnings (only)

### Rule 2: Bidirectional Tracing
```
Feature → Epic (GitHub) ↔ Tasks (brain.db) ↔ Commits (git) ↔ Learnings (brain.db)

Can trace:
  - Epic ID → all tasks + commits
  - Task ID → commit SHA + learning
  - Commit → task ID + learning
  - Learning → task that created it
```

### Rule 3: Status Sync
```
brain.db task status ALWAYS matches:
  - GitHub issue status (if created)
  - Git commit history (if completed)
  - Not a divergence point
```

## Commands That Interact

```
/ship feature [description]
  → drift-ccpm: Create epic + issues
  → drift-architect: Create tasks in brain.db
  → drift-builder: Execute each task
  → Updates brain.db status per task
  → drift-scribe: Record learnings

/tasks
  → Query brain.db tasks table
  → Show GitHub issue status (if linked)
  → Display dependencies + blockers

/cost
  → Sum brain.db tokens_used per task
  → Group by domain
  → Show ROI trends

/diff
  → Read git commits
  → Match to task IDs
  → Group by task (not by file)

/resume
  → Query brain.db checkpoints
  → Restore last incomplete task
  → Restore brain state (decisions, learnings)

/undo [task-id]
  → Find task in brain.db
  → Get commit SHA
  → Revert git changes
  → Update status in brain.db

/rollback [N]
  → Query brain.db for last N tasks
  → Revert commits in reverse order
  → Update all statuses
```

## Example: Full Traceability

```
Feature: Add Stripe Integration (REQ-001)

GitHub Epic: feat/stripe-integration
  ├─ Issue #123: Add Stripe schema (Task 1)
  ├─ Issue #124: Add webhook validator (Task 2)
  ├─ Issue #125: Create payment API (Task 3)
  └─ Issue #126: Add payment UI (Task 4)

brain.db tasks:
  ├─ task_001: schema, files=[schema.ts], status=completed, commit=a1b2c3d
  ├─ task_002: webhook, files=[webhook.ts], status=completed, commit=e4f5g6h
  ├─ task_003: api, files=[routes/payments.ts], status=completed, commit=i7j8k9l
  └─ task_004: ui, files=[components/Payment.tsx], status=completed, commit=m0n1o2p

Git commits:
  ├─ a1b2c3d: feat: add Stripe schema (Task 1 / REQ-001)
  ├─ e4f5g6h: feat: add webhook validator (Task 2 / REQ-001)
  ├─ i7j8k9l: feat: create payment API (Task 3 / REQ-001)
  └─ m0n1o2p: feat: add payment UI (Task 4 / REQ-001)

brain.db learnings:
  ├─ webhook-retry: "Stripe webhook retries need exponential backoff"
  ├─ idempotency-key: "All payment mutations need idempotency keys"
  └─ webhook-timeout: "Timeout Stripe webhooks at 5 seconds"
```

Trace any direction:
- Epic #123 → all 4 tasks + 4 commits + 3 learnings
- Task 2 → commit e4f5g6h + "webhook-retry" learning
- Learning "idempotency-key" → Task 3 + commits related to it

## Extensibility

To add new task tracking:
1. **Add column to brain.db tasks** (e.g., `priority TEXT`, `estimated_hours INTEGER`)
2. **Update drift-ccpm** to populate new fields
3. **Update /tasks** to display new fields
4. **Update /cost** to use new fields in ROI calculation

The architecture remains clean: GitHub (strategy), brain.db (execution), git (code), learnings (patterns).

