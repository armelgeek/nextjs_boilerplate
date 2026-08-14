---
name: drift-designer
description: Code architecture review — design patterns, organization, decoupling
---

# drift-designer

Audit code organization. Suggest design patterns. Identify structure issues.

## Usage

```
/drift-designer [file-or-feature]    # Audit specific code
/drift-designer                      # Full codebase scan (scope TBD)
```

Or auto-triggered during `/ship` code review phase.

## What It Audits

### Structure
- God objects (class doing too much)
- Anemic models (logic everywhere else)
- Missing layers (UI talking to database)
- Circular dependencies
- Over-/under-abstraction

### Patterns
- Missing compound components (should split UI)
- Repeated logic (rule of 3 violation)
- Over-parameterized functions (function doing too much)
- Poor separation of concerns

### Decoupling
- Tight dependencies (hard to test)
- Coupling direction (dependencies going UP the graph)
- Hard-coded behavior (should be strategy pattern)
- Monolithic services (should be split)

## Output

```
Audit: UserService

Problems found:
  ❌ God object (52 methods)
  ❌ Mixed concerns (validation + email + payment)
  ❌ Testability: Mocks 8 dependencies for 1 test

Recommendations:
  → Extract BookingPolicyValidator (validation only)
  → Extract BookingEmailService (email only)
  → Extract BookingPaymentService (payment only)
  → UserService becomes facade (deprecated in v2)

Benefits:
  ✅ Each class <10 methods
  ✅ Test in isolation
  ✅ Reuse services independently

Phase Plan:
  1. Create new services (non-breaking)
  2. Deprecate old methods
  3. Remove in next major
```

Or:

```
Audit: BookingForm Component

Structure OK ✅
  - Single responsibility (form only)
  - Testable (inputs → outputs)
  - Uses compound pattern (Form.Header, Form.Body)

Suggestions (optional):
  - Extract validation to schema.ts (currently inline)
  - Split into BookingForm + AvailabilityPicker (if >200 lines)

Verdict: Well-designed. No changes needed.
```

## Common Refactorings Suggested

### Extract Service
From: Mixed concerns in one class  
To: Separate service classes

### Extract Component
From: 200+ line component  
To: Compound component + sub-components

### Strategy Pattern
From: Long if/else for variable behavior  
To: Strategy lookup table

### Factory Function
From: Complex object construction scattered  
To: Factory function with defaults

### Separate Layer
From: UI calling database directly  
To: Service layer in between

## When to Trigger

- Code review finding (lint → type check → design review)
- Before major refactor ("will this structure support changes?")
- New feature design ("what's the right structure?")
- Technical debt review ("what's causing the most pain?")

## Design Principles Applied

✅ **Single Responsibility** — One reason to change  
✅ **Open/Closed** — Open for extension, closed for modification  
✅ **Dependency Inversion** — Depend on abstractions, not concretions  
✅ **Interface Segregation** — Small, focused interfaces  
✅ **DRY** — Don't repeat yourself (rule of 3)  

