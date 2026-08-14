# Code Style & Conventions

Standards for development with Claude in this project.

## Comments

**Rule**: Keep comments clean after each feature. Remove unnecessary comments.

**What to comment:**
- Why something exists (non-obvious logic)
- Workarounds for specific bugs
- Hidden constraints or invariants
- Trade-offs made in the code

**What NOT to comment:**
- What the code does (good naming handles that)
- Obvious logic
- TODO/FIXME without a clear reason
- Debug print statements or temporary code

**Style:**
- Single-line only: `// comment`
- No multi-line blocks
- No javadoc/TSDoc unless public API
- Remove ALL temporary comments before commit

Example:

```typescript
// ❌ Bad - obvious what the code does
function getUserById(id: string) {
  // Get user from database
  return db.user.findUnique({ where: { id } })
}

// ✅ Good - explains why
function getUserById(id: string) {
  // Use findUnique to fail fast on duplicate IDs in corrupted DB
  return db.user.findUnique({ where: { id } })
}
```

## Git Commits

**Format**: Conventional commits

```
feat: Add new feature
fix: Fix bug
refactor: Reorganize code
docs: Update documentation
chore: Maintenance task
```

**Rules:**
- NO `Co-Authored-By` trailers
- One logical change per commit
- Descriptive message (not just "update code")
- Reference issue numbers if applicable: `fix: #123`

Example:

```bash
# ❌ Wrong
git commit -m "Update stuff"

# ✅ Correct
git commit -m "fix: Handle null values in email validation"

# ✅ With issue
git commit -m "feat: Add dark mode toggle (#456)"
```

## Naming

### Files & Directories

```
kebab-case/
├── feature-name.ts
├── create-feature.ts
└── update-feature.ts
```

### Code Identifiers

```typescript
// Constants
const MAX_FILE_SIZE = 5242880  // UPPER_SNAKE_CASE

// Functions & Methods
function createUser() {}        // camelCase
const handleSubmit = () => {}   // camelCase

// Classes & Types
class UserService {}            // PascalCase
interface UserData {}           // PascalCase
type User = {}                  // PascalCase

// Database
model_user_profiles             // snake_case tables

// API Routes
/api/user-profiles              // kebab-case paths
/api/users/123                  // numeric IDs
```

## Imports & Exports

**Rule**: Organize by groups with blank lines

```typescript
// System imports
import { useEffect } from 'react'
import { z } from 'zod'

// Internal imports
import { api } from '@/lib/client'
import { CreateUserSchema } from '@/types/user'
import { UserForm } from '@/components/molecules/forms'

// Side effects last
import '@/styles/globals.css'
```

## Functions & Methods

**Keep small and focused:**
- Single responsibility
- Max 20 lines (as guideline)
- One level of abstraction
- Early returns to reduce nesting

```typescript
// ❌ Too many responsibilities
async function handleUserUpdate(id: string, data: any) {
  const user = await db.user.findUnique({ where: { id } })
  if (!user) throw new Error('Not found')
  
  const validated = schema.parse(data)
  
  const updated = await db.user.update({
    where: { id },
    data: validated
  })
  
  await sendEmail(user.email, 'Profile updated')
  
  return updated
}

// ✅ Separated concerns
async function updateUser(id: string, data: any) {
  const validated = schema.parse(data)
  return db.user.update({ where: { id }, data: validated })
}

// Caller handles email
const user = await updateUser(id, data)
await sendEmail(user.email, 'Profile updated')
```

## Exports

**Default vs Named:**

```typescript
// Use named exports (easier to refactor, rename, track usage)
export function createUser() {}
export const MAX_USERS = 1000

// Only default for single primary export
// Example: page components
export default function HomePage() {}
```

## Error Handling

**Consistent pattern:**

```typescript
try {
  const result = await operation()
  return { success: true, data: result }
} catch (error) {
  console.error('Context: what failed', error)
  return { 
    success: false, 
    error: error instanceof Error ? error.message : 'Unknown error'
  }
}
```

## Type Safety

**Use strict types:**

```typescript
// ❌ Avoid 'any'
function process(data: any) {}

// ✅ Specific types
function process(data: UserInput) {}

// ✅ Generic when needed
function process<T>(data: T, callback: (item: T) => void) {}
```

## Testing Notes

- Test files colocated with source: `feature.ts` + `feature.test.ts`
- No unnecessary test boilerplate
- Name tests by behavior: `should return null if not found`
- Keep tests focused and independent

## When to Break These Rules

- Public APIs may need detailed docs (JSDoc)
- Configuration files may need explanatory comments
- Complex algorithms need step-by-step comments
- Team consensus overrides these guidelines

**Check with team before breaking convention.**
