# API Client

Unified wrapper around the fetch API for all HTTP requests in client components.

## File

- **client.ts** - Centralized API client with methods for GET, POST, PATCH, DELETE

## Features

- Consistent header handling (Content-Type: application/json)
- Standardized response format
- Automatic JSON parsing
- Centralized error handling

## Response Format

```typescript
{
  ok: boolean          // Whether request succeeded
  status: number       // HTTP status code
  data: T              // Parsed response data
  error?: string       // Error message if !ok
}
```

## Usage

```typescript
import { api } from '@/lib/client'

// GET
const res = await api.get('/api/users')
if (res.ok) console.log(res.data)

// POST
const res = await api.post('/api/users', { name: 'John' })

// PATCH
const res = await api.patch('/api/users/1', { name: 'Jane' })

// DELETE
const res = await api.delete('/api/users/1')
```

## Benefits

- Single point of configuration for all API calls
- Reduces boilerplate in components
- Easier to add logging, authentication, or retry logic
