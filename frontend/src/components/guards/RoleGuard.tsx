// components/guards/RoleGuard.tsx
'use client';

import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallbackPath?: string;
}

export default function RoleGuard({ 
  children, 
  allowedRoles, 
  fallbackPath = '/unauthorized' 
}: RoleGuardProps) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated || !user) {
        router.push('/login');
        return;
      }

      const hasRequiredRole = allowedRoles.includes(user.role);
      
      if (!hasRequiredRole) {
        router.push(fallbackPath);
      }
    }
  }, [user, loading, isAuthenticated, allowedRoles, fallbackPath, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null; // La redirection est gérée dans useEffect
  }

  if (!allowedRoles.includes(user.role)) {
    return null; // La redirection est gérée dans useEffect
  }

  return <>{children}</>;
}