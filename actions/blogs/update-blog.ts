'use server';

import { db } from '@/lib/db';
import { requirePermission } from '@/lib/auth-helpers';

interface UpdateBlogInput {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  published?: boolean;
  tags?: string[];
}

export async function updateBlog(data: UpdateBlogInput) {
  
  await requirePermission("blog", "update");

  const { 
    id, 
    title, 
    slug, 
    content, 
    excerpt, 
    coverImage, 
    published,
    tags = []
  } = data;

  if (!id || !title || !slug || !content) {
    return { error: 'ID, title, slug, and content are required' };
  }

  try {
    
    const existingBlog = await db.blog.findUnique({
      where: { id },
    });

    if (!existingBlog) {
      return { error: 'Blog not found' };
    }

    const duplicateBlog = await db.blog.findFirst({
      where: {
        AND: [
          { id: { not: id } },
          { slug },
        ],
      },
    });

    if (duplicateBlog) {
      return { error: 'A blog with this slug already exists' };
    }

    const updateData: any = {
      title,
      slug,
      content,
      excerpt: excerpt || null,
      coverImage: coverImage || null,
      published,
      tags,
    };

    if (published && !existingBlog.published) {
      updateData.publishedAt = new Date();
    }

    const blog = await db.blog.update({
      where: { id },
      data: updateData,
    });

    return { 
      success: 'Blog updated successfully', 
      blog 
    };
  } catch (error: unknown) {
    console.error(error);
    return { error: 'Failed to update blog: ' + String(error) };
  }
}
