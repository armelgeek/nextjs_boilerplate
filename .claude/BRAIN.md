# Mooz Brain — Getting Started

Mooz Brain is an SQLite knowledge graph that learns from your development sessions and helps you make better decisions faster.

## First Run

On your first `/ship-feature` or `/ship-bug`:
1. The brain.db is auto-created at `.drift-brain.db`
2. Decisions and learnings are recorded automatically
3. Subsequent runs query the brain for locked decisions (never ask same question twice)

## What Gets Stored

### Decisions
Locked Q&A pairs for important choices:
- **Domain**: ui, api, database, auth, infra, content
- **Confidence**: 0.0–1.0 (higher = more reliable)
- **Locked**: Once decided, never ask again

Example:
```
Q: "Store dark mode preference in localStorage or database?"
A: "Database (for per-user preference across devices)"
Domain: ui
Confidence: 0.95
Locked: true
```

### Learnings
Error→fix patterns discovered through work:
- **Pattern**: ID for the pattern (e.g., "drizzle-await-queries")
- **Problem**: What breaks
- **Solution**: What fixes it
- **Confidence**: Increases on reuse
- **Use count**: Auto-tracked

Example:
```
Pattern: "server-action-validation"
Problem: "Mutations skip validation, silent failures on duplicate emails"
Solution: "Always validate with Zod before DB write, throw custom error"
Confidence: 0.85
Use count: 3
```

### Hot Files
Most frequently co-changed files from git history:
- Helps identify related files that need parallel updates
- Prevents breaking changes to modules that always change together

## Workflow Integration

### During `/ship-feature`
1. **Clarify** (auto): Domain-specific questions (0–10, never repeated)
2. **Scout** (auto): Find all affected files
3. **Architect** (auto): Create precise task plan
4. **Build**: Execute tasks
5. **Scribe** (auto): Record decisions and learnings

### During `/ship-bug`
1. **Scout**: Find bug's root cause and all affected files
2. **Architect**: Plan fix tasks
3. **Build**: Implement and test
4. **Scribe**: Record bug pattern as learning

## Querying the Brain

### Search decisions
```
/brain-search decisions auth
/brain-search decisions database confidence:>0.8
/brain-search decisions locked
```

### Search learnings
```
/brain-search learnings database
/brain-search learnings confidence:>0.7
/brain-search learnings pattern:drizzle*
```

### View hot files
```
/brain-search hot-files limit:5
```

## Auto-Routing

Every prompt is intelligently routed based on your intent:
```
You: "add authentication"
→ Brain detects domain: auth
→ Auto-invokes: /drift-clarify → /drift-scout → /drift-architect → /ship-feature
→ Brain records decisions + learnings automatically
```

Bypass routing (if needed):
- Start with `/` (slash command)
- Start with `!` (explicit escape)
- End with `?` (question)
- Less than 4 chars (ack)

Disable auto-routing: `DRIFT_AUTO_ROUTING=off` environment variable

## Brain Files & Backups

```
.drift-brain.db          # Main database (git-ignored)
.brain-checkpoints/      # Automatic backups before context compact (git-ignored)
  brain-2026-08-09T*.db  # Timestamped checkpoints
```

Brain snapshots are automatically saved:
- Before session compaction (PreCompact hook)
- On major decisions
- Every 30 seconds (cache TTL)

## Troubleshooting

### Brain not creating on first run?
1. Check that `better-sqlite3` is installed: `pnpm list better-sqlite3`
2. Run `node .claude/brain-init.js` manually
3. Verify `.drift-brain.db` exists

### Brain queries return nothing?
1. Confirm you've run `/ship-feature` or `/ship-bug` (seeds the brain)
2. Check brain-search with `/brain-search --all`
3. Verify confidence filtering: `/brain-search learnings confidence:0.0` (shows all)

### Want to export/backup the brain?
```bash
cp .drift-brain.db .drift-brain-backup-$(date +%Y%m%d).db
sqlite3 .drift-brain.db ".dump" > brain-dump.sql
```

### Want to reset the brain?
```bash
rm .drift-brain.db
rm -rf .brain-checkpoints/
# Brain will be recreated on next /ship-feature
```

## Migration from Old Memory System

If you have prior decisions in `~/.claude/projects/*/memory/*.md`:
1. Run `/learn` to extract patterns → patterns.md
2. Review patterns (confirm they still apply)
3. Manually record key decisions: `/brain-search decisions --import patterns.md`
4. Delete old markdown files

## Performance

Brain queries are cached:
- **Decisions table**: <10ms (indexed by domain)
- **Learnings table**: <10ms (indexed by confidence)
- **Hot files**: <5ms (indexed by change count)
- **Brain snapshot**: Cached for 30 seconds

Total overhead per prompt: <1 second after initial load.

## Privacy & Storage

- Brain.db lives locally in `.drift-brain.db` (never uploaded)
- Checkpoints auto-purge after 10 backups (keep space usage under 50MB)
- Decision/learning records are project-specific (no cloud sync)
- Auto-excluded from git via `.claude/.gitignore`

## Next Steps

1. Run your first `/ship-feature` — brain will be created
2. Check `/brain-search decisions` to see what was recorded
3. Run a second feature in the same domain — notice the brain skips duplicate questions
4. Try `/brain-search learnings` to see discovered patterns

Enjoy smarter, faster development! 🧠

