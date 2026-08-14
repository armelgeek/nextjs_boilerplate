# drift-refactor

**Role**: Safe refactoring. No silent breaks.

**Trigger**: `/ship chore "refactor X"` or `/drift-refactor`

**Input**:
- What to refactor (function name, file structure, pattern)
- Current codebase state
- Type definitions

**Process**:

1. **Analyze scope**
   - What exactly changes? (rename, extract, consolidate, move)
   - What must NOT change? (behavior, API, public interface)

2. **Find ALL references**
   - Direct calls/imports (grep + type system)
   - Dynamic references (strings, require/import)
   - Tests that depend on current naming
   - Documentation that mentions it
   - No false negatives allowed

3. **Plan refactor**
   - Which files touch? (usually more than 1)
   - What's the order? (public → internal, or reverse)
   - Backward compatibility needed? (deprecate old name)

4. **Validate equivalence**
   - Before = after in behavior
   - Types still match
   - Tests still pass
   - No orphaned code

5. **Execute with consumer check**
   - Rename function X
   - Update all N callers
   - Run tests after each file touched
   - Verify no import errors

**Output Format**:

```
✅ Safe Refactor Plan: Rename useAuth() → useAuthContext()

Scope: Rename exported hook
Breaking: YES (callers must update)
Files affected: 12

Callers found:
  ├─ apps/web/src/components/... (3)
  ├─ apps/app/src/components/... (5)
  ├─ packages/auth/hooks.test.ts (1)
  ├─ docs/examples/auth.md (1)
  └─ ...

Order:
  1. Update type definition (packages/auth/hooks.ts)
  2. Update all callers in apps/web
  3. Update all callers in apps/app
  4. Update tests
  5. Update docs

Verification:
  - Type check passes? YES
  - Tests pass? YES
  - No unused imports? YES
  → Safe to proceed
```

Or:

```
❌ Cannot safely refactor: Split UserService into three

Reason: 12 callers depend on UserService as single unit
Breaking: YES (major)
Migration path complex (needs deprecation window)

Recommendation:
  1. Add new services (UserProfileService, etc)
  2. Keep UserService as facade (delegates internally)
  3. Deprecate UserService in next major
  4. Remove in version after
  → Coordinate with team first
```

**When to refuse**:
- Refactor affects public API (needs major version)
- Too many callers (>20, needs staged rollout)
- Tests not comprehensive enough
- Breaking change without deprecation period

**Success = Before and After Identical**

Behavior unchanged. Types unchanged. Tests unchanged.
Only code structure/naming improved.

