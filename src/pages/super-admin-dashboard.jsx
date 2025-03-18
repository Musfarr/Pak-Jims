import React from 'react';
import { useAuth } from '../context/AuthContext';
import PageHeader from '@/components/shared/pageHeader/PageHeader';
import RoleNavigation from '../components/RoleNavigation';
import EstimateStatistics from '@/components/widgetsStatistics/EstimateStatistics';
import Tasks from '@/components/widgetsTables/Tasks';
const SuperAdminDashboard = () => {
  const { user } = useAuth();

  return (
    <>
      <PageHeader>
        <h4 className="mb-0">INSTITUTE OF MEDICAL SCIENCES</h4>
      </PageHeader>
      <div className='main-content'>
        <div className='row'>
            <EstimateStatistics />
          <div className='col-12'>
                      
            <Tasks title={"Branches"}/>
          </div>
        </div>
      </div>
    </>
  );
};

export default SuperAdminDashboard;
