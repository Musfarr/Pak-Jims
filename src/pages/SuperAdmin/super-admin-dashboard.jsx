import React from 'react';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '@/components/shared/pageHeader/PageHeader';
import EstimateStatistics from '@/components/widgetsStatistics/EstimateStatistics';
import { Link } from 'react-router-dom';
import { FiEdit, FiEye, FiTrash2, FiUserPlus, FiPlus } from 'react-icons/fi';
import Pagination from '@/components/shared/Pagination';
import { useQuery } from '@tanstack/react-query';
import { GetApi } from '@/utils/Api/ApiServices';

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
    { amount: institutes.totalStudents || '0', description: 'Total Students', icon: 'feather-bar-chart-2', bgColor: 'bg-teal' }
  ];

  return (
    <>
      <PageHeader>
        <h4 className="mb-0">Super Admin Dashboard</h4>
      </PageHeader>
      <div className="main-content">
        <div className="row">
          <EstimateStatistics statisticsData={statisticsData} />
          <div className='col-12'>          
          {/* <div className='col-12'>
            <div className='card'>
              <div className='card-body'>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="card-title">Institutes List</h5>
                    <Link to="/institutes/create" className="btn btn-primary hover">
                    <FiPlus size={16} /> Add New Institute 
                    </Link>
                </div>
                
                {isLoading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading institutes...</p>
                  </div>
                ) : isError ? (
                  <div className="alert alert-danger">
                    Error loading institutes. Please try again later.
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>School Name</th>
                        <th>Registration No</th>
                        <th>ISO Certified No</th>
                        <th>NTN No</th>
                        <th>Phone No</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {institutes.map((institute) => (
                        <tr key={institute.id}>
                          <td>{institute.name}</td>
                          <td>{institute.registration_no}</td>
                          <td>{institute.iso_certified_no}</td>
                          <td>{institute.ntn_no}</td>
                          <td>{institute.phone_no}</td>
                          <td>{institute.email}</td>
                          <td>{institute.address}</td>
                          <td>
                            <div className="d-flex gap-2">
                              <Link to={`/institutes/edit/${institute.id}`} className="btn btn-sm btn-warning">
                                <FiEdit />
                              </Link>
                              <Link 
                                to={`/branch/create/${institute.id}`} 
                                className="btn btn-sm btn-primary"
                              >
                                <FiPlus className="me-1" /> Add Branch
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </div>
                )}
                
                {!isLoading && !isError && institutes.length === 0 && (
                  <div className="text-center py-4">
                    <p className="text-muted text-bold">No institutes found</p>
                    
                  </div>
                )}
                
              </div>
              <div className="card-footer">
                <Pagination />
              </div>
            </div>
          </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default SuperAdminDashboard;
