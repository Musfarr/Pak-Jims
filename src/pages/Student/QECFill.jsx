import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { GetApi, PostApi } from '@/utils/Api/ApiServices';
import { FiCheckCircle, FiFileText, FiAlertCircle } from 'react-icons/fi';
import Footer from '@/components/shared/Footer';
import Swal from 'sweetalert2';

const QECFill = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [responses, setResponses] = useState({});

  const [semester, setSemester] = useState('');
  const [selectedFacultyId, setSelectedFacultyId] = useState('');

  // Set default faculty if only one exists
  useEffect(() => {
    if (metadata?.faculty?.length === 1) {
      setSelectedFacultyId(metadata.faculty[0].id);
    }
  }, [metadata?.faculty]);

  // Fetch survey details using React Query
  const {
    data: surveyResponse,
    isLoading: isSurveyLoading,
    error: surveyError
  } = useQuery({
    queryKey: ['student-survey', id],
    queryFn: () => GetApi(`/get-survey/${id}`),
    enabled: !!id
  });


  console.log(surveyResponse ,"surveyResponse");
  // Extract survey assignment and survey object from API response
  const surveyAssignment = surveyResponse?.data?.[0] || null;
  const survey = surveyAssignment?.survey || null;
  const metadata = surveyAssignment?.meta || null;
  const payloadrequiremt = surveyAssignment?.meta?.requirements ;



  // Helper to get all questions
  const getAllQuestions = () => {
    if (!survey || !survey.sections) return [];
    let allQuestions = [];
    survey.sections.forEach(section => {
      if (section.questions && section.questions.length > 0) {
        allQuestions = [
          ...allQuestions,
          ...section.questions.map(q => ({ ...q, sectionTitle: section.title }))
        ];
      }
    });
    return allQuestions;
  };
  const questions = getAllQuestions();

  // Handle input change for radio and text inputs
  const handleInputChange = (question, value) => {
    setResponses(prev => ({
      ...prev,
      [question.id]: {
        type: question.type,
        value: value
      }
    }));
  };

  // Handle checkbox change
  const handleCheckboxChange = (question, option, checked) => {
    setResponses(prev => {
      const currentResponse = prev[question.id] || { type: 'checkbox', value: [] };
      if (checked) {
        return {
          ...prev,
          [question.id]: {
            ...currentResponse,
            value: [...(currentResponse.value || []), option]
          }
        };
      } else {
        return {
          ...prev,
          [question.id]: {
            ...currentResponse,
            value: (currentResponse.value || []).filter(v => v !== option)
          }
        };
      }
    });
  };

  // Submit survey mutation
  const submitMutation = useMutation({
    mutationFn: (payload) => PostApi(`/submit-survey/${id}`, payload),
    onSuccess: () => {
      Swal.fire({
        icon: 'success',
        title: 'Submitted!',
        text: 'Your survey response has been submitted.',
        timer: 2000,
        showConfirmButton: false
      });
      setTimeout(() => navigate('/student-qec-list'), 2000);
    },
    onError: () => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to submit survey. Please try again.'
      });
    }
  });

  // Render question with input controls
  const renderQuestion = (question, index) => {
    const response = responses[question.id] || {};
    const responseValue = response.value;

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
                    value={option.id}
                    checked={responseValue === option.id}
                    onChange={() => handleInputChange(question, option.id)}
                  />
                  <label className="form-check-label" htmlFor={`option_${question.id}_${idx}`}>
                    {option.text} {option.label ? `(${option.label})` : ''}
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
                    value={option.id}
                    checked={Array.isArray(responseValue) && responseValue.includes(option.id)}
                    onChange={e => handleCheckboxChange(question, option.id, e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor={`option_${question.id}_${idx}`}>
                    {option.text} {option.label ? `(${option.label})` : ''}
                  </label>
                </div>
              ))}
            </div>
          </div>
        );
      case 'text':
      case 'textarea':
        return (
          <div className="mb-4" key={question.id}>
            <label className="form-label fw-semibold">{index + 1}. {question.text}</label>
            <textarea
              className="form-control"
              rows="3"
              value={responseValue || ''}
              onChange={e => handleInputChange(question, e.target.value)}
              placeholder="Type your response here..."
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

  // Handle form submit
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (metadata.requirements?.includes('semester') && !semester) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Please enter a semester.',
        confirmButtonColor: '#3085d6'
      });
      setIsSubmitting(false);
      return;
    }
    
    if (metadata.requirements?.includes('faculty') && !selectedFacultyId) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Please select an instructor.',
        confirmButtonColor: '#3085d6'
      });
      setIsSubmitting(false);
      return;
    }
    
    if (!surveyAssignment || !survey) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Survey information missing. Cannot submit.',
        confirmButtonColor: '#3085d6'
      });
      setIsSubmitting(false);
      return;
    }

    // Validate all questions answered
    let allAnswered = true;
    const missingQuestions = [];
    
    survey.sections.forEach((section, sIndex) => {
      section.questions.forEach((question, qIndex) => {
        const response = responses[question.id];
        const hasAnswer = response && 
          ((question.type === 'radio' && response.value !== undefined) ||
           (question.type === 'checkbox' && Array.isArray(response.value) && response.value.length > 0) ||
           (question.type === 'text' && response.value && response.value.trim() !== ''));
        
        if (!hasAnswer) {
          allAnswered = false;
          missingQuestions.push(`Section ${sIndex + 1}, Question ${qIndex + 1}`);
        }
      });
    });

    if (!allAnswered) {
      Swal.fire({
        icon: 'error',
        title: 'Incomplete Form',
        html: `Please answer all questions before submitting.<br>Missing answers: ${missingQuestions.join(', ')}`,
        confirmButtonColor: '#3085d6'
      });
      setIsSubmitting(false);
      return;
    }

    // Build responses array as required by API
    const responsesArray = [];
    
    survey.sections.forEach(section => {
      section.questions.forEach(question => {
        const response = responses[question.id];
        if (!response) return;

        switch (question.type) {
          case 'radio':
            responsesArray.push({
              question_id: question.id,
              option_id: response.value
            });
            break;
            
          case 'checkbox':
            if (Array.isArray(response.value)) {
              response.value.forEach(optionId => {
                responsesArray.push({
                  question_id: question.id,
                  option_id: optionId
                });
              });
            }
            break;
            
          case 'text':
          case 'textarea':
            responsesArray.push({
              question_id: question.id,
              text_response: response.value
            });
            break;
        }
      });
    });

    const payload = {
      survey_id: survey.id,
      survey_assignment_id: surveyAssignment.id,
      responses: responsesArray,
      course_id: surveyResponse?.data[0]?.meta?.course?.id,
      instructor_id: selectedFacultyId || surveyResponse?.data[0]?.meta?.faculty?.id,
      semester_id: metadata.requirements?.includes('semester') ? semester : surveyResponse?.data[0]?.term,
      depart_id: surveyResponse?.data[0]?.meta?.department?.id,
      program_id: surveyResponse?.data[0]?.meta?.course?.program_id,
    };

    PostApi(`/submit-survey`, payload)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Submitted!',
          text: 'Your survey response has been submitted.',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          navigate('/general-qec-list');
        });
      })
      .catch(error => {
        console.error('Submission error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: error.response?.data?.message || 'Failed to submit survey. Please try again.',
          confirmButtonColor: '#3085d6'
        });
      })
      .finally(() => setIsSubmitting(false));
  };



  return (
    <>
      <div className='main-content'>
        <div className='row'>
          <div className='col-12'>
            <div className="page-title-box d-flex align-items-center justify-content-between">
              <div className="page-title-left">
                {/* Add breadcrumbs or title if needed */}
              </div>
            </div>
          </div>

          <div className="col-lg-12">
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="card-title">Quality Enhancement Cell (QEC) Questionnaire</h5>
                {survey && <p className="card-subtitle text-muted mb-0">{survey.title} - {survey.description}</p>}
              </div>
              <div className='card-header'>
                {metadata && (
                  <div className="mt-3 w-100">
                    <div className="row align-items-center g-3">
                      {metadata.requirements?.includes('department') && metadata.department && (
                        <div className="col-md-4">
                          <div className="d-flex flex-column">
                            <span className="text-muted small">Department</span>
                            <span className="fw-medium">
                              {metadata.department.name} <span className="text-muted">({metadata.department.prefix})</span>
                            </span>
                          </div>
                        </div>
                      )}

                      {metadata.requirements?.includes('course') && metadata.course && (
                        <div className="col-md-4">
                          <div className="d-flex flex-column">
                            <span className="text-muted small">Course</span>
                            <span className="fw-medium">
                              {metadata.course.name} <span className="text-muted">({metadata.course.prefix})</span>
                            </span>
                          </div>
                        </div>
                      )}

                      {metadata.requirements?.includes('faculty') && metadata.faculty && (
                        <div className="col-md-4">
                          <div className="d-flex flex-column">
                            <label className="text-muted small">Instructor <span className="text-danger">*</span></label>
                            <select 
                              className="form-select form-select-sm"
                              value={selectedFacultyId}
                              onChange={(e) => setSelectedFacultyId(e.target.value)}
                              required
                            >
                              <option value="">Select Instructor</option>
                              {metadata.faculty.map((faculty) => (
                                <option key={faculty.id} value={faculty.id}>
                                  {faculty.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      )}

                      {metadata.requirements?.includes('degree') && metadata.degree && (
                        <div className="col-md-4">
                          <div className="d-flex flex-column">
                            <span className="text-muted small">Program</span>
                            <span className="fw-medium">
                              {metadata.degree.name} <span className="text-muted">({metadata.degree.prefix})</span>
                            </span>
                          </div>
                        </div>
                      )}

                      {metadata.requirements?.includes('year_of_study') && Array.isArray(metadata.year_of_study) && metadata.year_of_study.length > 0 && (
                        <div className="col-md-4">
                          <div className="d-flex flex-column ">
                            <span className="text-muted small">Session</span>
                            <span className="fw-medium ">
                              {metadata.year_of_study[0]?.name || 'N/A'}
                            </span>
                          </div>
                        </div>
                      )}

                      {metadata.requirements?.includes('semester') && (
                        <div className="col-md-2">
                          <div className="d-flex flex-column">
                            <label className="text-muted small">Semester <span className="text-danger">*</span></label>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              value={semester}
                              onChange={(e) => setSemester(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {metadata.created_at && (
                      <div className="pt-3 mt-3 border-top text-end">
                        <small className="text-muted">
                          Created: {new Date(metadata.created_at).toLocaleString()}
                        </small>
                      </div>
                    )}
                  </div>
                )}
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
                ) : !survey ? (
                  <div className="alert alert-warning">
                    <FiAlertCircle className="me-2" />
                    No survey found with ID: {id}
                  </div>
                ) : (
                  <>
                    <div className="alert alert-info">
                      <FiCheckCircle className="me-2" />
                      Please answer all questions honestly. Your feedback is anonymous and will be used to improve teaching quality.
                    </div>
                    <form onSubmit={handleSubmit}>
                      <div className="mb-4 border-bottom pb-3">
                        <h6 className="fw-bold">Questionnaire Items</h6>
                        <p className="text-muted small">
                          <FiFileText className="me-1" />
                          Total Sections: {survey.sections?.length || 0} | 
                          Total Questions: {questions.length}
                        </p>
                      </div>
                      {survey.sections && survey.sections.map((section, sectionIndex) => (
                        <div key={section.id} className="mb-5">
                          <h6 className="fw-bold mb-3 bg-light p-2 rounded">{sectionIndex + 1}. {section.title}</h6>
                          {section.questions && section.questions.map((question, questionIndex) =>
                            renderQuestion(question, questionIndex)
                          )}
                        </div>
                      ))}
                      <div className="d-flex justify-content-end mt-4">
                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                          {isSubmitting ? 'Submitting...' : 'Submit'}
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default QECFill;
