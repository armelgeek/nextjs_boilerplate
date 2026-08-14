# Claude Development Guide

Standard guide for developing with Claude following the project architecture.

**Mode**: Drift with auto-routing → Agents (Scout/Architect/Builder/Critic/Scribe) + Brain DB for persistence

## 🏗️ Project Architecture

### Folder Structure

```
src/
├── app/                    # Next.js routes and layouts
│   ├── (protected)/       # Auth-protected routes
│   ├── (admin)/          # Admin routes
│   ├── api/              # API routes
│   └── auth/             # Auth routes
├── actions/              # Server actions (DB + business logic)
├── components/           # UI components (Atomic Design)
│   ├── atoms/
│   ├── molecules/
│   ├── organisms/
│   ├── templates/
│   ├── ui/              # Shadcn/ui components
│   └── skeletons/       # Loading skeletons
├── lib/                 # Utilities and services
│   ├── auth*           # Authentication
│   ├── client.ts       # Unified API client
│   ├── database        # Prisma setup
│   ├── email           # Email service
│   ├── payments/       # Stripe integration
│   ├── schemas/        # Zod validations
│   ├── security/       # Rate limiting, audit
│   ├── webhooks/       # Webhook handlers
│   ├── utils/          # Helpers
│   └── README.md       # Module documentation
├── types/              # TypeScript types
└── scripts/            # Utility scripts
```

## 🔄 Feature Development Workflow

### 1️⃣ Create Type/Schema

```typescript
// types/feature.ts
import { z } from 'zod'

export const FeatureSchema = z.object({
  id: z.string().cuid(),
  title: z.string().min(1).max(255),
  // ... fields
  createdAt: z.date(),
  updatedAt: z.date()
})

export type Feature = z.infer<typeof FeatureSchema>
export const CreateFeatureSchema = FeatureSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
})
```

### 2️⃣ Update Prisma Schema

```typescript
// prisma/schema.prisma
model Feature {
  id        String   @id @default(cuid())
  title     String   @db.VarChar(255)
  // ... fields
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([title])
}
```

### 3️⃣ Generate & Apply Migration

```bash
npx prisma migrate dev --name add_features
```

### 4️⃣ Create Server Action

```typescript
// actions/features/create-feature.ts
'use server'

import { db } from '@/lib/db'
import { CreateFeatureSchema } from '@/types/feature'
import { auth } from '@/lib/auth'

export async function createFeature(data: unknown) {
  try {
    const validated = CreateFeatureSchema.parse(data)
    const session = await auth.getSession()
    
    if (!session) {
      return { success: false, error: 'Unauthorized' }
    }

    const feature = await db.feature.create({
      data: { ...validated, authorId: session.user.id }
    })

    return { success: true, data: feature }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create'
    }
  }
}
```

### 5️⃣ Create CRUD Adapter

```typescript
// actions/features/list-features-crud.ts
'use server'

import { db } from '@/lib/db'

export interface CrudListParams {
  page?: number
  limit?: number
  search?: string
  filter?: Record<string, any>
  sort?: string
}

export interface CrudListResponse {
  data: any[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export async function listFeaturesCrud(params: CrudListParams): Promise<CrudListResponse> {
  const { page = 1, limit = 10, search = '', filter = {} } = params
  const skip = (page - 1) * limit

  const where: any = { ...filter }
  if (search) {
    where.OR = [{ title: { contains: search, mode: 'insensitive' } }]
  }

  const [data, total] = await Promise.all([
    db.feature.findMany({ where, skip, take: limit }),
    db.feature.count({ where })
  ])

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) }
}
```

### 6️⃣ Create UI Component

```typescript
// components/molecules/forms/feature-form.tsx
'use client'

import { useState } from 'react'
import { api } from '@/lib/client'
import { toast } from 'sonner'

export function FeatureForm({ initialData, onSuccess }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({ title: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await api.post('/api/features', formData)
      if (!res.ok) throw new Error(res.error)
      
      toast.success('Created')
      onSuccess?.()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
    </form>
  )
}
```

### 7️⃣ Create API Route

```typescript
// app/api/features/route.ts
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const session = await auth.getSession({ headers: request.headers })
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const feature = await db.feature.create({
      data: { ...body, authorId: session.user.id }
    })

    return NextResponse.json(feature, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed' },
      { status: 400 }
    )
  }
}
```

### 8️⃣ Create Page

```typescript
// app/(protected)/features/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { CrudPage } from '@/components/organisms/crud-page'
import { listFeaturesCrud } from '@/actions/features/list-features-crud'

export default function FeaturesPage() {
  const [data, setData] = useState([])
  const [total, setTotal] = useState(0)

  const handleLoad = async (page = 1) => {
    const result = await listFeaturesCrud({ page, limit: 10 })
    setData(result.data)
    setTotal(result.total)
  }

  useEffect(() => {
    handleLoad()
  }, [])

  return (
    <CrudPage
      title="Features"
      columns={[
        { key: 'title', label: 'Title' },
        { key: 'createdAt', label: 'Created' }
      ]}
      data={data}
      total={total}
      onRefresh={() => handleLoad()}
    />
  )
}
```

## 📋 Conventions

### Naming

- **Files**: kebab-case (`feature-form.tsx`, `create-feature.ts`)
- **Functions**: camelCase (`createFeature`, `handleSubmit`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`)
- **DB Tables**: snake_case (`feature_items`)
- **API Routes**: kebab-case (`/api/feature-items`)

### Response Format

```typescript
// Success
{ success: true, data: T }

// Error
{ success: false, error: string }

// Paginated
{ data: T[], total: number, page: number, limit: number, totalPages: number }
```

## 🔐 Auth & Permissions

### Check Session

```typescript
import { auth } from '@/lib/auth'

export async function protectedAction(data: any) {
  const session = await auth.getSession()
  if (!session) throw new Error('Unauthorized')
  
  const userId = session.user.id
  // ...
}
```

### Check Permissions

```typescript
import { checkPermission } from '@/lib/check-permission'

if (!checkPermission(session.user.role, 'delete:feature')) {
  return { success: false, error: 'Forbidden' }
}
```

## 🤖 Drift Commands

```bash
/disable              # Disable auto-routing
/enable               # Enable auto-routing
/ship-feature        # Complete feature workflow
/ship-bug            # Complete bug fix workflow
/ship-refactor       # Safe refactoring
/standup             # Status check
/tasks               # Pending tasks
/resume              # Resume from checkpoint
/rollback            # Undo N tasks
```

## 📚 API Client

```typescript
import { api } from '@/lib/client'

// GET
const res = await api.get('/api/features')

// POST
const res = await api.post('/api/features', { title: 'New' })

// PATCH
const res = await api.patch('/api/features/123', { title: 'Updated' })

// DELETE
const res = await api.delete('/api/features/123')

// Error handling
if (!res.ok) {
  toast.error(res.error)
}
```

## 🗄️ Database

### Prisma Studio

```bash
npx prisma studio
```

### Migrations

```bash
npx prisma generate       # Generate Prisma client
npx prisma migrate dev   # Create and apply migration
npx prisma migrate deploy # Apply migrations in production
```

## 🧪 Testing

```bash
npm test              # Run tests
npm run lint          # Lint code
npm run format        # Format with Biome
```

## 💡 Tips

### Get Current User

```typescript
const session = await auth.getSession()
const userId = session?.user.id
```

### Toast Notifications

```typescript
import { toast } from 'sonner'

toast.success('Success message')
toast.error('Error message')
toast.loading('Loading...')
```

### Revalidate After Server Action

```typescript
'use server'
import { revalidatePath } from 'next/cache'

export async function updateFeature(id: string, data: any) {
  await db.feature.update({ where: { id }, data })
  revalidatePath('/features')
}
```

## 📖 Module Documentation

- `lib/README.md` - Overview of all lib modules
- `lib/AUTH.md` - Authentication & authorization
- `lib/CLIENT.md` - Unified API client
- `lib/DATABASE.md` - Prisma & database
- `lib/PAYMENTS.md` - Stripe integration
- `lib/SCHEMAS.md` - Zod validation
- etc.

## ✅ Pre-Deploy Checklist

- [ ] Types validated with Zod
- [ ] Prisma schema updated
- [ ] Migration applied
- [ ] Server actions tested
- [ ] Components reusable
- [ ] Error handling complete
- [ ] Permissions verified
- [ ] TypeScript builds cleanly
- [ ] Manual testing done
