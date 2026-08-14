# Changelog

All notable changes to this pack. Format follows Keep a Changelog, loosely.

## [2.0.0] - 2026-07-30

### Added

- `landing-page-triage`, the start-here skill, taking the pack to 26. It runs no
  diagnosis: it asks five questions to establish what evidence exists, routes to
  at most three skills in order, and names the ones it is skipping. Twenty five
  sibling skills and no router meant the first-use experience was a list.
- `significance.py` in `landing-page-ab-test-readout`: two-proportion z-test,
  Wilson intervals, required sample size, and the minimum detectable effect at the
  sample you have. The one skill that is pure arithmetic previously asked the model
  to judge noise by eye, and its own worked example asserted a result was "inside
  the range noise produces" without a number. It is p = 0.0821.
- **If the data does not exist** sections in `lead-form-sales-handoff-check`,
  `trial-vs-demo-path-decision` and `popup-and-overlay-timing-review`. Refusing to
  guess was right; stopping at "ask for data" was where the skill died on a
  Tuesday. Each now names the degraded path: walk your own signup with a stopwatch,
  read the last ten lost-deal notes, ask for a screen recording.

- Ten skills, taking the pack from 15 to 25:
  - `pricing-page-clarity-review`
  - `lead-form-sales-handoff-check`
  - `landing-page-copy-readability-pass`
  - `page-length-fit-check`
  - `comparison-page-positioning-review`
  - `trial-vs-demo-path-decision`
  - `popup-and-overlay-timing-review`
  - `accessibility-conversion-blocker-check`
  - `google-ads-landing-page-experience-review`
  - `traffic-temperature-match-review`
- `readability_report.py`, a deterministic copy measurement helper: sentence
  counts, long-sentence positions, passive-voice candidates, hedges, word
  frequency, and a two-version diff. Ships inside
  `landing-page-copy-readability-pass`.
- `contrast_check.py`, a WCAG 2.1 contrast calculator that exits non-zero on any
  failing pair so it can gate a build. Ships inside
  `accessibility-conversion-blocker-check`.
- `scripts/selftest.py`, regression tests over both helpers, including the
  large-text boundary at 18.66px and the empty-input case.
- `AGENTS.md` with composition chains, the skill boundary table, and the rules
  for extending the pack.
- `references/industry-notes.md`, recording where vertical changes the judgement.
- MIT `LICENSE` as a file rather than a sentence in the README.
- Three new sample outputs in `examples/`.

### Changed

- **Every one of the 15 original skills was rewritten in six sections, not one.**
  All 15 shared a single identical `description` activation sentence, and also
  byte-identical `Required input`, `Decision rules`, `Output format`, `Guardrails`
  and two of three activation bullets. A first pass fixed only the description and
  the example, which left fifteen skills that routed differently and then produced
  the same generic answer. Two were substantively wrong as a result:
  `landing-page-ab-test-readout` promised to say when a test cannot conclude and
  contained no threshold that could produce that answer, and `objection-map-builder`
  existed to read customer verbatims while its required input asked for sessions,
  CVR and scroll depth. Both now refuse: the readout at 100 conversions per arm and
  one business cycle, the objection map with no verbatims at all.
- **Every one of the 15 original practical examples was rewritten.** They shared a
  placeholder ("use the supplied evidence, run the workflow above") that taught the
  model nothing. Each now carries real numbers and a real verdict, including what
  the skill refuses to conclude from the data given.
- Both legacy sample outputs in `examples/` were rewritten. The A/B sample listed
  "statistical confidence" as missing data and then said "Ship Variant B" at medium
  confidence, on a result that computes to p = 0.0821; the message-match sample
  assigned high confidence to four findings without a single number. Both now carry
  evidence tags and a section on what they refuse to conclude.
- `scripts/validate-skills.py` now checks what actually breaks: section order,
  frontmatter matching the folder, duplicate descriptions, trigger clauses that
  overlap enough to make routing a coin flip, and a worked example that contains a
  number and declines something. The previous version asked only whether the words
  "Use when" appeared anywhere, so pasting one skill's description verbatim into
  another kept it green. Verified red on three mutations before being trusted.
- `evals/review-checklist.md` now separates what the gates cover from what only a
  human can judge, and states what the review cannot catch.
- Every unsourced threshold is now labelled as this pack's own default rather than
  implied research. `AGENTS.md` claimed the 35-word sentence flag was "a starting
  position with a source"; it has no source, and neither do the 20-word mean, the
  three-decisions-per-screen ceiling or the 25th percentile scroll cutoff. The
  WCAG, Apple and Google numbers do, and are cited as such.
- Skills are now fully self-contained. None reads a file outside its own folder,
  so the install command cannot leave a skill pointing at a missing path.
- Install command copies only skill folders (`*-*`), so nothing stray lands in
  `~/.claude/skills/`.
- README rewritten: two grouped tables, a what-it-decides column, situation-based
  quick starts, and an explicit "what this pack does not do" section.

### Fixed

Bugs in the helpers, each now a regression test:

- `contrast_check.py` parsed and discarded alpha, so `rgba(0,0,0,0.02)` on white
  reported 21.00:1 and exited 0. Invisible text passed a build gate. Translucent
  colours are now refused with an instruction to composite them first.
- `contrast_check.py` accepted a non-finite font size, and `1e309` silently
  relaxed the threshold from 4.5:1 to 3:1, flipping a real failure into a pass.
  Sizes must now be finite, positive and under 1000px; weights must be 1 to 1000.
- `contrast_check.py` returned the same exit code for a contrast failure and an
  unparseable line, so a CI gate could not tell a real defect from a typo. Now
  0 pass, 1 threshold failure, 2 could not measure.
- `contrast_check.py` emitted one row per pair with no cap; 200 000 pairs produced
  200 009 lines into a model's context. Output is capped, failing rows print first
  and are never dropped for passing ones, and what was hidden is reported.
- `readability_report.py` shredded accented words, so "Zürich teams don't wait"
  counted 11 words instead of 7 and the frequency table listed `rich` and `caf`.
  A page in Chinese was reported as an empty file. Both now measure correctly, and
  CJK text is counted in ideographs with that stated in the output.
- `readability_report.py` counted abbreviations as sentence ends, so "Trusted by
  Dr. Smith and approx. 4 000 teams. Book a demo." measured as four sentences with
  a mean of 2.5 words, making jargon-heavy pages look unusually easy to read. The
  intended protection had never worked: the pattern was mangled instead of the
  match, so no dotted abbreviation ever matched.
- `readability_report.py` accepted `--mean` and printed it and never adjudicated
  it. The flag never flagged.
- `readability_report.py` reported a mean, and flagged it, on a single sentence.
  Below ten sentences it now refuses to adjudicate and says why.
- `readability_report.py --compare` against an empty second document reported
  improvement on every metric instead of an error.
- The hedge counter was an intensifier list, so "perhaps / may / possibly /
  arguably" scored zero, missing the vagueness class that actually kills landing
  page copy. Hedges and intensifiers are now counted and reported separately.
- A UTF-8 BOM leaked into the first label of a pairs file.
- `__pycache__/` and `*.pyc` were not ignored, so the next commit after a selftest
  run would have shipped bytecode into every install.

Wrong numbers in the pack's own content, caught before shipping:

- The readability example claimed a 27-word sentence; the helper measures 22.
- The same example asserted the body copy's mean was within range, for 400 words
  that were never supplied.
- The traffic temperature example claimed cold traffic was 63% of sessions and 30%
  of conversions; it is 66.8% and 33.1%. Worse, its own supplied numbers total
  2.50% overall against the 2.8% the user stated, and the skill that exists to
  catch exactly that discrepancy swallowed it. Reconciling the total is now the
  first step in its workflow.
- The accessibility example gave the white-on-lime contrast as roughly 1.4:1; it
  measures 1.29:1.
- A hedge count in the selftest treated an adjective as a hedge.
- Em dash removed from the README footer.

## [1.0.0] - 2026-06-18

### Added

- First release: 15 skills for paid traffic landing page diagnosis, a validator,
  two sample outputs and a review checklist.
