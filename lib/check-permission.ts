'use server';

import { getSession } from './auth-helpers';
import { hasPermission } from './permissions';

export async function checkPermissionAction(
  resource: string,
  action: string
): Promise<{ hasPermission: boolean; isAuthenticated: boolean }> {
  const session = await getSession();
  
  if (!session?.user) {
    return { hasPermission: false, isAuthenticated: false };
  }

  const allowed = await hasPermission(session.user.id, resource, action);
  return { hasPermission: allowed, isAuthenticated: true };
}
