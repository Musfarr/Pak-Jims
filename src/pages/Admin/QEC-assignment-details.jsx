import React, { useState, useEffect } from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import Footer from '@/components/shared/Footer'
import { useParams, useNavigate } from 'react-router-dom'
import { FiCalendar, FiCheck, FiCheckCircle, FiFileText, FiList, FiTarget, FiUser, FiSave, FiX, FiEdit } from 'react-icons/fi'
import { DeleteApi, GetApi, PostApi, PutApi } from '@/utils/Api/ApiServices'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Swal from 'sweetalert2'
import { useLocation } from 'react-router-dom'
import Select from 'react-select'

const QECAssignmentDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const assignmentTerm = location.state?.assignmentTerm;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // State for editing mode
  const [isEditing, setIsEditing] = useState(false);

  // Fetch assignment details
  const { 
    data: assignmentResponse, 
    isLoading: isAssignmentLoading, 
    error: assignmentError,
    refetch: refetchAssignment
  } = useQuery({
    queryKey: ['assignment-details', id, assignmentTerm],
    queryFn: () => PostApi(`/survey-assign-show`, { term: assignmentTerm, survey_id: id})
  });

  // Fetch departments
  const { data: departmentsResponse, isLoading: isDepartmentsLoading } = useQuery({
    queryKey: ['departments'],
    queryFn: () => GetApi('/departments')
  });
  const departmentsData = departmentsResponse?.data?.data || [];


  // Fetch batches
  const { data: batchesResponse, isLoading: isBatchesLoading } = useQuery({
    queryKey: ['batches'],
    queryFn: () => GetApi('/batches')
  });
  const batchesData = batchesResponse?.data || [];

  // Fetch courses
  const { data: coursesResponse, isLoading: isCoursesLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: () => GetApi('/courses')
  });
  const coursesData = coursesResponse?.data?.data || [];

  // Fetch survey details based on the assignment survey_id

 

  // Process data from API response
  const assignment = assignmentResponse?.data?.data || {
    survey_id: id,
    term: assignmentTerm,
    course_ids: [],
    depart_ids: [],
    batch_ids: []
  };
  
  // Extract IDs directly from assignment data when needed
  const selectedDepartments = assignment?.depart_ids || [];
  const selectedBatches = assignment?.batch_ids || [];
  const selectedCourses = assignment?.course_ids || [];
  
  const isLoading = isAssignmentLoading || isDepartmentsLoading || isBatchesLoading || isCoursesLoading;
  const hasError = assignmentError;

  // Mutation for updating assignment
  const updateAssignmentMutation = useMutation({
    mutationFn: (data) => PutApi(`/survey-assign-update`, data),
    onSuccess: () => {
      Swal.fire('Success', 'Assignment updated successfully', 'success');
      queryClient.invalidateQueries(['assignment-details', id, assignmentTerm]);
      setIsEditing(false);
    },
    onError: (error) => {
      Swal.fire('Error', error.message || 'Failed to update assignment', 'error');
    }
  });

  // Initialize edited values - only once when data loads or changes
  const [editedDepartments, setEditedDepartments] = useState([]);
  const [editedBatches, setEditedBatches] = useState([]);
  const [editedCourses, setEditedCourses] = useState([]);
  
  // Initialize edit states only when data actually changes
  const [dataInitialized, setDataInitialized] = useState(false);
  
  useEffect(() => {
    // Only update if we have assignment data and it hasn't been initialized yet
    // or if the assignment data has changed (based on the query key)
    if (assignmentResponse?.data?.data && (!dataInitialized || assignmentResponse)) {
      setEditedDepartments(assignmentResponse.data.data.depart_ids || []);
      setEditedBatches(assignmentResponse.data.data.batch_ids || []);
      setEditedCourses(assignmentResponse.data.data.course_ids || []);
      setDataInitialized(true);
    }
  }, [assignmentResponse, dataInitialized]);

  // Handle save changes
  const handleSaveChanges = () => {
    const updateData = {
      survey_id: id,
      term: assignmentTerm,
      depart_ids: editedDepartments,
      batch_ids: editedBatches,
      course_ids: editedCourses
    };
    
    updateAssignmentMutation.mutate(updateData);
  };


  // Handle unassign
  const handleUnassign = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will unassign the survey. Users will no longer be able to access it.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, unassign it!'
    }).then((result) => {
      if (result.isConfirmed) {
        // This would be replaced with an actual API call in production
        // DeleteApi(`/survey-assign/${id}`)
        Swal.fire(
          'Unassigned!',
          'Survey has been unassigned.',
          'success'
        );
        // Navigate back to the assignments list
        navigate('/qec/assignments');
      }
    });
  };

  return (
    <>
      
      <div className='main-content '  >
        <div className='row'>
          {isLoading ? (
            <div className="col-12">
              <div className="card">
                <div className="card-body text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3">Loading assignment information...</p>
                </div>
              </div>
            </div>
          ) : hasError ? (
            <div className="col-12">
              <div className="card">
                <div className="card-body text-center py-5">
                  <div className="alert alert-danger">
                    An error occurred while loading the assignment information. Please try again.
                  </div>
                  <button 
                    className="btn btn-primary mt-3" 
                    onClick={() => {
                      refetchAssignment();
                    }}
                  >
                    Retry
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Survey Information Card */}
              <div className="col-lg-12">
                <div className="card mb-4">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <div>
                    </div>
                    <div className="d-flex gap-2">
                      
                      <button 
                        className="btn btn-outline-danger"
                        onClick={handleUnassign}
                      >
                        <FiTarget className="me-1" /> Unassign
                      </button>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6">
                        <h6 className="fw-bold mb-3">Assignment Information</h6>
                        <div className="border rounded p-3">
                          <table className="table table-sm mb-0">
                            <tbody>
                              <tr>
                                <td width="40%" className="fw-medium">Survey ID:</td>
                                <td>{assignment.survey_id}</td>
                              </tr>
                              <tr>
                                <td className="fw-medium">Term:</td>
                                <td>{assignment.term}</td>
                              </tr>
                              <tr>
                                <td className="fw-medium">Created On:</td>
                                <td>{assignment.created_at || 'N/A'}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                      
                      <div className="col-md-6 d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h6 className="fw-bold mb-0"></h6>
                          {!isEditing ? (
                            <button 
                              className="btn btn-sm btn-primary" 
                              onClick={() => setIsEditing(true)}
                            >
                              <FiEdit className="me-1" /> Edit Assignments
                            </button>
                          ) : (
                            <div className="d-flex gap-2">
                              <button 
                                className="btn btn-sm btn-success" 
                                onClick={handleSaveChanges}
                                disabled={updateAssignmentMutation.isLoading}
                              >
                                <FiSave className="me-1" /> Save
                              </button>
                              <button 
                                className="btn btn-sm btn-secondary" 
                                onClick={() => setIsEditing(false)}
                              >
                                <FiX className="me-1" /> Cancel
                              </button>
                            </div>
                          )}
                        </div>
                        {updateAssignmentMutation.isLoading && (
                          <div className="alert alert-info mb-3">
                            <div className="d-flex align-items-center">
                              <div className="spinner-border spinner-border-sm me-2" role="status">
                                <span className="visually-hidden">Loading...</span>
                              </div>
                              <div>Updating assignment...</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="row mt-4">
                      <div className="col-md-4">
                        <h6 className="fw-bold mb-3">Departments</h6>
                        <div className="border rounded p-3">
                          {isEditing ? (
                            <div>
                              <Select
                                isMulti
                                isLoading={isDepartmentsLoading}
                                options={departmentsData.map(dept => ({
                                  value: dept.id.toString(),
                                  label: dept.name
                                }))}
                                value={departmentsData
                                  .filter(dept => editedDepartments.includes(dept.id.toString()))
                                  .map(dept => ({
                                    value: dept.id.toString(),
                                    label: dept.name
                                  }))}
                                onChange={(selected) => {
                                  setEditedDepartments(selected.map(item => item.value));
                                }}
                                placeholder="Select departments..."
                                className="mb-3"
                              />
                            </div>
                          ) : (
                            <div>
                              {isDepartmentsLoading ? (
                                <div className="text-center py-3">
                                  <div className="spinner-border spinner-border-sm" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                  </div>
                                </div>
                              ) : editedDepartments.length === 0 ? (
                                <div className="text-muted">No departments assigned</div>
                              ) : (
                                <ul className="list-group list-group-flush">
                                  {departmentsData
                                    .filter(dept => editedDepartments.includes(dept.id.toString()))
                                    .map(dept => (
                                      <li key={dept.id} className="list-group-item py-2">
                                        <FiCheckCircle className="text-success me-2" />
                                        {dept.name}
                                      </li>
                                    ))}
                                </ul>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="col-md-4">
                        <h6 className="fw-bold mb-3">Batches</h6>
                        <div className="border rounded p-3">
                          {isEditing ? (
                            <div>
                              <Select
                                isMulti
                                isLoading={isBatchesLoading}
                                options={batchesData.map(batch => ({
                                  value: batch.id.toString(),
                                  label: batch.name
                                }))}
                                value={batchesData
                                  .filter(batch => editedBatches.includes(batch.id.toString()))
                                  .map(batch => ({
                                    value: batch.id.toString(),
                                    label: batch.name
                                  }))}
                                onChange={(selected) => {
                                  setEditedBatches(selected.map(item => item.value));
                                }}
                                placeholder="Select batches..."
                                className="mb-3"
                              />
                            </div>
                          ) : (
                            <div>
                              {isBatchesLoading ? (
                                <div className="text-center py-3">
                                  <div className="spinner-border spinner-border-sm" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                  </div>
                                </div>
                              ) : editedBatches.length === 0 ? (
                                <div className="text-muted">No batches assigned</div>
                              ) : (
                                <ul className="list-group list-group-flush">
                                  {batchesData
                                    .filter(batch => editedBatches.includes(batch.id.toString()))
                                    .map(batch => (
                                      <li key={batch.id} className="list-group-item py-2">
                                        <FiCheckCircle className="text-success me-2" />
                                        {batch.name}
                                      </li>
                                    ))}
                                </ul>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="col-md-4">
                        <h6 className="fw-bold mb-3">Courses</h6>
                        <div className="border rounded p-3">
                          {isEditing ? (
                            <div>
                              <Select
                                isMulti
                                isLoading={isCoursesLoading}
                                options={coursesData.map(course => ({
                                  value: course.id.toString(),
                                  label: course.name
                                }))}
                                value={coursesData
                                  .filter(course => editedCourses.includes(course.id.toString()))
                                  .map(course => ({
                                    value: course.id.toString(),
                                    label: course.name
                                  }))}
                                onChange={(selected) => {
                                  setEditedCourses(selected.map(item => item.value));
                                }}
                                placeholder="Select courses..."
                                className="mb-3"
                              />
                            </div>
                          ) : (
                            <div>
                              {isCoursesLoading ? (
                                <div className="text-center py-3">
                                  <div className="spinner-border spinner-border-sm" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                  </div>
                                </div>
                              ) : editedCourses.length === 0 ? (
                                <div className="text-muted">No courses assigned</div>
                              ) : (
                                <ul className="list-group list-group-flush">
                                  {coursesData
                                    .filter(course => editedCourses.includes(course.id.toString()))
                                    .map(course => (
                                      <li key={course.id} className="list-group-item py-2">
                                        <FiCheckCircle className="text-success me-2" />
                                        {course.name}
                                      </li>
                                    ))}
                                </ul>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* <div className="alert alert-info mt-4">
                      <div className="d-flex">
                        <div className="me-3">
                          <FiCheckCircle size={24} />
                        </div>
                        <div>
                          <h6 className="alert-heading">Survey Assignment Information</h6>
                          <p className="mb-0">
                            This survey is currently assigned for the <strong>{formatTerm(assignment.term)}</strong> term. 
                            {assignment.department !== 'All Departments' && 
                              ` It is targeted at the ${assignment.department} department`}
                            {assignment.program !== 'All Programs' && 
                              ` for ${assignment.program} program students`}
                            {assignment.course !== 'All Courses' && 
                              ` enrolled in ${assignment.course}`}.
                            Students and faculty will be able to access and fill this survey during this period.
                          </p>
                        </div>
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}

export default QECAssignmentDetails
