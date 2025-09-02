import React from 'react';
import { useAuth } from '../context/AuthContext';
import PageHeader from '@/components/shared/pageHeader/PageHeader';
import RoleNavigation from '../components/RoleNavigation';
import EstimateStatistics from '@/components/widgetsStatistics/EstimateStatistics';
import { useQuery } from '@tanstack/react-query';
import { GetApi } from '@/utils/Api/ApiServices';

const FacultyDashboard = () => {
  const { user } = useAuth();

  const { data: response, isLoading, isError } = useQuery({
    queryKey: ['facultyDashboard'],
    queryFn: () => GetApi('faculty/dashboard')
  });

  const facultyDashboard = response?.data || [];
  
  

  const statisticsData = [
    { amount: facultyDashboard?.summary?.completion_rate + '%' || '0', description: 'Completion Rate', icon: 'feather-users', bgColor: 'bg-primary' },
    { amount: facultyDashboard?.summary?.total_assigned || '0', description: 'Total Assigned', icon: 'feather-users', bgColor: 'bg-success' },
    { amount: facultyDashboard?.summary?.total_pending || '0', description: 'Total Pending', icon: 'feather-users', bgColor: 'bg-warning' },
    { amount: facultyDashboard?.summary?.total_submitted || '0', description: 'Total Submitted', icon: 'feather-bar-chart-2', bgColor: 'bg-teal' },
    // { amount: facultyDashboard?.average_score_submitted + '%' || '0', description: 'Average Score Submitted', icon: 'feather-bar-chart-2', bgColor: 'bg-success' },
    // { amount: facultyDashboard?.average_score_engaged  + '%' || '0', description: 'Average Score Engaged', icon: 'feather-bar-chart-2', bgColor: 'bg-teal' }
  ];  
  return (
    <>
      <PageHeader>
        <h4 className="mb-0">Faculty Dashboard</h4>
      </PageHeader>
      <div className='main-content'>
        <div className='row'>
          <EstimateStatistics statisticsData={statisticsData} />
          <div className='col-12'>
            {/* <RoleNavigation /> */}
            
            
          </div>
        </div>
      </div>
    </>
  );
};

export default FacultyDashboard;
