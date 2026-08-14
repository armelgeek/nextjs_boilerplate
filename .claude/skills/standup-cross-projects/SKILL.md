# Standup Cross-Projects

Weekly review: see the state of all your projects at a glance. WIP, blockers, what's next.

## Usage

```bash
/standup
```

Returns a summary of all projects' STATUS.md files:
- What's in progress (WIP limit check)
- Blockers across all projects
- Next priorities by project
- Revenue/metrics if live
- Context for context-switching

## Output

```
📊 Cross-Project Standup — 2026-08-06

MOOZ ✅
├─ In Progress: Team collaboration MVP (50%)
├─ Blocker: None
├─ Next: Finish team collab, audit onboarding
└─ Metrics: $2.4k MRR, 2% churn 🚨

Vola 🔨
├─ In Progress: Analytics dashboard (80%)
├─ Blocker: Waiting on Stripe chart library decision
├─ Next: Finish dashboard, add real-time sync
└─ Metrics: Pre-launch

Visumode ⏸
├─ In Progress: None (paused)
├─ Blocker: None
├─ Next: Decide on design system approach
└─ Metrics: Exploring market fit

[...]

Rotation Reminder:
- MOOZ: Last worked 2 days ago (Thu) → schedule next Mon/Wed
- Vola: Last worked today (Fri) → good cadence
- Visumode: Last worked 2 weeks ago → maybe deprioritize?

WIP Status:
✅ All projects have WIP ≤ 1
✅ No critical blockers
⚠️ Visumode stale (2 weeks) — either revive or archive
```

## Rules

- Scan all project STATUS.md files
- Flag WIP > 1 (finish before starting new feature)
- Highlight blockers (need unblocking?)
- Show metrics if project is live
- Suggest rotation based on last worked date
- If STATUS.md is stale (>1 week), flag it
