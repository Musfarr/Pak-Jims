import React from 'react';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '@/components/shared/pageHeader/PageHeader';
import EstimateStatistics from '@/components/widgetsStatistics/EstimateStatistics';
import { useQuery } from '@tanstack/react-query';
import { GetApi } from '@/utils/Api/ApiServices';


const AdminDashboard = () => {
  const { user } = useAuth();
  const { data: response, isLoading, isError } = useQuery({
    queryKey: ['institutes'],
    queryFn: () => GetApi('dashboard')
  });

  const institutes = response?.data || [];

  const statisticsData = [
    { amount: institutes.totalInstitues || '0', description: 'Total Institutes', icon: 'feather-users', bgColor: 'bg-primary' },
    { amount: institutes.totalBranches || '0', description: 'Total Branches', icon: 'feather-users', bgColor: 'bg-success' },
    { amount: institutes.totalAdmins || '0', description: 'Total Admins', icon: 'feather-users', bgColor: 'bg-warning' },
    { amount: institutes.totalUsers || '0', description: 'Total Users', icon: 'feather-bar-chart-2', bgColor: 'bg-teal' }
  ];  
  return (
    <>
      <PageHeader>
        <h4 className="mb-0">{user?.name || 'Admin'}</h4>
      </PageHeader>
      <div className='main-content'>
        <div className='row'>
          <EstimateStatistics statisticsData={statisticsData} />

          {/* <div className='col-12'>  
            <div className='card'>
              <div className='card-body'>
                <h5 className="card-title">Welcome, {user?.name || 'Admin'}</h5>
                <p className="card-text">This is the Admin dashboard with administrative access.</p>
                
                <div className="row mt-4">
                  <div className="col-md-4 mb-3">
                    <div className="card bg-primary text-white">
                      <div className="card-body text-center">
                        <h3>Student Management</h3>
                        <p>Manage student accounts</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="card bg-success text-white">
                      <div className="card-body text-center">
                        <h3>Course Management</h3>
                        <p>Manage courses and programs</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="card bg-info text-white">
                      <div className="card-body text-center">
                        <h3>Analytics</h3>
                        <p>View basic analytics</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
