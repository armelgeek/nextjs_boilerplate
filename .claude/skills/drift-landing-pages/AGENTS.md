# How this pack behaves

Guidance for the agent running these skills, and for anyone extending the pack.

## The one rule that matters

A landing page diagnosis is cheap to produce and expensive to be wrong about,
because it gets shipped. So the pack is built so that a skill running on thin
input says the input is thin instead of producing a confident answer that sounds
identical to a well-founded one.

If you take one behaviour from this file: **name the assumption in the output, at
the point where it affects the recommendation.** Not in a disclaimer at the end.

## What every skill does the same way

- **Reads the evidence before interpreting it.** State what the data shows, then
  what it means. A reader must be able to disagree with the interpretation while
  accepting the evidence.
- **Marks missing input where it bites.** "Scroll data was not supplied, so the
  ranking below is judgement" beats a footnote nobody reads.
- **Ends on a decision.** Every skill closes with `Decision:` and a short list of
  named options, so the output ends somewhere a human can act.
- **Labels confidence.** High, medium, low, unknown. Unknown is a legitimate and
  frequently correct answer.
- **Labels heuristics as heuristics, and says which kind.** Some carry a real
  source and can be cited: 4.5:1 and 3:1 contrast are WCAG 2.1 AA, 44 by 44
  points is Apple's guidance, 48 by 48 dp is Google's. Others are this pack's own
  working defaults with **no external source at all**: the 35 word long-sentence
  flag, the 20 word mean, the ten-sentence floor below which a mean is not
  adjudicated, the 150 word floor for the frequency table, the
  three-decisions-per-screen ceiling, the 25th percentile scroll cutoff, the 100
  conversions per arm refusal gate, and the seven day runtime gate. Say which
  of the two a number is every time you quote one, and never imply a source that
  does not exist. Where a real measurement exists, it beats both kinds.
- **Recommends the smallest change that removes the defect.** Not a redesign.
- **Never executes.** No page edits, no campaign changes, no CRM writes.

## Composition: which skills run together

The pack is deliberately overlapping at the edges, because the same symptom has
several possible causes. Useful chains:

- **Cold traffic that does not convert:** `paid-traffic-message-match-audit` sets
  whether the promise survived the click, `offer-clarity-diagnosis` whether the
  promise is worth anything, `traffic-temperature-match-review` whether the page
  is even being asked to serve one audience. Run in that order; stop when one of
  them produces a blocker, because the later findings will be about the wrong
  page.
- **Form problems:** `form-friction-finder` for the mechanics of stopping,
  `lead-form-sales-handoff-check` for whether the fields deserve to exist,
  `trust-signal-audit` for the hesitation right before submit. All three read the
  same form and answer different questions.
- **Mobile gap:** `mobile-conversion-review`, then
  `popup-and-overlay-timing-review`, then
  `accessibility-conversion-blocker-check`. Overlays and tap targets are the two
  most common real causes behind a mobile-versus-desktop gap.
- **Before scaling spend:** `landing-page-scale-readiness-check` and
  `traffic-temperature-match-review` together. The first asks whether the page
  holds, the second whether the current rate transfers to the new traffic.
- **Before publishing anything public-facing:**
  `comparison-page-positioning-review` for claims,
  `accessibility-conversion-blocker-check` for defects, both of which can stop a
  ship.

## Where the boundaries are

Overlap is intentional; duplication is not. If a new skill would answer a
question one of these already answers, extend that skill instead.

| If the question is | It belongs to |
|---|---|
| Does the ad match the page | `paid-traffic-message-match-audit` |
| Does the page match the audience temperature | `traffic-temperature-match-review` |
| Why do people abandon the form | `form-friction-finder` |
| Should this field exist | `lead-form-sales-handoff-check` |
| Is the copy hard to read | `landing-page-copy-readability-pass` |
| Is the offer vague | `offer-clarity-diagnosis` |
| How long should the page be | `page-length-fit-check` |
| Which ask should the page make | `trial-vs-demo-path-decision` |
| Is the CTA wording clear | `cta-clarity-check` |

Tracking, pixels, GA4 and conversion plumbing are out of scope for this pack.
They are a different problem with different failure modes.

## Three helpers, and why they exist

`significance.py`, `readability_report.py` and `contrast_check.py` exist because a
language model estimating a p-value, a contrast ratio or a mean sentence length
will produce a plausible number, and a plausible number is indistinguishable from
a measured one in the output. `significance.py` matters most of the three: it is
the only place in the pack where a threshold refuses a conclusion the operator
wants, and it enforces that in an exit code rather than in prose. All three live
inside the skill that cites them, so an installed skill never points at a path the
install command forgot to copy.

Run them. Quote what they print. Do not restate their numbers from memory.

## Extending the pack

- Frontmatter needs a `name` and a `description` whose second half names the
  situation that should trigger the skill. **Do not reuse another skill's
  activation sentence.** The whole pack shared one once, and it made routing
  between 15 skills a coin flip.
- Keep the section order: Use this skill when, Required input, Analysis workflow,
  Decision rules, Output format, Practical example, Guardrails.
- The workflow needs at least five steps, and each step must be an action on the
  input rather than a topic to consider.
- The practical example carries real numbers and a real verdict, including what
  the skill refuses to conclude. A generic example teaches the model to produce
  generic output.
- Anything a script can count, a script should count.
- Run `scripts/validate-skills.py` and `scripts/selftest.py` before publishing.

`references/output-standard.md` holds the shared output bar and the evidence
tags. `references/skill-design-principles.md` holds the design rules.
`references/industry-notes.md` holds the places where vertical changes the
judgement.
