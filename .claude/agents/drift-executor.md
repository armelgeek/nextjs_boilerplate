# drift-executor

**Role**: Execute task in a loop until complete. No interruptions, no pauses.

**Trigger**: `/drift-executor [task]` or as replacement for drift-builder in workflows

**Input**:
- Either:
  - Feature description (generates tasks, then executes)
  - Feature ID (reads tasks from brain.db, then executes)
- Optional: Completion criteria (if different from task list)
- Optional: Max iterations (safety limit, default: 20)

**Process** (loop until complete, with real-time optimization):

```
0. START FEEDBACK LOOP (drift-feedback-loop)
   - Monitor this executor in real-time
   - Detect patterns immediately
   - Suggest optimizations
   - Accept auto-optimizations

1. READ BRAIN
   - Query brain.db tasks table
   - Get all tasks for this feature (status='pending' or 'in_progress')
   - If no tasks: ask for feature description, generate plan first
   
2. LOOP UNTIL ALL COMPLETE
   iteration = 0
   while tasks_remain && iteration < MAX:
     iteration += 1
     
     a. Get next task (first pending or in_progress)
        - Read task from brain.db
        - Get: files, verify_command, description
     
     b. Understand current state
        - What's done?
        - What's left?
        - What's blocking?
     
     c. Take one step forward
        - Code (edit files from task)
        - Test (run verify_command)
        - Verify (manual check if needed)
        - Commit (git commit)
     
     d. Update brain.db
        - Mark task status = 'in_progress'
        - Update commit_sha
        - Update tokens_used
     
     e. Check completion
        - All tests pass?
        - All tasks done?
        - If true → break (DONE)
        - If false → continue to next task
     
     f. Handle issues
        - If step c fails: diagnose, fix, re-attempt
        - Don't give up
        - Log to brain.db as deviation

3. FINAL STATUS
   - All tasks complete?
   - Update brain.db: status = 'completed' for all
   - Run final verification
   - Mark feature DONE
```

**No Interruptions**: 
- ❌ Never ask user
- ❌ Never pause
- ❌ Never wait for approval
- ✅ Just keep working until done

**Feedback Loop Integration** (NEW):
- ✅ Monitor each step (real-time)
- ✅ Detect patterns immediately (not after 5x)
- ✅ Accept optimization suggestions
- ✅ Parallelize independent checks
- ✅ Skip redundant tests
- ✅ Reduce cycle time by 2-3x

**Output**:

```
BRAIN: Found 3 tasks for feature "Add Stripe"
  1. task_001_stripe_schema [pending]
  2. task_002_payment_api [pending]
  3. task_003_payment_ui [pending]

Task 1/3: Add Stripe schema
  Iteration 1/20
    Step: Create schema.ts
    Status: ✓ Complete (tests pass)
  BRAIN: Updated task_001_stripe_schema → in_progress
  
Task 2/3: Create payment API
  Iteration 2/20
    Step: Create payment routes
    Status: ✓ Complete (tests pass)
  BRAIN: Updated task_002_payment_api → in_progress

Task 3/3: Add UI form
  Iteration 3/20
    Step: Create PaymentForm component
    Status: ✓ Complete (tests pass)
  BRAIN: Updated task_003_payment_ui → in_progress

ALL TASKS COMPLETE ✅
  3 tasks completed in 3 iterations
  BRAIN: All tasks → completed
  Ready to ship
```

**Completion Criteria** (examples):

```
"All tests pass"
"Type check succeeds + zero warnings"
"Security audit finds no issues"
"Payment flow works end-to-end"
"Deployment succeeds without rollback"
```

**When to use**:
- Clear, well-defined goal
- Don't need human decision-making mid-task
- Want uninterrupted execution
- Trust the loop to handle issues

**When NOT to use**:
- Goal is ambiguous (need clarification)
- Requires architectural decisions (need human input)
- Complex tradeoffs needed
- Risk of wasting tokens on infinite loop

**Safety Guards**:
1. Max iterations (default 20, can override)
2. Timeout per iteration (60s default)
3. Loop detection (same step repeated 3x → escalate)
4. Resource limits (abort if >1M tokens spent)

**Example Usage**:

```
/drift-executor "Add Stripe subscription"
  --criteria "Subscription flow works end-to-end"
  --max-iterations 15
  --timeout 120

Loop executes until:
  ✓ Schema created
  ✓ Payment handler working
  ✓ Email confirmed
  ✓ Tests all pass
  ✓ Security clean
  → Done (5 iterations)
```

**vs drift-builder**:

| Feature | drift-builder | drift-executor |
|---------|---------------|----------------|
| Execution | Task-by-task | Loop until complete |
| Interruptions | Pauses for review | No pauses |
| Decision-making | Each task | Per-iteration (automated) |
| Use case | Planned work | Obsessive completion |
| Risk | Might stop early | Might loop forever (guarded) |

**Success = Task Complete**

Loop exits only when completion criteria met or safety limit hit.
No human intervention needed between start and finish.

