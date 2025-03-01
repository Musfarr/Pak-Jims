import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole, minimumRole }) => {
  const { isAuthenticated, hasRole, homePage } = useAuth();

  // Redirect to the appropriate page based on authentication and role
  if (!isAuthenticated) {
    return <Navigate to="/authentication/login/cover" replace />;
  }

  // Check if user has the exact required role (if specified)
  if (requiredRole && !hasRole(requiredRole)) {
    // Redirect to unauthorized page
    return <Navigate to="/unauthorized" replace />;
  }

  // Check if user has the minimum required role level (if specified)
  if (minimumRole && !hasRole({ minLevel: minimumRole })) {
    // Redirect to unauthorized page
    return <Navigate to="/unauthorized" replace />;
  }

  // User is authenticated and has the required role/permission
  return children;
};

export default ProtectedRoute;
