import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const roleHierarchy = {
  masteradmin: 5,
  superadmin: 4,
  admin: 3,
  faculty: 2,
  student: 1
};

const roleHomepages = {
  masteradmin: '/master-admin-dashboard',
  superadmin: '/super-admin-dashboard',
  admin: '/admin-dashboard',
  faculty: '/faculty-dashboard',
  student: '/student-dashboard'
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [homePage, setHomePage] = useState('/');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');
    
    console.log("AuthContext: Stored role from localStorage:", storedRole);
    
    if (storedToken) {
      setIsAuthenticated(true);
      setToken(storedToken);
      setRole(storedRole);
      setHomePage(roleHomepages[storedRole] || '/dashboard');
      
      // Mock user data
      setUser({
        name: 'John Doe',
        email: 'john@example.com',
        role: storedRole
      });
    }
  }, []);

  const login = (email, password, userRole) => {
    console.log("AuthContext: Logging in with role:", userRole);
    
    localStorage.setItem('token', 'mock-jwt-token');
    localStorage.setItem('role', userRole);
    
    setIsAuthenticated(true);
    setToken('mock-jwt-token');
    setRole(userRole);
    
    const newHomePage = roleHomepages[userRole] || '/dashboard';
    setHomePage(newHomePage);
    
    setUser({
      name: 'John Doe',
      email: email,
      role: userRole
    });
    
    return { success: true, redirectTo: newHomePage };
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsAuthenticated(false);
    setToken(null);
    setUser(null);
    setRole(null);
    setHomePage('/');
    return '/authentication/login/cover';
  };

  // Check if user has a specific role or minimum role level
  const hasRole = (roleCheck) => {
    console.log("AuthContext: Checking role:", roleCheck, "Current role:", role);
    
    // Define role hierarchy (higher index = higher privilege)
    const roleHierarchy = ['student', 'faculty', 'admin', 'superadmin', 'masteradmin'];
    
    // If roleCheck is a string, check for exact match
    if (typeof roleCheck === 'string') {
      const result = role === roleCheck;
      console.log("AuthContext: Exact role check result:", result);
      return result;
    }
    
    // If roleCheck is an object with minLevel, check for minimum role level
    if (roleCheck && roleCheck.minLevel) {
      const currentRoleIndex = roleHierarchy.indexOf(role.toLowerCase());
      const requiredRoleIndex = roleHierarchy.indexOf(roleCheck.minLevel.toLowerCase());
      
      console.log("AuthContext: Min role check - Current index:", currentRoleIndex, "Required index:", requiredRoleIndex);
      
      // User has sufficient role if their role index is >= the required role index
      const result = currentRoleIndex >= requiredRoleIndex && requiredRoleIndex !== -1;
      console.log("AuthContext: Min role check result:", result);
      return result;
    }
    
    return false;
  };

  const value = {
    isAuthenticated,
    token,
    user,
    role,
    homePage,
    login,
    logout,
    hasRole
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;
