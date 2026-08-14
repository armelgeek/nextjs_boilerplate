'use server';

import { CrudListResponse, CrudListOptions } from '@/types/crud';
import { listBlogs } from './list-blogs';

export interface Blog {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  author?: {
    id: string;
    name: string;
  };
  views: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date | null;
}

export async function listBlogsCrud(
  options: CrudListOptions
): Promise<CrudListResponse<Blog>> {
  const result = await listBlogs({
    page: options.page || 1,
    limit: options.pageSize || 10,
    filters: {
      title: options.filters?.title || '',
      published: options.filters?.published || 'all',
    },
  });

  if (!result.success) {
    throw new Error(result.error || 'Failed to load blogs');
  }

  return {
    data: result.blogs as Blog[],
    total: result.pagination.total,
    page: options.page || 1,
    pageSize: options.pageSize || 10,
    totalPages: result.pagination.totalPages,
  };
}
