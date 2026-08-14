---
name: ship-chore
description: "Refactoring workflow: plan → review → execute safely"
---

# /ship chore — Safe Refactoring

Refactor code safely. No breaking changes, zero consumers left behind.

## Usage

```
/ship chore "split auth middleware into smaller functions"
/ship chore "rename User model to Account for clarity"
/ship chore "extract form validation into reusable hook"
/ship chore "consolidate duplicate API routes"
```

## Workflow

```
/ship chore [description]
  ↓
[1] Clarify Scope (drift-clarify)
    ├─ Is this rename/split/extract/consolidate?
    ├─ Impact radius: single file? module? app-wide?
    └─ Backward compatibility: need shims?
  ↓
[2] Scout (drift-scout)
    ├─ Find ALL usages of code being refactored
    ├─ Consumer count (critical for safety)
    ├─ Dependency graph
    └─ Identify breaking change risks
  ↓
[3] Plan (drift-architect)
    ├─ Task 1: Define new structure (types, exports)
    ├─ Task 2: Implement refactored code
    ├─ Task 3: Update all consumers (1-to-1 mapped)
    ├─ Task 4: Delete old code / cleanup
    ├─ Task 5: Verify no orphaned imports
    └─ NO AUTO-BUILD (review plan first)
  ↓
[4] Review Plan (drift-critic)
    ├─ Will all consumers be updated?
    ├─ Any import paths that break?
    ├─ Rename across tests + docs?
    └─ Backward compat needed (deprecation)?
  ↓
[5] User Decides
    ├─ "Looks good, proceed" → go to build
    ├─ "Need to adjust scope" → go back to scout
    ├─ "Too risky, defer" → save to brain as seed
    └─ NO FORCED EXECUTION
  ↓
[6] Build (drift-builder)
    ├─ Implement per task
    ├─ Verify ALL consumers updated (grep check)
    ├─ Tests still pass
    └─ No broken imports
  ↓
[7] Review (drift-critic)
    ├─ Diff includes ALL consumers
    ├─ No orphaned code left behind
    ├─ Tests pass
    └─ Bundle size stable (no regression)
  ↓
[8] Record (drift-scribe)
    ├─ Save refactoring pattern to brain
    ├─ Learning: "split-auth-middleware"
    ├─ Difficulty level (easy/medium/hard)
    └─ Time estimate vs actual
  ↓
[9] Ship
    ├─ Merge to main
    ├─ Deploy (usually low risk if plan was solid)
    └─ Update primer.md
```

## Chore Types

### Rename (Highest Risk)
- Old name → New name
- Update everywhere: code, tests, comments, docs
- Scout MUST find every occurrence

Example:
```
/ship chore "rename User model to Account for clarity"
Scout finds: 47 usages across 12 files
Plan creates 48 tasks (47 consumers + 1 model)
```

### Split (Medium Risk)
- One function/component/file → Multiple
- Define new exports/structure first
- Update all imports

Example:
```
/ship chore "split LoginForm into credential + 2FA components"
Scout finds: 3 files importing LoginForm
Plan creates 3 tasks (split → update imports → cleanup old)
```

### Extract (Medium Risk)
- Repeated logic → Shared utility
- New file/function for extracted code
- Update callers to use new utility

Example:
```
/ship chore "extract email validation into "
Scout finds: 8 places validating email manually
Plan creates 8 tasks (1 new util + 8 consumers)
```

### Consolidate (Low Risk)
- Merge multiple related things
- Usually safer than split (no new consumers to update)

Example:
```
/ship chore "consolidate error handlers into middleware"
Scout finds: 6 separate error handlers
Plan creates 1 task (merge + test that behavior unchanged)
```

## Safety Checklist

Before executing, verify:

- [ ] Scout found ALL consumers (grep double-check)
- [ ] Plan includes task for each consumer
- [ ] No "partial update" tasks (update ALL or none)
- [ ] Tests verify old behavior still works
- [ ] Backward compat shims if breaking change
- [ ] Deprecation warning if needed

## Brain Learnings

Brain captures:

1. **Pattern**: "split-middleware" or "rename-model"
2. **Problem**: What coupling made it hard?
3. **Solution**: How to safely decompose?
4. **Difficulty**: Easy/Medium/Hard
5. **Effort**: Time estimate vs actual
6. **Consumers**: Count and complexity

Future chores in same domain reuse these patterns.

## When to NOT Use /ship chore

- ❌ Refactoring with behavior changes → use `/ship feature`
- ❌ Fixing bugs during refactoring → use `/ship bug` (separate)
- ❌ Performance optimization → use `/ship feature` (if significant)
- ❌ One-liner fixes → just commit directly

## Tips

1. **Start small** — Refactor one module, not the whole codebase
2. **Review plan first** — Don't auto-execute, human approval needed
3. **Verify consumers** — Scout output is your source of truth
4. **Test thoroughly** — Refactoring has zero functional change visible to tests
5. **Document patterns** — Brain learns from your refactorings

## Example: Real Refactoring

```
User: /ship chore "extract email validation to utils"

[1] Clarify: Extract type, reusable across projects? Yes.
[2] Scout: Found 8 places with email validation logic
[3] Plan: 
    - Task 1: Create packages/utils/validators/email.ts
    - Task 2: Update apps/app/auth/actions.ts (uses validation)
    - Task 3: Update apps/app/onboarding/actions.ts
    ... (8 tasks total)
[4] Review: All 8 consumers included? Yes. Ready.
[5] User: Looks good, proceed.
[6] Build: Each task updates one consumer + tests
[7] Review: All email validation now uses new util
[8] Record: Brain saves "email-validation-extraction" pattern
[9] Ship: Deploy
```

Next refactoring in validators domain reuses this pattern → faster, cheaper.
