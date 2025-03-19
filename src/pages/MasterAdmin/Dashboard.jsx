import React from 'react';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '@/components/shared/pageHeader/PageHeader';
import RoleNavigation from '../../components/RoleNavigation';
import { Link } from 'react-router-dom';
import { FiUsers, FiSettings, FiShield, FiDatabase, FiBook, FiUserCheck } from 'react-icons/fi';

const MasterAdminDashboard = () => {
  const { user } = useAuth();

  return (
    <>
      <PageHeader>
        <h4 className="mb-0">Master Admin Dashboard</h4>
      </PageHeader>
      <div className='main-content'>
        <div className='row'>
          <div className='col-12'>
            <RoleNavigation />
            
            <div className='card'>
              <div className='card-body'>
                <h5 className="card-title">Welcome, {user?.name || 'Master Admin'}</h5>
                <p className="card-text">This is the Master Admin dashboard with highest level of access.</p>
                
                <div className="row mt-4">
                  <div className="col-md-3 mb-3">
                    <div className="card bg-primary text-white">
                      <div className="card-body text-center">
                        <FiSettings className="fs-1 mb-2" />
                        <h3>System Management</h3>
                        <p>Manage all system settings</p>
                        <Link to="/system/settings" className="btn btn-light mt-2">Manage</Link>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 mb-3">
                    <div className="card bg-success text-white">
                      <div className="card-body text-center">
                        <FiUsers className="fs-1 mb-2" />
                        <h3>User Management</h3>
                        <p>Manage all user accounts</p>
                        <Link to="/users/management" className="btn btn-light mt-2">Manage</Link>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 mb-3">
                    <div className="card bg-info text-white">
                      <div className="card-body text-center">
                        <FiShield className="fs-1 mb-2" />
                        <h3>Role Management</h3>
                        <p>Configure roles and permissions</p>
                        <Link to="/roles/management" className="btn btn-light mt-2">Manage</Link>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 mb-3">
                    <div className="card bg-warning text-white">
                      <div className="card-body text-center">
                        <FiDatabase className="fs-1 mb-2" />
                        <h3>Institutes</h3>
                        <p>Manage all institutes</p>
                        <Link to="/institutes" className="btn btn-light mt-2">Manage</Link>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="row mt-3">
                  <div className="col-md-3 mb-3">
                    <div className="card bg-danger text-white">
                      <div className="card-body text-center">
                        <FiUserCheck className="fs-1 mb-2" />
                        <h3>Super Admins</h3>
                        <p>Manage Super Admin accounts</p>
                        <Link to="/super-admins" className="btn btn-light mt-2">Manage</Link>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 mb-3">
                    <div className="card bg-secondary text-white">
                      <div className="card-body text-center">
                        <FiBook className="fs-1 mb-2" />
                        <h3>Audit Logs</h3>
                        <p>View system audit logs</p>
                        <Link to="/audit/logs" className="btn btn-light mt-2">View</Link>
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

export default MasterAdminDashboard;
