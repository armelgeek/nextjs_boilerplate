# Sample output: Paid Traffic Message Match Audit

Data is fictional. This is a shape reference for the expected output, including
what the skill declines to conclude.

Every row carries an evidence tag from `references/output-standard.md`.

## Input supplied by the user

> Google Search campaign. Query cluster: "reduce wasted ad spend", "google ads
> audit", "ppc budget waste".
>
> Ad headline: "Find Wasted Ad Spend in 15 Minutes"
> Ad description: "Upload your account export and get a prioritized waste report."
>
> Page hero: "AI Marketing Operating System"
> Subhead: "Manage campaigns, reports and insights in one place."
> Primary CTA: "Start free trial"
> Proof: a logo row and one testimonial reading "This saves us time."
>
> 2100 clicks last month, 23 conversions, bounce 74%. One ad group, one page.
> No scroll data. Sales has not fed back on lead quality.

## Element comparison

| Element | Ad says | Page says | Match | Position | Tag |
|---|---|---|---|---|---|
| Outcome | Find wasted ad spend | Manage campaigns, reports and insights | broken | Hero, first line | `quoted` |
| Mechanism | Upload an account export, get a report | Not stated on the first screen | broken | Hero and subhead | `quoted` |
| Audience | Someone who suspects waste in Google Ads | Anyone doing marketing | broken | Hero | `quoted` |
| Time frame | 15 minutes | Not stated | broken | Hero | `quoted` |
| Commitment | A report | A free trial | broken | Primary CTA | `quoted` |
| Proof | Implied: waste found | "This saves us time" | partial | Below hero | `quoted` |

## Findings

| Finding | Evidence | Tag | Consequence |
|---|---|---|---|
| The first mismatch is the hero headline, above everything else | Ad promises a diagnostic outcome, hero names a product category | `quoted` | A visitor with audit intent cannot confirm they are in the right place, which is consistent with 74% bounce |
| The page never states the mechanism the ad sold | "Upload your account export" appears in the ad and nowhere on the first screen | `quoted` | The visitor cannot tell what they would have to do |
| The CTA asks for more than the click was sold on | Report in the ad, free trial on the page | `quoted` | A trial is a heavier commitment than a diagnostic, on traffic that asked for a diagnostic |
| Proof does not answer the doubt the ad created | Testimonial mentions time, not wasted spend or audit output | `quoted` | Proof is present and not doing work here |
| 23 conversions from 2100 clicks is 1.10% | Supplied counts | `counted` | Establishes there is something to fix, not what |

## Which side is wrong

The page. The ad is specific, matches the query cluster, and promises something
a searcher for "google ads audit" wants. The page is written for a different
visitor. `assumed`, on one input: that the campaign is performing acceptably on
click-through, which was not supplied.

## Smallest fix

Put the ad's promise in the hero verbatim, and state the mechanism in the subhead.
One headline and one subhead, before anything else on the page is touched.

| Element | Current | Suggested |
|---|---|---|
| Hero | AI Marketing Operating System | Find wasted Google Ads spend in 15 minutes |
| Subhead | Manage campaigns, reports and insights in one place. | Upload your account export and get a ranked list of budget leaks, match-type issues and tracking gaps. |
| Primary CTA | Start free trial | Get the waste report |

## What this audit refuses to conclude

- **That message match is the cause of the 1.10% rate.** Six broken elements
  make it the leading hypothesis, and 74% bounce is consistent with it, but no
  scroll data was supplied and a tracking defect would look identical. `hypothesis`
- **Anything about lead quality.** Sales has not fed back, so whether the traffic
  itself is wrong is unknown, and that is a targeting question rather than a page
  one. `unknown`
- **That the suggested hero will convert better.** It restores continuity from
  click to page, which is the defect found. The lift is a hypothesis to measure.
- **Whether other ads break differently.** One ad group was supplied. With
  several, this audit runs per ad, because an aggregate hides a page that matches
  one ad and breaks three.

## Decision

Fix the page, starting with the hero and subhead. Do not rewrite the ad: it is
the specific half of the pair.

## Missing data

- Scroll depth, which would separate "left before reading" from "read and left"
- Lead quality feedback from sales
- Whether other ad groups point at this page
- Confirmation that conversion tracking fires on this page at all
