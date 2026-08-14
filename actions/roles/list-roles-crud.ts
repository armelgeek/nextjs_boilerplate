'use server';

import { CrudListResponse, CrudListOptions } from '@/types/crud';
import { listRoles } from './list-roles';

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissionsCount?: number;
  usersCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export async function listRolesCrud(
  options: CrudListOptions
): Promise<CrudListResponse<Role>> {
  const result = await listRoles();

  if (!result.success) {
    throw new Error(result.error || 'Failed to load roles');
  }

  const page = options.page || 1;
  const pageSize = options.pageSize || 10;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  const filtered = result.roles.filter(r =>
    !options.filters?.name || r.name.toLowerCase().includes(options.filters.name.toLowerCase())
  );

  return {
    data: filtered.slice(start, end) as Role[],
    total: filtered.length,
    page,
    pageSize,
    totalPages: Math.ceil(filtered.length / pageSize),
  };
}
