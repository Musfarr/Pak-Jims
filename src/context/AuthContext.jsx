import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);



  const login = (userData, apiToken) => {
    localStorage.setItem('token', apiToken);
    localStorage.setItem('user', JSON.stringify(userData));
    
    setIsAuthenticated(true);
    setToken(apiToken);
    setUser(userData);
    setRole(userData.user_type);
    
    // Determine redirect based on user type
    let redirectTo = '/dashboard';
    if (userData.user_type === 'super_admin') {
      redirectTo = '/super-admin-dashboard';
    } else if (userData.user_type === 'admin') {
      redirectTo = '/admin-dashboard';
    } else if (userData.user_type === 'faculty') {
      redirectTo = '/faculty-dashboard';
    } else if (userData.user_type === 'student') {
      redirectTo = '/student-dashboard';
    }
    
    return { success: true, redirectTo };
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Reset state
    setIsAuthenticated(false);
    setToken(null);
    setUser(null);
    setRole(null);
    
    return '/authentication/login';
  };

  // Value object to be provided to consumers
  const contextValue = {
    isAuthenticated,
    token,
    user,
    role,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;
