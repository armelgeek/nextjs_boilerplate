---
name: drift-idea-clarifier
description: Turn vague product ideas into clear, implementation-ready specifications for Mooz. Auto-generates docs/product/ with 14 markdown files covering all requirements.
---

# Idea Clarifier

Transform a vague product idea into a clear specification before implementation.

Do not jump into code. First understand the problem, users, business goals, scope, workflows, rules, and technical constraints.

## Operating Modes

### Interactive Mode
Ask focused questions in small batches (5 max per turn). After each answer, summarize what's understood, identify assumptions, and ask the next critical questions.

### Fast Discovery Mode
Make clearly labeled assumptions where info is missing. Don't invent business-critical details silently.

### Review Mode
Analyze existing notes/requirements. Extract confirmed info, ambiguities, contradictions, and gaps.

## Discovery Framework

Clarify in order (skip if already answered):

### 1. Product Vision
- What is being built?
- What problem does it solve?
- Who experiences that problem?
- Why is it valuable?
- What makes it successful?

### 2. Users and Roles
- Primary users
- Secondary users
- Administrators
- Organizations/businesses
- Permissions per role

### 3. Core User Journeys
- Sign up / sign in
- Onboarding
- Creating/managing content
- Searching/browsing
- Purchasing/booking
- Payment
- Notifications
- Administration

Write as step-by-step flows.

### 4. MVP Scope
Separate into:
- Must have (required for v1)
- Should have (valuable but not essential)
- Could have (nice-to-haves)
- Out of scope (explicitly excluded)

Favor a small, testable MVP.

### 5. Functional Requirements
For each feature:
- Goal
- Actors
- Trigger
- Main flow
- Alternative flows
- Validation rules
- Error states

Use user stories:
> As a [role], I want to [action], so that [benefit].

### 6. Business Rules
Rules enforced consistently:
- Statuses and transitions
- Ownership and permissions
- Limits and quotas
- Pricing and commissions
- Cancellation/refunds
- Inventory or capacity
- Availability
- Duplicates prevention

Write in precise, testable language.

### 7. Data Model
Identify:
- Core entities
- Important fields
- Relationships
- Ownership
- Lifecycle/status fields
- Unique constraints
- Audit fields

Don't design DB schema until business rules are clear.

### 8. Pages and Interfaces
- Public pages
- Authenticated pages
- Admin pages
- Key components
- Empty/loading/error states
- Mobile considerations

Don't generate UI code unless requested.

### 9. Integrations and Non-Functional Requirements
- Payment providers
- Email/SMS
- File storage
- Maps/geolocation
- Analytics
- Authentication
- Third-party APIs
- Languages
- Accessibility
- Performance
- Security
- Privacy
- Scale

### 10. Technical Direction
Only after product clarity, recommend:
- Frontend
- Backend
- Database
- Authentication
- Storage
- Deployment
- Architecture

Keep proportional to MVP. Avoid overengineering.

## Auto-Generated Documentation

**After discovery, automatically create `docs/product/` with these 14 files:**

```
docs/product/
├── 00-README.md
├── 01-product-brief.md
├── 02-user-roles.md
├── 03-mvp-scope.md
├── 04-user-stories.md
├── 05-user-journeys.md
├── 06-functional-requirements.md
├── 07-business-rules.md
├── 08-data-model.md
├── 09-pages-and-navigation.md
├── 10-integrations.md
├── 11-technical-architecture.md
├── 12-development-roadmap.md
└── 13-risks-and-open-questions.md
```

### File Purposes

**00-README.md** — Overview, how to read, latest update, links

**01-product-brief.md** — Name, problem, target users, value prop, metrics

**02-user-roles.md** — Each role with permissions and responsibilities

**03-mvp-scope.md** — Must/should/could have with descriptions

**04-user-stories.md** — User stories grouped by feature with acceptance criteria

**05-user-journeys.md** — Core workflows (signup, main flow, admin, etc.)

**06-functional-requirements.md** — Features with goal, actors, flows, validation, errors

**07-business-rules.md** — Statuses, permissions, quotas, pricing, cancellation, inventory

**08-data-model.md** — Entities with fields, relationships, ownership, lifecycle

**09-pages-and-navigation.md** — Page hierarchy, components, states

**10-integrations.md** — External services, APIs, webhooks, email, storage

**11-technical-architecture.md** — Tech stack, frontend, backend, database, deployment

**12-development-roadmap.md** — Phases with effort estimates

**13-risks-and-open-questions.md** — Decisions, assumptions, unresolved questions, risks

### Commit Message

After generating all files:

```bash
git add docs/product/
git commit -m "docs: generate product specification from idea clarifier

Auto-generated 14 markdown files in docs/product/ documenting:
- Product vision and goals
- User roles and journeys
- MVP scope and functional requirements
- Business rules and data model
- Pages, integrations, and technical direction
- Development roadmap and risks

All requirements clarified and ready for implementation."
```

## Quality Checklist

Verify before marking READY:

- [ ] Product vision is clear
- [ ] User roles are defined
- [ ] MVP is tightly scoped
- [ ] User journeys are mapped
- [ ] Functional requirements detailed
- [ ] Business rules explicit
- [ ] Data model sketched
- [ ] Pages/navigation clear
- [ ] Integrations listed
- [ ] Technical direction chosen
- [ ] Roadmap realistic
- [ ] Risks identified

## Implementation Readiness

Give one outcome:

- **READY** — All documented, no critical unknowns
- **READY WITH ASSUMPTIONS** — Clear, specific assumptions noted and accepted
- **NOT READY** — Critical questions or contradictions remain

Explain in 13-risks-and-open-questions.md.

## Quality Rules

- Never pretend uncertain info is confirmed
- Label all assumptions explicitly
- Detect and resolve contradictions
- Prefer concrete examples
- Keep MVP focused
- Avoid feature creep
- Don't code until product requirements are clear
- Don't recommend microservices for small MVP
- Don't add complex infrastructure without need
- Use clear Markdown
- Keep requirements independent from implementation details
- **ALWAYS create docs/product/ folder structure automatically**
