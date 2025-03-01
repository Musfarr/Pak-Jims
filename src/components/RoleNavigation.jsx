import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoleNavigation = () => {
  const { role, logout, hasRole } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    const redirectTo = logout();
    navigate(redirectTo);
  };
  
  return (
    <div className="card mb-4">
      <div className="card-body">
        <h5 className="card-title">Role Navigation</h5>
        <p className="card-text text-muted">Current Role: <strong>{role}</strong></p>
        
        <div className="d-flex flex-wrap gap-2">
          {/* All users can access their own dashboard */}
          <Link to={`/${role}-dashboard`} className="btn btn-sm btn-primary">
            My Dashboard
          </Link>
          
          {/* Only admin and above can access admin dashboard */}
          {hasRole({ minLevel: 'admin' }) && (
            <Link to="/admin-dashboard" className="btn btn-sm btn-info">
              Admin Dashboard
            </Link>
          )}
          
          {/* Only superadmin and above can access superadmin dashboard */}
          {hasRole({ minLevel: 'superadmin' }) && (
            <Link to="/super-admin-dashboard" className="btn btn-sm btn-warning">
              Super Admin Dashboard
            </Link>
          )}
          
          {/* Only masteradmin can access masteradmin dashboard */}
          {hasRole({ minLevel: 'masteradmin' }) && (
            <Link to="/master-admin-dashboard" className="btn btn-sm btn-danger">
              Master Admin Dashboard
            </Link>
          )}
          
          {/* Common area for faculty and above */}
          {hasRole({ minLevel: 'faculty' }) && (
            <Link to="/faculty-dashboard" className="btn btn-sm btn-success">
              Faculty Area
            </Link>
          )}
          
          {/* Student area */}
          <Link to="/student-dashboard" className="btn btn-sm btn-secondary">
            Student Area
          </Link>
          
          {/* Logout button */}
          <button onClick={handleLogout} className="btn btn-sm btn-outline-danger ms-auto">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleNavigation;
