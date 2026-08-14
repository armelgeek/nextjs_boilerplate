'use server';

import { db } from '@/lib/db';
import { requirePermission } from '@/lib/auth-helpers';

export async function deleteBlog(id: string) {
  
  await requirePermission("blog", "delete");

  if (!id) {
    return { error: 'Blog ID is required' };
  }

  try {
    
    const existingBlog = await db.blog.findUnique({
      where: { id },
    });

    if (!existingBlog) {
      return { error: 'Blog not found' };
    }

    await db.blog.delete({
      where: { id },
    });

    return { success: 'Blog deleted successfully' };
  } catch (error: unknown) {
    console.error(error);
    return { error: 'Failed to delete blog: ' + String(error) };
  }
}
