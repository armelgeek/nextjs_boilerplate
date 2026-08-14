# Sample output: Landing Page AB Test Readout

Data is fictional. This is a shape reference for the expected output, including
what the skill declines to conclude.

Every row carries an evidence tag from `references/output-standard.md`.

## Input supplied by the user

> Variant A: generic product hero. Variant B: message-match hero for paid search.
> 14 days. Primary metric: demo form completion.
>
> A: 4212 sessions, 131 completions. B: 4208 sessions, 160 completions.
> Desktop CVR: A 3.9%, B 5.1%. Mobile CVR: A 2.4%, B 2.5%. I do not have sessions
> per device to hand.
> CRM: 31 qualified demos from A, 39 from B.
>
> Looks like B wins. Can we ship it?

## Helper run

```bash
python3 significance.py --a 4212 131 --b 4208 160 --runtime-days 14
```

## Significance

| Variant | Visitors | Conversions | Rate | 95% interval |
|---|---|---|---|---|
| A | 4212 | 131 | 3.11% | 2.63% to 3.68% |
| B | 4208 | 160 | 3.80% | 3.27% to 4.42% |

- Absolute difference: +0.69pp `measured`
- 95% interval on the difference: -0.09pp to +1.47pp `measured`
- z = 1.738, two-sided p = 0.0821 at alpha 0.05 `measured`
- Statistically significant: no `measured`
- The interval contains zero, so the direction of the effect is not established.
- Visitors per arm needed to detect a difference this size at 80% power: 10934. You have 4208, a shortfall of 6726 per arm. `counted`
- Smallest difference detectable at the current sample size: 1.06pp `counted`

## Refusal gates

| Gate | Status |
|---|---|
| 100+ conversions in A | pass (131) |
| 100+ conversions in B | pass (160) |
| At least one full business cycle | pass (14 days) |
| Same conversion definition in both arms | unknown, not stated |
| Stop decision made before looking at the numbers | unknown, not stated |

Both numeric gates pass, which matters: this result is not being dismissed on a
technicality about sample size or runtime. It fails on the arithmetic itself.

## Findings

| Finding | Evidence | Tag | What it supports |
|---|---|---|---|
| The observed +0.69pp difference sits inside the range noise produces at this sample size | p = 0.0821, interval -0.09pp to +1.47pp | `measured` | No winner can be named |
| The test has roughly 38% of the sample it would need to decide | 4208 of 10934 per arm | `counted` | Run longer, or decide without evidence and say so |
| The device split cannot be assessed | Rates quoted with no sessions per device | `unknown` | Dropped from the readout rather than reported at medium confidence |
| Lead quality direction is unmeasured | 31 versus 39 qualified demos, no denominators, no definition of qualified | `unknown` | Cannot support "lead quality did not drop" |
| Whether both arms measured the same event | Not stated by the user | `unknown` | Would invalidate the comparison outright if they differed |

## Decision

**Inconclusive on the primary metric.** 131 versus 160 completions on roughly
4210 sessions per arm is inside the range that noise produces: p = 0.0821 against
an alpha of 0.05, with the interval on the difference crossing zero.

Shipping Variant B anyway is a legitimate business decision. The message-match
hero is defensible on reasoning, the point estimate is positive, and waiting for
6726 more sessions per arm carries its own cost. If it ships, the sentence that
goes into the record is:

> Shipped B on judgement. No evidence of a lift; p = 0.0821 over 14 days.

Not "validated a 22% lift". That distinction is the whole point of this readout.

## What this readout refuses to do

- Name a winner. The arithmetic does not support one.
- Report the device split as a finding. Without sessions per device those two
  rates are decoration.
- Turn 31 versus 39 qualified demos into a claim about lead quality.
- Recommend a budget increase on the strength of this result.

## Missing data

- Sessions per device, which would make the device split assessable
- The definition of a qualified demo, and the denominators behind 31 and 39
- Whether the stop decision was made before or after looking at the numbers
- Confirmation that both arms fired the same conversion event
