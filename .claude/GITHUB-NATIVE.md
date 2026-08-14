# GitHub-Native Workflow (Recommended)

Everything in GitHub: Issues, Discussions, Wiki, Projects.
No Slack. No Notion. Just git.

---

## Architecture

```
GitHub Repository
├── Issues             ← Epic breakdown (drift-ccpm)
├── Discussions        ← Standups + async updates
├── Wiki              ← PRDs + documentation
├── Projects          ← Kanban board
└── Actions           ← CI/CD + automation
```

---

## Setup (5 minutes)

### 1. Enable GitHub Discussions

```bash
# In your repo settings:
# Settings → Features → Enable Discussions
```

### 2. Create Discussion Categories

```
Standups (category)
PRDs (category)
Postmortems (category)
Decisions (category)
```

### 3. Configure Mooz

```bash
# .claude/integrations.env
NOTIFICATION_SERVICE=github
DOCS_SERVICE=github_wiki
ISSUE_SERVICE=github
GITHUB_REPO=yourusername/yourrepo
GITHUB_TOKEN=ghp_... (with repo + discussions scope)
```

### 4. Enable GitHub Wiki

```bash
# Repo settings → Features → Enable Wiki
```

---

## Workflows with GitHub

### /ship-feature "dark mode"

This does:
1. **PRD created** → Wiki page (version controlled)
2. **Epic + Issues created** → GitHub Issues
3. **Standup posted** → Discussions > Standups category
4. **Code pushed** → PRs linked to issues
5. **Merged** → Issue auto-closed

---

### /standup

Posts to **Discussions > Standups**:

```
✅ Done today
- Issue #42 Dark mode MVP
- Issue #44 Theme persistence

🔨 In progress
- Issue #45 Dark mode settings
- Issue #46 Export themes

🚧 Blocked
- Issue #47 (waiting on design feedback)

📊 Metrics
- Velocity: 3 issues/day
- Test coverage: 92%
```

And it's **threaded**, so team can reply + discuss.

---

### /postmortem "API down"

Creates discussion:

```
Category: Postmortems
Title: Incident: API timeout 2025-08-06 14:30

Timeline:
- 14:30 API responses >30s
- 14:35 Database connection pool exhausted
- 14:40 Hotfix deployed
- 14:45 Normal (monitoring shows green)

Root Cause:
N+1 query in user listing endpoint (issue #123)

Fix:
- Permanent fix deployed in PR #456
- Test added to prevent regression
- Database query optimized

Action items:
- [ ] Review all N+1 patterns (@alice, due 2025-08-08)
- [ ] Add query performance monitoring (@bob, due 2025-08-07)
- [ ] Update RCA postmortem template (@charlie, due 2025-08-09)
```

Team can:
- React with 👍 to acknowledge
- Reply with questions
- Link related issues
- Cross-reference in other discussions

---

### /ship-bug "users can't reset password"

1. **RCA discussion** created in Postmortems category
2. **Issue #789** created with details
3. **Branch + PR** linked to issue
4. **Test added** for regression
5. **Auto-closed** when merged

All discussion stays in GitHub.

---

## GitHub Project Board

Auto-populate from issues:

```
Backlog        | Ready      | In Progress | In Review | Done
Issue #42      | Issue #43  | Issue #44   | PR #456   | Issue #41
Issue #50      | Issue #51  |             | PR #457   | Issue #40
```

Drag-drop updates issues automatically.

---

## Key Advantages

✅ **Version controlled** — All PRDs in wiki with git history
✅ **No external services** — Everything on GitHub  
✅ **Searchable** — Full-text search across issues + discussions
✅ **Permissioned** — GitHub org permissions = project permissions
✅ **Threaded** — Discussions are better than Slack for async work
✅ **Linked** — Every issue → PR → commit → deploy traced
✅ **Mobile-friendly** — GitHub app has discussions

---

## Config for GitHub-Native

```bash
# .claude/integrations.env

# Post standups + postmortems to GitHub Discussions
NOTIFICATION_SERVICE=github
GITHUB_REPO=yourusername/yourrepo
GITHUB_TOKEN=ghp_xxxxx

# Store PRDs in GitHub Wiki
DOCS_SERVICE=github_wiki

# Track issues in GitHub
ISSUE_SERVICE=github

# No external services needed!
```

---

## Commands in GitHub-Native

All the same commands, but:
- Standups post to **Discussions**
- PRDs save to **Wiki**
- Issues created in **GitHub Issues**
- Links auto-created between everything

Example flow:

```bash
/ship-feature "notifications"
  ↓
📝 PRD created → wiki/notifications.md (versioned)
  ↓
🎯 Epic created → Issue #502 "Feature: Notifications"
  ↓
📋 Sub-issues created → #503, #504, #505, #506
  ↓
💬 Standup posted → Discussions/Standups thread
  ↓
💻 Code + PR linked → PR #200 closes #503
  ↓
✅ Merged → Issue auto-closed, Standup updated
```

Everything traceable, everything searchable.

---

## GitHub API Permissions

Generate token with:
- ✅ repo (full control)
- ✅ discussions (read/write)
- ✅ workflow (for GitHub Actions)

```bash
# Setup
gh auth login
# Choose GitHub.com
# Choose HTTPS
# Authenticate with browser
# Grant permissions
```

---

## Example: 1-Week Sprint with GitHub

**Monday 9am:**
```
/standup
```
→ "What did you do Friday?" + "What's today?" posted to Discussions

**Monday 10am:**
```
/ship-feature "export to PDF"
```
→ PRD created in wiki, epic + 4 issues created, linked

**Tuesday:**
```
/ship-bug "export button broken on mobile"
```
→ RCA + fix + issue closed

**Friday 4:30pm:**
```
/standup
```
→ Final standup shows:
```
✅ Done:
- Issue #502 Export to PDF (epic complete)
- Issue #789 Mobile export fix

📊 This week:
- 6 issues closed
- 8 commits
- 0 blockers
```

**Everything in GitHub. Zero external tools.**

---

## Next Steps

1. Enable Discussions in repo settings
2. Create categories (Standups, PRDs, Postmortems, Decisions)
3. Set config:
   ```bash
   NOTIFICATION_SERVICE=github
   DOCS_SERVICE=github_wiki
   ISSUE_SERVICE=github
   GITHUB_TOKEN=ghp_...
   ```
4. Try: `/standup`
5. Watch it post to GitHub Discussions

That's it. You're live! 🚀
