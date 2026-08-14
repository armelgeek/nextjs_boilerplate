# Database

Prisma ORM setup and database connection management.

## Files

- **db.ts** - Database initialization and export (re-export from prisma.ts)
- **prisma.ts** - Prisma client singleton with proper connection handling

## Features

- Prisma ORM integration
- PostgreSQL adapter (@prisma/adapter-pg)
- Singleton pattern to prevent multiple client instances
- Development hot-reload support

## Usage

```typescript
import { db } from '@/lib/db'

// Query
const users = await db.user.findMany()
const user = await db.user.findUnique({ where: { id: '123' } })

// Create
await db.user.create({ data: { email, name } })

// Update
await db.user.update({ 
  where: { id: '123' }, 
  data: { name: 'Updated' } 
})

// Delete
await db.user.delete({ where: { id: '123' } })
```

## Schema

Database schema is defined in `prisma/schema.prisma`. Run migrations with:
```bash
npx prisma migrate dev --name migration_name
npx prisma generate  # Generate types
```
