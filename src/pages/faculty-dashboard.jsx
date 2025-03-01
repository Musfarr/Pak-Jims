import React from 'react';
import { useAuth } from '../context/AuthContext';
import PageHeader from '@/components/shared/pageHeader/PageHeader';
import RoleNavigation from '../components/RoleNavigation';

const FacultyDashboard = () => {
  const { user } = useAuth();

  return (
    <>
      <PageHeader>
        <h4 className="mb-0">Faculty Dashboard</h4>
      </PageHeader>
      <div className='main-content'>
        <div className='row'>
          <div className='col-12'>
            <RoleNavigation />
            
            <div className='card'>
              <div className='card-body'>
                <h5 className="card-title">Welcome, {user?.name || 'Faculty Member'}</h5>
                <p className="card-text">This is the Faculty dashboard with teaching staff access.</p>
                
                <div className="row mt-4">
                  <div className="col-md-4 mb-3">
                    <div className="card bg-primary text-white">
                      <div className="card-body text-center">
                        <h3>My Courses</h3>
                        <p>View and manage your courses</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="card bg-success text-white">
                      <div className="card-body text-center">
                        <h3>Grades</h3>
                        <p>Manage student grades</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="card bg-info text-white">
                      <div className="card-body text-center">
                        <h3>Attendance</h3>
                        <p>Track student attendance</p>
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

export default FacultyDashboard;
