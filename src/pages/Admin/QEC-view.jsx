import React from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import PageHeaderWidgets from '@/components/shared/pageHeader/PageHeaderWidgets'
import Footer from '@/components/shared/Footer'
import { useParams } from 'react-router-dom'
import { FiCheckCircle, FiFileText, FiList, FiTarget, FiUser, FiAlertCircle } from 'react-icons/fi'
import { DeleteApi, GetApi } from '@/utils/Api/ApiServices';
import { useQuery } from '@tanstack/react-query';

const QECView = () => {
  const { id } = useParams();

  // Fetch departments using React Query
  const { data: departmentResponse, isLoading: isDepartmentLoading, error: departmentError } = useQuery({
    queryKey: ['departments'],
    queryFn: () => GetApi('/departments')
  });
  const departments = departmentResponse?.data?.data || [];

  // Fetch programs using React Query
  const { data: programResponse, isLoading: isProgramLoading, error: programError } = useQuery({
    queryKey: ['programs'],
    queryFn: () => GetApi('/programs')
  });
  const programs = programResponse?.data || [];

  // Fetch courses using React Query
  const { data: courseResponse, isLoading: isCourseLoading, error: courseError } = useQuery({
    queryKey: ['courses'],
    queryFn: () => GetApi('/courses')
  });
  const courses = courseResponse?.data?.data || [];

  // Fetch survey details using React Query
  const { 
    data: surveyResponse, 
    isLoading: isSurveyLoading, 
    error: surveyError 
  } = useQuery({
    queryKey: ['survey', id],
    queryFn: () => GetApi(`/surveys/${id}`),
    enabled: !!id // Only run query if id is available
  });

  // Process survey data from API response
  const surveyData = surveyResponse?.data || null;
  
  // Get all questions from all sections
  const getAllQuestions = () => {
    if (!surveyData || !surveyData.sections) return [];
    
    let allQuestions = [];
    surveyData.sections.forEach(section => {
      if (section.questions && section.questions.length > 0) {
        allQuestions = [...allQuestions, ...section.questions.map(q => ({
          ...q,
          sectionTitle: section.title // Add section title to each question
        }))];
      }
    });
    
    return allQuestions;
  };
  
  const questions = getAllQuestions();

  // Function to render question based on type
  const renderQuestion = (question, index) => {
    switch (question.type) {
      case 'radio':
        return (
          <div className="mb-4" key={question.id}>
            <label className="form-label fw-semibold">{index + 1}. {question.text}</label>
            <div className="ps-4 mt-2">
              {question.options && question.options.map((option, idx) => (
                <div key={idx} className="form-check mb-2">
                  <input 
                    className="form-check-input" 
                    type="radio" 
                    name={`question_${question.id}`} 
                    id={`option_${question.id}_${idx}`}
                    disabled
                  />
                  <label className="form-check-label" htmlFor={`option_${question.id}_${idx}`}>
                    {option.text} ({option.label})
                  </label>
                </div>
              ))}
            </div>
          </div>
        );
      case 'checkbox':
        return (
          <div className="mb-4" key={question.id}>
            <label className="form-label fw-semibold">{index + 1}. {question.text}</label>
            <div className="ps-4 mt-2">
              {question.options && question.options.map((option, idx) => (
                <div key={idx} className="form-check mb-2">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    name={`question_${question.id}`} 
                    id={`option_${question.id}_${idx}`}
                    disabled
                  />
                  <label className="form-check-label" htmlFor={`option_${question.id}_${idx}`}>
                    {option.text} ({option.label})
                  </label>
                </div>
              ))}
            </div>
          </div>
        );
      case 'textarea':
        return (
          <div className="mb-4" key={question.id}>
            <label className="form-label fw-semibold">{index + 1}. {question.text}</label>
            <textarea 
              className="form-control" 
              rows="3" 
              disabled 
              placeholder="Response area (not fillable in preview mode)"
            ></textarea>
          </div>
        );
      default:
        return (
          <div className="mb-4" key={question.id}>
            <label className="form-label fw-semibold">{index + 1}. {question.text}</label>
            <p className="text-muted small">Question type: {question.type}</p>
          </div>
        );
    }
  };
  
  // Group questions by section for display
  const renderQuestionsBySection = () => {
    if (!surveyData || !surveyData.sections) return null;
    
    return surveyData.sections.map((section, sectionIndex) => (
      <div key={section.id} className="mb-5">
        <h6 className="fw-bold mb-3 bg-light p-2 rounded">{sectionIndex + 1}. {section.title}</h6>
        {section.questions && section.questions.map((question, questionIndex) => 
          renderQuestion(question, questionIndex)
        )}
      </div>
    ));
  };

  return (
    <>
      <div className='main-content'>
        <div className='row'>
          <div className='col-12'>
            <div className="page-title-box d-flex align-items-center justify-content-between">
              <div className="page-title-left">
                
              </div>
              
            </div>
          </div>

          <div className="col-lg-12">
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="card-title">Quality Enhancement Cell (QEC) Questionnaire</h5>
                {surveyData && <p className="card-subtitle text-muted mb-0">{surveyData.title} - {surveyData.description}</p>}
              </div>
              <div className="card-body">
                {/* <div className="row mb-4">
                  <div className="col-lg-6">
                    <div className="border rounded p-3 h-100">
                      <h6 className="fw-bold mb-3">Questionnaire Details</h6>
                      <table className="table">
                        <tbody>
                          <tr>
                            <td width="40%" className="fw-medium">Target Audience:</td>
                            <td>
                              <div className="d-flex align-items-center">
                                <FiTarget className="me-2 text-primary" />
                                <span className="text-capitalize">{qecData.target_audience}</span>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td className="fw-medium">Start Date:</td>
                            <td>{qecData.start_date}</td>
                          </tr>
                          <tr>
                            <td className="fw-medium">End Date:</td>
                            <td>{qecData.end_date}</td>
                          </tr>
                          <tr>
                            <td className="fw-medium">Created On:</td>
                            <td>{qecData.created_at}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="border rounded p-3 h-100">
                      <h6 className="fw-bold mb-3">Assignment Settings</h6>
                      <div className="mb-3">
                        <label className="form-label" htmlFor="departmentSelect">Department</label>
                        <div className="input-group">
                          <div className="input-group-text"><FiList /></div>
                          <select className="form-select" id="departmentSelect" disabled={isDepartmentLoading}>
                            <option value="">Select Department</option>
                            {isDepartmentLoading && <option disabled>Loading departments...</option>}
                            {departments && departments.map(dept => (
                              <option key={dept.id} value={dept.id}>{dept.name}</option>
                            ))}
                            <option value="all">All Departments</option>
                            {departmentError && <option disabled>Error loading departments...</option>}
                          </select>
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label" htmlFor="programSelect">Program</label>
                        <div className="input-group">
                          <div className="input-group-text"><FiList /></div>
                          <select className="form-select" id="programSelect" disabled={isProgramLoading}>
                            <option value="">Select Program</option>
                            {isProgramLoading && <option disabled>Loading programs...</option>}
                            {programs && programs.map(program => (
                              <option key={program.id} value={program.id}>{program.name}</option>
                            ))}
                            <option value="all">All Programs</option>
                            {programError && <option disabled>Error loading programs...</option>}
                          </select>
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label" htmlFor="courseSelect">Course</label>
                        <div className="input-group">
                          <div className="input-group-text"><FiList /></div>
                          <select className="form-select" id="courseSelect" disabled={isCourseLoading}>
                            <option value="">Select Course</option>
                            {isCourseLoading && <option disabled>Loading courses...</option>}
                            {courses && courses.map(course => (
                              <option key={course.id} value={course.id}>{course.name}</option>
                            ))}
                            <option value="all">All Courses</option>
                            {courseError && <option disabled>Error loading courses...</option>}
                          </select>
                        </div>
                      </div>


                      <div className="mb-3">
                        <label className="form-label" htmlFor="assignToSelect">Assign To</label>
                        <div className="input-group">
                          <div className="input-group-text"><FiList /></div>
                          <select className="form-select" id="assignToSelect">
                            <option value="">Select Assign To</option>
                            <option value="faculty">Faculty</option>
                            <option value="student">Student</option>
                            <option value="all">All</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-lg">
                    <div className="border rounded p-3 h-100 ">
                      <div className="d-flex justify-content-end gap-2">
                        <button className="btn btn-danger">Cancel</button>
                        <button className="btn btn-primary">Assign</button>
                      </div>

                      
                    </div>
                  </div>


                </div> */}

                <div className="row">
                  <div className="col-12">
                    <div className="card border">
                      <div className="card-header bg-light d-flex justify-content-between align-items-center">
                        <h6 className="mb-0">Questionnaire Preview</h6>
                        <div className="text-muted small">
                          <FiFileText className="me-1" /> Total Questions: {questions.length}
                        </div>
                      </div>
                      <div className="card-body">
                        {isSurveyLoading ? (
                          <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="mt-3">Loading survey questions...</p>
                          </div>
                        ) : surveyError ? (
                          <div className="alert alert-danger">
                            <FiAlertCircle className="me-2" />
                            Error loading survey: {surveyError.message || 'Failed to load survey data'}
                          </div>
                        ) : !surveyData ? (
                          <div className="alert alert-warning">
                            <FiAlertCircle className="me-2" />
                            No survey found with ID: {id}
                          </div>
                        ) : (
                          <>
                            <div className="alert alert-info">
                              <FiCheckCircle className="me-2" />
                              This is a preview mode. The form is not fillable here. You can view how the questionnaire will appear to respondents.
                            </div>

                            <div className="mt-4">
                              <h6 className="fw-bold mb-3">Instructions</h6>
                              <p className="mb-4">Please answer all questions honestly. Your feedback is anonymous and will be used to improve teaching quality.</p>
                              
                              <div className="mb-4 border-bottom pb-3">
                                <h6 className="fw-bold">Questionnaire Items</h6>
                                <p className="text-muted small">
                                  <FiFileText className="me-1" /> 
                                  Total Sections: {surveyData.sections?.length || 0} | 
                                  Total Questions: {questions.length}
                                </p>
                              </div>

                              {renderQuestionsBySection()}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default QECView
