'use server';
import { db as prisma } from '@/lib/db';
import { requirePermission } from '@/lib/auth-helpers';
import { hashPassword } from 'better-auth/crypto';

interface CreateAdminInput {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role?: string;
  isAdmin?: boolean;
}

export async function createAdmin(data: CreateAdminInput) {
  
  await requirePermission("user", "create");

  const { name, email, phone, password, role = 'user', isAdmin = false } = data;

  if (!name || !email || !password) {
    return { error: 'Name, email, and password are required' };
  }

  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters long' };
  }

  try {
    
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: 'A user with this email already exists' };
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone: phone || null,
        emailVerified: true, 
        roleId: role && role !== 'user' ? role : null,
        isAdmin,
      },
    });

    await prisma.account.create({
      data: {
        userId: user.id,
        accountId: email,
        providerId: 'credential',
        password: hashedPassword,
      },
    });

    return { success: 'User created successfully', adminId: user.id };
  } catch (error: unknown) {
    console.error(error);
    return { error: 'Failed to create user: ' + String(error) };
  }
}
