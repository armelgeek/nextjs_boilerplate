"use server";

import { db as prisma } from "@/lib/db";
import { requirePermission } from "@/lib/auth-helpers";

interface UpdatePermissionInput {
  id: string;
  name: string;
  description?: string;
  resource: string;
  action: string;
}

export async function updatePermission(data: UpdatePermissionInput) {
  
  await requirePermission("permission", "update");

  const { id, name, description, resource, action } = data;

  if (!id || !name || name.trim() === "") {
    return { error: "ID and permission name are required" };
  }

  if (!resource || resource.trim() === "") {
    return { error: "Resource is required" };
  }

  if (!action || action.trim() === "") {
    return { error: "Action is required" };
  }

  try {
    
    const existingPermission = await prisma.permission.findUnique({
      where: { id },
    });

    if (!existingPermission) {
      return { error: "Permission not found" };
    }

    const nameConflict = await prisma.permission.findFirst({
      where: {
        name: name.trim(),
        NOT: { id },
      },
    });

    if (nameConflict) {
      return {
        error:
          "A permission with this name already exists. Please use a different name.",
      };
    }

    const resourceActionConflict = await prisma.permission.findFirst({
      where: {
        resource: resource.trim(),
        action: action.trim(),
        NOT: { id },
      },
    });

    if (resourceActionConflict) {
      return {
        error: "A permission with this resource and action combination already exists.",
      };
    }

    const permission = await prisma.permission.update({
      where: { id },
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        resource: resource.trim(),
        action: action.trim(),
      },
    });

    return { success: "Permission updated successfully", permission };
  } catch (error: unknown) {
    console.error(error);
    return { error: "Failed to update permission: " + String(error) };
  }
}
