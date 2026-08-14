---
name: drift-reflexion
description: >-
  Before writing a single line of code, enforce structured internal reflection. No code output — a short plan covering behavior, UI states, edge cases. Triggers on: create/add/modify a feature, screen, component, form, dashboard, flow, page. Prevents half-baked code.
---

# Think Before Code — Mooz Edition

**Don't code blind.** This skill forces structured self-reflection BEFORE the first line — not a questionnaire for the user, but a short plan that captures behavior, UI states, and pitfalls specific to Mooz's stack.

## When It Triggers

Automatically on:
- ✅ "Add a button that does X"
- ✅ "Create a dashboard for Y"
- ✅ "Redesign the login screen"
- ✅ "Add a form for Z"
- ✅ "Create a settings page"
- ✅ Any UI/feature request without a 100% complete spec

Skip if:
- ❌ Trivial bug fix
- ❌ Pure refactoring (no behavior change)
- ❌ Spec already complete, no ambiguity

---

## The Process (Internal)

### Step 1 — Functional Spec

Ask yourself silently:
- **Exact behavior in one sentence?**
- **Inputs/outputs/params?** (what comes in, what goes out)
- **Edge cases:** empty data, network down, invalid input, permissions, race conditions (double-click, concurrent requests)?
- **Touch existing data?** (migration, consistency, breaking changes to schema)
- **What's in Mooz already I should reuse?**
  - `useServerAction()` for form submissions?
  - Existing `packages/database` queries?
  - `packages/auth` session/permissions?
  - Shadcn/ui component (Button, Form, Dialog)?
  - Error handling pattern from `packages/observability`?

### Step 2 — UI States (Critical for Next.js Server Components)

For **Server Components:**
- Render states: initial load, data fetched, error, empty
- Suspense boundaries: where do I split rendering vs loading?
- Streaming: should this component start rendering before child data loads?

For **Client Components** (`use client`):
- States: idle, loading, success, error
- Form states: pristine, dirty, submitting, submitted
- All 4 explicitly handled, or will one silently fail?

Visual consistency:
- Is this component using shadcn/ui + Tailwind like the rest?
- Same button styles, toast notifications (Sonner), error messages?
- Matches existing pages in `apps/app` or `apps/web`?
- Mobile-responsive? (tested at 375px width minimum?)

### Step 3 — Mooz-Specific Patterns

Before coding, ask:
- **Server Action or API route?** (prefer Server Action for mutations in `apps/app`)
- **Database query pattern?** (use Drizzle from `packages/database`, typed queries only)
- **Validation?** (Zod schema, validate on server, not client)
- **Error handling?** (return `{ success, data } | { success: false, error }` pattern?)
- **Permissions?** (check `` session, no hardcoded roles)
- **Testing needed?** (unit test for business logic in `packages/*`, integration test for flow?)

### Step 4 — Blocking Questions

Reread your answers. A question is "blocking" only if:
- It's an arbitrary product/business choice (not derivable from context), AND
- The two options change implementation significantly.

Examples that ARE blocking:
- "After form submission, redirect or show toast?" (changes UX significantly)
- "Is this a public page or auth-only?" (changes permission logic)

Examples that are NOT:
- "Use Drizzle or raw SQL?" (always Drizzle in Mooz)
- "One component or split into pieces?" (I can decide this)
- "Light/dark mode support?" (yes, always)

**If blocking:** ask 1-2 questions grouped, briefly. Then move to step 5.
**If not:** stay silent, move to step 5.

### Step 5 — Write the Plan (Before Code)

Display a SHORT plan (2-5 points) covering:

```
🎯 Behavior: [one line]
📊 States: [list: idle | loading | success | error | empty]
⚙️ Tech: [Server Action / API route, Drizzle query, validation schema]
⚠️ Edge cases: [what's handled and how]
📦 Reuse: [existing component / hook / service]
Assumptions: [any guess I made that might need correction in one sentence]
```

Then **code immediately**. The plan is a visible guardrail, not another approval gate.

---

## Example: Mooz-Specific

**Request:** "Add a feature to export user bookings as CSV"

**Internal reflection (silent):**
- Behavior: click button → fetch user's bookings → generate CSV → download
- Edge cases: no bookings (disable button), export in progress (loading state), permission check (auth-only), network error
- Query: use existing `getBookingsByUser()` in `packages/database`
- Should be Server Action (mutation, data fetch, auth check all together)
- States: idle, loading, success, error
- Validation: confirm user owns the bookings (auth check via session)
- Reuse: existing `useServerAction()` hook + Sonner for success/error toast
- Testing: add test for `getBookingsByUser()` query access control

**Plan displayed:**
```
🎯 Behavior: Click "Export CSV" → fetch user's bookings → download file
📊 States: idle | loading | success | error | empty (no bookings)
⚙️ Tech: Server Action in apps/app/actions/export.ts, Drizzle query from packages/database, Zod validation for auth
⚠️ Edge cases: no bookings (disable button), auth required (check session), network error (toast), concurrent exports (debounce)
📦 Reuse: getBookingsByUser() + useServerAction() hook + Sonner toast
```

Then write the code. If you adjust assumptions while coding, do it.

---

## Mooz Stack Checklist (Embedded in Step 3)

Before coding, confirm:
- ✅ Using Next.js 15 patterns (Server Components first, `use client` only when needed)
- ✅ React Server Components for layout/static content
- ✅ Server Actions for mutations (no API routes in `apps/app` unless external)
- ✅ Drizzle ORM only (typed, no raw SQL)
- ✅ Zod for validation (shared between client + server)
- ✅ TypeScript strict mode (no `any`)
- ✅ Shadcn/ui + Tailwind (no custom components unless justified)
- ✅ Error handling: return typed `{ success, data }` or throw for truly exceptional cases
- ✅ Permissions: auth via ``, role checks explicit
- ✅ Testing: business logic tested, UI flows verified
- ✅ Dark mode support via Tailwind class-based theming
- ✅ Mobile responsive (375px minimum)

---

## What This Is NOT

- ❌ A code generation skill (another skill handles that)
- ❌ A user questionnaire by default (think first, ask only if blocked)
- ❌ A business idea validator (assume the feature is decided)
- ❌ A second approval gate (the plan is a safety check, not a decision point)

---

## The Trap to Avoid

Don't ask the full list to the user. Answer yourself first:
- With your knowledge of Mooz's stack
- With existing patterns you've seen
- With reasonable assumptions

Ask the user ONLY if truly blocked (arbitrary business decision).

---

## Output Format

A short plan (2-5 lines each), readable, covering:
1. **Behavior** — what happens when the user acts
2. **States** — all UI states explicitly handled
3. **Tech stack** — which Mooz tools/patterns
4. **Edge cases** — errors, empty, permissions, concurrency
5. **Reuse** — existing components/hooks/queries to use

Then: write code. No new questions. Adjust while coding if needed.

---

## One More Thing

After writing the plan, scan for:
- **"Use client" vs Server Component?** Prefer Server Component unless you need interactivity
- **Form handling?** Use `useFormStatus()` from React for pending state
- **Async component?** Can you fetch data in the Server Component instead of a client hook?
- **Error boundary?** Does this need `error.tsx`?
- **Testing?** At least one test that fails if the logic breaks

These are fast checks, not detailed review. Just "did I miss an obvious thing?"

Then ship it.
