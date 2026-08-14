import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function requireAuth() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return session;
}

export async function requireAdmin() {
  const session = await requireAuth();

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { isAdmin: true },
  });

  if (!user?.isAdmin) {
    redirect("/");
  }

  return session;
}

export async function requireRole(roleName: string) {
  const session = await requireAuth();

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { role: true },
  });

  if (!user?.role || user.role.name !== roleName) {
    redirect("/");
  }

  return session;
}

export async function requirePermission(resource: string, action: string) {
  const session = await requireAuth();

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
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

  const hasPermission = user?.role?.rolePermissions.some(
    (rp) => rp.permission.resource === resource && rp.permission.action === action
  );

  if (!hasPermission) {
    redirect("/");
  }

  return session;
}

export async function isUserAdmin(userId?: string): Promise<boolean> {
  try {
    let targetUserId = userId;
    
    if (!targetUserId) {
      const session = await auth.api.getSession({
        headers: await headers(),
      });
      
      if (!session) {
        return false;
      }
      
      targetUserId = session.user.id;
    }

    const user = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: { isAdmin: true },
    });

    return user?.isAdmin || false;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}
