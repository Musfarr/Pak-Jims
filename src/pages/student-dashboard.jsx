import React from 'react';
import { useAuth } from '../context/AuthContext';
import PageHeader from '@/components/shared/pageHeader/PageHeader';
import RoleNavigation from '../components/RoleNavigation';
import { useQuery } from '@tanstack/react-query';
import { GetApi } from '@/utils/Api/ApiServices';
import EstimateStatistics from '@/components/widgetsStatistics/EstimateStatistics';



const StudentDashboard = () => {
  const { user } = useAuth();

  const { data: response, isLoading, isError } = useQuery({
    queryKey: ['studentDashboard'],
    queryFn: () => GetApi('student/dashboard')
  });

  const studentDashboard = response?.data || [];
  

  const statisticsData = [
    { amount: studentDashboard?.summary?.completion_rate + '%' || '0', description: 'Completion Rate', icon: 'feather-users', bgColor: 'bg-primary' },
    { amount: studentDashboard?.summary?.total_assigned || '0', description: 'Total Assigned', icon: 'feather-users', bgColor: 'bg-success' },
    { amount: studentDashboard?.summary?.total_pending || '0', description: 'Total Pending', icon: 'feather-users', bgColor: 'bg-warning' },
    { amount: studentDashboard?.summary?.total_submitted || '0', description: 'Total Submitted', icon: 'feather-bar-chart-2', bgColor: 'bg-teal' }
  ];  
  return (
    <>
      <PageHeader>
        <h4 className="mb-0">Student Dashboard</h4>
      </PageHeader>
      <div className='main-content'>
        <div className='row'>
          <EstimateStatistics statisticsData={statisticsData} />
          <div className='col-12'>

            {/* <RoleNavigation /> */}
            
            {/* <div className='card'>
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
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentDashboard;
