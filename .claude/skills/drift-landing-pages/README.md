# 26 Claude Skills for Landing Pages

A pack of 26 Claude Skills for diagnosing landing pages that get traffic and do
not convert: message match, offer clarity, proof, objections, forms, mobile,
pricing, page length, overlays, accessibility and the Google Ads landing page
experience rating.

Each skill is a self-contained `SKILL.md` with explicit triggers, required
inputs, an analysis workflow, decision rules, a worked example, an output format
and guardrails. Drop them into Claude Code and they activate on their own when
what you are doing matches the description.

Every skill is data-first. They read what you give them. None of them log into an
account, change a page or touch a budget.

## Install

### Claude Code

```bash
git clone https://github.com/mardab96/landing-pages-claude-skills.git
mkdir -p ~/.claude/skills
cp -r landing-pages-claude-skills/*-* ~/.claude/skills/
```

Start a new Claude Code session. That is it. Every skill is self-contained: none
of them reads a file outside its own folder, so there is nothing else to copy and
nothing to break if you install only the ones you want.

For a single project instead of your whole account, copy into `.claude/skills/`
inside the project.

### Any other Claude environment

The skills are plain Markdown with YAML frontmatter. Paste the contents of a
`SKILL.md` into context when you want that skill.

## Start here

**`landing-page-triage`.** Ask for it by name, or just say the page gets traffic
and does not convert and you do not know why.

It runs no diagnosis of its own. It asks five questions to find out what evidence
you actually have, then names at most three skills to run, in order, and says
which ones it is deliberately skipping and why. Twenty six skills produce twenty
six opinions ranked by nothing; triage exists so that does not happen.

If the problem is already named, skip it and go straight to the skill that owns
that question.

## What is inside

### Diagnosing the page you have

| # | Skill | Folder | What it decides |
|---|---|---|---|
| 1 | Paid Traffic Message Match Audit | `paid-traffic-message-match-audit` | Where the ad promise and the page stop agreeing. |
| 2 | Above The Fold Clarity Review | `above-the-fold-clarity-review` | What a visitor understands and can do before scrolling. |
| 3 | Offer Clarity Diagnosis | `offer-clarity-diagnosis` | Whether the offer is specific enough to be believed. |
| 4 | Hero Section Diagnosis | `hero-section-diagnosis` | Where headline, subhead, visual and CTA contradict each other. |
| 5 | Social Proof Strength Audit | `social-proof-strength-audit` | Whether the proof would convince a sceptic in the reader's situation. |
| 6 | Objection Map Builder | `objection-map-builder` | Which real objections the page never answers. |
| 7 | Form Friction Finder | `form-friction-finder` | What stops people finishing a form they meant to finish. |
| 8 | Mobile Conversion Review | `mobile-conversion-review` | What breaks on a phone specifically. |
| 9 | CTA Clarity Check | `cta-clarity-check` | Whether the page asks for one thing or quietly asks for five. |
| 10 | Trust Signal Audit | `trust-signal-audit` | Whether a cautious buyer's questions are answered at the ask. |
| 11 | Conversion Leak Finder | `conversion-leak-finder` | Every way to leave the page without converting. |
| 12 | Page Speed Impact Review | `page-speed-impact-review` | Which speed defect is worth engineering time. |
| 13 | Thank You Page Opportunity Audit | `thank-you-page-opportunity-audit` | What the highest-intent moment in the funnel is wasting. |
| 14 | Landing Page AB Test Readout | `landing-page-ab-test-readout` | Whether the result is a decision or a coincidence. |
| 15 | Landing Page Scale Readiness Check | `landing-page-scale-readiness-check` | Whether the page survives the budget going up. |

### Deciding what the page should be

| # | Skill | Folder | What it decides |
|---|---|---|---|
| 16 | Pricing Page Clarity Review | `pricing-page-clarity-review` | Whether a visitor can pick a plan without contacting anyone. |
| 17 | Lead Form Sales Handoff Check | `lead-form-sales-handoff-check` | Which fields earn their place, and which criterion has no field. |
| 18 | Landing Page Copy Readability Pass | `landing-page-copy-readability-pass` | Which sentences slow the reader down, measured not guessed. |
| 19 | Page Length Fit Check | `page-length-fit-check` | How much argument the page owes before it asks. |
| 20 | Comparison Page Positioning Review | `comparison-page-positioning-review` | Which competitor claims will not survive being checked. |
| 21 | Trial Vs Demo Path Decision | `trial-vs-demo-path-decision` | Which ask the page should make, given time to first value. |
| 22 | Popup And Overlay Timing Review | `popup-and-overlay-timing-review` | Which overlay is stealing the primary conversion. |
| 23 | Accessibility Conversion Blocker Check | `accessibility-conversion-blocker-check` | Which accessibility defects also cost money today. |
| 24 | Google Ads Landing Page Experience Review | `google-ads-landing-page-experience-review` | Whether Below average is a page problem or a keyword problem. |
| 25 | Traffic Temperature Match Review | `traffic-temperature-match-review` | What one page costs you when it serves cold and branded traffic at once. |

### Routing

| # | Skill | Folder | What it decides |
|---|---|---|---|
| 26 | Landing Page Triage | `landing-page-triage` | Which three of the other 25 to run, and which to skip. |

## Quick starts

Pick the situation, not the skill. Or run `landing-page-triage` and let it pick.

**Clicks arrive, nothing converts.** Message match audit, then offer clarity,
then traffic temperature. In that order, because a page can be perfectly clear
about the wrong promise.

**Mobile is far worse than desktop.** Mobile conversion review, then popup and
overlay timing, then accessibility blockers. Two of those three usually turn out
to be the same defect seen from different angles.

**People start the form and stop.** Form friction finder for the mechanics, lead
form sales handoff check for whether the fields should exist at all.

**Google Ads says the landing page experience is Below average.** The Google Ads
landing page experience review first, because half the time the finding is that
the page is fine and the keyword mapping is not.

**About to raise the budget.** Scale readiness check, then traffic temperature
match, because the rate you are about to scale was measured on traffic you are
about to change.

**Nobody agrees on how long the page should be.** Page length fit check. It
refuses to answer in word counts and answers in objections per ask instead.

**A comparison page is about to go public.** Comparison page positioning review,
which will not let an unsourced competitor claim ship.

**A test just finished and someone wants to ship the winner.** AB test readout. It
runs the arithmetic and will tell you the test cannot conclude, which is often the
true answer.

## Three skills ship a script

Some of this work is arithmetic, and a model asked to eyeball arithmetic produces
a plausible number that is indistinguishable from a measured one.

- `landing-page-ab-test-readout/significance.py` runs a two-proportion test,
  Wilson intervals, the sample size needed to decide, and the minimum detectable
  effect at the size you have. Exits non-zero when the result is inconclusive.
- `landing-page-copy-readability-pass/readability_report.py` counts sentences,
  sentence length, long-sentence positions, passive-voice candidates, hedges,
  intensifiers and word frequency, and can diff two versions of the copy.
- `accessibility-conversion-blocker-check/contrast_check.py` computes WCAG 2.1
  contrast ratios and exits non-zero when any pair fails, so it can gate a build.

All three are stdlib-only Python 3 and live inside the skill that uses them, so an
installed skill never points at a file the install command forgot to copy.

```bash
python3 landing-page-ab-test-readout/significance.py --a 1200 36 --b 1180 48 --runtime-days 6
python3 accessibility-conversion-blocker-check/contrast_check.py pairs.txt
python3 landing-page-copy-readability-pass/readability_report.py before.txt --compare after.txt
```

## Bring your data

These skills are worth having because they read your actual inputs: page copy, a
screenshot, form fields, a Google Ads export, a speed report, scroll numbers,
review text, sales call notes. Each `SKILL.md` lists what it needs under
`## Required input`.

When an input is missing they say so and mark the assumption. That is deliberate.
A confident landing page diagnosis built on no data is worse than no diagnosis,
because it gets shipped.

Several skills also carry an **If the data does not exist** section, because "ask
for data" is where a diagnosis dies on a Tuesday. Those sections say what to do
with what you have: walk your own signup with a stopwatch, read the last ten
lost-deal notes, ask for a screen recording instead of a screenshot.

## Activation and trigger reliability

Claude activates a skill from the YAML `description` first and reads the rest of
`SKILL.md` after. So each description names its own situation, no two share an
activation sentence, and the validator fails the pack if any two get close enough
to make routing a guess.

Ask for the job and name the object. "Audit message match between this ad and
this page" routes better than "review this page".

## What this pack does not do

Worth knowing before you install it:

- **It does not run tests.** The A/B skill reads a result you already have. It
  cannot start an experiment or watch one.
- **It does not see your page.** It reads what you paste or link. It has no
  browser, no screenshot capability and no access to your analytics.
- **It does not measure speed.** The speed skill turns a report you ran into a
  priority. Run PageSpeed Insights or Lighthouse yourself first.
- **It does not write the page.** It diagnoses and recommends the smallest
  change. Several skills deliberately demonstrate a rewrite on the worst two or
  three examples instead of rewriting everything.
- **It does not produce an accessibility conformance verdict.** The accessibility
  skill finds the defects that also cost conversions. Conformance is a different
  job with a different scope.
- **It does not set prices.** The pricing skill reviews whether the page
  communicates the price it already has.
- **It has no memory between sessions.** Each run starts cold. If you want a
  page's history tracked, that is a document you keep.
- **Twenty two of the 26 have no sample output.** Four do, and they are the shape
  reference for the rest.

## Guardrails

By default no skill in this pack will publish ads, change budgets, pause
campaigns, edit tracking, modify a landing page, change CRM fields, send a
customer message, or claim a performance impact without evidence.

Use them to structure the work, not to hand over control of the account.

## Thresholds, and where they come from

Some numbers in this pack carry a real source and are cited: 4.5:1 and 3:1
contrast are WCAG 2.1 AA, 44 by 44 points is Apple's guidance, 48 by 48 dp is
Google's.

Others are this pack's own working defaults with **no external source at all**:
the 35-word long-sentence flag, the 20-word mean, the ten-sentence floor below
which a mean is not adjudicated, the 150-word floor for a frequency table, three
decisions per screen, the 25th percentile scroll cutoff, and 100 conversions per
arm over seven days before an A/B result can name a winner. They are useful
starting positions, they are not research, and every skill that quotes one says
which kind it is.

## Industry notes

Landing page judgement shifts by vertical, and a rule that is right for a 49
e-commerce order is wrong for a 40 000 enterprise deal.
[`references/industry-notes.md`](references/industry-notes.md) records where the
reasoning changes.

## Validate the pack

```bash
python3 scripts/validate-skills.py   # structure, ordering, duplicate routing, examples
python3 scripts/selftest.py          # the helper maths and its boundary cases
```

The validator checks sections and their order, frontmatter matching the folder,
workflows with real steps, worked examples that contain a number and decline
something, and any two descriptions close enough to make routing arbitrary. The
selftest covers the three helpers, including translucent colours, non-finite font
sizes, accented and CJK text, abbreviations, and the A/B refusal gates.

Neither can tell whether a decision rule is good advice.
[`evals/review-checklist.md`](evals/review-checklist.md) is the manual pass for
that, and it says plainly what it cannot catch either.

## Examples

Sample outputs, showing the expected depth and what each skill refuses to
conclude:

- [`examples/paid-traffic-message-match-audit-sample.md`](examples/paid-traffic-message-match-audit-sample.md)
- [`examples/landing-page-ab-test-readout-sample.md`](examples/landing-page-ab-test-readout-sample.md)
- [`examples/pricing-page-clarity-review-sample.md`](examples/pricing-page-clarity-review-sample.md)
- [`examples/accessibility-conversion-blocker-check-sample.md`](examples/accessibility-conversion-blocker-check-sample.md)

[`AGENTS.md`](AGENTS.md) covers how the pack behaves, which skills compose, and
where the boundaries between them are.

## Licence and attribution

MIT. See [`LICENSE`](LICENSE). Free for personal and commercial work, including
inside client engagements. A credit is appreciated and not required.

Built and maintained by [AdLume](https://adlume.co), performance marketing
infrastructure for AI-native operators.
