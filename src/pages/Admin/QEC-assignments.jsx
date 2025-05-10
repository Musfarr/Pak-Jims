import React, { useState } from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import PageHeaderWidgets from '@/components/shared/pageHeader/PageHeaderWidgets'
import Footer from '@/components/shared/Footer'
import { useParams, useNavigate } from 'react-router-dom'
import { FiCalendar, FiCheck, FiEye, FiFileText, FiList, FiSearch, FiTarget, FiUser } from 'react-icons/fi'
import { GetApi } from '@/utils/Api/ApiServices'
import { useQuery } from '@tanstack/react-query'
import Swal from 'sweetalert2'

const QECAssignments = ({ title }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch assignments list
  const { 
    data: assignmentsResponse, 
    isLoading, 
    error,
    refetch
  } = useQuery({
    queryKey: ['survey-assignments', id],
    queryFn: () => GetApi(`/survey-assign/${id}`)
  });

  // Get assignments from API response or use static data
  const assignments = assignmentsResponse?.data ||[]


  // Filter assignments based on search term
  const filteredAssignments = assignments.filter(assignment => {
    return (
      assignment.term?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });


  
  // View details of assignment
  const handleViewDetails = (assignmentId) => {
    navigate(`/qec/assignment-details/${assignmentId}`);
  };

  return (
    <>
      <PageHeader>
        <h4 className="mb-0">QEC Assignments</h4>
      </PageHeader>
      <div className='main-content'>
        <div className='row'>
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">Assigned QEC Surveys</h5>
                <div className="d-flex align-items-center">
                  <div className="search-box me-2">
                    <div className="input-group">
                      <span className="input-group-text">
                        <FiSearch size={18} />
                      </span>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Search assignments..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-body pb-4">
                {isLoading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3">Loading assignment information...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-4">
                    <div className="alert alert-danger">
                      An error occurred while loading the assignments. Please try again.
                    </div>
                    <button 
                      className="btn btn-primary mt-3" 
                      onClick={refetch}
                    >
                      Retry
                    </button>
                  </div>
                ) : filteredAssignments.length === 0 ? (
                  <div className="text-center py-4">
                    <div className="alert alert-info">
                      No assignments found matching your search criteria.
                    </div>
                  </div>
                ) : (
                  <div className="table-rponsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Term</th>
                          <th>Survey</th>
                          <th>Assigned Details</th>
                          <th>Action</th>
                          
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAssignments.map((assignment , index) => (
                          <tr key={assignment.id}>
                            <td>{index + 1}</td>
                            <td>{assignment.survey.title}</td>
                            <td>{assignment.term}</td>
                            <td>
                              <button 
                                className="btn btn-sm btn-outline-primary" 
                                onClick={() => navigate(`/qec/assignment-details/${assignment.survey_id}` , { state: { assignmentTerm: assignment.term } })}
                                title="View Details"
                              >
                                <FiEye /> Details
                              </button>
                            </td>
                            <td>

                            <div className="d-flex gap-2">
                              <button 
                                className="btn btn-sm btn-outline-success" 
                                onClick={() => navigate(`/qec/assign/${assignment.survey_id}`)}
                                title="View Report"
                              >
                                Assign
                              </button>
                    
                              {/* <button 
                                className="btn btn-sm btn-outline-secondary" 
                                onClick={() => navigate(`/qec/report/${assignment.survey_id}`)}
                                title="View Report"
                              >
                                Report
                              </button> */}

                            </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default QECAssignments
