# Industry notes

Where landing page judgement changes by vertical. A rule that is right for a 49
e-commerce order is wrong for a 40 000 enterprise deal, and a skill that applies
one to the other produces confident nonsense.

Read the relevant section before applying a threshold from any skill.

## E-commerce

- **The page is often not the decision point.** Product, price, shipping and
  return terms carry the conversion. A hero rewrite moves less here than
  anywhere else.
- **Trust signals are transactional, not reputational.** Delivery time, return
  window, payment methods and total landed cost matter more than logos or
  founder credibility. `trust-signal-audit` should look for those first.
- **Mobile is the default case, not a segment.** A mobile finding is the finding.
- **Page length is usually short and the objection load is small**, because the
  commitment is small and reversible. `page-length-fit-check` should expect this
  and not read a short page as under-argued.
- **Pricing clarity means total cost.** A price that excludes shipping and duty
  is the defect `pricing-page-clarity-review` should surface, not tier structure.
- **Comparison pages are usually product-to-product**, so
  `comparison-page-positioning-review` is checking specifications rather than
  positioning claims.

## B2B SaaS, self-serve

- **Time to first value is the deciding number** for
  `trial-vs-demo-path-decision`. Everything else is downstream of it.
- **The signup is the conversion, and activation is a separate event.** Do not
  let a skill blur them; a page can produce signups that never activate, and
  that is a page problem the page cannot see.
- **Pricing pages carry real weight** and hidden seat or usage limits are the
  most common clarity defect.
- **The reader is frequently not the buyer.** A champion needs material to take
  internally, which is an objection `objection-map-builder` should look for
  explicitly in reviews and sales notes.

## B2B SaaS, sales-assisted and enterprise

- **The ask is a conversation, so the argument has to precede it.** A hard demo
  CTA above the objections is a real defect here, unlike in e-commerce.
- **Security, procurement and compliance are objections, not footnotes.** If the
  page does not answer them, `objection-map-builder` should treat their absence
  as a finding even when no customer mentioned them.
- **Sample sizes are small.** `landing-page-ab-test-readout` will frequently and
  correctly conclude that a test cannot conclude. Say so rather than softening
  it. This is the vertical where inconclusive is the honest answer most often.
- **Deal size pays for a call**, so `trial-vs-demo-path-decision` usually lands
  on demo, and the interesting question is what the subordinate path is for.
- **Comparison pages are positioning documents** and carry the most legal
  exposure. Every claim needs a dated source.

## Lead generation and local services

- **Speed of response beats page polish.** The thank-you page and what happens
  in the next five minutes often outrank anything above the fold, which makes
  `thank-you-page-opportunity-audit` unusually valuable here.
- **Lead quality is the metric, not lead volume.** `lead-form-sales-handoff-check`
  is the highest-value skill in this vertical, because the cheap fix is usually a
  qualifying field rather than a page change.
- **Phone is a primary conversion**, so a click-to-call target and its tap size
  belong in the mobile and accessibility reviews, not as an afterthought.
- **Traffic is often geographically bounded**, so a broad-targeting scale plan
  fails for reasons `landing-page-scale-readiness-check` should name: the
  audience runs out before the budget does.

## Regulated verticals: finance, health, legal

- **Claim substantiation outranks conversion craft.** An unsourced outcome claim
  is a blocker, not a copy note, and `comparison-page-positioning-review` plus
  `social-proof-strength-audit` should both treat it that way.
- **Testimonials may be restricted or require disclosure.** Do not recommend
  adding one without flagging that the rules differ by jurisdiction and
  profession, and that this is outside the skill's competence.
- **Accessibility exposure is higher.** The commercial subset in
  `accessibility-conversion-blocker-check` is still not a conformance audit, and
  in these verticals the gap between the two matters more. Say so.
- **Trust defects are disqualifying rather than costly.** A missing legal entity
  on a page asking for financial details is not a percentage point.

## Marketplaces and two-sided products

- **Two audiences, two pages, always.** A single page serving supply and demand
  is the finding `traffic-temperature-match-review` should reach for first.
- **Proof is liquidity.** Volume of listings, response time and fill rate do the
  work that testimonials do elsewhere.
- **The conversion is often a browse, not a signup.** Check that the measured
  conversion is the one the page is actually built to produce before diagnosing
  anything else.
