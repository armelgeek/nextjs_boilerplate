---
name: cost
description: "Token cost analysis — track spending by task/domain"
---

# /cost — Token Cost Analysis

Track AI token spending and ROI by task, domain, or session.

## Usage

```
/cost                   # This session
/cost --all             # All sessions
/cost --domain auth     # Auth domain spending
/cost --by-task         # Per-task breakdown
```

## Output

```
Session Cost Analysis:

Total: 28,500 tokens (~$0.24 USD)

By Task:
  Task 1 (schema):      4,200 tokens
  Task 2 (service):     8,100 tokens (complex)
  Task 3 (UI):          6,200 tokens
  Task 4 (test):        5,000 tokens
  Task 5 (review):      5,000 tokens

By Domain:
  database: 12,300 tokens (43%)
  api:       8,100 tokens (28%)
  ui:        6,200 tokens (22%)
  infra:     1,900 tokens (7%)

ROI:
  First feature (auth):     30K tokens
  Second feature (auth):    15K tokens (50% savings)
  Third feature (auth):      8K tokens (75% savings)
  Learning curve complete.
```

## Cost Trends

```
/cost --trends
→ Shows token spending over time
→ Detects: is cost increasing? decreasing?
→ Suggests: if high, what's causing it?
```

## Budget Tracking

```
/cost --budget 100k
→ Set monthly budget
→ Track remaining
→ Alert if approaching limit
```

