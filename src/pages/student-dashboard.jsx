import React from 'react';
import { useAuth } from '../context/AuthContext';
import PageHeader from '@/components/shared/pageHeader/PageHeader';
import RoleNavigation from '../components/RoleNavigation';

const StudentDashboard = () => {
  const { user } = useAuth();

  return (
    <>
      <PageHeader>
        <h4 className="mb-0">Student Dashboard</h4>
      </PageHeader>
      <div className='main-content'>
        <div className='row'>
          <div className='col-12'>
            <RoleNavigation />
            
            <div className='card'>
              <div className='card-body'>
                <h5 className="card-title">Welcome, {user?.name || 'Student'}</h5>
                <p className="card-text">This is the Student dashboard with learning resources.</p>
                
                <div className="row mt-4">
                  <div className="col-md-4 mb-3">
                    <div className="card bg-primary text-white">
                      <div className="card-body text-center">
                        <h3>My Courses</h3>
                        <p>View your enrolled courses</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="card bg-success text-white">
                      <div className="card-body text-center">
                        <h3>Assignments</h3>
                        <p>View and submit assignments</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="card bg-info text-white">
                      <div className="card-body text-center">
                        <h3>Grades</h3>
                        <p>Check your grades</p>
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

export default StudentDashboard;
