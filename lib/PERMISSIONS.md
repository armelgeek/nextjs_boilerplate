# Permissions & RBAC

Role-based access control (RBAC) system for managing user permissions and roles.

## File

- **permissions.ts** - Permission definitions, role mappings, and RBAC logic

## Concepts

- **Roles** - High-level access levels (admin, user, guest)
- **Permissions** - Granular actions (create:post, delete:user, etc.)
- **Role-Permission Mapping** - Which permissions belong to each role

## Features

- Hierarchical role system
- Fine-grained permissions
- Permission checking utilities
- Role inheritance

## Usage

```typescript
import { checkPermission, hasRole } from '@/lib/permissions'

// Check if user has specific permission
if (!checkPermission(user.role, 'delete:post')) {
  throw new Error('Unauthorized')
}

// Check role
if (!hasRole(user.role, 'admin')) {
  return Response.json({ error: 'Admin only' }, { status: 403 })
}
```

## Common Permissions

- `create:*` - Create resources
- `read:*` - View resources
- `update:*` - Modify resources
- `delete:*` - Remove resources
- `manage:*` - Full control

## Default Roles

- **admin** - Full system access
- **user** - Basic user permissions
- **guest** - Limited public access
