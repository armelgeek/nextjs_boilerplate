'use server';

import { db } from '@/lib/db';
import { requirePermission, getSession } from '@/lib/auth-helpers';

export async function deleteUser(id: string) {
  
  await requirePermission("user", "delete");

  const session = await getSession();

  if (!id) {
    return { error: 'User ID is required' };
  }

  try {
    
    const existingUser = await db.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return { error: 'User not found' };
    }

    const usersWithRole = await db.user.count({
      where: { roleId: existingUser.roleId || undefined },
    });

    if (session && session.user.id === id) {
      return { error: 'You cannot delete your own account' };
    }

    await db.user.delete({
      where: { id },
    });

    return { success: 'User deleted successfully' };
  } catch (error: unknown) {
    console.error(error);
    return { error: 'Failed to delete user: ' + String(error) };
  }
}
