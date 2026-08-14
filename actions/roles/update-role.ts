"use server";

import { db as prisma } from "@/lib/db";
import { requirePermission } from "@/lib/auth-helpers";
import { revalidatePath } from "next/cache";

interface UpdateRoleInput {
  id: string;
  name: string;
  description?: string;
  permissionIds: string[];
}

export async function updateRole(data: UpdateRoleInput) {
  
  await requirePermission("role", "update");

  const { id, name, description, permissionIds } = data;

  if (!id || !name || name.trim() === "") {
    return { error: "ID and role name are required" };
  }

  try {
    
    const existingRole = await prisma.role.findUnique({
      where: { id },
    });

    if (!existingRole) {
      return { error: "Role not found" };
    }

    const nameConflict = await prisma.role.findFirst({
      where: {
        name: name.trim(),
        NOT: { id },
      },
    });

    if (nameConflict) {
      return {
        error:
          "A role with this name already exists. Please use a different name.",
      };
    }

    const role = await prisma.$transaction(async (tx) => {
      
      await tx.rolePermission.deleteMany({
        where: { roleId: id },
      });

      return await tx.role.update({
        where: { id },
        data: {
          name: name.trim(),
          description: description?.trim() || null,
          rolePermissions: {
            create: permissionIds.map((permissionId) => ({
              permissionId,
            })),
          },
        },
        include: {
          rolePermissions: {
            include: {
              permission: true,
            },
          },
        },
      });
    });

    revalidatePath("/roles");
    revalidatePath(`/roles/${id}`);

    return { success: "Role updated successfully", role };
  } catch (error: unknown) {
    console.error(error);
    return { error: "Failed to update role: " + String(error) };
  }
}
