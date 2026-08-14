---
name: enable
description: "Enable auto-routing — automatic skill invocation"
---

# /enable — Enable Auto-Routing

Turn on automatic command routing based on context.

## Usage

```
/enable                 # Enable all auto features
/enable auto-routing    # Just auto-routing
/enable --list          # Show which features are enabled
```

## Auto Features

- **auto-routing**: "add auth" → auto-invokes /ship feature
- **auto-test**: Save file → auto-run relevant tests
- **auto-check**: Before commit → auto-typecheck
- **auto-migrate**: Database change detected → auto-generate migration
- **auto-resume**: Checkpoint exists → auto-offer /resume
- **auto-scribe**: Task done → auto-invoke /drift-scribe

Once enabled, just describe what you want:
```
User: "add dark mode"
System: Clarify (asks q) → Scout (finds files) → Architect (plans) → Build
```

No need for explicit `/ship feature` commands.

