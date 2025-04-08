import React, { createContext, useContext, useState, useEffect } from 'react';
// import Cookies from 'js-cookie';
// import Cookies from 'js-cookie';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  // Load authentication state from cookies on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setIsAuthenticated(true);
        setToken(storedToken);
        setUser(userData);
        setRole(userData.user_type);
      } catch (error) {
        console.error('Error parsing user data from cookie:', error);
        // Clear invalid cookies
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = (userData, apiToken) => {
    // Store in cookies (expires in 7 days)
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
    // Clear cookies
    Cookies.remove('token');
    Cookies.remove('user');
    
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
    logout,
    // Add institute_id for convenience in components
    institute_id: user?.institute_id
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
