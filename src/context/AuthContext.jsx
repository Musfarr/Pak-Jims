import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Check if user is authenticated on mount
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      setUserRole(localStorage.getItem('role'));
    }
  }, []);

  const login = (email, password) => {
    // For now, just store dummy values since we don't have API
    localStorage.setItem('token', 'dummy_token');
    localStorage.setItem('role', 'admin');
    setIsAuthenticated(true);
    setUserRole('admin');
    // Navigation will be handled by the router
    return true;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsAuthenticated(false);
    setUserRole(null);
    // Navigation will be handled by the router
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      userRole, 
      login, 
      logout,
      setIsAuthenticated,
      setUserRole 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
