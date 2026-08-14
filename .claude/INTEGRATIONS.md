# Mooz Integrations Guide

Configure Slack, Notion, or replace them with alternatives.

---

## 📢 Notifications (Standup, Alerts)

### Slack (Default)

**Setup:**
1. Go to [api.slack.com/apps](https://api.slack.com/apps) → **Create New App**
2. Choose **From scratch**
3. Name: "Mooz Bot", select workspace
4. Left menu → **Incoming Webhooks** → toggle ON
5. **Add New Webhook to Workspace** → choose channel
6. Copy webhook URL

**Config:**
```bash
# .claude/integrations.env
NOTIFICATION_SERVICE=slack
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T.../B.../xxx
```

**Test:**
```bash
source .claude/integrations.env
curl -X POST $SLACK_WEBHOOK_URL -d '{"text":"Test from Mooz"}'
```

---

### Discord (Alternative)

**Setup:**
1. Right-click channel → **Edit channel**
2. **Integrations** → **Webhooks** → **Create Webhook**
3. Copy URL

**Config:**
```bash
NOTIFICATION_SERVICE=discord
DISCORD_WEBHOOK_URL=https://discordapp.com/api/webhooks/...
```

---

### Teams (Enterprise)

**Setup:**
1. Teams channel → **...** → **Connectors**
2. **Configure** → **Incoming Webhooks**
3. Name: "Mooz Bot"
4. Copy webhook URL

**Config:**
```bash
NOTIFICATION_SERVICE=teams
TEAMS_WEBHOOK_URL=https://outlook.webhook.office.com/webhookb2/...
```

---

### Email

**Setup:**
```bash
NOTIFICATION_SERVICE=email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_TO=team@example.com
```

For Gmail: Use [App Passwords](https://myaccount.google.com/apppasswords)

---

### GitHub Discussions (Everything in GitHub)

**Setup:**
```bash
NOTIFICATION_SERVICE=github
GITHUB_REPO=yourusername/yourrepo
GITHUB_TOKEN=ghp_...
```

Standups post as discussions instead of external services.

---

## 📚 Knowledge Base (PRDs, Docs)

### Notion (Default)

**Setup:**
1. [notion.so/my-integrations](https://www.notion.so/my-integrations) → Create integration
2. Copy token
3. Create a Notion database (template: Properties = Title, Status, Date)
4. Click **...** → **Connections** → add your integration
5. Copy database ID from URL

**Config:**
```bash
DOCS_SERVICE=notion
NOTION_TOKEN=secret_...
NOTION_DATABASE_ID=abc123...
```

---

### Confluence (Enterprise)

**Setup:**
1. [atlassian.com](https://id.atlassian.com/manage-profile/security/api-tokens) → Create API Token
2. Go to [company.atlassian.net/admin/spaces](https://company.atlassian.net/admin/spaces)
3. Create space, copy space key (e.g., "DRIFT")

**Config:**
```bash
DOCS_SERVICE=confluence
CONFLUENCE_URL=https://company.atlassian.net
CONFLUENCE_USERNAME=your-email@company.com
CONFLUENCE_API_TOKEN=abc123...
CONFLUENCE_SPACE_KEY=DRIFT
```

---

### GitHub Wiki (Version Control)

**Setup:**
1. Enable Wiki in repo settings
2. Clone wiki: `git clone https://github.com/username/repo.wiki.git`
3. Add `.gitignore` to wiki repo

**Config:**
```bash
DOCS_SERVICE=github_wiki
GITHUB_REPO=username/repo
GITHUB_TOKEN=ghp_...
```

PRDs automatically pushed to wiki, versioned with git.

---

### Local Markdown (Self-Hosted)

**Setup:**
```bash
mkdir -p docs/prds docs/epics
# Your PRDs and epics go here
```

**Config:**
```bash
DOCS_SERVICE=local
DOCS_PATH=./docs
```

Perfect for keeping everything in git without external services.

---

### Obsidian (Personal Knowledge Base)

**Setup:**
1. Open Obsidian
2. Create vault (or use existing)
3. Create folder: `Obsidian Vault/Mooz/PRDs`

**Config:**
```bash
DOCS_SERVICE=obsidian
OBSIDIAN_VAULT_PATH=/Users/username/Obsidian/MyVault
```

---

## 🎯 Issue Tracking

GitHub Issues is built-in. But you can also use Linear:

### Linear (Alternative)

**Setup:**
1. [linear.app](https://linear.app) → Settings → API → Create key
2. Create team
3. Copy team ID from URL

**Config:**
```bash
ISSUE_SERVICE=linear
LINEAR_API_KEY=lin_api_...
LINEAR_TEAM_ID=team_...
```

---

## 📊 Metrics & Analytics

### PostHog (Built-in)

PostHog tracks:
- Features shipped per day
- Bug fix time
- Test coverage
- Deployment frequency

**Setup:**
1. [posthog.com](https://posthog.com) → Sign up
2. Create project
3. Copy API key

**Config:**
```bash
POSTHOG_API_KEY=phc_...
POSTHOG_PROJECT_ID=your-project
```

---

## 🔄 Example: Swap Slack → Discord

1. Edit `.claude/integrations.env`:

```bash
# NOTIFICATION_SERVICE=slack
# SLACK_WEBHOOK_URL=...

NOTIFICATION_SERVICE=discord
DISCORD_WEBHOOK_URL=https://discordapp.com/api/webhooks/123/abc
```

2. Next `/standup` posts to Discord instead

---

## 🔄 Example: Swap Notion → GitHub Wiki

1. Create GitHub wiki for your repo
2. Edit `.claude/integrations.env`:

```bash
# DOCS_SERVICE=notion
# NOTION_TOKEN=...

DOCS_SERVICE=github_wiki
GITHUB_REPO=yourusername/yourrepo
GITHUB_TOKEN=ghp_...
```

3. Next `/ship` creates PRD in wiki instead

---

## 🔄 Example: Everything Local (Git Only)

```bash
# .claude/integrations.env

# Don't post standups anywhere
NOTIFICATION_SERVICE=none

# Store PRDs in /docs folder
DOCS_SERVICE=local
DOCS_PATH=./docs

# Use GitHub Issues
ISSUE_SERVICE=github
GITHUB_TOKEN=ghp_...
```

Everything stays in git, version controlled.

---

## Best Practices

### Multi-Service Setup

Combine for best of both:

```bash
# Notify on Slack + store in GitHub Wiki
NOTIFICATION_SERVICE=slack
DOCS_SERVICE=github_wiki
```

### Enterprise

```bash
NOTIFICATION_SERVICE=teams
DOCS_SERVICE=confluence
ISSUE_SERVICE=linear
```

### Solo/Indie Hacker

```bash
NOTIFICATION_SERVICE=none  # Just git commits
DOCS_SERVICE=local         # PRDs in /docs
ISSUE_SERVICE=github       # GitHub Issues
```

---

## Testing Your Config

```bash
source .claude/integrations.env

# Test notification
/standup

# Test docs (creates a PRD)
/ship-feature "test feature"

# Check GitHub Issues were created
gh issue list
```

If any fail, check:
- API keys are valid
- Webhooks are active
- Tokens have right permissions
- Network connectivity
