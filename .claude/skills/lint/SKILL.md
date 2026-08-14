---
name: lint
description: Run all linters across the project
---

Run linting checks:

1. Type-checker (e.g. `npm run typecheck`, `tsc --noEmit`)
2. Linter (e.g. `npm run lint`, `eslint .`, `ruff check .`)
3. Formatter check (e.g. `prettier --check .`, `ruff format --check .`)

Report any violations with file, line, and fix suggestion.

If a lint command doesn't exist or isn't configured, say so explicitly
instead of silently skipping it.
