import React from 'react';
import { useAuth } from '../context/AuthContext';
import PageHeader from '@/components/shared/pageHeader/PageHeader';
import RoleNavigation from '../components/RoleNavigation';

const SuperAdminDashboard = () => {
  const { user } = useAuth();

  return (
    <>
      <PageHeader>
        <h4 className="mb-0">Super Admin Dashboard</h4>
      </PageHeader>
      <div className='main-content'>
        <div className='row'>
          <div className='col-12'>
            <RoleNavigation />
            
            <div className='card'>
              <div className='card-body'>
                <h5 className="card-title">Welcome, {user?.name || 'Super Admin'}</h5>
                <p className="card-text">This is the Super Admin dashboard with high-level access.</p>
                
                <div className="row mt-4">
                  <div className="col-md-4 mb-3">
                    <div className="card bg-primary text-white">
                      <div className="card-body text-center">
                        <h3>Admin Management</h3>
                        <p>Manage admin accounts</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="card bg-success text-white">
                      <div className="card-body text-center">
                        <h3>Faculty Management</h3>
                        <p>Manage faculty accounts</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="card bg-info text-white">
                      <div className="card-body text-center">
                        <h3>Reports</h3>
                        <p>View system reports</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SuperAdminDashboard;
