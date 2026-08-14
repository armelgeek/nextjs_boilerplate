---
name: standup
description: "Daily standup: what's done, in progress, blocked. Uses drift-ccpm to read project state."
---

# /standup — Daily Status Check

Get a quick view of project progress and blockers.

## Usage

```
/standup
/standup notification-system
/standup --verbose
```

## What it shows

✅ **Done today**
- Issues closed
- PRs merged
- Features shipped

🔨 **In progress**
- Active issues
- Who's working on what
- Dependency chains

🚧 **Blocked**
- Issues waiting on someone
- Missing decisions
- External dependencies

📊 **Metrics**
- Velocity this sprint
- Burndown
- Test coverage

---

## Connect to Slack

Add webhook to post standup daily at 9am:

```bash
export SLACK_WEBHOOK_URL="https://hooks.slack.com/services/..."
```

Then drift-ccpm posts automatically.
