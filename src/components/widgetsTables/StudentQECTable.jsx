import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiEye, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import { GetApi } from '@/utils/Api/ApiServices';
import Swal from 'sweetalert2';

const StudentQECTable = ({ title }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch QEC surveys assigned to the student
  const { data: surveysResponse, isLoading, error, refetch } = useQuery({
    queryKey: ['student-surveys'],
    queryFn: () => GetApi('/my-surveys'),
    refetchOnWindowFocus: false,
  });

  const surveys = surveysResponse?.data || [];
  
  // Calculate pagination
  const totalPages = Math.ceil(surveys.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = surveys.slice(indexOfFirstItem, indexOfLastItem);

  // Handle pagination
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <span className="badge bg-success">Completed</span>;
      case 'pending':
        return <span className="badge bg-warning">Pending</span>;
      case 'expired':
        return <span className="badge bg-danger">Expired</span>;
      default:
        return <span className="badge bg-secondary">Not Started</span>;
    }
  };

  return (
    <div className="col-lg-12">
      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">{title}</h5>
          <div>
            <button 
              className="btn btn-sm btn-outline-secondary me-2" 
              onClick={() => refetch()}
              disabled={isLoading}
            >
              Refresh
            </button>
          </div>
        </div>
        <div className="card-body">
          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading surveys...</p>
            </div>
          ) : error ? (
            <div className="alert alert-danger">
              <FiAlertCircle className="me-2" />
              Error loading surveys: {error.message || 'Failed to load data'}
            </div>
          ) : surveys.length === 0 ? (
            <div className="alert alert-info">
              <FiCheckCircle className="me-2" />
              No surveys are currently assigned to you.
            </div>
          ) : (
            <>
              <div className="table-resonsive">
                <table className="table table-hover table-striped">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Title</th>
                      <th scope="col">Description</th>
                      <th scope="col">Assigned Date</th>
                      {/* <th scope="col">Due Date</th> */}
                      <th scope="col">Status</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((survey, index) => (
                      <tr key={survey.id}>
                        <th scope="row">{indexOfFirstItem + index + 1}</th>
                        <td>{survey.survey.title}</td>
                        <td>{survey.survey?.description?.slice(0, 50)  || 'No description available'}</td>
                        {/* <td>{formatDate(survey.assigned_date)}</td> */}
                        <td>{formatDate(survey.created_at)}</td>
                        <td>{getStatusBadge(survey.status)}</td>
                        <td>
                          <div className="d-flex gap-2">
                            {/* <Link 
                              to={`/qec-view/${survey.id}`} 
                              className="btn btn-sm btn-outline-primary"
                              title="View Survey"
                            >
                              <FiEye size={16} />
                            </Link> */}
                            {survey.status !== 'completed' ? (
                              <Link 
                                to={`/qec-fill/${survey.id}`} 
                                className="btn btn-sm btn-primary"
                                title="Fill Survey"
                              >
                                Fill
                              </Link>
                            ) : (
                              <div className="d-flex gap-2 align-items-center">
                                {/* <span className="badge bg-success">Filled</span> */}
                                <Link 
                                  to={`/qec-filled-view/${survey.survey_id}/${survey.id}`} 
                                  className="btn btn-sm btn-info"
                                  title="View Responses"
                                >
                                  <FiEye size={16} />
                                </Link>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <nav aria-label="Page navigation" className="mt-4">
                  <ul className="pagination justify-content-center">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </button>
                    </li>
                    {[...Array(totalPages)].map((_, index) => (
                      <li 
                        key={index} 
                        className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                      >
                        <button 
                          className="page-link" 
                          onClick={() => handlePageChange(index + 1)}
                        >
                          {index + 1}
                        </button>
                      </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentQECTable;
