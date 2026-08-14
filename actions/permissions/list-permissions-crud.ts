'use server';

import { CrudListResponse, CrudListOptions } from '@/types/crud';
import { listPermissions } from './list-permission';

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function listPermissionsCrud(
  options: CrudListOptions
): Promise<CrudListResponse<Permission>> {
  const result = await listPermissions({
    page: options.page || 1,
    limit: options.pageSize || 10,
    filters: {
      name: options.filters?.name || '',
      resource: options.filters?.resource || '',
      action: options.filters?.action || '',
    },
  });

  if (!result.success) {
    throw new Error(result.error || 'Failed to load permissions');
  }

  return {
    data: result.permissions as Permission[],
    total: result.pagination.total,
    page: options.page || 1,
    pageSize: options.pageSize || 10,
    totalPages: result.pagination.totalPages,
  };
}
