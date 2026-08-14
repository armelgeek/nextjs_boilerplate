"use server";

import { db as prisma } from "@/lib/db";
import { requirePermission } from "@/lib/auth-helpers";

export async function deletePermission(id: string) {
  
  await requirePermission("permission", "delete");

  if (!id) {
    return { error: "Permission ID is required" };
  }

  try {
    
    const permission = await prisma.permission.findUnique({
      where: { id },
    });

    if (!permission) {
      return { error: "Permission not found" };
    }

    const rolesWithPermission = await prisma.rolePermission.count({
      where: { permissionId: id },
    });

    if (rolesWithPermission > 0) {
      return {
        error: `Cannot delete permission. It is currently assigned to ${rolesWithPermission} role(s).`,
      };
    }

    await prisma.permission.delete({
      where: { id },
    });

    return { success: "Permission deleted successfully" };
  } catch (error: unknown) {
    console.error(error);
    return { error: "Failed to delete permission: " + String(error) };
  }
}
