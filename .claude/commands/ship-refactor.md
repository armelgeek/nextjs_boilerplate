---
name: ship-refactor
description: "Ship a refactoring: rename, extract, consolidate safely"
---

# /ship-refactor

Refactor with confidence. Find every caller, validate before/after.

## Usage

```
/ship-refactor "rename useAuth to useAuthContext"
/ship-refactor "extract validation from UserService"
/ship-refactor "move utils to packages/shared"
```

Or use `/ship chore` with refactor keyword:

```
/ship chore "refactor: rename useAuth"
# Auto-detects as refactor workflow
```

## Pipeline

1. **Scout** — Find all files + callers
   - Direct references
   - Imports/exports
   - Dynamic usage
   - Tests + docs

2. **Architect** — Plan the change
   - Update order (dependencies first)
   - Breaking or not?
   - Deprecation needed?

3. **Refactor** — Execute safely
   - Update step by step
   - Verify types after each file
   - Run tests after each change

4. **Verify** — Validate before = after
   - Behavior unchanged?
   - Types pass?
   - Tests still green?
   - No orphaned code?

5. **Critic** — Review changes
   - Safety check
   - Edge cases
   - Test coverage

6. **Ship** — Merge & deploy
   - If non-breaking → merge
   - If breaking → create PR + discuss migration

## Safety Guarantees

✅ **Complete** — Every caller found, none missed  
✅ **Validated** — Before and after are equivalent  
✅ **Type-safe** — TypeScript verified throughout  
✅ **Test-covered** — Tests pass, coverage maintained  
✅ **Breaking-aware** — Knows if it's a breaking change  

## Examples

### Example 1: Simple Rename
```
/ship-refactor "rename useAuth() to useAuthContext()"

Result:
  ✅ Found 12 callers
  ✅ Updated all imports
  ✅ Tests pass
  ✅ Types verified
  Breaking: YES (but documented)
  → Ready to merge + release
```

### Example 2: Extract Service
```
/ship-refactor "extract UserProfileService from UserService"

Result:
  ✅ New service created
  ✅ Old service now facade
  ✅ No breaking changes (backward compatible)
  ✅ Deprecation warning added
  → Ready to merge
  → Full removal in v2.0
```

### Example 3: Move File
```
/ship-refactor "move apps/app/utils to packages/shared/utils"

Result:
  ✅ Files moved
  ✅ 18 imports updated
  ✅ Tests updated
  ✅ No breaking changes
  → Ready to merge
```

## When It Refuses

```
/ship-refactor "split UserService into 5 microservices"

Result:
  ❌ Cannot refactor: 47 callers affected
  
  Recommendation:
    Stage 1: Create new services
    Stage 2: Use new from new code
    Stage 3: Migrate existing callers
    Stage 4: Deprecate old service
    Stage 5: Remove
  
  This needs coordination. Create RFC first.
```

## One-Line Summary

Never break anything accidentally. Mooz-refactor finds every caller, validates nothing changes except what you want, and migrates safely.

