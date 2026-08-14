---
name: drift-test
description: Test orchestration — run, fix failures, analyze coverage
---

# Testing

Run tests, fix failures, measure coverage.

## Usage

```
/drift-test
/drift-test --watch "auth"
/drift-test --coverage
/drift-test --fix
```

## Workflow

1. **Run tests**: `npm test`
2. **Parse failures**: Extract error messages
3. **Categorize failures**:
   - Missing mocks (mock database/API)
   - Async issues (await missing, timeout)
   - Assertion failures (logic bug)
   - Type errors (TypeScript)
4. **Fix by category**:
   - Missing mocks → add mock data
   - Async → add await, increase timeout
   - Logic → trace code, find bug
5. **Re-run**: Verify all pass
6. **Coverage**: `npm test --coverage`
   - Flag uncovered code
   - List untested functions
   - Suggest new tests

## Test Types

- **Unit**: Pure functions (utils, services)
- **Integration**: Database + API (Server Actions)
- **E2E**: Full user flows (if configured)

## Failure Fixes

```
[FAIL] users can't sign up (async timeout)
→ Fix: Add await to async operation

[FAIL] database test fails (mock missing)
→ Fix: Add test fixture with sample data

[FAIL] type error in test
→ Fix: Update test types to match new schema
```

## Coverage Goals

- Lines: 80%+
- Branches: 70%+
- Functions: 80%+
- Statements: 80%+

Report gaps and suggest which tests to add.

## Watch Mode

```
/drift-test --watch "auth"
→ Re-run auth tests on file change
→ Run locally while developing
```

## Parallel Testing

```
npm test --reporter=verbose
→ Shows which tests run in parallel
→ Detects ordering dependencies
```

