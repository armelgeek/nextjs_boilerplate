# Sample output: Accessibility Conversion Blocker Check

Shows the expected depth, and how the measured helper output sits inside the
judgement rather than replacing it.

## Input supplied by the user

> Buttons: #86FF1D background, white labels, 15px, weight 600.
> Body copy: #9C9C9C on #151516, 16px, weight 300.
> H1: #151516 on #FBF8F3, 40px, weight 700.
> Placeholder text: #cccccc on white, and placeholders are the only labels on all
> five form fields.
> Mobile submit button is 40px tall.
> Errors turn the field border red.

## Helper run

```bash
python3 contrast_check.py pairs.txt
```

## Contrast measurement (WCAG 2.1 AA)

| Element | Foreground on background | Size / weight | Ratio | Required | Status |
|---|---|---|---|---|---|
| Primary button | #ffffff on #86FF1D | 15px / 600 | 1.29:1 | 4.5:1 (normal text) | FAIL |
| Body copy | #9C9C9C on #151516 | 16px / 300 | 6.65:1 | 4.5:1 (normal text) | pass |
| H1 | #151516 on #FBF8F3 | 40px / 700 | 17.23:1 | 3.0:1 (large text or UI component) | pass |
| Placeholder | #cccccc on #ffffff | 16px / 400 | 1.61:1 | 4.5:1 (normal text) | FAIL |

Pairs measured: 4. Failing: 2. Worst pair: Primary button at 1.29:1 against
4.5:1.

## Ranked findings

| Element | Measured ratio | Requirement | Status | Commercial impact |
|---|---|---|---|---|
| Primary button label | 1.29:1 | 4.5:1 normal text | fail | Blocks conversion. This is the element the whole page exists to get clicked, and its label is close to invisible. Dark text on the lime fixes it without touching the brand colour. |
| Form placeholder text | 1.61:1 | 4.5:1 normal text | fail | Blocks conversion, and compounds the labelling defect below. |
| Body copy | 6.65:1 | 4.5:1 normal text | pass | None. |
| H1 | 17.23:1 | 3.0:1 large text | pass | None. |

## Structure findings

| Check | Status | Evidence | Fix |
|---|---|---|---|
| Every field has a real label | fail, 5 of 5 | Placeholders are the only labels | Visible persistent label above each field. A placeholder disappears the moment someone types, which produces wrong entries as well as failing perception. |
| Tap target size | fail | Mobile submit 40px | Under both heuristics: 44 by 44 points (Apple) and 48 by 48 dp (Google). Cited: Apple's, as the page is being reviewed on iOS. |
| Target spacing | unknown | Not supplied | Ask for the gap between adjacent controls. Two correct-sized targets three pixels apart still produce mis-taps. |
| Errors perceivable without colour | fail | Red border only | Words next to the field saying what is wrong. A colour-only error is invisible to anyone not perceiving that colour, and ambiguous to everyone else. |

## Conversion blockers

1. Primary button label at 1.29:1.
2. Five fields with no persistent label.
3. Colour-only error states.
4. Submit target below both size heuristics on mobile.

**Decision:** fix before ship. All four are cheap, and the first one sits on the
single element the page is built around.

**Out of scope:** any conformance verdict or conformance level, and any statement
about legal exposure. This is a defect list, not an audit.

**Missing data:** spacing between adjacent tap targets, and whether any text sits
over an image anywhere on the page. Both could add findings; neither changes the
four above.
