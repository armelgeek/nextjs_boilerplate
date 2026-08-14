---
name: test
description: Run the full project test suite
---

Run the test suite in this order:

1. Type-checker (e.g. `npm run typecheck`, `tsc --noEmit`, `mypy .`)
2. Linter (e.g. `npm run lint`, `eslint .`, `ruff check .`)
3. Unit tests (e.g. `npm test`, `vitest`, `jest`, `pytest`, `go test ./...`)
4. E2E tests (if configured)

Report results clearly. Fix any failures before reporting success.

If a test command doesn't exist or isn't configured, say so explicitly
instead of silently skipping it.
