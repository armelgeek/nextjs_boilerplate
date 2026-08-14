import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as readline from 'readline';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ],
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function createAdminUser() {
  console.log('\n🔐 Admin Account Setup\n');
  console.log('This script will create an admin user with full permissions.\n');

  try {
    
    const name = await question('Enter admin name: ');
    const email = await question('Enter admin email: ');
    const password = await question('Enter admin password: ');

    if (!name || !email || !password) {
      console.error('\n❌ All fields are required!');
      process.exit(1);
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      console.error('\n❌ User with this email already exists!');
      
      const update = await question('\nDo you want to make this user an admin with full permissions? (yes/no): ');
      if (update.toLowerCase() === 'yes' || update.toLowerCase() === 'y') {
        
        const superAdminRole = await getOrCreateSuperAdminRole();
        
        await prisma.user.update({
          where: { email },
          data: { 
            isAdmin: true,
            roleId: superAdminRole.id,
          }
        });
        console.log('\n✅ User updated to admin with Super Admin role successfully!');
      }
      
      rl.close();
      await prisma.$disconnect();
      await pool.end();
      process.exit(0);
    }

    console.log('\n📋 Setting up Super Admin role...');
    const superAdminRole = await getOrCreateSuperAdminRole();
    console.log('✅ Super Admin role ready with all permissions');

    console.log('\n👤 Creating admin user...');
    await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
    });

    const createdUser = await prisma.user.findUnique({
      where: { email }
    });

    if (createdUser) {
      await prisma.user.update({
        where: { email },
        data: { 
          isAdmin: true,
          emailVerified: true,
          roleId: superAdminRole.id,
        }
      });

      console.log('\n✅ Admin account created successfully!');
      console.log('\nAdmin Details:');
      console.log(`Name: ${name}`);
      console.log(`Email: ${email}`);
      console.log(`Role: Super Admin (${superAdminRole.rolePermissions.length} permissions)`);
      console.log(`Admin: Yes`);
      console.log('\nYou can now login with these credentials.\n');
    } else {
      console.error('\n❌ Failed to create user account');
    }

  } catch (error) {
    console.error('\n❌ Error creating admin user:', error);
    process.exit(1);
  } finally {
    rl.close();
    await prisma.$disconnect();
    await pool.end();
  }
}

async function getOrCreateSuperAdminRole() {
  
  const resources = ['user', 'role', 'permission', 'setting'];
  const actions = ['create', 'read', 'update', 'delete'];

  let role = await prisma.role.findUnique({
    where: { name: 'Super Admin' },
    include: {
      rolePermissions: {
        include: {
          permission: true,
        },
      },
    },
  });

  if (!role) {
    
    role = await prisma.role.create({
      data: {
        name: 'Super Admin',
        description: 'Full system access with all permissions',
        isSystem: true,
      },
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
      },
    });
  }

  const allPermissions = [];
  for (const resource of resources) {
    for (const action of actions) {
      const permissionName = `${resource}:${action}`;
      
      let permission = await prisma.permission.findUnique({
        where: { name: permissionName },
      });

      if (!permission) {
        permission = await prisma.permission.create({
          data: {
            name: permissionName,
            resource,
            action,
            description: `${action.charAt(0).toUpperCase() + action.slice(1)} ${resource}`,
          },
        });
      }

      allPermissions.push(permission);
    }
  }

  const existingPermissionIds = role.rolePermissions.map(rp => rp.permissionId);
  
  for (const permission of allPermissions) {
    if (!existingPermissionIds.includes(permission.id)) {
      await prisma.rolePermission.create({
        data: {
          roleId: role.id,
          permissionId: permission.id,
        },
      });
    }
  }

  return await prisma.role.findUnique({
    where: { id: role.id },
    include: {
      rolePermissions: {
        include: {
          permission: true,
        },
      },
    },
  }) as any;
}

createAdminUser();
