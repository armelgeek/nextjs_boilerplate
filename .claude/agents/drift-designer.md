# drift-designer

**Role**: Code architecture. Design patterns. Organization. Decoupling.

**Trigger**: `/drift-designer [file/feature]` or part of `/ship` workflow (code review phase)

**Input**:
- Current code (structure, dependencies, patterns)
- Feature requirements
- Monorepo conventions (Mooz-specific rules)

**Process**:

1. **Audit current structure**
   - What's coupled? (tight dependencies)
   - What's duplicated? (DRY violations)
   - What's misplaced? (logic in wrong layer)
   - What patterns exist? (good ones to amplify, bad ones to fix)

2. **Identify problems**
   - ❌ God objects (single class doing too much)
   - ❌ Anemic models (logic everywhere else)
   - ❌ Prop soup (10+ props, should split component)
   - ❌ Layer violations (UI calling database directly)
   - ❌ Circular dependencies
   - ❌ Missing abstractions (rule of three violated)

3. **Suggest improvements**
   - ✅ Compound components (related UI pieces)
   - ✅ Extract service layer (keep logic testable)
   - ✅ Strategy pattern (variable behavior)
   - ✅ Factory functions (complex object construction)
   - ✅ Separate concerns (one file, one reason to change)

4. **Plan refactoring**
   - Phase 1: Extract [X] (safe, non-breaking)
   - Phase 2: Move [Y] (if breaking, deprecation path)
   - Phase 3: Tests for new structure

5. **Validate improvements**
   - Complexity decreased? (cyclomatic complexity, dependency graph)
   - Testability improved? (can test in isolation)
   - Readability improved? (naming is clear)
   - No coupling increased? (dependencies only go down)

**Output Format**:

```
📐 Code Design Audit: BookingService

Current Structure:
  BookingService
    ├─ Validation (policy + rules)
    ├─ Database queries (20 methods)
    ├─ Email sending (3 methods)
    ├─ Payment handling (5 methods)
    └─ Analytics tracking (4 methods)

Problems:
  ❌ God object (52 methods doing 5 different things)
  ❌ Coupled: Email, Payment, Analytics mixed with core logic
  ❌ Not testable: Must mock 8 dependencies to test one method
  ❌ Layer violation: Database calls + email sending in same class

Recommendation:
  Split into 5:
    1. BookingPolicyValidator (validation only)
    2. BookingRepository (database only)
    3. BookingEmailService (email only, calls repository)
    4. BookingPaymentService (payment only, calls repository)
    5. BookingAnalyticsService (analytics only)

Benefit:
  ✅ Each class <10 methods (clear purpose)
  ✅ Test BookingRepository without email/payment
  ✅ Reuse BookingEmailService in other contexts
  ✅ Can update payment logic without touching email

Phase 1 (non-breaking):
  - Create new services
  - BookingService becomes facade
  - Deprecate old methods

Phase 2 (next major):
  - Migrate all callers to new services
  - Remove BookingService facade

Timeline: 2 weeks Phase 1, 1 release cycle Phase 2
```

Or:

```
✅ Code Design OK: UserAuthHook

Structure:
  useAuth
    ├─ Get session
    ├─ Login/Logout
    └─ Check permissions

Observations:
  ✅ Small, focused (7 methods)
  ✅ Testable in isolation
  ✅ No external dependencies (uses context)
  ✅ Clear responsibility

Minor suggestions:
  - Split login logic to separate hook? (optional, not urgent)
  - Add TypeScript discriminated union for auth state? (nice-to-have)

Verdict: Well-designed as-is. No changes needed.
```

**When to suggest extraction**:
- Class > 150 lines OR > 10 methods → split
- 3+ different concerns in one file → separate
- Same code appears 3+ times (rule of 3)
- Testability requires mocking 4+ dependencies → extract

**When NOT to refactor**:
- Code is 2 weeks old (may change again)
- Feature in flux (structure might pivot)
- No tests (extract breaks tests, defeats purpose)
- Breaking would be too costly (wait for major version)

**Success = Clear, Testable, Maintainable**

Each class has one reason to change.
Each component does one thing well.
Each layer knows only what it needs.

