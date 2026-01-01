import React from 'react';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '@/components/shared/pageHeader/PageHeader';
import EstimateStatistics from '@/components/widgetsStatistics/EstimateStatistics';
import { useQuery } from '@tanstack/react-query';
import { GetApi } from '@/utils/Api/ApiServices';
import WebAnalyticsChart from '@/components/widgetsCharts/WebAnalyticsChart';
import ReactApexChart from 'react-apexcharts';


const AdminDashboard = () => {
  const { user } = useAuth();
  const { data: response, isLoading, isError } = useQuery({
    queryKey: ['institutes'],
    queryFn: () => GetApi('admin/dashboard')
  });

  const institutes = response?.data || [];
  
  // Extract QEC data from API response
  const qecData = {
    // Overall institute progress data for bar chart
    overallProgress: {
      barChartQuestions: institutes.overall_institute_progress?.chart_data?.labels || [],
      barChartPercentages: institutes.overall_institute_progress?.chart_data?.scores || []
    },
    
    // Top 10 faculty members based on evaluation scores
    topFaculty: institutes.top_10_faculty || [],
    
    // Top 10 departments based on evaluation scores
    topDepartments: institutes.top_10_departments || [],
    
    // Department-wise scores
    departmentWiseScores: institutes.department_wise_scores || []
  };

 

  const statisticsData = [
    // { amount: institutes.overall_institute_progress?.total_qec_surveys || '0', description: 'Total QEC Surveys', icon: 'feather-users', bgColor: 'bg-success' },
    { amount: institutes.survey_statistics?.total_assigned || '0', description: 'Total Assigned', icon: 'feather-users', bgColor: 'bg-success' },
    { amount: institutes.survey_statistics?.total_pending || '0', description: 'Total Pending', icon: 'feather-users', bgColor: 'bg-warning' },
    { amount: institutes.survey_statistics?.total_submitted || '0', description: 'Total Submitted', icon: 'feather-bar-chart-2', bgColor: 'bg-teal' },
    { amount: institutes.survey_statistics?.completion_rate + '%' || '0', description: 'Completion Rate', icon: 'feather-users', bgColor: 'bg-primary' },
  ];  
  return (
    <>
      <PageHeader>
        <h4 className="mb-0">{user?.name || 'Admin'}</h4>
      </PageHeader>
      <div className='main-content'>
        <div className='row'>
          <EstimateStatistics statisticsData={statisticsData} />
          
          {/* QEC Dashboard Integration */}
          <div className='col-12 mt-4'>
            <div className='card'>
              <div className='card-header'>
                <h5 className='card-title'>QEC Dashboard</h5>
              </div>
              <div className='card-body'>
                <h6 className='mb-3'>Overall Institute Progress</h6>
                <div className='row'>
                  <div className='col-12'>
                    <WebAnalyticsChart data={qecData.overallProgress} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Faculty and Departments */}
          {/* <div className='col-md-6 mt-4'>
            <div className='card'>
              <div className='card-header'>
                <h5 className='card-title'>Top 10 Faculty</h5>
              </div>
              <div className='card-body'>
                <div className='table-responsive'>
                  <table className='table table-hover'>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Department</th>
                        <th>Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {qecData.topFaculty.map((faculty, index) => (
                        <tr key={faculty.faculty_id}>
                          <td>{index + 1}</td>
                          <td>{faculty.name}</td>
                          <td>{faculty.designation}</td>
                          <td>
                            <div className='d-flex align-items-center'>
                              <span className='me-2'>{faculty.score_percentage}%</span>
                              <div className='progress flex-grow-1' style={{ height: '5px' }}>
                                <div 
                                  className='progress-bar bg-success' 
                                  role='progressbar' 
                                  style={{ width: `${faculty.score_percentage}%` }} 
                                  aria-valuenow={faculty.score_percentage} 
                                  aria-valuemin='0' 
                                  aria-valuemax='100'
                                ></div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className='col-md-6 mt-4'>
            <div className='card'>
              <div className='card-header'>
                <h5 className='card-title'>Top 10 Departments</h5>
              </div>
              <div className='card-body'>
                <div className='table-responsive'>
                  <table className='table table-hover'>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Department</th>
                        <th>Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {qecData.topDepartments.map((dept, index) => (
                        <tr key={dept.department_id}>
                          <td>{index + 1}</td>
                          <td>{dept.name}</td>
                          <td>
                            <div className='d-flex align-items-center'>
                              <span className='me-2'>{dept.score_percentage}%</span>
                              <div className='progress flex-grow-1' style={{ height: '5px' }}>
                                <div 
                                  className='progress-bar bg-primary' 
                                  role='progressbar' 
                                  style={{ width: `${dept.score_percentage}%` }} 
                                  aria-valuenow={dept.score_percentage} 
                                  aria-valuemin='0' 
                                  aria-valuemax='100'
                                ></div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div> */}

          {/* Department-wise Scores */}
          {/* <div className='col-12 mt-4'>
            <div className='card'>
              <div className='card-header'>
                <h5 className='card-title'>Department-wise Scores</h5>
              </div>
              <div className='card-body'>
                <div className='table-responsive'>
                  <table className='table table-hover'>
                    <thead>
                      <tr>
                        <th>Department</th>
                        <th>Average</th>
                      </tr>
                    </thead>
                    <tbody>
                      {qecData.departmentWiseScores.map((dept, index) => {
                        return (
                          <tr key={dept.department_id}>
                            <td>{dept.department_name}</td>
                            <td>
                              <div className='d-flex align-items-center'>
                                <span className='me-2'>{dept.score_percentage}%</span>
                                <div className='progress flex-grow-1' style={{ height: '5px' }}>
                                  <div 
                                    className='progress-bar bg-info' 
                                    role='progressbar' 
                                    style={{ width: `${dept.score_percentage}%` }} 
                                    aria-valuenow={dept.score_percentage} 
                                    aria-valuemin='0' 
                                    aria-valuemax='100'
                                  ></div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
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
