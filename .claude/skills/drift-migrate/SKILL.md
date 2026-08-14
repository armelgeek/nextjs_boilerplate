---
name: drift-migrate
description: Database migration orchestration — generate, preview, apply, rollback
---

# Database Migrations

Safe database schema changes with preview, apply, and rollback.

## Usage

```
/drift-migrate "add users.email field"
/drift-migrate "create subscriptions table"
/drift-migrate "rename User model to Account"
/drift-migrate --status
/drift-migrate --rollback
```

## Workflow

```
/drift-migrate [description]
  ↓
[1] Parse requirement
    ├─ What schema change? (add column, create table, rename, etc.)
    ├─ Which table/model affected?
    └─ Data implications? (nullable, backfill needed?)
  ↓
[2] Generate migration
    ├─ Edit packages/database/src/schema.ts
    ├─ Run: npm run db:generate (creates migration file)
    └─ Output: migrations/[timestamp]_[description].sql
  ↓
[3] Preview changes
    ├─ Show generated SQL
    ├─ List affected tables/columns
    ├─ Check for breaking changes (DROP, RENAME)
    └─ Ask: "Ready to apply?"
  ↓
[4] Safety checks
    ├─ Check for data loss risks
    ├─ Verify 2-step deploy needed? (nullable → backfill → NOT NULL)
    ├─ Check Drizzle ORM compatibility
    └─ Flag if migration is large (>100MB data affected)
  ↓
[5] Apply migration
    ├─ Run: npm run db:push (applies to local DB)
    ├─ Verify: npm run db:studio (visual check)
    └─ Test queries still work
  ↓
[6] Verify downstream
    ├─ Check .ts files using affected tables
    ├─ Types still match schema? (run typecheck)
    ├─ Tests pass? (npm test)
    └─ No orphaned queries?
  ↓
[7] Ready for production
    ├─ Migration file committed
    ├─ Schema.ts updated
    ├─ Types updated
    └─ /wrap-up records migration
```

## Migration Types

### Add Column
```
/drift-migrate "add email to users"
→ Generates: ALTER TABLE users ADD COLUMN email VARCHAR(255)
→ If NOT NULL: requires default or backfill
→ 2-step if production data exists
```

### Create Table
```
/drift-migrate "create subscriptions table"
→ Generates: CREATE TABLE subscriptions (...)
→ Safe (new table, no data affected)
→ Auto-applies
```

### Rename Column
```
/drift-migrate "rename user.name to user.full_name"
→ High risk (breaks queries)
→ Must update ALL code referencing old name
→ /drift-scout finds all consumers
→ /drift-architect plans updates
```

### Drop Column
```
/drift-migrate "remove deprecated field"
→ Data loss (irreversible)
→ Asks: "Are you sure? (yes/no)"
→ Requires explicit confirmation
```

### Backfill Data
```
/drift-migrate "populate email for existing users"
→ Large operation (>10M rows)
→ Shows estimated time
→ Offers: background job vs inline
```

## Safety Checklist

Before applying migration:
- [ ] Schema change is necessary (not just cleanup)
- [ ] No data loss (unless intentional)
- [ ] 2-step deploy if needed (nullable → backfill → constraint)
- [ ] All code updated (typecheck passes)
- [ ] Tests updated (old/new schema covered)
- [ ] Rollback plan (what if production breaks?)

## Rollback

```
/drift-migrate --rollback
→ Reverts last migration
→ Restores schema.ts state
→ Re-generates schema
```

Only works if migration not yet deployed to production.

For production rollback: Manual intervention + Drizzle docs.

## Large Migrations

For >100MB table changes:

```
/drift-migrate --large "backfill 50M user rows"
→ Suggests background job
→ Stage 1: Add nullable column
→ Stage 2: Job backfills data over 1 hour
→ Stage 3: Add NOT NULL constraint
→ Avoids locking table during backfill
```

## Best Practices

1. **Small migrations** — One schema change per migration
2. **Test locally first** — Apply to local DB, verify
3. **Commit before** — Migration file committed before deploying
4. **Backfill large tables** — Use background job, not inline
5. **Review generated SQL** — Don't trust AI-generated DDL blindly
6. **2-step for constraints** — nullable → backfill → NOT NULL
7. **Coordinate with team** — Large migrations need notice

## Status & History

```
/drift-migrate --status
→ Shows:
  - Current schema version
  - Pending migrations (not applied)
  - Applied migrations (with timestamps)
  - Last migration timestamp
```

## Emergency Rollback

```
/drift-migrate --reset-local
→ Wipes local DB
→ Re-runs all migrations from start
→ Useful for testing rollback scenario
```

**WARNING**: This deletes all local data!

