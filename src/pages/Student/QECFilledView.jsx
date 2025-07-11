import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { GetApi, PostApi } from '@/utils/Api/ApiServices';
import Footer from '@/components/shared/Footer';
import { FiCheckCircle, FiFileText, FiAlertCircle, FiArrowLeft } from 'react-icons/fi';

const QECFilledView = () => {
  const { survey_id, assignment_id } = useParams();

  // Fetch submitted survey data using React Query
  const { 
    data: surveyResponse, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['submitted-survey', survey_id, assignment_id],
    queryFn: () => PostApi(`/submitted-survey`, { survey_id : survey_id, survey_assignment_id : assignment_id }),

    enabled: !!survey_id && !!assignment_id // Only run query if both IDs are available
  });

  // Process survey data and metadata from API response
  const surveyData = surveyResponse?.data?.responses || [];
  const metadata = surveyResponse?.data?.metadata || {};

  // Count total questions across all sections
  const getTotalQuestions = () => {
    if (!surveyData || !Array.isArray(surveyData)) return 0;
    
    let count = 0;
    surveyData.forEach(section => {
      if (section.questions && Array.isArray(section.questions)) {
        count += section.questions.length;
      }
    });
    
    return count;
  };

  // Function to render a radio question with selected option highlighted
  const renderRadioQuestion = (question, questionIndex) => {
    return (
      <div className="mb-4" key={question.question_id}>
        <label className="form-label fw-semibold">{questionIndex + 1}. {question.question_text}</label>
        <div className="ps-4 mt-2">
          {question.options && question.options.map((option) => (
            <div key={option.option_id} className="form-check mb-2">
              <input 
                className="form-check-input" 
                type="radio" 
                checked={option.selected}
                readOnly
                disabled
              />
              <label className={`form-check-label ${option.selected ? 'fw-bold text-primary' : ''}`}>
                {option.text} {option.label ? `(${option.label})` : ''}
              </label>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Function to render a checkbox question with selected options
  const renderCheckboxQuestion = (question, questionIndex) => {
    return (
      <div className="mb-4" key={question.question_id}>
        <label className="form-label fw-semibold">{questionIndex + 1}. {question.question_text}</label>
        <div className="ps-4 mt-2">
          {question.options && question.options.length > 0 ? (
            question.options.map((option) => (
              <div key={option.option_id} className="form-check mb-2">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  checked={option.selected || false}
                  readOnly
                  disabled
                />
                <label className={`form-check-label ${option.selected ? 'fw-bold text-primary' : ''}`}>
                  {option.text} {option.label ? `(${option.label})` : ''}
                </label>
              </div>
            ))
          ) : (
            <div className="text-muted">No options available</div>
          )}
        </div>
      </div>
    );
  };

  // Function to render a text response question
  const renderTextQuestion = (question, questionIndex) => {
    return (
      <div className="mb-4" key={question.question_id}>
        <label className="form-label fw-semibold">{questionIndex + 1}. {question.question_text}</label>
        <div className="border rounded p-3 bg-light">
          {question.text_response ? (
            <div className="text-break">{question.text_response}</div>
          ) : (
            <em className="text-muted">No response provided</em>
          )}
        </div>
      </div>
    );
  };

  // Render questions based on type
  const renderQuestion = (question, questionIndex) => {
    switch (question.type) {
      case 'radio':
        return renderRadioQuestion(question, questionIndex);
      case 'checkbox':
        return renderCheckboxQuestion(question, questionIndex);
      case 'text':
      case 'textarea':
        return renderTextQuestion(question, questionIndex);
      default:
        return (
          <div className="mb-4" key={question.question_id}>
            <label className="form-label fw-semibold">{questionIndex + 1}. {question.question_text}</label>
            <p className="text-muted small">Question type: {question.type}</p>
            {question.text_response && (
              <div className="border rounded p-3 bg-light mt-2">
                {question.text_response}
              </div>
            )}
            {question.options && question.options.length > 0 && (
              <div className="ps-4 mt-2">
                {question.options.map((option, idx) => (
                  <div key={idx} className="form-check mb-2">
                    <input 
                      className="form-check-input" 
                      type={question.type === 'checkbox' ? 'checkbox' : 'radio'}
                      checked={option.selected || false}
                      readOnly
                      disabled
                    />
                    <label className={`form-check-label ${option.selected ? 'fw-bold text-primary' : ''}`}>
                      {option.text} {option.label ? `(${option.label})` : ''}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <>
      <div className='main-content'>
        <div className='row'>
          <div className='col-12'>
            <div className=" mb-3 page-title-box d-flex align-items-center justify-content-between">
              <div className="page-title-left">
                <h5 className="mb-0">Submitted QEC Survey</h5>
              </div>
              <div>
                <Link to="/general-qec-list" className="btn btn-secondary btn-sm">
                  <FiArrowLeft className="me-1" /> Back to Surveys
                </Link>
              </div>
            </div>
          </div>

          <div className="col-lg-12">
            <div className="card mb-4">
              <div className="card-header">
                <div className="w-100 d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h5 className="card-title mb-0">Quality Enhancement Cell (QEC) Response</h5>
                    <p className="text-muted small mb-0">Submitted Survey Responses</p>
                  </div>
                  <div className="badge bg-success p-2">
                    <FiCheckCircle className="me-1" /> Completed
                  </div>
                </div>
                
              </div>
              <div className='card-header'>
                {metadata && (
                  <div className="mt-3 w-100">
                    <div className="row g-3">
                      <div className="col-md-4">
                        <div className="d-flex flex-column">
                          <span className="text-muted small">Course</span>
                          <span className="fw-medium">
                            {metadata.course_title} <span className="text-muted">({metadata.course_id})</span>
                          </span>
                        </div>
                      </div>

                      <div className="col-md-4">
                        <div className="d-flex flex-column">
                          <span className="text-muted small">Department</span>
                          <span className="fw-medium">{metadata.department_name}</span>
                        </div>
                      </div>

                      <div className="col-md-4">
                        <div className="d-flex flex-column">
                          <span className="text-muted small">Instructor</span>
                          <span className="fw-medium">{metadata.instructor_name}</span>
                        </div>
                      </div>

                      <div className="col-md-4">
                        <div className="d-flex flex-column">
                          <span className="text-muted small">Program</span>
                          <span className="fw-medium">{metadata.program_name}</span>
                        </div>
                      </div>

                      <div className="col-md-4">
                        <div className="d-flex flex-column">
                          <span className="text-muted small">Semester</span>
                          <span className="fw-medium">{metadata.semester}</span>
                        </div>
                      </div>

                      <div className="col-md-4">
                        <div className="d-flex flex-column">
                          <span className="text-muted small">Session</span>
                          <span className="fw-medium">{metadata.year_of_student}</span>
                        </div>
                      </div>
                    </div>

                    {metadata.submitted_at && (
                      <div className="pt-3 mt-3 border-top text-end">
                        <small className="text-muted">
                          Submitted on: {new Date(metadata.submitted_at).toLocaleString()}
                        </small>
                      </div>
                    )}
                  </div>
                )}

              </div>
              
              <div className="card-body">
                <div className="row">
                  <div className="col-12">
                    <div className="card border">
                      <div className="card-header bg-light d-flex justify-content-between align-items-center">
                        <h6 className="mb-0">Survey Responses</h6>
                        <div className="text-muted small">
                          <FiFileText className="me-1" /> Total Questions: {getTotalQuestions()}
                        </div>
                      </div>
                      <div className="card-body">
                        {isLoading ? (
                          <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="mt-3">Loading survey responses...</p>
                          </div>
                        ) : error ? (
                          <div className="alert alert-danger">
                            <FiAlertCircle className="me-2" />
                            Error loading survey: {error.message || 'Failed to load survey data'}
                          </div>
                        ) : !surveyData || surveyData.length === 0 ? (
                          <div className="alert alert-warning">
                            <FiAlertCircle className="me-2" />
                            No survey responses found with ID: {id}
                          </div>
                        ) : (
                          <>
                            <div className="alert alert-info">
                              <FiCheckCircle className="me-2" />
                              This survey has been completed. Below are the responses submitted.
                            </div>

                            <div className="mt-4">
                              {surveyData.map((section, sectionIndex) => (
                                <div key={section.section_id} className="mb-5">
                                  <h6 className="fw-bold mb-3 bg-light p-2 rounded">
                                    {sectionIndex + 1}. {section.section_title}
                                  </h6>
                                  {section.questions && section.questions.map((question, questionIndex) => 
                                    renderQuestion(question, questionIndex)
                                  )}
                                </div>
                              ))}
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
  );
};

export default QECFilledView;
