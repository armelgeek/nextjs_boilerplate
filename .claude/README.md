# Mooz Claude Code Setup

Complete automation for building Mooz with Claude Code.

## What's Included

### 📋 Skills (Located in `.claude/skills/`)

| Skill | Purpose |
|-------|---------|
| `drift-ccpm` | Spec-driven project management (PRD → Epic → Issues) |
| `drift-strategy` | Business model & GTM strategy |
| `drift-nextjs-ui` | Build React components & Next.js pages |
| `drift-design` | UI/UX design guidance |
| `drift-readiness` | Code quality & readiness audit |
| `drift-rca` | Root cause analysis for bugs |

### 🔧 Integrations

**Default: GitHub-Native**
- Standups → GitHub Discussions
- PRDs → GitHub Wiki
- Issues → GitHub Issues
- Everything version-controlled, searchable, traceable

**Setup:**
```bash
.claude/setup-github.sh
```

### ⚙️ Custom Commands

| Command | What it does |
|---------|------------|
| `/ship` | Full pipeline: strategy → PRD → epic → code → deploy |
| `/ship-feature` | Fast feature: PRD → code → deploy |
| `/ship-bug` | Bug fix: RCA → fix → test → deploy |
| `/postmortem` | Incident: RCA → postmortem → fix |
| `/standup` | Daily status: done ✅ / in progress 🔨 / blocked 🚧 |
| `/setup` | Initialize GitHub Discussions + Wiki |

### 📁 Configuration Files

```
.claude/
├── CLAUDE.md                    ← This project's AI instructions
├── WORKFLOW.md                  ← How to use Mooz workflows
├── GITHUB-NATIVE.md             ← GitHub-only setup guide
├── INTEGRATIONS.md              ← Alternative service configs
├── integrations.env             ← Service tokens & config
├── setup-github.sh              ← Automated setup script
├── README.md                    ← This file
│
├── commands/
│   ├── ship.md                  ← Full delivery workflow
│   ├── ship-feature.md          ← Feature shipping
│   ├── ship-bug.md              ← Bug fixes
│   ├── postmortem.md            ← Incident response
│   ├── standup.md               ← Daily standup
│   └── setup.md                 ← Setup helper
│
└── skills/
    ├── drift-ccpm/              ← Project management
    ├── drift-strategy/          ← Business strategy
    ├── drift-nextjs-ui/         ← Frontend building
    ├── drift-design/            ← Design system
    ├── drift-readiness/         ← Code audit
    ├── drift-rca/               ← Bug investigation
    └── [others...]
```

---

## 🚀 Quick Start (5 minutes)

### 1. Enable GitHub Discussions & Wiki

```bash
.claude/setup-github.sh
```

Or manually:
- Repo settings → Features → ✅ Discussions + Wiki
- Create discussion categories: Standups, PRDs, Postmortems, Decisions

### 2. Generate GitHub Token

```bash
# https://github.com/settings/tokens
# Scopes: repo, discussions, workflow
# Copy token
```

### 3. Test It

```bash
/ship-feature "test feature"
```

Should create:
- ✅ PRD in GitHub Wiki
- ✅ Issue #N in GitHub
- ✅ Standup in GitHub Discussions

---

## 📊 Workflow Examples

### Ship a Feature (3 days)

```
Day 1:
  /ship-feature "dark mode"
  → PRD created, epic + issues opened, standup posted

Day 2:
  /standup
  → Shows progress: 1 issue closed, 2 in progress

Day 3:
  /ship-feature completes when merged
  → Issue auto-closed, feature live
```

### Fix a Bug (2 hours)

```
Now:
  /ship-bug "users can't login"
  → RCA run, root cause identified, PR opened

30 min:
  → Fix merged, issue closed

Standup shows:
  ✅ Bug fix shipped
```

### Production Incident (4 hours)

```
14:00 - Incident happens
  /postmortem "API down"
  → Hotfix deployed in 30 min

15:00 - Root cause analysis
  → Found: N+1 query in user listing

16:00 - Permanent fix
  → PR with test + monitoring

17:00 - Postmortem written
  → Timeline, learnings, action items posted
```

### Daily Standup (5 minutes)

```
/standup
→ Posts to GitHub Discussions:
  ✅ Yesterday: Closed issue #42, #43
  🔨 Today: Working on #44, #45
  🚧 Blocked: Waiting on design feedback (#46)
```

---

## 🔄 Integrations

### GitHub-Native (Default) ⭐

Everything in GitHub. No external services.

```bash
NOTIFICATION_SERVICE=github
DOCS_SERVICE=github_wiki
ISSUE_SERVICE=github
```

### With Slack

GitHub Discussions + Slack notifications:

```bash
NOTIFICATION_SERVICE=slack
SLACK_WEBHOOK_URL=...
DOCS_SERVICE=github_wiki
ISSUE_SERVICE=github
```

### Full Config

See `.claude/integrations.env` for all options:
- Slack, Discord, Teams, Email
- Notion, Confluence, Obsidian
- Linear (alternative to GitHub Issues)

---

## 📚 Documentation

| File | Purpose |
|------|---------|
| `CLAUDE.md` | Project context for Claude |
| `WORKFLOW.md` | How to use drift commands |
| `GITHUB-NATIVE.md` | GitHub-only workflow guide |
| `INTEGRATIONS.md` | Setup alternative services |

---

## 🔧 Configuration

### .claude/integrations.env

Your service tokens and config. **Add to .gitignore!**

```bash
# GitHub (required)
GITHUB_REPO=yourusername/yourrepo
GITHUB_TOKEN=ghp_xxxxx

# Optional
SLACK_WEBHOOK_URL=...
NOTION_TOKEN=...
POSTHOG_API_KEY=...
```

### Git Ignore

Make sure `.gitignore` includes:

```
.claude/integrations.env
.claude/.env.local
.env*
```

---

## 🎯 Best Practices

### Always start with a spec

```bash
/ship-feature "feature name"
# → PRD created before any code
```

### Use GitHub Issues as source of truth

Once created, reference issues in PRs:
```
Fix #42 - Add dark mode toggle
```

### Standup every day

```bash
/standup  # 5 min, captures your progress
```

### RCA on production issues

```bash
/postmortem "what happened"  # Capture context while fresh
```

---

## 🆘 Troubleshooting

### `/standup` not posting to Discussions

- Check: `source .claude/integrations.env`
- Verify: `echo $GITHUB_TOKEN` (should show token)
- Check: Discussions enabled in repo settings

### PRDs not saving to Wiki

- Verify: Wiki enabled in repo settings
- Check: `DOCS_SERVICE=github_wiki` in integrations.env
- Check: GitHub token has `repo` scope

### Commands not recognized

- Ensure `.claude/commands/` files exist
- Reload Claude Code if recently created
- Check file names match command names

---

## 🚀 Advanced

### Multiple Projects

Copy `.claude/` to each project, update `GITHUB_REPO` per project.

### Team Setup

Share the setup script:
```bash
cp .claude/setup-github.sh ../docs/
# Team runs it in their own repo
```

### Metrics Dashboard

Enable PostHog:
```bash
POSTHOG_API_KEY=phc_...
POSTHOG_PROJECT_ID=...
```

Then `/standup --verbose` shows metrics.

---

## 📖 Next Steps

1. **Setup:** `.claude/setup-github.sh`
2. **Read:** `.claude/WORKFLOW.md`
3. **Try:** `/ship-feature "your first feature"`
4. **Daily:** `/standup`

That's it! You're shipping with Claude now. 🎉

---

## 📞 Questions?

Check:
- `.claude/GITHUB-NATIVE.md` — GitHub setup details
- `.claude/INTEGRATIONS.md` — Service alternatives  
- `.claude/WORKFLOW.md` — How to use commands

Everything is documented. You've got this! 💪
