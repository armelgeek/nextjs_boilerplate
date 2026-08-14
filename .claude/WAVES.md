# Wave-Based Parallel Execution

Execute independent tasks in parallel. Sequential barriers only when needed.

## Concept

Architect creates tasks with dependencies. Executor groups into "waves":
- **Wave 1**: Independent tasks (no shared files) → Run in parallel
- **Wave 2**: Tasks depending on Wave 1 → Run in parallel
- **Wave N**: Sequential barrier only where dependencies exist

## Example: Payment Feature

```
Task 1: Add Stripe schema (database package)
Task 2: Add webhook validator (auth package)  ← Independent from Task 1
Task 3: Create payment API (depends on Task 1+2)
Task 4: Add payment UI component (depends on Task 3)

Waves:
  Wave 1: [Task 1] + [Task 2] (parallel - different packages)
  Wave 2: [Task 3] (sequential - depends on Wave 1)
  Wave 3: [Task 4] (sequential - depends on Wave 2)
```

## Dependency Detection

```typescript
function groupIntoWaves(tasks: Task[]): Task[][] {
  const waves: Task[][] = [];
  let completedFiles = new Set<string>();

  for (const task of tasks) {
    const taskFiles = new Set(task.files);
    
    // Does this task touch files touched by prior tasks this wave?
    const conflicts = [...taskFiles].filter(f => completedFiles.has(f));
    
    if (conflicts.length === 0) {
      // No conflict - add to current wave
      waves[waves.length - 1].push(task);
      taskFiles.forEach(f => completedFiles.add(f));
    } else {
      // Conflict - start new wave (sequential barrier)
      waves.push([task]);
      completedFiles = taskFiles;
    }
  }

  return waves;
}
```

## Real Execution

```
Architect plan: 6 tasks with dependencies
↓
Wave grouping:
  Wave 1: Tasks 1, 2 (independent)
  Wave 2: Task 3 (depends on 1)
  Wave 3: Tasks 4, 5 (independent, both depend on 3)
  Wave 4: Task 6 (depends on 4+5)
↓
Parallel execution:
  t=0min   Task 1 Start ────────► Task 1 End (5min)
           Task 2 Start ────────► Task 2 End (5min)
  t=5min   Task 3 Start (waits for Wave 1) → Task 3 End (3min)
  t=8min   Task 4 Start ────────► Task 4 End (4min)
           Task 5 Start ────────► Task 5 End (4min)
  t=12min  Task 6 Start (waits for Wave 2) → Task 6 End (2min)
  t=14min  ✓ COMPLETE

Total time: 14 min (vs 28 min if fully sequential)
Speedup: 2x
```

## When Waves Win

- **Large features** (6+ tasks): 2-3x faster
- **Multi-domain work** (database + API + UI in parallel)
- **Monorepo with separate packages** (can work independently)

## When Waves Don't Help

- **Small features** (1-3 tasks): Sequential fine, overhead not worth it
- **Tightly coupled changes** (all tasks touch same file): All in same wave
- **Sequential by nature** (schema migration must happen before queries)

## Implementation in Mooz

Currently: Sequential for safety (one task at a time, human reviews)

Future enhancement: Opt-in wave execution
```
/ship feature --waves "add payment"
→ Architect groups into waves
→ Wave 1 builds in parallel
→ Human reviews Wave 1 result
→ Wave 2 builds in parallel
→ Continue...
```

Risk: Parallel context might miss interactions. Mitigated by:
- Each task gets fresh context (no cross-contamination)
- Review happens per-wave (catch issues early)
- Build stays sequential if any conflict detected

## Configuration

```json
{
  "drift": {
    "waves": {
      "enabled": false,
      "max_concurrent": 4,
      "auto_detect_conflicts": true
    }
  }
}
```

Enable with: `/drift:config waves.enabled true`

## Monitoring Waves

```
/drift:status --waves
→ Shows active waves, task completion status, parallelism info
```

## Trade-offs

| Aspect | Sequential | Waves |
|--------|-----------|-------|
| Speed | Slow (1 task at a time) | Fast (parallel) |
| Safety | High (review often) | Medium (review per-wave) |
| Context | Fresh per task | Fresh per wave (shared context) |
| Debugging | Easy (one failure) | Hard (multiple concurrent) |
| Cost | High (full re-context) | Medium (shared wave context) |

## Recommendation

**Default: Sequential** (safer, proven)
**Use waves when**:
- Feature has 6+ independent tasks
- You want 2-3x speedup
- You trust the plan (explicit dependency checks)

