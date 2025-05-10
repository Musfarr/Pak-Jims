import React from 'react';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '@/components/shared/pageHeader/PageHeader';
import EstimateStatistics from '@/components/widgetsStatistics/EstimateStatistics';
import { Link } from 'react-router-dom';
import { FiEdit, FiEye, FiTrash2, FiUserPlus, FiPlus } from 'react-icons/fi';
import Pagination from '@/components/shared/Pagination';
import { useQuery } from '@tanstack/react-query';
import { GetApi } from '@/utils/Api/ApiServices';
import SalesPipelineChart from '@/components/widgetsCharts/SalesPipelineChart';
import DeviceUseChart from '@/components/widgetsCharts/DeviceUseChart'

const SuperAdminDashboard = () => {
  const { user } = useAuth();

  // Fetch institutes data
  const { data: response, isLoading, isError } = useQuery({
    queryKey: ['institutes'],
    queryFn: () => GetApi('/dashboard')
  });

  const institutes = response?.data || [];

  const statisticsData = [
    { amount: institutes.totalInstitues || '0', description: 'Total Institutes', icon: 'feather-users', bgColor: 'bg-primary' },
    { amount: institutes.totalBranches || '0', description: 'Total Branches', icon: 'feather-users', bgColor: 'bg-success' },
    { amount: institutes.totalAdmins || '0', description: 'Total Admins', icon: 'feather-users', bgColor: 'bg-warning' },
    { amount: institutes.totalFaculties || '0', description: 'Total Faculties', icon: 'feather-bar-chart-2', bgColor: 'bg-teal' },
  ];

  return (
    <>
      <PageHeader>
        <h4 className="mb-0">Super Admin Dashboard</h4>
      </PageHeader>
      <div className="main-content">
        <div className="row">
          <EstimateStatistics statisticsData={statisticsData} />


          


          <div className="row">
                
                <SalesPipelineChart />
                <DeviceUseChart />
          </div>
        </div>
      </div>
    </>
  );
};

export default SuperAdminDashboard;
