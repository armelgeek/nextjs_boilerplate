---
name: setup
description: "Setup Mooz workflow: Enable GitHub Discussions, Wiki, configure tokens"
---

# /setup — Initialize Mooz Workflow

One-command setup for GitHub-native workflow.

## What it does

1. ✅ Enables GitHub Discussions
2. ✅ Creates Discussion categories
3. ✅ Enables GitHub Wiki
4. ✅ Generates/configures GitHub token
5. ✅ Updates integrations.env

## Usage

```bash
/setup
```

Or manually:

```bash
cd drift/.claude
bash setup-github.sh
```

## Requirements

- GitHub CLI (`gh`) installed
- Write access to your repo
- ~5 minutes

## After Setup

Test it:

```bash
source .claude/integrations.env
/standup
```

Should post to GitHub Discussions! 🎉

---

## What's enabled

```
✅ GitHub Discussions    → Standups, PRDs, Postmortems
✅ GitHub Wiki          → Documentation
✅ GitHub Issues        → Task tracking
✅ GitHub Projects      → Kanban board
```

No Slack. No Notion. Just GitHub.
