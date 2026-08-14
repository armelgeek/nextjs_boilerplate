'use server';

import { auth } from '@/lib/auth';
import { getSession } from '@/lib/auth-helpers';

export async function changePassword(formData: FormData) {
  const session = await getSession();
  
  if (!session?.user) {
    return { error: 'Not authenticated' };
  }

  try {
    const currentPassword = formData.get('currentPassword') as string;
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return { error: 'All fields are required' };
    }

    if (newPassword !== confirmPassword) {
      return { error: 'New passwords do not match' };
    }

    if (newPassword.length < 8) {
      return { error: 'Password must be at least 8 characters long' };
    }

    const response = await auth.api.changePassword({
      body: {
        newPassword,
        currentPassword,
        revokeOtherSessions: false,
      },
      headers: await import('next/headers').then((mod) => mod.headers()),
    });

    if (!response) {
      return { error: 'Failed to change password' };
    }

    return { success: true, message: 'Password changed successfully' };
  } catch (error: unknown) {
    console.error('Failed to change password:', error);

    const errorMessage = error instanceof Error ? error.message : String(error);

    if (errorMessage.includes('Invalid password') || errorMessage.includes('incorrect')) {
      return { error: 'Current password is incorrect' };
    }
    
    return { error: 'Failed to change password. Please try again.' };
  }
}
