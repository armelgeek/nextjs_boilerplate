export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  role?: Role | null;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
  stripeCustomerId?: string | null;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions?: Permission[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Permission {
  id: string;
  name: string;
  description?: string;
  resource: string;
  action: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSession {
  userId: string;
  email: string;
  name: string;
  image?: string;
  role?: {
    id: string;
    name: string;
  };
}

export interface UserProfile extends User {
  twoFactorEnabled: boolean;
  apiKeysCount: number;
}

export interface PermissionCheck {
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'manage';
}

export interface RoleWithPermissions extends Role {
  permissions: Permission[];
}
