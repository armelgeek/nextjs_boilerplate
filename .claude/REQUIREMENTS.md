# Requirements Tracing (REQ-ID)

Map features to requirements. Track which tasks implement which requirements.

## Concept

Every feature maps to one or more requirements (REQ-IDs). Track the chain:

```
Requirement (REQ-001)
  ↓
Phase (Phase 1: Build auth foundation)
  ↓
Tasks (Task A: schema, Task B: server action, Task C: UI)
  ↓
Commits (commit 1, commit 2, commit 3)
  ↓
Tests (test_auth_login.ts)
  ↓
Production (merged to main)
```

When requirements change, find all affected tasks/commits instantly.

## Format

**Requirement ID**: `REQ-NNN` (3 digits, incremental)

```markdown
# Requirements

## REQ-001: User authentication with JWT
- Description: Users can sign up, log in, log out
- Status: In Progress
- Priority: P0 (Critical)
- Phases: Phase 1, Phase 2
- Tasks: 
  - drift-architect:db-schema (Task A)
  - drift-architect:auth-service (Task B)
  - drift-architect:auth-ui (Task C)
- Commits: f4e93de, 9278e06, f6f3783
- Tests: test_auth_login.ts, test_auth_signup.ts
- Done criteria: Users can sign up, log in via web UI
```

## Usage in Mooz

### Create Requirement
```
/drift-project-scope "build billing system"

Outputs:
  - REQ-001: Payment processing
    Phase 1: Stripe integration
    Phase 2: Subscription management
    Phase 3: Invoicing
```

### Link Task to Requirement
During `/ship feature` planning:
```
/ship feature "add Stripe webhook handling" --req=REQ-001
→ Architect includes REQ-001 in task metadata
→ /wrap-up records: Task implemented REQ-001
```

### Track Requirement Status
```
/drift-status --requirements
→ Shows all REQs: status, phase, tasks, completion %

REQ-001: User authentication (80% complete)
  ├─ Phase 1: Schema + service (100%, 2 tasks)
  ├─ Phase 2: UI (50%, 1 of 2 tasks)
  └─ Phase 3: OAuth (0%, not started)

REQ-002: Payment processing (0% complete)
  └─ Phase 1: Stripe setup (not started)
```

### Search by Requirement
```
/brain-search --requirement REQ-001
→ Shows all decisions, tasks, commits for REQ-001

/brain-search --requirements database
→ All requirements involving database changes
```

### Change Management
When requirement changes:
```
REQ-001 Scope Change: Add "password reset" to auth

Affected tasks:
  - Task A (schema): add reset_token column
  - Task B (service): add reset logic
  - Task C (UI): add reset form
  - Task D (email): new email template

Impact: +1-2 tasks, +4-8h effort
```

## Storage

Requirements stored in `.claude/epics/requirements.md`:

```markdown
# Requirements Catalog

## REQ-001: User Authentication
- Status: IN_PROGRESS
- Phases: Phase 1 (Schema), Phase 2 (Service), Phase 3 (UI)
- Tasks: task_1, task_2, task_3
- Commits: [list]
- Completion: 80%

## REQ-002: Payment Processing
- Status: PLANNED
- Phases: Phase 2, Phase 3
- Tasks: []
- Completion: 0%
```

Also in brain.db:

```sql
CREATE TABLE requirements (
  id TEXT PRIMARY KEY,
  title TEXT,
  description TEXT,
  status TEXT,  -- PLANNED, IN_PROGRESS, DONE, BLOCKED
  priority TEXT,  -- P0, P1, P2, P3
  phases TEXT,  -- CSV: Phase1,Phase2,Phase3
  tasks TEXT,  -- CSV: task_ids
  commits TEXT,  -- CSV: commit_shas
  completion_pct INTEGER,
  created_at TEXT,
  updated_at TEXT
);
```

## Workflow Integration

### Before Building
```
User: What features are you planning?
I want to build: Payments, Notifications, Admin Panel

→ Run /drift-project-scope to decompose into requirements
→ Creates REQ-001 (Payments), REQ-002 (Notifications), REQ-003 (Admin)
→ Each maps to phases + estimated tasks
```

### While Building
```
User: /ship feature "add Stripe integration" --req=REQ-001

Architect:
  - Knows this implements REQ-001
  - Can reference prior Stripe work
  - Marks tasks as "REQ-001: Task A"
  
Scribe (at wrap-up):
  - Records: Task A implemented REQ-001
  - Updates requirement status
  - Calculates completion %
```

### Status Tracking
```
/drift:status

Requirement Status:
  REQ-001 (Payments): 40% complete
    Phase 1: Done (Stripe setup)
    Phase 2: In Progress (Subscriptions, 1 of 2 tasks)
    Phase 3: Not Started

  REQ-002 (Notifications): 0% complete
    Phase 1: Planned
```

### Release Planning
```
v1.0 Release: Include REQ-001 + REQ-002, defer REQ-003

Check completeness:
  REQ-001: 100% ✓
  REQ-002: 80% (missing email templates)
  → Block release, complete REQ-002 first
```

## Example: Billing System

```markdown
# Requirements for Billing System

## REQ-001: Product Management
- Users manage product tiers
- Status: DONE (100%)
- Phases: Phase 1
- Commits: a1b2c3d, e4f5g6h
- Tests: 15 tests, all passing

## REQ-002: Payment Processing
- Accept payments via Stripe
- Status: IN_PROGRESS (60%)
- Phases: Phase 2
- Tasks: 4 remaining (2 done)
- Commits: f4e93de (schema), 9278e06 (webhook handler)
- Tests: 12 tests passing

## REQ-003: Subscription Management
- Users upgrade/downgrade plans
- Status: PLANNED (0%)
- Phases: Phase 3, Phase 4
- Tasks: 6 estimated
- Effort: 16-20 hours
```

## Traceability

Query: "Which commits implement REQ-002?"
```
/brain-search --requirement REQ-002 --commits
→ f4e93de, 9278e06
```

Query: "What changed for REQ-001?"
```
git log --oneline --all | grep "REQ-001"
→ Show all commits tagged with REQ-001
```

Query: "Is REQ-003 blocked?"
```
/brain-search --requirement REQ-003 --status
→ BLOCKED (waiting on REQ-002 completion)
```

## Compliance & Auditing

Track per-requirement:
- ✓ Requirement defined
- ✓ Tasks identified
- ✓ Tasks completed
- ✓ Tests passing
- ✓ Code reviewed
- ✓ Deployed to production

Audit trail: Every REQ maps to commits, tests, reviews.

Useful for compliance (e.g., HIPAA, SOC2) where you must prove "Feature X was implemented, tested, and reviewed per requirement Y."

