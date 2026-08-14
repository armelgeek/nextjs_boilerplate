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
  const result = await listRoles({
    page: options.page || 1,
    limit: options.pageSize || 10,
    filters: {
      name: options.filters?.name || '',
    },
  });

  if (!result.success) {
    throw new Error(result.error || 'Failed to load roles');
  }

  return {
    data: result.roles as Role[],
    total: result.pagination.total,
    page: options.page || 1,
    pageSize: options.pageSize || 10,
    totalPages: result.pagination.totalPages,
  };
}
