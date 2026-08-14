---
name: drift-sloppify
description: De-sloppify cleanup pass — remove unnecessary tests, redundant checks, dead code
---

# drift-sloppify

Cleanup pass after implementation. Remove test/code slop without losing business logic.

## What It Does

After `drift-executor` implements a feature thoroughly (with TDD), sloppify:
- Removes tests that verify language/framework behavior
- Removes redundant type checks (type system already enforces)
- Removes over-defensive error handling
- Removes console.log, commented-out code
- **Keeps** all business logic tests

## Problem It Solves

When you ask LLM to "implement with TDD", it's thorough but sloppy:
```typescript
// BAD: Testing that TypeScript works
test("typeof check works", () => {
  const x: string = "hello";
  expect(typeof x === 'string').toBe(true);  // ❌ Remove this
});

// BAD: Redundant checks (type system already enforces)
if (typeof user !== 'string') throw Error('user must be string');
validateEmail(user);  // Already typed as string

// GOOD: Business logic test (keep this)
test("validateEmail rejects invalid emails", () => {
  expect(validateEmail("not-an-email")).toBe(false);
  expect(validateEmail("valid@email.com")).toBe(true);
});
```

## Usage

Auto-triggered after each drift-executor task, or:
```bash
/drift-sloppify
```

## What Gets Removed

### 1. Language/Framework Tests
```typescript
// ❌ Remove: testing that TypeScript/JS works
test("typeof returns string", () => expect(typeof "x" === 'string').toBe(true));
test("Array.length works", () => expect([1,2,3].length).toBe(3));
test("Promise resolves", async () => expect(Promise.resolve(5)).resolves.toBe(5));
```

### 2. Redundant Type Checks
```typescript
// ❌ Remove: type system already enforces
const getUser = (id: string) => {
  if (typeof id !== 'string') throw Error('id must be string');  // ❌
  return users[id];
};

// ✅ Keep: runtime validation at boundaries
const handleUserInput = (input: unknown) => {
  if (typeof input !== 'string') throw Error('invalid input');  // ✅
  return getUser(input);
};
```

### 3. Over-Defensive Error Handling
```typescript
// ❌ Remove: impossible state (type system guarantees)
const sum = (a: number, b: number) => {
  if (typeof a !== 'number') throw Error('a must be number');  // ❌
  if (typeof b !== 'number') throw Error('b must be number');  // ❌
  return a + b;
};

// ✅ Keep: guarding against actual failures
const fetchUser = async (id: string) => {
  if (!id) throw Error('id required');  // ✅ Real guard
  const response = await fetch(`/api/users/${id}`);
  if (!response.ok) throw Error(`Failed to fetch: ${response.status}`);  // ✅
  return response.json();
};
```

### 4. Dead Code
```typescript
// ❌ Remove: console.log
console.log("debugging");
console.warn("temp logging");

// ❌ Remove: commented-out code
// const oldImplementation = () => { ... }
// const backupLogic = () => { ... }
```

## Process

1. **Review all changes** in working tree
2. **For each file**:
   - Identify tests that test language behavior
   - Identify redundant type checks
   - Identify over-defensive guards for impossible states
   - Identify dead code (console.log, comments)
3. **Remove identified slop**
4. **Run full test suite** (must pass)
5. **Report** what was removed

## Output

```
✅ SLOPPIFY COMPLETE

Removed:
- 8 language/framework tests
- 3 redundant type guards
- 2 over-defensive try/catch blocks
- 5 console.log statements
- 4 blocks of commented-out code

Test suite: ✓ 52 tests pass (was 60, removed 8 framework tests)
Build: ✓ 0 errors, 0 warnings
Lint: ✓ Clean

Commit ready for push.
```

## Integration

- Runs after `drift-executor` (auto-triggered)
- Part of quality pipeline before review
- Cannot fail (if uncertain, keep the code)

## Key Insight

Rather than constraining the Implementer with "don't test X", let it be thorough, then clean up. Two focused agents (implement + cleanup) beat one constrained agent.

