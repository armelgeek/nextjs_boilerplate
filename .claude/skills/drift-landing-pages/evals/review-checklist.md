# Review checklist

The manual pass, for what the automated gates cannot see. Run the gates first:

```bash
python3 scripts/validate-skills.py   # structure, ordering, duplicate routing, examples with numbers
python3 scripts/selftest.py          # the helper maths and its boundary cases
```

Expected: `OK: 26 skills passed validation` and `138/138 checks passed`. If either
is red, stop here; the manual pass is not worth doing over a broken structure.

## What the automated gates already cover

Do not spend manual review time on these:

- required sections present and in order
- duplicate descriptions, and trigger clauses that overlap enough to make routing
  a coin flip
- frontmatter `name` matching the folder
- workflow with at least five numbered steps
- a practical example containing at least one number and at least one refusal
- placeholder and templated phrasing, including the specific templates this pack
  shipped once and had to unpick
- the arithmetic in both helpers, including translucent colours, non-finite font
  sizes, accented and CJK text, abbreviations, and the A/B refusal gates

## What only a human can check

**Does each decision rule decide this skill's own question?** A rule can be well
formed and generic. "If the data does not connect to revenue, label it a
hypothesis" is true everywhere and therefore useful nowhere. Compare against
`accessibility-conversion-blocker-check`, whose rules rank a button label above a
footer legal line, which is a judgement only this skill makes.

**Does the required input ask for what the description promises?** The version
that shipped once asked `objection-map-builder` for sessions and scroll depth
while its description promised to read customer verbatims. Read the description
and the input block together, for every skill.

**Would the worked example survive its own skill?** Recompute every number in it.
Two examples in this pack asserted numbers that their own helper contradicted, and
both got past a green validator.

**Does the example refuse the right thing?** The validator only checks that some
refusal marker appears. A refusal about something trivial passes it.

**Would two skills fight over a real request?** Write three sentences a user would
actually type and decide which skill should win each. Where two could, at least one
needs a boundary clause naming the other.

**Is a threshold labelled with the truth about its source?** Some carry a real one
(WCAG, Apple, Google). Others are this pack's own defaults with no external source:
the 35-word sentence flag, the 20-word mean, three decisions per screen, the 25th
percentile scroll cutoff, the ten-sentence mean floor, the 150 word frequency
floor, 100 conversions per arm, the seven day runtime gate. Neither kind may be presented
as the other.

## Examples covered

- `paid-traffic-message-match-audit`
- `landing-page-ab-test-readout`
- `pricing-page-clarity-review`
- `accessibility-conversion-blocker-check`

Twenty two skills have no sample output. That is a known gap, not an oversight; the
four above are the shape reference for the rest.

## Pass criteria

- A reader can tell when each skill activates without reading the repository.
- No decision rule would read identically in another skill.
- Every number in every example recomputes.
- Every skill's required input matches what its description promises.
- Every skill declines something it genuinely cannot know.
- No skill claims a conversion lift.

## This review passes falsely when

The pack is well-formed, self-consistent and wrong about the domain. Nothing here
catches a decision rule that is confidently bad CRO advice, and nothing here knows
whether a threshold is a good threshold. That needs someone who runs paid traffic
for a living, which is why the release process puts the pack in front of graders
playing the persona rather than relying on this file.
