---
name: wrap-up
description: End-of-session — structured handoff to primer.md
---

# Session Wrap-Up

## 1. Verify
Run typecheck/lint/tests if any code changed. Note pass/fail. Skip if nothing
was touched.

## 2. Rewrite primer.md

Overwrite `primer.md` with exactly this structure (replace bracketed hints):

```markdown
# Session Primer

## Last Session
[date]: [1–2 sentence summary]

## What Changed
- [file]: [why]

## Current State
[what works, what doesn't, what's partial]

## Uncommitted Changes
[list, or "None"]

## Test Status
- Type-check: PASS | FAIL | NOT CONFIGURED
- Lint: PASS | FAIL | NOT CONFIGURED
- Tests: PASS | FAIL | NOT CONFIGURED (X passed, Y failed)

## Decisions Made
[bullets, or "None"]

## Risks
[fragile or incomplete bits]

## Next Steps
1. [actionable]
2. [actionable]

## Next Recommended Command
[exact slash command, e.g. `/onboard deep finish auth`]

## Key Files
- [files next session should read first]
```

## 3. Record Decisions to Mooz Brain (NEW)

Save all decisions made this session to `.drift-brain.db`:

For each decision (tech picks, architecture, scope cuts):
```
DECISION: domain="[ui|api|database|auth|infra|content]" question="[what was decided]" answer="[decision made]" confidence=0.9 locked=true
```

Examples:
```
DECISION: domain="database" question="Use Drizzle migrations or manual SQL?" answer="Drizzle with auto-generated migrations (npm run db:generate)" confidence=0.95 locked=true

DECISION: domain="api" question="JWT refresh strategy?" answer="Refresh token in httpOnly cookie, auto-refresh on 401" confidence=0.85 locked=true
```

These decisions are locked (never asked again) and can be queried with `/brain-search decisions [domain]`

## 4. Append to decisions.md (legacy, for reference)

Also append to decisions.md for backward compatibility. Format:
```markdown
## [date]: [title]
**Choice:** …
**Why:** …
**Context:** …
```

## 5. Append to gotchas.md (only if mistakes happened)
Numbered rule per mistake. Skip if none.

## 6. Smart Diff Summary (NEW)

Group `git diff` by task (if multiple tasks this session):
```
## What Changed

### Task 1: [Task name]
- `file1.ts` — [what changed, why]
- `file2.ts` — [what changed]

### Task 2: [Task name]
- `file3.ts` — [what changed]
```

If single task: show brief file list + line count:
```
## What Changed
- `package.json` — add dependencies
- `apps/app/src/...` — implementation (145 lines added)
- `packages/database/schema.ts` — schema migration
```

## 8. Append metrics line

```bash
echo '{"date":"YYYY-MM-DD","files_touched":N,"verification_runs":N,"gotchas_added":N,"decisions_logged":N,"learnings_added":N}' >> .claude/metrics.jsonl
```

Counts (deterministic — don't guess from memory):
- `files_touched`: `git diff --name-only | wc -l`
- `verification_runs`: number of test/typecheck/lint runs
- `gotchas_added`: count of new rules added to gotchas.md
- `decisions_logged`: count saved to brain.db (from step 3)
- `learnings_added`: count saved to brain.db (from Scribe if run)

## 9. Report
One paragraph: what shipped, uncommitted changes, failing checks. No epic
summary — the user will read primer.md.

$ARGUMENTS
