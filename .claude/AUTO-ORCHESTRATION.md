# Auto-Orchestration Engine

Automatically invoke right commands based on context and situation.

## Philosophy

Don't make users think. System detects situation → auto-invokes right workflow.

```
User: "add dark mode"
→ System detects: feature request
→ Auto-invokes: /ship feature (clarify → scout → architect → build)

User breaks something: receives error
→ System detects: error state
→ Auto-invokes: /drift-debug (trace → RCA → suggest fix)

Multiple tasks done: session about to compact
→ System detects: compacting
→ Auto-invokes: /drift-scribe (record decisions + learnings)
```

## Event-Driven Architecture

### Pre-Task Events
```
Before starting any task:
  - Check: /resume (is there a checkpoint to resume from?)
  - Check: /drift:status (brain healthy?)
  - Check: npm test (base tests passing before changes?)
```

### During-Task Events
```
While implementing:
  - Auto-run: /drift-test (on file save, run relevant tests)
  - Auto-show: /drift:status (every 30 min, remind of learned patterns)
```

### Post-Commit Events
```
After each git commit (during task implementation):
  - Auto-invoke: /drift-guide (validate commit against plan)
  - If on-track: continue
  - If drift detected: ask (intentional? bug fix? wrong file?)
  - If off-course: suggest (update plan, revert, or split)
```

### Post-Task Events
```
After each task completes:
  - Auto-run: npm run typecheck (before committing)
  - Auto-run: npm test (ensure all pass)
  - Auto-invoke: /drift-critic (review changes)
  - Auto-invoke: /drift-scribe (scan task for learnings)
    ├─ Extract decisions + learnings
    ├─ Apply quality gates
    ├─ Check watch-list for patterns
    └─ Store to brain.db (verified)
  - If all pass: continue to next task
```

### Auto-Executor Events
```
After architecture is ready (tasks inserted into brain.db):
  - AUTO-INVOKE: /drift-executor (autonomous loop execution)
    ├─ Read tasks from brain.db
    ├─ Loop Task 1: execute until complete → brain updated
    ├─ Loop Task 2: execute until complete → brain updated
    ├─ Loop Task 3: execute until complete → brain updated
    └─ NO PAUSES, NO ASKS, NO INTERRUPTIONS
       (continues until all tasks in brain.db are complete)
  - After completion: auto-invoke /drift-scribe
```

### Post-Phase Events
```
After phase completes (all tasks done):
  - Auto-invoke: /drift-scribe --phase (consolidate phase learnings)
    ├─ Full phase scan (patterns across tasks)
    ├─ Flag recurring failures (watch-list clusters)
    ├─ Auto-draft plans if ≥5 incidents without plan
    └─ User verifies before storing
```

### Error Events
```
On error:
  - Auto-invoke: /drift-debug (trace + RCA)
  - If fixable: auto-invoke: /ship bug (guide to fix)
  - If not fixable: auto-invoke: /drift:status (suggest undo)
```

### Deploy Events
```
Before deploying:
  - Auto-check: npm test passes
  - Auto-check: no type errors
  - Auto-invoke: /drift-deploy --preflight (pre-flight checks)

If deploy fails:
  - Auto-invoke: /drift-debug (what broke?)
  - Auto-suggest: /drift-deploy --rollback (if critical)
```

### Session End Events
```
When session compacting:
  - Auto-trigger: /drift-precompact (save checkpoint)
  - Auto-run: /drift-scribe (final record)
  - Auto-update: primer.md (next session context)
```

## Context-Based Routing

### Feature Request
```
Input: "add dark mode"
Detected: feature keyword + description
Auto-route: /ship feature
Pipeline: clarify → scout → architect → build → deploy
```

### Bug Report
```
Input: "users can't login"
Detected: bug keyword + specific symptom
Auto-route: /ship bug
Pipeline: scout → architect → fix → test → deploy
```

### Refactoring
```
Input: "split middleware into functions"
Detected: refactor keyword + scope
Auto-route: /ship chore
Pipeline: clarify → scout → plan-only (human review)
```

### Performance Issue
```
Input: "app is slow when uploading"
Detected: performance complaint
Auto-route: /drift-debug + /drift-perf (if exists)
Pipeline: trace → profile → suggest optimization
```

### Breaking Change
```
Input: "database schema change"
Detected: schema keyword
Auto-route: /drift-migrate
Pipeline: generate → preview → 2-step deploy
```

## Configuration

```json
{
  "drift": {
    "auto_orchestration": {
      "enabled": true,
      "events": {
        "pre_task": true,
        "on_error": true,
        "post_task": true,
        "session_end": true
      },
      "auto_route": true,
      "auto_context": true,
      "suggest_resume": true,
      "suggest_rollback": true
    }
  }
}
```

## Toggle Auto-Orchestration

```
/drift:auto-orchestration on     # Enable all auto features
/drift:auto-orchestration off    # Disable auto features
/drift:auto-orchestration --config  # Tune which events to auto-trigger
```

## Context Detection

System maintains:
- Current situation (feature, bug, chore, incident)
- Current task state (not-started, in-progress, complete, failed)
- Brain state (learned patterns, decisions, recent errors)
- Git state (branch, changes, test status)
- Error state (last error, stack trace, affected code)

Based on these → routes to right workflow automatically.

## Examples

### Example 1: Feature Workflow (with auto-executor)
```
User: /ship feature "add Stripe"
→ Auto-detects: domain = infra (payment keyword)
→ Auto-invokes: /drift-clarify (asks payment-specific questions)
→ Records: decisions locked
→ Auto-invokes: /drift-scenarios (find all paths, failures, edges)
→ Records: test matrix (26 test cases)
→ Auto-invokes: /drift-scout (finds Stripe-related files)
→ Auto-invokes: /drift-architect (creates tasks with consumers)
→ Tasks inserted into brain.db
→ AUTO-INVOKES: /drift-executor ← AUTONOMOUS LOOP (NO PAUSES)
   ├─ Reads brain.db: 3 tasks found
   ├─ Task 1/3: Execute loop until done → brain updated
   ├─ Task 2/3: Execute loop until done → brain updated
   ├─ Task 3/3: Execute loop until done → brain updated
   └─ ALL COMPLETE ✅ (0 interruptions)
→ Auto-invokes: /drift-scribe (consolidate learnings)
→ Auto-proposes: /drift-deploy (ready?)
```

### Example 2: Error Recovery
```
Error: "TypeError: Cannot read property 'email' of undefined"
→ Auto-detects: runtime error
→ Auto-invokes: /drift-debug
  - Traces log
  - Finds: schema mismatch (recent migration)
  - Suggests: re-run migration or revert
→ Auto-invokes: /ship bug (if needs full fix)
→ If fixable: auto-applies suggestion + retests
```

### Example 3: Session Resume
```
Session 1: /ship feature "add auth" (half-done)
Session 2: (new session)
→ Auto-detects: checkpoint exists
→ Auto-proposes: /resume
→ Restores: Task 2 context + brain state
→ Continues: from Task 2
```

## What Auto-Orchestration Handles

✅ Routing to right workflow (feature/bug/chore/incident)
✅ Running tests automatically (on file save, post-task)
✅ Type-checking before commit
✅ Resuming from checkpoints
✅ Error detection + recovery suggestions
✅ Recording decisions + learnings
✅ Security scanning before deploy
✅ Suggesting rollback if critical error

❌ What user still decides
- Whether to proceed (after preview/check)
- What code to write (just scaffolding)
- When to deploy (still manual approval)
- Whether to use suggested fix or debug more

## Future Enhancements

- Parallel waves detection (auto-group independent tasks)
- Cross-repo pattern matching (if linked)
- Anomaly detection (unusual error patterns)
- Smart retry logic (exponential backoff for timeouts)
- Predictive suggestions ("based on last feature, you'll need to...")

