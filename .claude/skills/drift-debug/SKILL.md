---
name: drift-debug
description: Debug errors — trace logs, find root cause, suggest fix
---

# Debug

Find and fix errors in production or local.

## Usage

```
/drift-debug "users can't upload files"
/drift-debug --logs last-hour
/drift-debug --error "TypeError: Cannot read property"
```

## Workflow

1. **Describe issue**: "users can't upload files"

2. **Gather context**
   - When did it start?
   - Which users affected?
   - Error message (if any)?

3. **Search logs**
   -  logs
   - Browser console
   - Database logs

4. **Trace error**
   - Stack trace analysis
   - Find exact line that broke
   - Check recent commits that touched it

5. **RCA (Root Cause Analysis)**
   - Was it a recent deploy?
   - Did a dependency break?
   - Is it a data issue?
   - Is it external service down?

6. **Suggest fix**
   - Direct fix if obvious
   - Escalate to `/ship bug` if complex

## Log Analysis

```
/drift-debug --logs last-hour
→ Show error patterns
→ Count occurrences
→ Show affected users
→ Suggest most common cause
```

## Error Patterns

- **500 errors**: Server code break
- **timeout**: API slow or hanging
- **permission denied**: Auth issue
- **database connection**: DB down or exhausted
- **CORS**: Frontend calling wrong endpoint
- **type error**: TypeScript logic bug

## Quick Fixes

Some errors fixable immediately:
- Reset database connection pool
- Clear cache
- Restart function
- Rollback last commit

## Escalation

For complex bugs: `/ship bug "users can't upload"`

