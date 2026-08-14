# Onboarding Audit

Audite le signup flow → premier "aha moment". Identifie où on perd les gens **avant** d'avoir des vrais utilisateurs pour te le dire.

## Quand l'utiliser

- Avant de lancer (day 0)
- Après lancer mais avant de scaler
- Quand conversion rate est bas
- Quand tu suspèctes que l'onboarding saigne des users

## Usage

```bash
/onboarding-audit "TanStack Start + Stripe + Convex. Aha moment: first bookmark saved."
/onboarding-audit "analytics SaaS. Aha: integrated 1st data source and saw live chart"
```

## Output

```
Product: [name]
Aha Moment: [the thing that makes them go "oh, this is useful"]

Onboarding Flow (current):
1. Signup → [time: 30s]
2. Email verification → [time: 2min]
3. Initial tour → [time: 1min]
4. [action to aha] → [time: ?]

Friction Points (likely drop-off):
🔴 Email verification is mandatory + slow
🔴 After signup, no clear CTA to first action
🟡 Pricing page is late (after aha)
🟡 Tour doesn't explain the core value

Suggested Fixes (priority):
[ ] Move email verification to after first action (or skip it)
[ ] Add inline tour showing first action path
[ ] Change CTA: "Create your first [artifact]" not "Explore dashboard"
[ ] Measure: track drop-off at each step (cohort analysis)
```

## Rules

- Flow must be testable (simulated users = you walking through it)
- Aha moment first (before other features)
- No generic "welcome tour" — tour should enable first action
- Measure: count every step (which % reach step N?)

