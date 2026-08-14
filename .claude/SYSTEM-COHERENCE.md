# System Coherence

How all Mooz Brain subsystems work together seamlessly.

## The Three-Layer Architecture

```
GitHub (Strategy)
  └─ Epics + Issues
  └─ Team visibility + async collaboration

Brain.db (Execution)
  ├─ tasks table (what to do + status)
  ├─ decisions table (locked choices)
  ├─ learnings table (patterns discovered)
  └─ Single source of truth for tracking

Git (History)
  └─ Commits linking to task IDs
  └─ Immutable record of changes
```

## How Skills Feed Data

### Skill: drift-ccpm
**Input**: Feature description  
**Output**: GitHub epic + issues  
**Stores**: High-level strategy on GitHub  
**Example**:
```
Input: "add Stripe integration with webhooks"
Output:
  Epic: feat/stripe-integration
  Issue #123: Add schema + migrations
  Issue #124: Create webhook handler
  Issue #125: Add payment UI
```

### Skill: drift-architect
**Input**: Scout findings (code structure, consumers, patterns)  
**Output**: Ordered task list with exact implementation steps  
**Stores**: tasks table in brain.db  
**Linked to**: GitHub issues (issue_number in tasks table)  
**Example**:
```sql
INSERT INTO tasks VALUES (
  id='task_001_stripe_schema',
  name='Add Stripe schema',
  files='packages/database/src/schema.ts,migrations/[ts]_stripe.sql',
  verify_command='npm test --filter ',
  github_issue='#123',
  status='pending',
  created_at='2025-08-09T10:00:00Z'
);
```

### Skill: drift-builder
**Input**: Single task from brain.db + task plan  
**Process**:
1. Read task details from brain.db
2. Implement changes per architect's plan
3. Run verify_command
4. Commit to git with "Task [ID]" in message
5. Update brain.db: status='completed', commit_sha='...'  

**Stores**: Git commits + brain.db task status  
**Example**:
```
Git commit message:
  feat: add Stripe schema (Task task_001_stripe_schema)
  
  - Creates payments, subscriptions, invoices tables
  - Generates migration file
  - Adds type-safe Drizzle queries

brain.db update:
  UPDATE tasks SET status='completed', commit_sha='a1b2c3d'
  WHERE id='task_001_stripe_schema'
```

### Skill: drift-guide
**Input**: Current task plan (from brain.db) + latest commit  
**Process**: Compare files touched vs plan  
**Output**: Validation feedback (on-track, drift, off-course)  
**Example**:
```
Commit touches: [webhook.ts, index.ts]
Plan expects: [webhook.ts, index.ts, tests]

Feedback: ⚠️ Mooz detected
  Missing: __tests__/webhook.test.ts
  Action: Add tests or is this next commit?
```

### Skill: drift-scribe
**Input**: Completed tasks + session context  
**Output**: Extracted decisions, learnings, conventions  
**Stores**: decisions + learnings tables in brain.db  
**Example**:
```sql
INSERT INTO decisions VALUES (
  id='decision_stripe_retry',
  name='Stripe webhook exponential backoff',
  rationale='Stripe retries 3x, max 72 hours. App should not re-retry.',
  locked_at='2025-08-09T14:00:00Z'
);

INSERT INTO learnings VALUES (
  id='learning_idempotency',
  pattern='All payment mutations need idempotency keys',
  confidence=0.95,
  domain='api',
  evidence='Learned from task #124 (webhook handler)'
);
```

## How Commands Access Data

### /tasks
```
Query brain.db tasks table
→ Show pending/completed/blocked
→ Display dependencies
→ Show estimated time remaining
```

### /diff
```
Read git commits (last N)
→ Match commit to task_id via commit message
→ Group changes by task (not by file)
→ Show tokens_used per task
```

### /cost
```
Query brain.db tasks table (tokens_used column)
→ Sum per domain (database, api, ui, auth, infra, content)
→ Show ROI: did this task save time?
→ Trend analysis: which domains improve fastest
```

### /resume
```
Query brain.db tasks + checkpoints
→ Find last incomplete task
→ Restore git state (checkout branch)
→ Restore brain state (recent decisions, learnings)
→ Continue from Task N+1
```

### /undo [task-id]
```
Query brain.db tasks WHERE id=[task-id]
→ Get commit_sha
→ Git reset/revert to before commit
→ Update brain.db status='deferred'
→ Do NOT delete (need for rollback chain)
```

### /rollback [N]
```
Query brain.db tasks ORDER BY created_at DESC LIMIT N
→ For each task (reverse order):
  └─ Get commit_sha
  └─ Git revert / reset
  └─ Update status='deferred'
→ All tasks marked as "can be resumed"
```

### /check-plan
```
Before building:
→ Query brain.db tasks
→ Verify file consumers (no breaking changes)
→ Check dependency order (Task 2 doesn't run before Task 1)
→ Estimate tokens + time
→ Show blockers / warning
```

## Auto-Orchestration Integration

```
Event: Feature request detected
→ AUTO-ROUTE to /ship feature
→ drift-ccpm: Create epic + issues (GitHub)
→ drift-architect: Plan tasks (brain.db)
→ PRE-TASK: /resume check (restore checkpoint if exists)
→ For each task:
  └─ drift-builder: Execute (commit)
  └─ POST-TASK: /drift-test (verify)
  └─ POST-TASK: /drift-critic (code review)
→ drift-scribe: Record learnings (brain.db)
→ DEPLOY: /drift-deploy --preflight

Event: Error detected
→ AUTO-ROUTE to /drift-debug
→ RCA: Trace through git logs + brain.db
→ Suggest: /ship bug (quick fix) or /rollback (revert last task)

Event: Session compacting
→ AUTO-ROUTE to /drift-precompact
→ Save: Timestamped brain.db snapshot
→ AUTO-ROUTE to /drift-scribe
→ Save: Final learnings + decisions
→ Update: primer.md (next session context)
```

## Example: Full Flow

User: `/ship feature "add Stripe"`

```
1. CLARIFY (drift-clarify)
   Q: One-time or subscription?
   A: Subscription with annual discount
   → Decisions locked in brain.db

2. SCOUT (drift-scout)
   Find: All payment-related files
   Find: Every Stripe webhook caller
   → Results stored in hot_files table

3. ARCHITECT (drift-architect)
   Plan:
     Task 1: Add schema + migrations
     Task 2: Webhook validator
     Task 3: Payment API routes
     Task 4: UI form
   → Inserted into tasks table

4. BUILD (drift-builder)
   Loop each task:
     a. Read task from brain.db
     b. Implement per plan
     c. Run verify_command
     d. Commit: "feat: ... (Task task_001)"
     e. Update brain.db status='completed'
     
5. TEST (auto-post-task)
   → Run npm test
   → Auto-invoke /drift-test if failure
   
6. REVIEW (auto-post-task)
   → Auto-invoke /drift-critic
   → Auto-invoke /drift-security
   
7. SCRIBE (drift-scribe)
   Extract:
     - Decisions (webhook retry logic)
     - Learnings (idempotency key pattern)
     - Conventions (Stripe error handling)
   → Stored in brain.db
   
8. DEPLOY (auto-if-ready)
   → /drift-deploy --preflight
   → Check: All tests pass
   → Check: No type errors
   → Check: Security audit clean
   → Deploy to 
   
9. MONITOR (post-deploy)
   → Watch error logs for 5 min
   → If errors: auto-suggest rollback
   
10. WRAP-UP (/wrap-up)
    → Summary of 4 tasks completed
    → Learned 3 patterns
    → Cost: 12,500 tokens
    → Decisions recorded
    → Ready for next session
```

## Consistency Guarantees

### Guarantee 1: Single Source Per Level
- **GitHub**: Only place epics/issues live (never manual duplication)
- **brain.db**: Only place task metadata lives (tasks table is canonical)
- **Git**: Only place code changes live (commits are immutable history)

### Guarantee 2: Bidirectional Links
```
Epic #123 ←→ tasks table (github_issue field)
Task #1 ←→ Commit SHA (commit_sha field)
Commit ←→ Learning (via git message task ID)
```

Trace any direction:
```
"what changed for this decision?"
  → Find decision in brain.db
  → Find task that created it
  → Get commit SHA from task
  → Read commit diff

"what did this commit learn?"
  → Parse commit message (Task ID)
  → Find task in brain.db
  → Query learnings WHERE task_id
```

### Guarantee 3: Status Always Syncs
```
brain.db task status ←→ GitHub issue status (when linked)
brain.db task status ←→ Git history (when committed)

No divergence possible:
- If task marked 'completed' in brain.db, must have commit_sha
- If commit exists, task must be marked 'completed' in brain.db
- If GitHub issue exists, task must link via github_issue field
```

## Testing the Coherence

```bash
# Verify every task has a commit
pnpm drift:verify-commits

# Verify every GitHub issue has a task
pnpm drift:verify-github-sync

# Verify learning -> task -> commit chain
pnpm drift:verify-traceability

# Rebuild coherence if diverged
pnpm drift:repair-coherence
```

## Adding New Skill

To add a new skill that participates in this system:

1. **Declare what it stores**: brain.db table + field, GitHub resource, or git type
2. **Declare what it reads**: which brain.db tables / GitHub data
3. **Declare upstream**: which skills must run first
4. **Declare downstream**: which commands depend on it
5. **Add to auto-orchestration**: when does it trigger

Example: New `/drift-perf` skill
```
Stores: brain.db new table `performance_metrics`
Reads: tasks table (to know what changed)
Upstream: drift-builder (must run after)
Downstream: /cost (includes perf data), /diff (shows perf impact)
Auto-trigger: After each task completes (POST-TASK event)
```

The system stays coherent because every new piece declares its dependencies, not because we hope it works.

