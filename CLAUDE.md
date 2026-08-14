# Boilerplate Next.js - Claude Development Instructions

Guide complet pour développer des fonctionnalités avec Claude en suivant l'architecture du projet.

## 🏗️ Architecture du Projet

### Structure des Dossiers

```
src/
├── app/                    # Routes Next.js et layouts
│   ├── (protected)/       # Routes protégées par auth
│   ├── (admin)/          # Routes administrateur
│   ├── api/              # API routes
│   └── auth/             # Routes authentification
├── actions/              # Server actions (Prisma + métier)
│   ├── blogs/
│   ├── roles/
│   ├── permissions/
│   ├── users/
│   └── payments/
├── components/           # Composants UI (Atomic Design)
│   ├── atoms/           # Petits composants réutilisables
│   ├── molecules/       # Composants modérés
│   ├── organisms/       # Composants complexes
│   ├── templates/       # Mises en page complet
│   ├── ui/             # Components Shadcn/ui
│   └── skeletons/      # Loading skeletons
├── lib/                 # Utilitaires et services
│   ├── auth*           # Authentification
│   ├── client.ts       # API client unifié
│   ├── database        # Prisma setup
│   ├── email           # Service email
│   ├── payments/       # Intégration Stripe
│   ├── schemas/        # Zod validations
│   ├── security/       # Rate limiting, audit
│   ├── webhooks/       # Webhook handlers
│   ├── utils/          # Helpers
│   └── README.md       # Doc par module
├── types/              # Types TypeScript
└── scripts/            # Scripts utilitaires
```

## 🔄 Flux de Développement d'une Fonctionnalité

### 1️⃣ Créer/Modifier le Type Domain

```typescript
// types/blog.ts
import { z } from 'zod'

export const BlogPostSchema = z.object({
  id: z.string().cuid(),
  title: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  content: z.string(),
  published: z.boolean().default(false),
  authorId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export type BlogPost = z.infer<typeof BlogPostSchema>

// Schemas pour les inputs
export const CreateBlogPostSchema = BlogPostSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
})

export const UpdateBlogPostSchema = CreateBlogPostSchema.partial()
```

### 2️⃣ Créer/Mettre à Jour le Schéma Prisma

```typescript
// prisma/schema.prisma
model BlogPost {
  id        String   @id @default(cuid())
  title     String   @db.VarChar(255)
  slug      String   @unique @db.VarChar(255)
  content   String   @db.Text
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  authorId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([authorId])
  @@index([slug])
}
```

### 3️⃣ Générer et Appliquer la Migration

```bash
# Générer la migration
npx prisma migrate dev --name add_blog_posts

# Vérifier le schéma
npx prisma studio
```

### 4️⃣ Créer les Server Actions (Logique Métier)

```typescript
// actions/blogs/create-blog.ts
'use server'

import { db } from '@/lib/db'
import { CreateBlogPostSchema } from '@/types/blog'

export async function createBlogPost(data: unknown) {
  try {
    // Validation
    const validated = CreateBlogPostSchema.parse(data)
    
    // Vérifier l'authentification/permissions
    const session = await auth.getSession() // ou ton auth système
    if (!session) {
      return { success: false, error: 'Unauthorized' }
    }

    // Créer le slug automatiquement
    const slug = validated.title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')

    // Vérifier l'unicité du slug
    const existing = await db.blogPost.findUnique({ where: { slug } })
    if (existing) {
      return { success: false, error: 'Slug already exists' }
    }

    // Créer
    const post = await db.blogPost.create({
      data: {
        ...validated,
        slug,
        authorId: session.userId
      }
    })

    return { success: true, data: post }
  } catch (error) {
    console.error('Error creating blog post:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create blog post'
    }
  }
}
```

### 5️⃣ Créer des CRUD Adapters

```typescript
// actions/blogs/list-blogs-crud.ts
'use server'

import { db } from '@/lib/db'
import { BlogPost } from '@/types/blog'

export interface CrudListParams {
  page?: number
  limit?: number
  search?: string
  filter?: Record<string, any>
  sort?: string
}

export interface CrudListResponse {
  data: BlogPost[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export async function listBlogsCrud(params: CrudListParams): Promise<CrudListResponse> {
  try {
    const { page = 1, limit = 10, search = '', filter = {}, sort = 'createdAt' } = params

    const skip = (page - 1) * limit

    // Construire les filtres
    const where: any = { ...filter }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Récupérer les données
    const [data, total] = await Promise.all([
      db.blogPost.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sort === 'createdAt' ? 'createdAt' : sort]: 'desc'
        }
      }),
      db.blogPost.count({ where })
    ])

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  } catch (error) {
    console.error('Error listing blog posts:', error)
    throw error
  }
}
```

### 6️⃣ Créer les Composants UI

```typescript
// components/molecules/forms/blog-form.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { api } from '@/lib/client'
import { BlogPost, UpdateBlogPostSchema } from '@/types/blog'

interface BlogFormProps {
  initialData?: BlogPost
  onSuccess?: (post: BlogPost) => void
}

export function BlogForm({ initialData, onSuccess }: BlogFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    published: initialData?.published || false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Valider
      const validated = UpdateBlogPostSchema.parse(formData)

      // Envoyer
      const endpoint = initialData 
        ? `/api/blogs/${initialData.id}`
        : '/api/blogs'
      
      const method = initialData ? 'PATCH' : 'POST'
      
      const res = await api[method.toLowerCase() as 'post' | 'patch'](endpoint, validated)

      if (!res.ok) {
        toast.error(res.error || 'Failed to save blog post')
        return
      }

      toast.success(initialData ? 'Blog post updated' : 'Blog post created')
      onSuccess?.(res.data as BlogPost)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label>Title</label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          required
        />
      </div>
      <div>
        <label>Content</label>
        <Textarea
          value={formData.content}
          onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
          required
        />
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={formData.published}
            onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
          />
          Published
        </label>
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save'}
      </Button>
    </form>
  )
}
```

### 7️⃣ Créer les API Routes

```typescript
// app/api/blogs/route.ts
import { db } from '@/lib/db'
import { CreateBlogPostSchema } from '@/types/blog'
import { auth } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const session = await auth.getSession({ headers: request.headers })
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validated = CreateBlogPostSchema.parse(body)

    const slug = validated.title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')

    const post = await db.blogPost.create({
      data: {
        ...validated,
        slug,
        authorId: session.user.id
      }
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Error creating blog:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create blog' },
      { status: 400 }
    )
  }
}

// app/api/blogs/[id]/route.ts
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    const post = await db.blogPost.update({
      where: { id: params.id },
      data: body
    })

    return NextResponse.json(post)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update blog' },
      { status: 400 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.blogPost.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete blog' },
      { status: 400 }
    )
  }
}
```

### 8️⃣ Créer les Pages

```typescript
// app/(protected)/blogs/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { CrudPage } from '@/components/organisms/crud-page'
import { listBlogsCrud } from '@/actions/blogs/list-blogs-crud'
import { BlogPost } from '@/types/blog'

export default function BlogsPage() {
  const [data, setData] = useState<BlogPost[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const handleLoad = async (page = 1) => {
    setIsLoading(true)
    const result = await listBlogsCrud({ page, limit: 10 })
    setData(result.data)
    setTotal(result.total)
    setIsLoading(false)
  }

  useEffect(() => {
    handleLoad()
  }, [])

  return (
    <CrudPage
      title="Blog Posts"
      description="Manage blog posts"
      columns={[
        { key: 'title', label: 'Title' },
        { key: 'published', label: 'Published', render: (v) => v ? '✓' : '✗' },
        { key: 'createdAt', label: 'Created', render: (v) => new Date(v).toLocaleDateString() }
      ]}
      data={data}
      total={total}
      isLoading={isLoading}
      onRefresh={() => handleLoad()}
    />
  )
}
```

## 📋 Conventions du Projet

### Naming Conventions

```
Files:        kebab-case (blog-form.tsx, create-blog.ts)
Classes:      PascalCase (BlogForm, CreateBlogUseCase)
Functions:    camelCase (createBlogPost, handleSubmit)
Constants:    UPPER_SNAKE_CASE (MAX_FILE_SIZE, DEFAULT_LIMIT)
DB Tables:    snake_case (blog_posts, user_roles)
API Routes:   kebab-case (/api/blog-posts, /api/api-keys)
Folders:      kebab-case (blog-posts/, auth-config/)
```

### Response Format

```typescript
// Success Response (Server Action)
{ success: true, data: T }

// Error Response
{ success: false, error: string }

// Paginated Response
{
  data: T[],
  total: number,
  page: number,
  limit: number,
  totalPages: number
}

// API Response (use next/NextResponse)
NextResponse.json(data, { status: 200 })
NextResponse.json({ error: message }, { status: 400 })
```

### Error Handling Pattern

```typescript
try {
  // Logic
  return { success: true, data: result }
} catch (error) {
  console.error('Error message:', error)
  return {
    success: false,
    error: error instanceof Error ? error.message : 'Unknown error'
  }
}
```

## 🔐 Authentification & Permissions

### Vérifier la Session

```typescript
import { auth } from '@/lib/auth'

// Dans Server Actions
export async function protectedAction(data: any) {
  const session = await auth.getSession()
  if (!session) throw new Error('Unauthorized')
  
  const userId = session.user.id
  // ...
}

// Dans API Routes
export async function POST(request: Request) {
  const session = await auth.getSession({ headers: request.headers })
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  // ...
}
```

### Vérifier les Permissions

```typescript
import { checkPermission } from '@/lib/check-permission'

// Dans Server Actions
if (!checkPermission(session.user.role, 'delete:blog')) {
  throw new Error('Forbidden')
}

// Pattern complet
export async function deleteBlog(id: string) {
  const session = await auth.getSession()
  if (!checkPermission(session.user.role, 'delete:blog')) {
    return { success: false, error: 'Forbidden' }
  }
  // ...
}
```

## 📤 Upload de Fichiers

### Pattern de Service (Email Templates, Fichiers, etc.)

```typescript
// lib/file-service.ts
import { mkdir, writeFile } from 'fs/promises'
import { join } from 'path'

export class FileService {
  private uploadDir: string

  constructor(subfolder: string) {
    const root = process.cwd()
    this.uploadDir = join(root, 'public', 'uploads', subfolder)
  }

  async ensureDir() {
    await mkdir(this.uploadDir, { recursive: true })
  }

  async upload(file: File): Promise<string> {
    // Validation
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      throw new Error('File too large')
    }

    // Créer le répertoire
    await this.ensureDir()

    // Sauvegarder
    const filename = `${Date.now()}-${file.name}`
    const filepath = join(this.uploadDir, filename)
    const buffer = await file.arrayBuffer()
    await writeFile(filepath, Buffer.from(buffer))

    return `/uploads/${filename}`
  }

  async delete(filename: string): Promise<void> {
    const filepath = join(this.uploadDir, filename)
    await unlink(filepath)
  }
}

// Usage
const fileService = new FileService('blog-covers')
const url = await fileService.upload(file)
```

## 💳 Intégration Stripe

### Créer des Plans

```bash
npm run stripe:setup
```

### Créer une Session de Paiement

```typescript
// actions/payments/create-checkout-session.ts
'use server'

import { stripe } from '@/lib/payments/stripe/config'
import { auth } from '@/lib/auth'

export async function createCheckoutSession(planId: string) {
  try {
    const session = await auth.getSession()
    if (!session) return { error: 'Unauthorized' }

    const plan = await db.plan.findUnique({ where: { id: planId } })
    if (!plan) return { error: 'Plan not found' }

    const checkoutSession = await stripe.checkout.sessions.create({
      customer_email: session.user.email,
      mode: 'subscription',
      line_items: [{
        price: plan.stripePriceId,
        quantity: 1
      }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel`
    })

    return { url: checkoutSession.url }
  } catch (error) {
    return { error: 'Failed to create checkout session' }
  }
}
```

## 🔍 Validation avec Zod

### Pattern Complet

```typescript
// types/user.ts
import { z } from 'zod'

// Schema complet avec tous les champs
export const UserSchema = z.object({
  id: z.string().cuid(),
  email: z.string().email(),
  name: z.string().optional(),
  role: z.enum(['admin', 'user']).default('user'),
  createdAt: z.date(),
  updatedAt: z.date()
})

// Pour créer (exclure les champs auto)
export const CreateUserSchema = UserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
})

// Pour modifier (tous les champs optionnels)
export const UpdateUserSchema = CreateUserSchema.partial()

// Pour des validations spécifiques
export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(8),
  confirmPassword: z.string().min(8)
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
})
```

## 🌐 Client API Unifié

### Utilisation

```typescript
import { api } from '@/lib/client'

// GET
const res = await api.get('/api/blogs')
if (res.ok) console.log(res.data)

// POST
const res = await api.post('/api/blogs', { title: 'New' })

// PATCH
const res = await api.patch('/api/blogs/123', { title: 'Updated' })

// DELETE
const res = await api.delete('/api/blogs/123')

// Gestion d'erreur uniforme
if (!res.ok) {
  toast.error(res.error || 'Failed')
  return
}
```

## 📚 Utilitaires Disponibles

### Array Utils
```typescript
import { unique, flatten, compact } from '@/lib/utils/array'

unique([1, 2, 2, 3])      // [1, 2, 3]
flatten([[1, 2], [3]])    // [1, 2, 3]
compact([1, null, 2])     // [1, 2]
```

### String Utils
```typescript
import { capitalize, slug, truncate } from '@/lib/utils/string'

capitalize('hello')       // 'Hello'
slug('Hello World')      // 'hello-world'
truncate('Long text', 5) // 'Long...'
```

### Object Utils
```typescript
import { omit, pick, merge } from '@/lib/utils/object'

omit({ a: 1, b: 2 }, ['b'])    // { a: 1 }
pick({ a: 1, b: 2 }, ['a'])    // { a: 1 }
merge({ a: 1 }, { b: 2 })      // { a: 1, b: 2 }
```

## 🗄️ Prisma Studio

Visualiser et modifier les données :

```bash
npm run studio
```

## 📝 Scripts Utiles

```bash
# Développement
npm run dev              # Mode développement
npm run build           # Build production
npm start               # Démarrer production

# Database
npx prisma generate    # Générer Prisma client
npx prisma migrate dev # Créer et appliquer migration
npx prisma studio      # Ouvrir UI Prisma

# Stripe
npm run stripe:setup    # Créer plans Stripe
npm run stripe:listen   # Écouter webhooks localement

# Admin
npm run setup:admin     # Créer admin initial
```

## 🚀 Checkpoints avant de Déployer

- [ ] Types validés avec Zod
- [ ] Schema Prisma à jour
- [ ] Migration appliquée (`npx prisma migrate deploy`)
- [ ] Server actions/API routes testés
- [ ] Composants UI réutilisables
- [ ] Gestion des erreurs complète
- [ ] Permissions vérifiées
- [ ] TypeScript `npm run build` sans erreurs
- [ ] Tests fonctionnels manuels

## 📖 Documentation des Modules

Voir `lib/README.md` et les fichiers individuels:
- `lib/AUTH.md` - Authentification
- `lib/CLIENT.md` - API client
- `lib/DATABASE.md` - Prisma & DB
- `lib/PAYMENTS.md` - Stripe
- `lib/SCHEMAS.md` - Zod validation
- `lib/SECURITY.md` - Rate limiting & audit
- etc.

## 💡 Tips & Tricks

### Récupérer l'utilisateur actuel

```typescript
const session = await auth.getSession()
const currentUserId = session?.user.id
```

### Déboguer les erreurs Prisma

```typescript
const result = await db.user.create({
  data: { email: 'test@example.com' }
}).catch(error => {
  console.log('Prisma Error:', error.code, error.meta)
  throw error
})
```

### Afficher les toasts

```typescript
import { toast } from 'sonner'

toast.success('Success message')
toast.error('Error message')
toast.loading('Loading...')
toast.promise(promise, { loading, success, error })
```

### Revalidate après Server Action

```typescript
'use server'
import { revalidatePath } from 'next/cache'

export async function updateBlog(id: string, data: any) {
  await db.blogPost.update({ where: { id }, data })
  revalidatePath('/blogs') // Regénérer la page
  revalidatePath(`/blogs/${id}`)
}
```
