# Database Migrations Strategy

## Overview

All Mooz projects (including CV Optimizer, MOOZ, etc.) now have automatic migration support for both **local PostgreSQL** and **Neon**.

## How It Works

### Local PostgreSQL
```bash
npm run db:push
```
Standard drizzle-kit workflow: generate → push to DB.

### PostgreSQL (Recommended)
```bash
npm run db:push
```
**Automatic fallback strategy:**
1. Try drizzle-kit push (60s timeout)
2. If timeout → automatically apply migrations via `psql`

Why the fallback? Neon's serverless WebSocket driver can hang during schema introspection. The fallback uses the direct PostgreSQL endpoint instead.

## Setup

### 1. Environment
```bash
# .env.local
DATABASE_URL=postgresql://user:pass@host/dbname?sslmode=require
```

#### For Neon:
Use the **direct endpoint** (recommended):
```
postgresql://user:pass@host.neon.tech/dbname?sslmode=require
```

**Not** the pooler endpoint (those timeout with drizzle-kit).

#### For Local:
```
postgresql://user:pass@localhost:5432/dbname
```

### 2. Migrate
```bash
# Generate migration file
npm run db:generate

# Push to database (local or Neon, works either way)
npm run db:push

# Verify
npm run db:studio
```

## What Changed

### drizzle.config.ts
- Auto-detects Neon URLs
- Sanitizes URL: removes `channel_binding` parameter, uses direct endpoint
- No special config needed per project

### db-push-safe.sh
- Wraps drizzle-kit with smart fallback
- 60s timeout for Neon (avoids hanging)
- Falls back to psql + manual SQL file execution

### package.json
```json
{
  "scripts": {
    "db:push": "bash db-push-safe.sh"
  }
}
```

## Troubleshooting

### Migrations stuck?
```bash
# Force timeout check (60s max)
cd packages/database
timeout 60 npm run db:push

# If that fails, apply manually
psql "$DATABASE_URL" < drizzle/XXXX_migration_name.sql
```

### "channel_binding" error?
The URL has `&channel_binding=require`. Remove it — the safe wrapper handles this automatically.

### "WebSocket" timeout warning?
Normal for Neon. The fallback applies migrations anyway via psql.

## For New Projects

When creating a new project with `create-app.sh`:
1. All packages inherit the safe wrapper
2. Just set `DATABASE_URL` in `.env.local`
3. Run `npm run db:push` — works everywhere

No manual SQL or psql commands needed in the common case.

## Architecture

```
npm run db:push
  ↓
db-push-safe.sh (local detection)
  ├─ LOCAL: drizzle-kit push ✓
  └─ NEON: timeout 60s drizzle-kit push
        ├─ Success ✓
        └─ Timeout → psql fallback ✓
```

All paths result in applied migrations.

---

**Last updated:** 2026-08-07
