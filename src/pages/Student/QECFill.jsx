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

  // Handle input change
  const handleInputChange = (question, value) => {
    setResponses(prev => ({ ...prev, [question.id]: value }));
  };

  // Handle checkbox change
  const handleCheckboxChange = (question, option, checked) => {
    setResponses(prev => {
      const prevVals = prev[question.id] || [];
      if (checked) {
        return { ...prev, [question.id]: [...prevVals, option] };
      } else {
        return { ...prev, [question.id]: prevVals.filter(v => v !== option) };
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
                    value={option.value || option.text}
                    checked={responses[question.id] === (option.value || option.text)}
                    onChange={() => handleInputChange(question, option.value || option.text)}
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
                    value={option.value || option.text}
                    checked={Array.isArray(responses[question.id]) && responses[question.id].includes(option.value || option.text)}
                    onChange={e => handleCheckboxChange(question, option.value || option.text, e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor={`option_${question.id}_${idx}`}>
                    {option.text} {option.label ? `(${option.label})` : ''}
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
              value={responses[question.id] || ''}
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
    for (const section of survey.sections) {
      for (const question of section.questions) {
        const answer = responses[question.id];
        if (question.type === 'radio') {
          if (!answer) allAnswered = false;
        } else if (question.type === 'checkbox') {
          if (!Array.isArray(answer) || answer.length === 0) allAnswered = false;
        } else if (question.type === 'textarea') {
          if (!answer || answer.trim() === "") allAnswered = false;
        }
      }
    }
    if (!allAnswered) {
      Swal.fire({
        icon: 'error',
        title: 'Incomplete!',
        text: 'Please answerr all questions before submitting.',
        confirmButtonColor: '#3085d6'
      });
      setIsSubmitting(false);
      return;
    }
    // Build responses array as required by API
    const responsesArray = [];
    survey.sections.forEach(section => {
      section.questions.forEach(question => {
        const answer = responses[question.id];
        if (answer !== undefined && answer !== null && answer !== "") {
          if (question.type === 'radio') {
            const selectedOption = question.options.find(opt => (opt.value || opt.text) === answer);
            if (selectedOption) {
              responsesArray.push({ question_id: question.id, option_id: selectedOption.id });
            }
          } else if (question.type === 'checkbox') {
            if (Array.isArray(answer)) {
              answer.forEach(ans => {
                const selectedOption = question.options.find(opt => (opt.value || opt.text) === ans);
                if (selectedOption) {
                  responsesArray.push({ question_id: question.id, option_id: selectedOption.id });
                }
              });
            }
          } else if (question.type === 'textarea') {
            responsesArray.push({ question_id: question.id, text_response: answer });
          }
        }
      });
    });
    const payload = {
      survey_id: survey.id,
      survey_assignment_id: surveyAssignment.id,
      responses: responsesArray,
      course_id:surveyResponse?.data[0]?.meta?.course?.id,
      instructor_id:surveyResponse?.data[0]?.meta?.faculty?.id,
      semester_id:surveyResponse?.data[0]?.meta?.course?.id,
      depart_id:surveyResponse?.data[0]?.meta?.department?.id,
      program_id:surveyResponse?.data[0]?.meta?.course?.program_id,
      year_of_student:surveyResponse?.data[0]?.term,
      
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
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to submit survey. Please try again.',
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
