---
name: drift-status
description: Show Mooz Brain statistics, recent decisions, learnings, and performance
---

# Mooz Brain Status

Display comprehensive status of your Mooz Brain knowledge graph.

## Usage

```
/drift:status          # Full status report
/drift:status brief    # Quick summary
/drift:status decisions # Recent decisions only
/drift:status learnings # Recent learnings only
```

## Report Contents

### Brain Health
- **Database size**: KB used on disk
- **Tables**: Record counts per table
- **Last updated**: Most recent decision/learning
- **Cache status**: Hot cache hits, misses

### Recent Decisions (locked Q&A)
```
Domain: auth | Confidence: 0.95 | Locked: ✓
Q: "JWT refresh storage?"
A: "httpOnly cookie + refresh token in memory"
Recorded: 2026-08-09 14:30 | Reused: 3 times
```

### Recent Learnings (patterns)
```
Pattern: drizzle-await-queries
Problem: Queries not awaited cause undefined behavior
Solution: Always await db.query, wrap in try/catch
Domain: database | Confidence: 0.90 | Use count: 5
```

### Hot Files (co-changed)
```
apps/app/src/app/auth/page.tsx — 12 changes (auth domain)
packages/database/schema.ts — 8 changes (database domain)
packages/auth/session.ts — 7 changes (auth domain)
```

### Performance Metrics
```
Decisions queried this session: 0
Decisions applied (skipped questions): 0
Learnings applied: 0
Estimated tokens saved: 0 (baseline: first feature in each domain)

Model selection by domain:
  ui: haiku (100% success) → next: haiku
  database: sonnet (85% success) → next: sonnet
  api: sonnet (90% success) → next: sonnet
  auth: sonnet (95% success) → next: sonnet
```

### Timestamps
```
Brain created: 2026-08-09
Last decision recorded: 2026-08-09 14:30
Last learning recorded: 2026-08-09 14:25
Auto-checkpoint (pre-compact): none yet
```

## Flags

- `--init` — Initialize brain if not exists
- `--reset` — Delete and recreate brain (careful!)
- `--export [file]` — Export brain to SQL dump
- `--import [file]` — Import SQL dump to brain
- `--csv` — Output in CSV format (decisions/learnings)

## Examples

### Full report
```
/drift:status
```
Shows everything: health, recent decisions, learnings, hot files, perf metrics.

### Quick check
```
/drift:status brief
```
Just health stats + last decision + hot files.

### Export decisions for backup
```
/drift:status --export brain-backup-2026-08-09.sql
```
Creates SQL dump of all tables.

### Track progress across sessions
```
/drift:status --csv learnings
```
CSV of all learnings (import into Excel/Google Sheets for trending).

## What Each Metric Means

| Metric | Good | Warning | Action |
|--------|------|---------|--------|
| Decision confidence | 0.85+ | <0.6 | Re-evaluate or mark as experimental |
| Learning use count | 3+ | 0 (not used yet) | Maybe too specific, consider generalizing |
| Decision locked | Yes | No | This decision is still in flux, not ready to lock |
| Token savings | 30%+ vs first | <10% | Patterns may not be applicable enough |
| Cache hits | High | Low | Brain may not have relevant past data |

## Troubleshooting

**Brain not found?**
```
/drift:status --init
```
Initializes brain if it doesn't exist.

**Brain corrupted?**
```
/drift:status --reset
```
Deletes and recreates (loses all history).

**Decisions not being recorded?**
Run a `/ship-feature` or `/ship-bug` to populate brain.

## Post-Status Tips

After viewing status:
- **If decisions 0**: Run `/ship-feature` to seed brain
- **If learnings <3**: More features will auto-populate
- **If token savings low**: Brain is new, savings increase with time
- **If cache hits high**: Brain is well-calibrated for your workflow

Next command suggestions appear in status report footer.

$ARGUMENTS
