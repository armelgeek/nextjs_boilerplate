# Output Standard

The shared bar for every skill in this pack.

## The five rules

1. **Evidence-first.** State what the data shows before interpreting it. A reader
   must be able to accept the evidence and reject the interpretation.
2. **Honest about missing data.** If an input is missing, say so where it affects
   the recommendation, not in a footnote. Say what it would change.
3. **Decision-oriented.** End with a clear next action or an approval ask.
4. **Conservative with claims.** Confidence is high, medium, low or unknown.
   Unknown is a legitimate answer and frequently the correct one.
5. **Human-in-the-loop.** Skills diagnose and recommend. They do not execute.

## Evidence tags

Tag every claim so a reader can tell what it rests on. A diagnosis where these
are indistinguishable is the failure this pack exists to avoid.

| Tag | Means | Example |
|---|---|---|
| `measured` | A number from a tool or export, quoted as printed | "LCP 5.8s, field data, 75th percentile" |
| `counted` | Derived by arithmetic from supplied numbers, with the arithmetic shown | "190 of 610 finished, 31 percent" |
| `quoted` | The user's or the page's own words, verbatim | "the headline reads Growth, unlocked." |
| `observed` | Read off a screenshot or a page, not measured | "the banner covers roughly a third of the mobile viewport" |
| `heuristic` | A threshold with a named source, not a law | "44 by 44 points, Apple's guidance" |
| `assumed` | Filled in because it was missing, stated as such | "assuming self-serve, since the motion was not supplied" |
| `hypothesis` | A causal claim that the data supports but does not establish | "choice load is a hypothesis for the drop-off" |
| `unknown` | Cannot be determined from what was supplied | "net effect unknown, nobody measured it both ways" |
| `out of scope` | A real question this skill does not answer | "whether 29 is the right price" |

## Failure modes to avoid

Each of these produces output that reads exactly like good output.

- **The confident average.** Reporting one conversion rate for a page served by
  four traffic sources. The blend hides both the working source and the broken
  one, and it is the most common way a landing page readout misleads.
- **Attribution by adjacency.** Two things changed and one moved; naming a cause
  because it was nearby. Say which changes were simultaneous.
- **The invented threshold.** "Anything above 3 percent is healthy." If a number
  has no source, it does not belong in the output. Tag it `heuristic` with the
  source or leave it out.
- **The small sample stated as a rate.** 6 conversions from 90 sessions is not
  6.7 percent in any useful sense. Say small sample and do not rank it.
- **Preference dressed as diagnosis.** "The hero feels cluttered" is taste.
  "Four CTAs at equal weight above the fold" is a finding.
- **The rewrite that answers a question nobody asked.** Rewriting the page when
  asked which sentence is hardest to read. Demonstrate on the worst examples and
  stop.
- **Borrowed benchmarks.** Somebody else's conversion rate for somebody else's
  offer. The only useful baseline is the page's own history.
- **Certainty about the unmeasured.** A predicted lift, a predicted Quality
  Score, a predicted rate after a change. Every one of these is a hypothesis and
  has to be labelled as one.
- **The disclaimer at the end.** Honesty placed where nobody reads it. The
  assumption goes next to the claim it undermines.
