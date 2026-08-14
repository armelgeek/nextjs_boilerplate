import { z } from 'zod';

export const createBlogSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title must be less than 200 characters'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  excerpt: z.string().max(500, 'Excerpt must be less than 500 characters').optional(),
  published: z.boolean().optional().default(false),
  featuredImage: z.string().url('Invalid image URL').optional().or(z.literal('')),
  tags: z.array(z.string()).optional().default([]),
  categories: z.array(z.string()).optional().default([]),
});

export const updateBlogSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title must be less than 200 characters').optional(),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format').optional(),
  content: z.string().min(10, 'Content must be at least 10 characters').optional(),
  excerpt: z.string().max(500, 'Excerpt must be less than 500 characters').optional(),
  published: z.boolean().optional(),
  featuredImage: z.string().url('Invalid image URL').optional().or(z.literal('')),
  tags: z.array(z.string()).optional(),
  categories: z.array(z.string()).optional(),
});

export const publishBlogSchema = z.object({
  published: z.boolean(),
});

export type CreateBlog = z.infer<typeof createBlogSchema>;
export type UpdateBlog = z.infer<typeof updateBlogSchema>;
export type PublishBlog = z.infer<typeof publishBlogSchema>;
