---
name: disable
description: "Disable auto-routing — manual command mode"
---

# /disable — Disable Auto-Routing

Turn off automatic command routing. Back to manual mode.

## Usage

```
/disable                # Disable all auto features
/disable auto-routing   # Just auto-routing
```

After disable, use explicit commands:
```
/ship feature "add dark mode"
/drift-migrate "add column"
/drift-test
```

Useful for:
- Complex multi-step work (you want explicit control)
- Parallel tasks (auto-routing can't handle dependencies well)
- Learning (understand the workflow explicitly)

