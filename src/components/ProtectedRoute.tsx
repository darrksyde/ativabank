import { useAuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import { useEffect, ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: ('super-admin' | 'admin' | 'customer')[];
}

export function ProtectedRoute({ 
  children, 
  allowedRoles = ['customer']
}: ProtectedRouteProps) {
  const { currentUser, isLoading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!currentUser) {
      router.replace('/');
      return;
    }

    // Check if user has permission for this route
    if (!allowedRoles.includes(currentUser.role)) {
      router.replace(`/${currentUser.role}`);
      return;
    }
  }, [currentUser, isLoading, router, allowedRoles]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!currentUser || !allowedRoles.includes(currentUser.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}

export default ProtectedRoute;