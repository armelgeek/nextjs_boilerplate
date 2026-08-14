# Mooz Development Workflow

Automated orchestration of skills for fast, spec-driven development.

## Available Commands

### Main Workflows

| Command | Use case | Time |
|---------|----------|------|
| `/ship feature "name"` | Build a new feature | 1-3 days |
| `/ship-bug "issue"` | Fix a bug | 30 min - 2h |
| `/postmortem "incident"` | Production incident | 2-6h |
| `/standup` | Daily status check | 5 min |

### Full Pipeline

```
/ship "notification system"
```

This orchestrates:
1. **drift-strategy** — Define business goals
2. **drift-ccpm** — Write PRD + decompose into issues
3. **drift-nextjs-ui** — Build components
4. **drift-readiness** — Verify quality
5. **drift-ccpm** — Close issues + ship

### Fast Feature

```
/ship-feature "dark mode"
```

Skips strategy, goes straight to: PRD → Epic → Code → Deploy

### Bug Fix

```
/ship-bug "users can't login"
```

Sequence: RCA → Fix → Test → Deploy

### Incident Response

```
/postmortem "API crashed"
```

Sequence: RCA → Hotfix → Root cause → Permanent fix → Postmortem

### Daily Standup

```
/standup
```

Shows: Done ✅ | In progress 🔨 | Blocked 🚧

---

## Skill Map

**For Planning:**
- `drift-strategy` — Business model, ICP, GTM
- `drift-ccpm` — PRDs, epics, issues, standup

**For Building:**
- `drift-nextjs-ui` — React components + Next.js pages
- `drift-design` — Visual design decisions

**For Quality:**
- `drift-readiness` — Code audit, test coverage
- `drift-rca` — Root cause analysis for bugs

**For External Tools:**
- `idea-clarifier` — Product spec generator
- `startup-validator` — Validate assumptions
- `landing-pages-claude-skills` — Landing page variants

---

## Quick Tips

### 1. Always start with `/ship` or `/ship-feature`

Don't just start coding. Write a PRD first. It takes 10 min and saves 10 hours of rework.

### 2. Use GitHub Issues as your source of truth

Once you `/ship`, your epic + issues are in GitHub. Reference those.

### 3. Parallel work with worktrees

drift-ccpm creates Git worktrees for parallel agents. No merge conflicts.

### 4. Post standups to Slack

Set `SLACK_WEBHOOK_URL` for automatic daily standups at 9am.

### 5. RCA on production issues immediately

Don't wait. Use `/ship-bug` or `/postmortem` to capture context while it's fresh.

---

## Example: Shipping a Feature

**Day 1 morning:**
```
/ship-feature "add OAuth login"
```

Claude:
1. Asks clarifying questions (optional fields, SSO providers)
2. Writes PRD
3. Creates epic + 5 GitHub issues
4. Creates worktrees for parallel work

**Day 1 afternoon:**
```
/standup
```

Output:
```
✅ Done: OAuth provider setup, Stripe integration
🔨 In progress: Login form (Sarah), User profile migration (Bob)
🚧 Blocked: Waiting on legal review of privacy policy
```

**Day 2:**
```
/ship-bug "reset password link expires too fast"
```

Claude:
1. RCA finds: token TTL is 5 min instead of 30 min
2. Fixes it
3. Adds test
4. Closes the issue

**Day 2 EOD:**
```
/standup
```

Output:
```
✅ Done: All OAuth issues (5), Password reset bug (1)
🔨 In progress: Email notifications flow
🚧 Blocked: None
```

**Day 3:**
Feature merged, tested, deployed. New feature live.

---

## When Something Breaks

Production issue? Use `/postmortem`:

```
/postmortem "payments going to wrong account"
```

This does:
1. RCA with logs
2. Hotfix deployed in <30 min
3. Root cause investigation
4. Permanent fix
5. Postmortem doc with action items

---

## Metrics That Matter

After each command, drift-ccpm tracks:
- **Velocity** — Issues shipped per day
- **Quality** — Test coverage, type safety
- **Reliability** — Uptime, error rate
- **Process** — RCA quality, postmortem accuracy

View with `/standup --verbose`
