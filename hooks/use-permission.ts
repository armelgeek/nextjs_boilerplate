'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { checkPermissionAction } from '@/lib/check-permission';

export function usePermission(resource: string, action: string) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    async function checkPermission() {
      try {
        const result = await checkPermissionAction(resource, action);
        
        if (!result.isAuthenticated) {
          router.push('/login');
          return;
        }
        
        if (!result.hasPermission) {
          router.push('/unauthorized');
          return;
        }
        
        setHasPermission(true);
      } catch (error) {
        console.error('Permission check failed:', error);
        router.push('/unauthorized');
      } finally {
        setIsLoading(false);
      }
    }

    checkPermission();
  }, [resource, action, router]);

  return { isLoading, hasPermission };
}
