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
  const [isLoading, setIsLoading] = useState(true);

  // Load authentication state from localStorage on initial render
  useEffect(() => {
    const loadAuthState = () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedRole = localStorage.getItem('role');
        const storedUser = localStorage.getItem('user');
        
        console.log("AuthContext: Loading auth state, role:", storedRole);
        
        if (storedToken && storedRole) {
          setIsAuthenticated(true);
          setToken(storedToken);
          setRole(storedRole);
          setHomePage(roleHomepages[storedRole] || '/dashboard');
          
          // Set user data from localStorage if available, otherwise use default
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          } else {
            // Mock user data
            const defaultUser = {
              name: 'John Doe',
              email: 'john@example.com',
              role: storedRole
            };
            setUser(defaultUser);
            localStorage.setItem('user', JSON.stringify(defaultUser));
          }
        }
      } catch (error) {
        console.error("Error loading auth state:", error);
        // If there's an error, clear localStorage to prevent persistent errors
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAuthState();
    
    // Add event listener for storage changes in other tabs/windows
    window.addEventListener('storage', loadAuthState);
    
    return () => {
      window.removeEventListener('storage', loadAuthState);
    };
  }, []);

  const login = (email, password, userRole) => {
    console.log("AuthContext: Logging in with role:", userRole);
    
    // Create user object
    const userData = {
      name: 'John Doe',
      email: email,
      role: userRole
    };
    
    // Store auth data in localStorage
    localStorage.setItem('token', 'mock-jwt-token');
    localStorage.setItem('role', userRole);
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Update state
    setIsAuthenticated(true);
    setToken('mock-jwt-token');
    setRole(userRole);
    setUser(userData);
    
    const newHomePage = roleHomepages[userRole] || '/dashboard';
    setHomePage(newHomePage);
    
    return { success: true, redirectTo: newHomePage };
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    
    // Reset state
    setIsAuthenticated(false);
    setToken(null);
    setUser(null);
    setRole(null);
    setHomePage('/');
    
    return '/authentication/login';
  };

  // Check if user has a specific role or minimum role level
  const hasRole = (roleCheck) => {
    console.log("AuthContext: Checking role:", roleCheck, "Current role:", role);
    
    if (!role) return false;
    
    // If roleCheck is a string, check for exact match
    if (typeof roleCheck === 'string') {
      return role.toLowerCase() === roleCheck.toLowerCase();
    }
    
    // If roleCheck is an object with minLevel property, check for minimum role level
    if (roleCheck && roleCheck.minLevel) {
      const userRoleLevel = roleHierarchy[role.toLowerCase()] || 0;
      const requiredRoleLevel = roleHierarchy[roleCheck.minLevel.toLowerCase()] || 0;
      return userRoleLevel >= requiredRoleLevel;
    }
    
    return false;
  };

  // Value object to be provided to consumers
  const contextValue = {
    isAuthenticated,
    token,
    user,
    role,
    homePage,
    isLoading,
    login,
    logout,
    hasRole
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
