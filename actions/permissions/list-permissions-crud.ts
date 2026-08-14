'use server';

import { CrudListResponse, CrudListOptions } from '@/types/crud';
import { listPermissions } from './list-permissions';

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
  const result = await listPermissions();

  if (!result.success) {
    throw new Error(result.error || 'Failed to load permissions');
  }

  const page = options.page || 1;
  const pageSize = options.pageSize || 10;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  const filtered = result.permissions.filter(p =>
    (!options.filters?.name || p.name.toLowerCase().includes(options.filters.name.toLowerCase())) &&
    (!options.filters?.resource || p.resource.toLowerCase().includes(options.filters.resource.toLowerCase())) &&
    (!options.filters?.action || p.action.toLowerCase().includes(options.filters.action.toLowerCase()))
  );

  return {
    data: filtered.slice(start, end) as Permission[],
    total: filtered.length,
    page,
    pageSize,
    totalPages: Math.ceil(filtered.length / pageSize),
  };
}
