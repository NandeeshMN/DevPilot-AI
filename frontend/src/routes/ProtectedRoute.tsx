import React from 'react';
import { useAuthContext } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
}

/**
 * Validates request scopes against active authentication context parameters.
 * If authenticated, displays main child components; otherwise displays the fallback layout.
 */
export default function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isLoggedIn } = useAuthContext();
  
  if (!isLoggedIn) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
