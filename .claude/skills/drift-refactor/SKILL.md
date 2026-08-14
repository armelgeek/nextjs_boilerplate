---
name: drift-refactor
description: Safe refactoring with complete caller analysis and validation
---

# drift-refactor

Refactor without breaking anything. Finds every caller, validates before/after.

## Usage

```
/ship chore "refactor X"         # Auto-detects as refactor
/drift-refactor "rename useAuth" # Direct refactor request
```

## What It Does

1. **Find ALL references** — grep + import analysis + dynamic usage
2. **Plan the change** — order of updates, breaking/non-breaking
3. **Validate equivalence** — before = after (behavior, types, tests)
4. **Execute safely** — update step-by-step, verify after each
5. **Report** — what changed, what to test, migration path if breaking

## Refactor Types

### Rename Function/Hook
```
Current: useAuth()
New: useAuthContext()

Finds: 12 callers across 3 apps
Updates: All imports + calls
Breaking: YES (migration needed)
```

### Extract Service
```
Current: UserService (does profile + auth + settings)
New: UserProfileService + UserAuthService + UserSettingsService

Finds: 25 callers
Plan: New services first, facade pattern, deprecate old, remove later
Breaking: NO (if using facade)
```

### Move File/Module
```
Current: apps/app/utils/helpers.ts
New: packages/shared/utils/helpers.ts

Finds: 18 imports
Updates: All paths
Breaking: NO (path only changes)
```

### Consolidate Duplicates
```
Current: Two auth hooks doing same thing
New: One hook + deprecate duplicate

Finds: Both used in 8 places
Plan: Use new hook in 4 places, deprecate old, remove later
Breaking: MAYBE (if signatures differ)
```

## Safety Guarantees

✅ No orphaned code (every reference updated)  
✅ No type mismatches (TypeScript verified)  
✅ No breaking surprises (validated before commit)  
✅ Backward compatible option (deprecation available)  

## Common Refactors

```
/ship chore "rename userService to authService"
/ship chore "extract validation logic from UserService"
/ship chore "move utils to packages/shared"
/ship chore "consolidate duplicate hooks"
/ship chore "split large component into smaller ones"
```

## Refuses If

- Affects 20+ callers without staged plan
- Breaking change to public API (needs discussion first)
- Tests not comprehensive (can't validate equivalence)
- Circular dependencies would result

## Output

```
✅ Refactor Safe
  Files touched: 7
  Callers updated: 12
  Breaking: NO
  → Ready to commit
```

Or:

```
⚠️ Breaking Change Detected
  You're renaming exported function
  Affects 5 packages + 2 apps
  
  Recommend:
    1. New function with new name
    2. Old function calls new (facade)
    3. Deprecate old with warning
    4. Remove in next major version
```

