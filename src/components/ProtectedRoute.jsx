import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole, minimumRole }) => {
  const { isAuthenticated, hasRole, homePage, isLoading } = useAuth();

  // Show loading indicator while authentication state is being determined
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Redirect to the login page if not authenticated
  if (!isAuthenticated) {
    // Store the current location to redirect back after login
    const currentPath = window.location.pathname;
    if (currentPath !== '/' && !currentPath.includes('/authentication/')) {
      sessionStorage.setItem('redirectAfterLogin', currentPath);
    }
    return <Navigate to="/authentication/login" replace />;
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
