import { redirect } from "next/navigation";
import { auth } from "./auth";
import {
  canAccessProtectedRoutes,
  hasPermission,
  hasRole,
} from "./permissions";

export async function requireAuth(options?: { roles?: string[] }) {
  const session = await auth.api.getSession({
    headers: await import("next/headers").then((mod) => mod.headers()),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const canAccess = await canAccessProtectedRoutes(session.user.id);
  if (!canAccess) {
    redirect("/unauthorized");
  }

  if (options?.roles) {
    const hasRequiredRole = await hasRole(session.user.id, options.roles);
    if (!hasRequiredRole) {
      redirect("/unauthorized");
    }
  }

  return session;
}

export async function requirePermission(resource: string, action: string) {
  const session = await auth.api.getSession({
    headers: await import("next/headers").then((mod) => mod.headers()),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const allowed = await hasPermission(session.user.id, resource, action);
  
  if (!allowed) {
    redirect("/unauthorized");
  }

  return session;
}

export async function getSession() {
  return await auth.api.getSession({
    headers: await import("next/headers").then((mod) => mod.headers()),
  });
}

export async function checkPermission(
  resource: string,
  action: string
): Promise<boolean> {
  const session = await getSession();
  if (!session?.user) return false;

  return hasPermission(session.user.id, resource, action);
}

export async function checkRole(roles: string[]): Promise<boolean> {
  const session = await getSession();
  if (!session?.user) return false;

  return hasRole(session.user.id, roles);
}
