import React from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import Footer from '@/components/shared/Footer'
import { useParams, useNavigate } from 'react-router-dom'
import { FiCalendar, FiCheck, FiCheckCircle, FiFileText, FiList, FiTarget, FiUser } from 'react-icons/fi'
import { DeleteApi, GetApi, PostApi } from '@/utils/Api/ApiServices'
import { useQuery } from '@tanstack/react-query'
import Swal from 'sweetalert2'

const QECAssignmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch assignment details
  const { 
    data: assignmentResponse, 
    isLoading: isAssignmentLoading, 
    error: assignmentError,
    refetch: refetchAssignment
  } = useQuery({
    queryKey: ['assignment-details', id],
    queryFn: () => GetApi(`/survey-assign/${id}`)
  });

  // Fetch survey details based on the assignment survey_id
  const { 
    data: surveyResponse, 
    isLoading: isSurveyLoading, 
    error: surveyError 
  } = useQuery({
    queryKey: ['survey-details', assignmentResponse?.data?.data?.survey_id],
    queryFn: () => GetApi(`/surveys/${assignmentResponse?.data?.data?.survey_id}`),
    enabled: !!assignmentResponse?.data?.data?.survey_id
  });

  // Static data for demonstration
  const staticAssignment = {
    id: id,
    survey_id: 2,
    survey_title: "Teacher Evaluation Form",
    term: "2025-spring",
    assigned_by: "13",
    created_at: "2025-05-08 18:48:30",
    department: "Computer Science",
    program: "BS Computer Science",
    course: "Introduction to Programming",
    status: "active"
  };

  const staticSurvey = {
    id: staticAssignment.survey_id,
    title: staticAssignment.survey_title,
    description: "Comprehensive evaluation of teaching faculty performance across all departments",
    sections: [
      {
        id: 1,
        title: "Instructor",
        questions: [
          {
            id: 1,
            text: "The Instructor is prepared for each class",
            type: "radio",
            options: [
              { id: 1, label: "A", text: "A" },
              { id: 2, label: "B", text: "B" },
              { id: 3, label: "C", text: "C" },
              { id: 4, label: "D", text: "D" }
            ]
          },
          {
            id: 2,
            text: "The Instructor demonstrates knowledge of the subject",
            type: "radio",
            options: [
              { id: 5, label: "A", text: "A" },
              { id: 6, label: "B", text: "B" },
              { id: 7, label: "C", text: "C" },
              { id: 8, label: "D", text: "D" }
            ]
          }
        ]
      }
    ]
  };

  // Process data - use API data if available, otherwise use static data
  const assignment = assignmentResponse?.data?.data || staticAssignment;
  const survey = surveyResponse?.data?.data || staticSurvey;
  const isLoading = isAssignmentLoading || isSurveyLoading;
  const hasError = assignmentError || surveyError;

  // Format term for display
  const formatTerm = (term) => {
    if (!term) return 'N/A';
    const [year, semester] = term.split('-');
    return `${semester.charAt(0).toUpperCase() + semester.slice(1)} ${year}`;
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
      <PageHeader>
        <h4 className="mb-0">Assignment Details</h4>
      </PageHeader>
      <div className='main-content'>
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
                      <h5 className="card-title mb-0">{survey?.title || 'Survey Details'}</h5>
                      <p className="text-muted mb-0 small">{survey?.description || 'No description available'}</p>
                    </div>
                    <div className="d-flex gap-2">
                      <button 
                        className="btn btn-outline-primary"
                        onClick={() => navigate(`/qec/view/${survey.id}`)}
                      >
                        <FiFileText className="me-1" /> View Survey
                      </button>
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
                                <td width="40%" className="fw-medium">Assignment ID:</td>
                                <td>{assignment.id}</td>
                              </tr>
                              <tr>
                                <td className="fw-medium">Term:</td>
                                <td>{formatTerm(assignment.term)}</td>
                              </tr>
                              <tr>
                                <td className="fw-medium">Created On:</td>
                                <td>{assignment.created_at || 'N/A'}</td>
                              </tr>
                              <tr>
                                <td className="fw-medium">Status:</td>
                                <td>
                                  <span className={`badge bg-${assignment.status === 'active' ? 'success' : 'warning'}`}>
                                    {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                                  </span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                      
                      <div className="col-md-6">
                        <h6 className="fw-bold mb-3">Assignment Target</h6>
                        <div className="border rounded p-3">
                          <table className="table table-sm mb-0">
                            <tbody>
                              <tr>
                                <td width="40%" className="fw-medium">Department:</td>
                                <td>{assignment.department || 'All Departments'}</td>
                              </tr>
                              <tr>
                                <td className="fw-medium">Program:</td>
                                <td>{assignment.program || 'All Programs'}</td>
                              </tr>
                              <tr>
                                <td className="fw-medium">Course:</td>
                                <td>{assignment.course || 'All Courses'}</td>
                              </tr>
                              <tr>
                                <td className="fw-medium">Assigned By:</td>
                                <td>Admin (ID: {assignment.assigned_by})</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    <div className="alert alert-info mt-4">
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
                    </div>
                  </div>
                </div>
              </div>

              {/* Survey Questions Preview */}
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-header">
                    <h5 className="card-title">Survey Questions Preview</h5>
                  </div>
                  <div className="card-body">
                    {survey.sections && survey.sections.length > 0 ? (
                      survey.sections.map((section) => (
                        <div key={section.id} className="mb-4">
                          <h6 className="fw-bold mb-3">{section.title}</h6>
                          {section.questions && section.questions.length > 0 ? (
                            section.questions.map((question, index) => (
                              <div key={question.id} className="mb-3 border-bottom pb-3">
                                <p className="mb-2 fw-medium">{index + 1}. {question.text}</p>
                                {question.type === 'radio' && question.options && (
                                  <div className="ps-4">
                                    {question.options.map((option) => (
                                      <div key={option.id} className="form-check">
                                        <input 
                                          className="form-check-input" 
                                          type="radio" 
                                          name={`question_${question.id}`} 
                                          id={`option_${option.id}`} 
                                          value={option.label}
                                          disabled
                                        />
                                        <label className="form-check-label" htmlFor={`option_${option.id}`}>
                                          {option.text}
                                        </label>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))
                          ) : (
                            <p className="text-muted">No questions in this section</p>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-muted">No sections found in this survey</p>
                    )}
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
