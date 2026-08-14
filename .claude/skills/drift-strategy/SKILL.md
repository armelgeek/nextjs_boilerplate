---
name: drift-strategy
description: Design business model based on validation. Reads validation results, creates pricing, ICP, GTM strategy, and metrics aligned with your validated market.
---

# Solo Founder Strategy

Design a business model based on **reality**, not assumptions.

This skill reads your validation results (from startup-validator) and creates a coherent go-to-market strategy tailored for a solo founder.

**Prerequisite:** Run `/startup-validator` first to generate `docs/validation/`

## Core Principle

Strategy isn't about fancy business models. It's about:
1. **Who** will pay you (ICP)
2. **How much** they'll pay (pricing)
3. **How** you'll reach them (GTM)
4. **What metrics** matter (success)

All grounded in validation results, not fantasy.

## How It Works

### Step 1: Analyze Validation Results

Reads `docs/validation/results.md` and understands:
- Who you actually talked to
- What they said they'd pay
- What problem you solved for them
- How many pre-sales/commitments you got

### Step 2: Design Business Model

**Not "choose a model", but derive it from data:**

**If validation showed:**
```
"Event organizers save 5 hours per event"
"They value their time at $50/hour"
"Willingness to pay: $150-300/month"

→ Strategy recommends:
   Pricing: $200/month (middle of range)
   Model: SaaS subscription + commission
   Reasoning: Save time = recurring value
```

**Not:**
```
❌ "Stripe takes commission, so I'll take commission too"
❌ "Everyone uses subscription SaaS, so I will"
```

But:
```
✅ "Organizers said they'd pay $200/month"
✅ "→ Price at $200/month"
✅ "→ Include commission for bigger margin"
```

### Step 3: Define ICP (Ideal Customer Profile)

From validation, extract precise ICP:

**Not:**
```
❌ "SMBs"
❌ "Anyone who needs X"
```

But:
```
✅ Event organizers with 50-500 capacity
✅ Small music venues (not corporate events)
✅ Geographic: Initially US, then EU
✅ Revenue: $100k-1M annually
✅ Tech level: Comfortable with SaaS
```

### Step 4: Create Go-to-Market (GTM)

Match channels to ICP, realistic for solo:

**If ICP is "event organizers":**
```
Channel 1: Direct outreach (50 targets)
- Identified 50 target organizers from validation
- Personal email pitch
- Success metric: 10% response, 5% trial

Channel 2: Communities
- Event manager groups (Facebook, Reddit)
- Industry forums
- Success metric: 20 signups/month

Channel 3: Content
- Twitter tips for event organizers
- Blog: "How to sell tickets 10x faster"
- Success metric: Organic discovery

Channel 4: Partnerships (later)
- Event platforms, ticketing integrations
- Only after reaching $1000 MRR
```

**Not:**
```
❌ "Sales team" (you're solo)
❌ "National ads" (too expensive)
❌ "Hope people find you" (no strategy)
```

But:
```
✅ Direct outreach to 50 known targets
✅ Leverage communities (free/cheap)
✅ Build in public on Twitter
✅ Partnerships only after PMF
```

### Step 5: Define Metrics

What to track and when:

**Acquisition metrics:**
```
- CAC (Customer Acquisition Cost)
- Conversion rate by channel
- Time to first paying customer
```

**Revenue metrics:**
```
- MRR (Monthly Recurring Revenue)
- ARR (Annual Recurring Revenue)
- ARPU (Average Revenue Per User)
```

**Retention metrics:**
```
- Churn rate (monthly)
- Expansion revenue
- NPS (customer satisfaction)
```

**Health metrics:**
```
- Runway (months of cash left)
- Burn rate (if not yet profitable)
- Break-even month
```

## Examples by Product Type

### Ticket Marketplace

**From validation:** "5 organizers interested, 3 pre-sales at $100/month"

**Business model:**
```
docs/strategy/business-model.md

Primary: SaaS subscription ($100-300/month)
Secondary: Commission on ticket sales (5-10%)
Reasoning: Recurring revenue stable, commission aligns incentives

ICP: Small event organizers (50-500 capacity)
- Music venues
- Conference organizers
- Local event promoters
- Tech meetup hosts

Willingness to pay: $100-300/month
- Based on 5 conversations
- Saves them 5 hours per event
- Current solution costs them $50/hour = $250
- So $150-300/month is rational
```

**Go-to-market:**
```
docs/strategy/go-to-market.md

Phase 1 (Month 1-2): Direct outreach
- Target: 50 small venues + event organizers
- Personal email (not mass email)
- Pitch: "I built this for people like you"
- Success metric: 10% response, 5% trial

Phase 2 (Month 2-3): Communities
- Event industry groups (Facebook, LinkedIn)
- Local meetup communities
- Conference organizer groups
- Success metric: 20-30 signups

Phase 3 (Month 3+): Content
- Twitter threads on event organizing
- Blog posts (SEO for "ticket sales software")
- Guest posts in event industry
- Success metric: 50+ organic visitors/month

Phase 4 (Month 6+): Partnerships
- Integrate with venue management software
- Partner with event platforms
- Only after reaching $1000+ MRR
```

**Metrics:**
```
docs/strategy/metrics.md

Month 1-3:
- CAC: Should be <$50 (mostly own time)
- Conversion: Direct outreach 5%, Communities 2%
- Target MRR: $300-500

Month 3-6:
- MRR growth: 10-20% monthly
- Churn rate: <5%
- Target MRR: $1000+

Month 6-12:
- Expand to 2 countries
- Launch API for integrations
- Target MRR: $2000-3000
```

### AI Content Generator

**From validation:** "100+ waitlist signups, 10 willing to pay"

**Business model:**
```
docs/strategy/business-model.md

Primary: SaaS subscription (per user/month)
Pricing tiers:
- Starter: $30/month (10 posts/month)
- Pro: $100/month (100 posts/month)
- Agency: $300/month (unlimited)

Reasoning: Content value = time saved
- 1 post per hour valued
- Pricing: $0.30 per post saved
- 10 posts = $3, 100 posts = $30
```

**ICP:**
```
- Solo content creators
- Small marketing teams (1-3 people)
- LinkedIn creators
- TikTok creators
- Micro-influencers

Criteria:
- Publish 3+ times per week
- Spend >5 hours/week on content
- Make $500+/month from content
```

**Go-to-market:**
```
Phase 1: Waitlist (existing 100)
- Convert 20% → 20 paid customers
- Revenue: 20 × $50 = $1000 MRR

Phase 2: Twitter/LinkedIn
- Share results from early users
- "Users save 10 hours/week with X"
- Build in public, growth hacking
- Target: 50 more customers

Phase 3: Communities
- Creator communities (Skool, Mighty Networks)
- Newsletter communities
- LinkedIn creator groups

Phase 4: Partnerships (after $2000 MRR)
- Creator networks
- Email newsletter tools
- Social media scheduling tools
```

## Pricing Intelligence

### Don't guess, derive from validation:

**Step 1: Extract willingness-to-pay from validation**
```
Interview feedback:
- "I'd pay $50/month"
- "$100/month seems expensive"
- "I could justify $75"

→ Price: $79/month
```

**Step 2: Validate with tiers**
```
- Starter: $29 (basic)
- Pro: $79 (most customers)
- Enterprise: $300 (big orgs)

→ Launch Pro, add Starter if feedback
```

**Step 3: Test in market**
```
Real price ≠ stated price
- People often say they'd pay X but won't
- Only trust pre-sales that actually paid
- Adjust price based on early customer feedback
```

## Growth Targets (Solo-Realistic)

**Year 1:**
```
Month 1-3: $300-500 MRR (direct outreach)
Month 3-6: $1000-2000 MRR (channels working)
Month 6-12: $2000-5000 MRR (scaling what works)
```

**This is REALISTIC for solo because:**
- You're not hiring
- You're not spending on ads
- You're focused on right channel + right ICP
- You're only doing this 4-5 hours/day

**This is NOT:**
```
❌ "I'll reach $100k MRR in 3 months"
❌ "I'll grow 10x month-over-month"
❌ "I'll expand to 5 countries immediately"
```

But:
```
✅ Steady 20-30% monthly growth
✅ Sustainable single-channel focus
✅ Only expand when the first works
```

## Output Files

```
docs/strategy/
├── business-model.md
│   └── Revenue model (SaaS, commission, etc)
│   └── Why this model fits your market
│
├── pricing.md
│   └── Pricing tiers
│   └── Justification from validation
│   └── Price vs. willingness-to-pay analysis
│
├── ica-profile.md
│   └── Exact customer profile
│   └── Company size, revenue, needs
│   └── Where to find them
│
├── go-to-market.md
│   └── Channels by phase (1-4)
│   └── Success metrics per channel
│   └── Timeline (realistic)
│
├── acquisition-plan.md
│   └── Specific actions
│   └── Where to find first 10 customers
│   └── How to pitch them
│
├── metrics.md
│   └── What to track
│   └── Success thresholds
│   └── Targets per phase
│
└── risks.md
    └── Major risks (competition, market, timing)
    └── Mitigation per risk
    └── When to pivot/kill
```

---

## Next Step

After strategy ✅, move to: `/saas-architect`

The architect skill will read your strategy and design tech proportional to your scale and budget.
