import { db as prisma } from "./db";

export async function canAccessUser(
  editorId: string,
  targetUserId: string
): Promise<boolean> {
  
  if (editorId === targetUserId) return true;

  const editor = await prisma.user.findUnique({
    where: { id: editorId },
    include: {
      role: {
        include: {
          rolePermissions: {
            include: { permission: true },
          },
        },
      },
    },
  });

  if (!editor) return false;

  if (editor.isAdmin && editor.role?.name === "Super Admin") return true;

  return (
    editor.role?.rolePermissions.some(
      (rp) =>
        rp.permission.resource === "user" &&
        rp.permission.action === "update_any"
    ) ?? false
  );
}

export async function hasPermission(
  userId: string,
  resource: string,
  action: string
): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      role: {
        include: {
          rolePermissions: {
            include: {
              permission: true,
            },
          },
        },
      },
    },
  });

  if (!user) return false;

  if (!user.isAdmin) return false;

  if (!user.role) return false;

  return user.role.rolePermissions.some(
    (rp) =>
      rp.permission.resource === resource && rp.permission.action === action
  );
}

export async function hasRole(userId: string, roleNames: string[]): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      role: true,
    },
  });

  if (!user || !user.role) return false;

  return roleNames.includes(user.role.name);
}

export async function canAccessProtectedRoutes(
  userId: string
): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isAdmin: true },
  });

  if (!user) return false;

  return user.isAdmin;
}
