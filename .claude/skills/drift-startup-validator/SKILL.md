---
name: drift-startup-validator
description: Validate product ideas before coding. Reads spec from drift-idea-clarifier, proposes intelligent tests, creates validation plan adapted to your Mooz product type.
---

# Startup Validator

Don't code first. Validate first.

This skill reads your product spec (from idea-clarifier) and proposes **specific, testable experiments** to validate that people actually want what you're building.

**Prerequisite:** Run `/idea-clarifier` first to generate `docs/product/`

## Core Principle

Not generic validation ("interview 20 people"), but **intelligent validation tailored to YOUR product**.

### Smart vs. Generic

**Generic (❌ waste of time):**
```
- Interview 20 people
- Create landing page
- Run ads
- See what sticks
```

**Smart (✅ focused):**
```
Product type: Marketplace
→ Test 1: Can vendor list item? (form)
→ Test 2: Can buyer complete purchase? (payment)
→ Test 3: Does vendor get paid? (payouts)
Success: 3 complete end-to-end transactions
```

## How It Works

### Step 1: Analyze Your Product

Reads `docs/product/` and understands:
- Product type (SaaS, marketplace, content, tool, etc.)
- Core complexity (auth, payments, real-time, file storage, etc.)
- Number of user types (1 or many)
- Revenue model (SaaS, marketplace, ads, etc.)

### Step 2: Propose Validation Strategy

**Matches validation difficulty to product complexity:**

**Low complexity** (note-taking app):
```
Phase 1: Can users sign up? (form test)
Phase 2: Can users create notes? (basic UI test)
Phase 3: Do users come back? (1 week retention)
Success metric: 3 users with 5+ notes each
Timeline: 1 week
```

**Medium complexity** (small marketplace):
```
Phase 1: Can vendors create listings? (form + data storage)
Phase 2: Can buyers purchase? (payment integration)
Phase 3: Does vendor get paid? (payout flow)
Success metric: 3 complete transactions
Timeline: 2-3 weeks (for Stripe setup)
```

**High complexity** (two-sided with real-time):
```
Phase 1: Can drivers accept rides? (real-time messages)
Phase 2: Can riders request? (location, matching)
Phase 3: Does transaction complete? (payment + rating)
Success metric: 5 completed rides
Timeline: 4-6 weeks (significant complexity)
```

### Step 3: Create Validation Plan

Generates `docs/validation/` with:

```
docs/validation/
├── hypothesis.md
│   └── "Small event organizers want easier ticket sales"
│
├── assumptions.md
│   └── Willingness to pay: $50-200/month
│   └── Problem severity: High
│   └── Market size: >10,000 targets
│
├── tests.md
│   ├── Phase 1 (Week 1): Concept test
│   ├── Phase 2 (Week 2): MVP test
│   ├── Phase 3 (Week 3): Revenue test
│   └── Each test has: Success criteria, Sample size, Timeline
│
├── interview-script.md
│   └── Questions tailored to YOUR product
│   └── Not generic "do you like X"
│   └── But specific "have you tried X, what was hard?"
│
├── metrics.md
│   └── What to track per phase
│   └── Success threshold per test
│   └── "Go/No-Go" decision criteria
│
└── results.md (after running tests)
    ├── What we learned
    ├── Did hypotheses hold?
    └── Decision: Build / Pivot / Abandon
```

## Key Intelligence

### 1. Product-Type Aware

**For B2B SaaS:**
```
Validate with actual ICP buyers
- Not friends
- Not random people
- Actual decision makers from target companies
Success: Pre-sales or signed LOI
```

**For Marketplace:**
```
Validate BOTH sides
- Vendors actually listing
- Buyers actually purchasing
- Not just one side interested
Success: Complete transaction
```

**For Content:**
```
Validate organic reach
- Can you find 100 interested people?
- Do they share your content?
- Do they come back?
Success: 1000+ organic visitors
```

### 2. Complexity-Aware

**Simple product:**
```
Can do manual MVP
- No backend needed
- Google Form → Typeform
- Manually process orders
- Fast validation (1 week)
```

**Complex product:**
```
Need basic MVP
- Real database
- Basic integrations
- Real code (but minimal)
- Longer validation (3-4 weeks)
```

### 3. Realistic for Solo

Not:
```
❌ "Hire someone to validate"
❌ "Run expensive ad campaigns"
❌ "Build before validating"
```

But:
```
✅ Direct outreach to 50 target customers
✅ Use free tools (Typeform, Stripe test mode)
✅ Manual processes at first
✅ Lean experiments, learn fast
```

## Examples by Product Type

### Ticket Marketplace
```
Hypothesis: Event organizers want easier ticket sales

Phase 1: Concept (1 week)
- Interview 5 organizers about pain points
- Share mockup, ask "would you use this?"
- Success: 4/5 say "yes, I'd pay for this"

Phase 2: Wizard of Oz (1 week)
- Manually handle event creation (Google Form)
- Use Stripe test mode for ticket sales
- Success: 3 complete end-to-end transactions

Phase 3: Pre-sales (1 week)
- Offer early access for $100/month
- Success: 2 customers commit payment

Decision: Ready to build → ~8 weeks to MVP
```

### AI Content Generator
```
Hypothesis: Creators want automated social media content

Phase 1: Survey (3 days)
- Send survey to 200 creators via Twitter/LinkedIn
- Success: 50+ interested

Phase 2: Landing page (1 week)
- Simple landing page + email signup
- Drive traffic via Twitter, communities
- Success: 100+ signups

Phase 3: Manual MVP (1 week)
- Manually create content for 5 beta users
- Get feedback on quality/usefulness
- Success: All 5 say "worth paying for"

Decision: Ready to automate → ~6 weeks to MVP
```

### SaaS Productivity Tool
```
Hypothesis: Managers want better team sync

Phase 1: Pain point interview (1 week)
- Interview 10 managers
- Record their current process
- Identify biggest friction
- Success: Clear #1 pain point identified

Phase 2: Mockup test (1 week)
- Build interactive mockup (Figma/Framer)
- Show to 5 target managers
- Ask: "Would you use this?"
- Success: 4/5 say yes

Phase 3: Wizard of Oz (1-2 weeks)
- Build real backend
- Manually manage UI (no fancy features)
- Get 3 customers to commit payment
- Success: Pre-sales revenue

Decision: Ready to scale → ~4 weeks to MVP
```

## Avoiding Common Mistakes

### ❌ Validating Too Generically

Wrong:
```
"I'll get feedback from 20 people"
- Who? Random people
- What feedback? Vague "do you like it"
- How to decide? No clear success metric
```

Right:
```
"I'll test with 5 target customers"
- Who? Small event organizers (ICP)
- What? Can they complete end-to-end transaction
- Success metric: 2+ complete transactions = go
```

### ❌ Validating Wrong Side of Marketplace

Wrong:
```
"I have 10 people interested!"
- But who? Just one side (buyers)
- What about sellers? Not validated
- Can't build without both sides
```

Right:
```
"5 organizers will list events"
"3 buyers completed purchases"
→ Both sides validated → Green light to build
```

### ❌ Validation Without Revenue

Wrong:
```
"People loved the mockup!"
- But did they pay?
- Free interest ≠ paying customers
```

Right:
```
"3 customers committed $100/month"
- Real money = real validation
- Now build with confidence
```

## Validation Decision Framework

After running tests, use this to decide:

**Go (Build):**
```
✅ Core hypothesis validated
✅ Target customers exist
✅ Pre-sales or strong interest
✅ Market timing is right
→ Proceed to solo-founder-strategy
```

**Pivot (Adjust):**
```
⚠️ Core hypothesis partially validated
⚠️ Wrong customer segment
⚠️ Different use case emerged
→ Adjust docs/product/, revalidate
```

**No-Go (Abandon):**
```
❌ Core hypothesis disproven
❌ No customers interested
❌ Market too small
❌ Already solved by competitors
→ Kill the idea, move to next one
```

---

## Output Files

After validation:

```
docs/validation/
├── hypothesis.md
├── assumptions.md
├── tests.md
├── interview-script.md
├── metrics.md
├── results.md
├── learnings.md
└── decision.md
```

Each file is specific to YOUR product, not a generic template.

---

## Next Step

After validation ✅, move to: `/solo-founder-strategy`

The strategy skill will read your validation results and design a business model based on what you actually learned.
