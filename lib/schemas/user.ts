import { z } from 'zod';

export const userProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  image: z.string().url('Invalid image URL').optional().or(z.literal('')),
});

export const roleSchema = z.object({
  id: z.string(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
});

export const permissionSchema = z.object({
  id: z.string(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  resource: z.string().min(1, 'Resource is required'),
  action: z.string().min(1, 'Action is required'),
  description: z.string().optional(),
});

export const createRoleSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
  description: z.string().optional(),
  permissions: z.array(z.string()).optional(),
});

export const updateRoleSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters').optional(),
  description: z.string().optional(),
  permissions: z.array(z.string()).optional(),
});

export const createPermissionSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  resource: z.string().min(1, 'Resource is required'),
  action: z.enum(['create', 'read', 'update', 'delete', 'manage']),
  description: z.string().optional(),
});

export type UserProfile = z.infer<typeof userProfileSchema>;
export type Role = z.infer<typeof roleSchema>;
export type Permission = z.infer<typeof permissionSchema>;
export type CreateRole = z.infer<typeof createRoleSchema>;
export type UpdateRole = z.infer<typeof updateRoleSchema>;
export type CreatePermission = z.infer<typeof createPermissionSchema>;
