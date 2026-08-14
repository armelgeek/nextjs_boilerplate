'use server';

import { CrudListResponse, CrudListOptions } from '@/types/crud';
import { listAdmins } from './list-user';

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  role: {
    id: string;
    name: string;
  } | null;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export async function listUsersCrud(
  options: CrudListOptions
): Promise<CrudListResponse<User>> {
  const result = await listAdmins({
    page: options.page || 1,
    limit: options.pageSize || 10,
    filters: {
      name: options.filters?.name || '',
      email: options.filters?.email || '',
      emailVerified: options.filters?.emailVerified || 'all',
      isAdmin: options.filters?.isAdmin || 'all',
      role: options.filters?.role || 'all',
    },
  });

  if (!result.success) {
    throw new Error(result.error || 'Failed to load users');
  }

  return {
    data: result.admins as User[],
    total: result.pagination.total,
    page: options.page || 1,
    pageSize: options.pageSize || 10,
    totalPages: result.pagination.totalPages,
  };
}
