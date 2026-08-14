# Sample output: Pricing Page Clarity Review

Shows the expected depth, including what the skill refuses to conclude.

## Input supplied by the user

> Paid search sends about 900 sessions a month to our pricing page. Scroll depth
> is fine, 71 percent reach the plan table. Trial starts from that page last
> month: 4.
>
> Copy: Starter 29. Growth 79. Scale 199. Enterprise, Contact us. Toggle for
> monthly and annual, annual says save 20 percent. Feature list under each plan.
> Footnote at the bottom: onboarding from 500, one off.
>
> We sell self-serve mostly, some bigger accounts talk to us first.

## Output

**Sales motion:** self-serve primary, sales-assisted for larger accounts, as
stated. Average deal size was not supplied, so anything below about the
appropriateness of the Enterprise tier is marked as an assumption.

| Finding | Page evidence | What the visitor cannot decide | Recommended change | Confidence |
|---|---|---|---|---|
| No seat or usage basis on any price | "Starter 29. Growth 79. Scale 199." | What they will actually pay. 29 per seat and 29 per account are different products. | Put the basis next to every number: per seat, per month, per account, per 1000 events. | High |
| Mandatory cost lives in a footnote | "onboarding from 500, one off" at the bottom | Whether the real entry price is 29 or 529. | Pull it into the table, and say which plans it applies to. If it applies to all of them, it is part of the price. | High |
| Starter and Growth are not differentiated | Feature lists supplied without a distinguishing line | Which of the two they are. | One sentence per plan naming who should pick it. If you cannot write it, the boundary is wrong, not the copy. | High |
| "from 500" is an open-ended number | Same footnote | The ceiling. "From" with no range reads as "we will decide when we see your budget". | State a range or the thing that determines it. | Medium |
| Four choices plus a billing toggle | Plan table as supplied | Which decision to make first. | Hypothesis only. Needs per-plan click data before touching the tier count. | Low |
| Annual discount stated without the annual number | "annual says save 20 percent" | What annual costs. A percentage is a puzzle, a price is an answer. | Show both prices, not the discount. | Medium |

**Decision:** fix now, in this order: price basis, onboarding fee position, plan
differentiation. Those three are blockers. The tier count is not on the list.

**Blockers:** price basis missing, mandatory cost hidden in a footnote,
undifferentiated adjacent plans. Each one independently stops a visitor from
choosing a plan.

**Polish, not blockers:** the discount presentation, the "from" range.

**What this does not conclude:** 71 percent reaching the table with 4 trial
starts is a decision problem rather than an attention problem, and that is as far
as the supplied data goes. It does not identify which plan people stall on,
because no per-plan interaction data was supplied. Pulling that first would
change the priority order below the top three.

**Out of scope:** whether 29, 79 and 199 are the right prices. This review is
about communicating the price that exists.

**Missing data:** per-plan clicks, average deal size, and whether the onboarding
fee applies to every plan or only to Scale and Enterprise. The last one changes
whether it is a blocker for all traffic or for a segment.
