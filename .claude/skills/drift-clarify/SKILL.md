---
name: drift-clarify
description: Domain-aware questioning. Ask targeted questions until ambiguity is resolved.
---

# Clarify Ambiguity

Ask domain-specific questions to resolve ambiguity before planning. Never ask the same question twice (checks brain.db).

## How It Works

1. **Detect domain** from task keywords
2. **Check brain.db** for locked decisions in this domain
3. **Ask 3–6 targeted questions** (max 4 rounds, 16 questions total)
4. **Record decisions** to brain.db (locked, never asked again)

## Domains & Questions

### UI Domain
- Layout density? (dense lists, spacious cards, mixed)
- Interaction pattern? (inline edit, modal, drawer, page)
- Empty state? (designed or generic?)
- Responsive breakpoint? (mobile-first, tablet support)
- Animations/transitions? (none, subtle, prominent)
- Dark mode? (support it, ignore it, later)

### API Domain
- Response format? (REST, GraphQL, JSON-RPC)
- Error handling? (status codes, error object shape)
- Auth mechanism? (JWT, session, API key, OAuth)
- Rate limiting? (needed, defer, none)
- Versioning? (URL path, header, none)
- Pagination? (cursor, offset, size limits)

### Database Domain
- ORM/query builder? (Drizzle, Prisma, raw SQL)
- Migration strategy? (auto, manual, pending)
- Data access pattern? (repository, service, direct queries)
- Transactions? (when needed, always, never)
- Denormalization? (allowed, forbidden, specific cases)
- Soft deletes? (yes, no, specific tables)

### Auth Domain
- Token type? (JWT, session, opaque)
- Token storage? (localStorage, httpOnly cookie, memory)
- Refresh strategy? (auto, manual, sliding window)
- Multi-factor? (defer, SMS, TOTP, none)
- Role model? (simple flags, RBAC, ABAC)
- Audit logging? (yes, no, later)

### Infra Domain
- Deploy target? (, AWS, Docker, other)
- CI/CD pipeline? (GitHub Actions, other)
- Environment secrets? ( Env Vars, .env.local, other)
- Monitoring? (PostHog, Sentry, none yet)
- Database hosting? (Neon, Supabase, RDS, local)
- CDN? ( CDN, Cloudflare, none)

### Content Domain
- Format? (Markdown, rich text, plain text, HTML)
- Tone? (formal, conversational, casual)
- Internationalization? (single language, i18n)
- SEO? (structured data, robots.txt, sitemaps)
- Accessibility? (WCAG AA, defer, basic)

## Stopping Criteria

Stop asking when:
- 8/10 categories clarified (good enough)
- 4 rounds of questions completed (max 16 questions)
- User says "enough"
- Decision doesn't require clarification (obvious from code)

## Recording Decisions

Each clarified decision is recorded to brain.db:
```
domain: [ui|api|database|auth|infra|content]
question: [what was asked]
answer: [user's answer]
confidence: 1.0 (user-provided, highest confidence)
locked: true (never ask again)
```

## Special Cases

**Ambiguous task** → Ask questions, record decisions, then hand off to `/drift-architect`

**Task already clarified** → Check brain.db, skip this step

**Simple task** (obvious from code) → Skip, go straight to `/drift-architect`

## Rules

- Never ask the same question twice (query brain.db first)
- Keep questions short (1-2 sentences max)
- Offer 2-4 options per question (open-ended OK if no clear options)
- Record every decision, even if user defers ("later")
- If user defers, note confidence: 0.3–0.5

## Example Flow

```
User: "add dark mode"
→ Detected domain: UI
→ Check brain.db: no prior UI decisions for dark mode
→ Ask 5 questions:
  1. Persist user preference? (localStorage, database, system default)
  2. Initial preference? (system, light, dark)
  3. Animations? (smooth transition, instant)
  4. All components support it? (yes, partial, defer)
  5. Test coverage? (yes, defer)
→ Record 5 decisions to brain.db (locked)
→ Hand to /drift-architect
```

$ARGUMENTS
