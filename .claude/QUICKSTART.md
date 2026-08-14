# Mooz Brain Quick Start

Get up and running in 5 minutes.

## 1. Initialize Brain (1 min)

```bash
# From repo root
sh .claude/init-brain.sh

# Output:
# ✅ Brain initialization complete!
# Tables created: decisions, learnings, hot_files, model_performance, tasks, seeds, conventions
```

Done. Brain.db is ready.

## 2. Your First Feature (3 min)

```bash
/ship feature "add dark mode"
```

System will:
1. **Clarify** — Ask 2-3 domain questions
2. **Scout** — Find all relevant files
3. **Architect** — Create task list
4. **Build** — Implement task by task
5. **Review** — Auto-review code
6. **Ship** — Suggest deployment

You approve at key points. That's it.

## 3. Check Brain Status (1 min)

```bash
/drift:status
```

Shows:
- Decisions locked (won't ask twice)
- Learnings discovered
- Files that changed together
- Model performance (which agent works best)

## Key Commands

```bash
/ship feature "description"      # New feature (full pipeline)
/ship bug "bug description"      # Quick bug fix
/tasks                           # List pending/done
/resume                          # Continue interrupted work
/drift-guide                     # Validate current commit
/drift:status                    # See what brain learned
/brain-search decisions          # Find past decisions
/cost                            # Token spending by domain
```

## How It Works

**Auto-routing** — You describe what you want, system picks the right workflow.

**No commands needed** — Just describe the feature/bug, brain handles the rest.

**Learns every session** — Next feature is faster (brain remembers patterns).

**Coherent & traceable** — Every decision, task, commit, and learning linked together.

## Example Session

```
You: /ship feature "add Stripe payments"

System: 
  1. Clarifies: "Subscription or one-time? Annual discount?"
     You: "Subscription with annual"
     → Decision locked (won't ask again)

  2. Scouts: "Found 8 files related to payments"

  3. Architects: "4 tasks: schema → webhook → API → UI"

  4. Builds: Task 1/4 - Add schema
     (drift-guide validates after each commit)
     Task 2/4 - Webhook validator
     Task 3/4 - Payment API
     Task 4/4 - Payment UI

  5. Reviews: "Found 0 bugs, 1 security note (fixed)"

  6. Ships: "Deploy to staging? (yes/no)"
     You: "yes"

System learns:
  - Stripe needs exponential backoff on retries
  - Payment schema pattern
  - Idempotency key requirement
```

Next Stripe feature: **70% faster** (brain remembers).

## Troubleshooting

**brain.db not created**
```bash
rm .drift-brain.db  # if exists
sh .claude/init-brain.sh
```

**"Command not found: /ship"**
Make sure you're in a Claude Code session, not regular terminal.

**Want to reset and start fresh**
```bash
pnpm drift:reset-brain  # (alias to remove + reinit)
```

## That's It

You're ready. Start with:

```bash
/ship feature "what you want to build"
```

Brain does the rest. 🚀

