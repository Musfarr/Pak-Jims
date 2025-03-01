import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Unauthorized = () => {
  const { role, logout, homePage } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    const redirectTo = logout();
    navigate(redirectTo);
  };
  
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body text-center">
              <h1 className="display-4 text-danger mb-4">Access Denied</h1>
              <div className="mb-4">
                <i className="fa fa-exclamation-triangle text-warning" style={{ fontSize: '4rem' }}></i>
              </div>
              <h5 className="mb-3">You don't have permission to access this page</h5>
              <p className="text-muted mb-4">
                Your current role ({role}) doesn't have the necessary permissions.
                Please contact an administrator if you believe this is an error.
              </p>
              <div className="d-flex justify-content-center gap-3">
                <Link to={homePage} className="btn btn-primary">
                  Go to Dashboard
                </Link>
                <button onClick={handleLogout} className="btn btn-outline-danger">
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
