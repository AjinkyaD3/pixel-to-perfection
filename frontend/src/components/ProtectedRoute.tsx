import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '@/lib/api';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles 
}) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasRequiredRole, setHasRequiredRole] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuth = authService.isAuthenticated();
        setIsAuthenticated(isAuth);

        if (isAuth && allowedRoles && allowedRoles.length > 0) {
          // Verify user's role if roles are specified
          const currentUser = authService.getCurrentUser();
          if (currentUser && allowedRoles.includes(currentUser.role)) {
            setHasRequiredRole(true);
          } else {
            // User doesn't have the required role
            setHasRequiredRole(false);
          }
        } else if (isAuth) {
          // No role restrictions, but user is authenticated
          setHasRequiredRole(true);
        }

        setLoading(false);
      } catch (error) {
        console.error('Authentication check failed:', error);
        setIsAuthenticated(false);
        setHasRequiredRole(false);
        setLoading(false);
      }
    };

    checkAuth();
  }, [allowedRoles]);

  if (loading) {
    // You could show a loading spinner here
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  if (!hasRequiredRole) {
    // Redirect to unauthorized page if authenticated but lacking required role
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  // Render children if authenticated and authorized
  return <>{children}</>;
};

export default ProtectedRoute; 