import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { GetApi } from '@/utils/Api/ApiServices';
import Footer from '@/components/shared/Footer';

const apiMap = {
  '1': '/report/performa1-ind-evaluation',
  '2': '/report/performa2-ind-evaluation',
  '3': '/report/performa3-ind-evaluation',
  '4': '/report/performa4-ind-evaluation',
  '5': '/report/performa5-ind-evaluation',
  '6': '/report/performa6-ind-evaluation',
  '7': '/report/performa7-ind-evaluation',
  '8': '/report/performa8-ind-evaluation',
  '9': '/report/performa9-ind-evaluation',
  '10': '/report/performa10-ind-evaluation',
};

const QECSubmissionsList = () => {
  const { performa = '1', id } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  // Compose API endpoint
  const endpoint = `${apiMap[performa]}?per_page=${perPage}&page=${page}`;

  const { data: response, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['qec-submissions', performa, id, page, perPage],
    queryFn: () => GetApi(endpoint),
    enabled: !!apiMap[performa],
  });

  const submissions = response?.data || [];
  const pagination = response?.pagination || {};
  const currentPage = pagination.current_page || page;
  const lastPage = pagination.last_page || 1;
  const perPageFromApi = pagination.per_page || perPage;
  const total = pagination.total || 0;

  // Client-side filter by name
  const filteredSubmissions = submissions.filter(item =>
    item.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="main-content">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Submissions List (Performa {performa})</h5>
                <button className="btn btn-secondary" onClick={() => navigate(-1)}>
                  Back
                </button>
              </div>
              <div className="card-body">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="fas fa-search"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search by name"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                {isLoading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : isError ? (
                  <div className="alert alert-danger">
                    {error?.message || 'Error loading submissions'}
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>#</th>
                          {/* <th>Faculty</th> */}
                          <th>Department</th>
                          <th>Semester/Module</th>
                          <th>Name</th>
                          <th>Course ID</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredSubmissions.length > 0 ? (
                          filteredSubmissions.map((item, idx) => (
                            <tr key={item.survey_assignment_id || idx}>
                              <td>{(currentPage - 1) * perPageFromApi + idx + 1}</td>
                              {/* <td>{item.faculty}</td> */}
                              <td>{item.department}</td>
                              <td>{item.term}</td>
                              <td>{item.name}</td>
                              <td>{item.course_id}</td>
                              <td>
                                {/* Optionally add a view button for each submission */}
                                <button
                                  className="btn btn-outline-primary btn-sm"
                                  onClick={() => navigate(`/qec/submission-view/${performa}/${item.survey_assignment_id}/${item.user_id}`)}
                                >
                                  View Submission
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="7" className="text-center py-4">
                              <div className="text-muted">
                                <i className="fas fa-inbox me-2"></i>
                                No submissions found
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
                {/* Pagination Controls */}
                <div className="d-flex justify-content-between align-items-center mt-3 gap-3 flex-wrap">
                  <div className="text-muted small">
                    Page {currentPage} of {lastPage}
                  </div>
                  <div className="d-flex align-items-center gap-2 mx-auto">
                    <button
                      className="btn btn-outline-primary btn-sm"
                      disabled={currentPage === 1}
                      onClick={() => setPage(currentPage - 1)}
                    >
                      Previous
                    </button>
                    <button
                      className="btn btn-outline-primary btn-sm"
                      disabled={currentPage === lastPage}
                      onClick={() => setPage(currentPage + 1)}
                    >
                      Next
                    </button>
                  </div>
                  <div>
                    <select
                      value={perPage}
                      onChange={e => { setPerPage(Number(e.target.value)); setPage(1); }}
                      className="form-select form-select-sm w-auto d-inline-block"
                    >
                      {[10, 20, 50, 100].map(n => <option key={n} value={n}>{n} per page</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default QECSubmissionsList;
