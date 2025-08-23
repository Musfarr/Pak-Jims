import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { GetApi, PostApi } from '@/utils/Api/ApiServices';
import Footer from '@/components/shared/Footer';
import { FiCheckCircle, FiFileText, FiAlertCircle, FiArrowLeft } from 'react-icons/fi';
import { FaPrint } from 'react-icons/fa6';
import Swal from 'sweetalert2';
import html2pdf from 'html2pdf.js';
import { FaCheck } from 'react-icons/fa';
import logo1 from '/images/logo1.jpg';
import logo2 from '/images/QEClogo.png';
import { BsEyeFill } from 'react-icons/bs';



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
        <div className={`ps-4 mt-2 d-flex ${question.options.length <= 3 ? '' : 'justify-content-between'}`}>
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
                {/* {option.text} {option.label ? `(${option.label})` : ''} */}
                {option.text}
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
                  {option.text}
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
              <div className="ps-4 mt-2 d-flex justify-content-between">
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
                      {option.text} 
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
    }
  };

  // PDF Export Handler
  const handleDownloadPDF = () => {
    const element = document.getElementById('qec-pdf-print');
    const opt = {
      margin: [2, 2, 2, 2],
      filename: `QEC_Survey_${survey_id}_${assignment_id}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: true
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait' 
      },
      pagebreak: { 
        mode: ['css'],
        before: '.page-break-before',
        after: '.page-break-after',
        avoid: '.avoid-break' 
      }
    };
    
    // Add print-specific styles
    const style = document.createElement('style');
    style.innerHTML = `
      @media print {
        .qec-pdf-print {
          box-shadow: none !important;
          padding: 0 !important;
          margin: 0 !important;
        }
        .qec-pdf-section {
          page-break-inside: avoid;
          break-inside: avoid;
        }
        .qec-pdf-meta {
          margin: 10px 0 !important;
          padding: 5px 0 !important;
        }
        .qec-pdf-header {
          margin-bottom: 15px !important;
        }
      }
    `;
    document.head.appendChild(style);
    
    // Generate PDF
    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .then(() => {
        // Clean up the style element
        document.head.removeChild(style);
      });
  };

  // PDF-styled renderers
  const renderPDFRadio = (question, questionIndex) => (
    <div key={question.question_id} className="qec-pdf-question">
      <div className="qec-pdf-question-label">{questionIndex + 1}. {question.question_text}</div>
      <div className="qec-pdf-options d-flex justify-content-around">
        {question.options && question.options.map((option, idx) => (
          <span key={option.option_id} className="qec-pdf-option">
            <span className=  {` qec-pdf-radio`}> {option.selected ? <FaCheck size={18} /> : '' } </span>
            <span>{option.text}</span>
          </span>
        ))}
      </div>
    </div>
  );

  const renderPDFCheckbox = (question, questionIndex) => (
    <div key={question.question_id} className="qec-pdf-question">
      <div className="qec-pdf-question-label">{questionIndex + 1}. {question.question_text}</div>
      <div className="qec-pdf-options">
        {question.options && question.options.map((option, idx) => (
          <span key={option.option_id} className="qec-pdf-option">
            <span className={`qec-pdf-checkbox`}> {option.selected ? <FaCheck size={18} /> : '' } </span>
            <span>{option.text} {option.label ? `(${option.label})` : ''}</span>
          </span>
        ))}
      </div>
    </div>
  );

  const renderPDFText = (question, questionIndex) => (
    <div key={question.question_id} className="qec-pdf-question">
      <div className="qec-pdf-question-label">{questionIndex + 1}. {question.question_text}</div>
      <div className="qec-pdf-text">
        {question.text_response ? (
          <span>{question.text_response}</span>
        ) : (
          <em style={{ color: '#888' }}>No response provided</em>
        )}
      </div>
    </div>
  );

  const renderPDFQuestion = (question, questionIndex) => {
    switch (question.type) {
      case 'radio': return renderPDFRadio(question, questionIndex);
      case 'checkbox': return renderPDFCheckbox(question, questionIndex);
      case 'text':
      case 'textarea': return renderPDFText(question, questionIndex);
      default: return renderPDFText(question, questionIndex);
    }
  };

  // Modal preview state
  const [showPdfPreview, setShowPdfPreview] = React.useState(false);

  return (
    <>
      {/* Modal PDF Preview */}
      {showPdfPreview && (
        <div className="modal fade show" tabIndex="-1" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-xl modal-dialog-centered" style={{ maxWidth: '900px' }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">PDF Preview (A4 Style)</h5>
                <button type="button" className="btn-close" onClick={() => setShowPdfPreview(false)}></button>
              </div>
              <div className="modal-body" style={{ overflowY: 'auto', maxHeight: '80vh', background: '#f6f6f6' }}>
                <div id="qec-pdf-print" className="qec-pdf-print" style={{ margin: '0 auto', boxShadow: '0 0 12px #bbb', background: '#fff', maxWidth: '210mm', padding: '20px' }}>
                  <div className="qec-pdf-header">
                    <img style={{ width: '90px', height: '90px' }} src={logo1} alt="" />
                    <div>
                      <h2 className="qec-pdf-title">{metadata.survey.name}</h2>
                      <div className="qec-pdf-subtitle">{metadata.survey.title}</div>
                      <div className="qec-pdf-subtitle">{metadata.survey.description}</div>
                    </div>
                    <img style={{ width: '90px', height: '90px' }} src={logo2} alt="" />
                  </div>
                  <div className="qec-pdf-meta" style={{ 
                    margin: '15px 0', 
                    padding: '12px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '4px',
                    backgroundColor: '#f9f9f9',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '8px 20px',
                    pageBreakInside: 'avoid',
                    breakInside: 'avoid'
                  }}>
                    {metadata?.course_title && <div className="qec-pdf-meta-item"><b>Course:</b> {metadata.course_title} ({metadata.course_id})</div>}
                    {metadata?.department_name && <div className="qec-pdf-meta-item"><b>Department:</b> {metadata.department_name}</div>}
                    {metadata?.instructor_name && <div className="qec-pdf-meta-item"><b>Instructor:</b> {metadata.instructor_name}</div>}
                    {metadata?.program_name && <div className="qec-pdf-meta-item"><b>Program:</b> {metadata.program_name}</div>}
                    {metadata?.semester_id && <div className="qec-pdf-meta-item"><b>Semester/Module:</b> {metadata.semester_id}</div>}
                    {metadata?.year_of_student && <div className="qec-pdf-meta-item"><b>Year of Study:</b> {metadata.year_of_student || '-'}</div>}
                  </div>
                  {/* {metadata.submitted_at && (
                    <div className="qec-pdf-date">
                      Submitted on: {new Date(metadata.submitted_at).toLocaleString()}
                    </div>
                  )} */}
                  <div style={{ pageBreakBefore: 'avoid', breakBefore: 'avoid' }}>
                    <div className="qec-pdf-section-title fs-16" style={{ 
                      margin: '15px 0 20px 0',
                      padding: '12px',
                      backgroundColor: '#f0f7ff',
                      borderRadius: '4px',
                      borderLeft: '4px solid #4a89dc',
                      pageBreakAfter: 'avoid',
                      breakAfter: 'avoid'
                    }}>
                      <strong>Instruction:</strong> {metadata.survey?.instructions}
                    </div>
                    {surveyData && surveyData.map((section, sectionIndex) => (
                      <div key={section.section_id} className="qec-pdf-section">
                        <div className="qec-pdf-section-title">
                          {section.section_title}
                        </div>
                        {section.questions && section.questions.map((question, questionIndex) => (
                          renderPDFQuestion(question, questionIndex)
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowPdfPreview(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div style={{ display: 'none' }}>
        {/* Hidden printable PDF container */}
        <div id="qec-pdf-print" className="qec-pdf-print">
        <div className="qec-pdf-header">
                    <img style={{ width: '90px', height: '90px' }} src={logo1} alt="" />
                    <div>
                      <h2 className="qec-pdf-title">{metadata.survey?.name}</h2>
                      <div className="qec-pdf-subtitle">{metadata.survey?.title}</div>
                      <div className="qec-pdf-subtitle">{metadata.survey?.description}</div>
                    </div>
                    <img style={{ width: '90px', height: '90px' }} src={logo2} alt="" />
                  </div>
          <div className="qec-pdf-meta">
           {metadata?.course_title && <div className="qec-pdf-meta-item"><b>Course:</b> {metadata.course_title} ({metadata.course_id})</div>}
            {metadata?.department_name && <div className="qec-pdf-meta-item"><b>Department:</b> {metadata.department_name}</div>}
            {metadata?.instructor_name && <div className="qec-pdf-meta-item"><b>Instructor:</b> {metadata.instructor_name}</div>}
            {metadata?.program_name && <div className="qec-pdf-meta-item"><b>Program:</b> {metadata.program_name}</div>}
            {metadata?.semester_id && <div className="qec-pdf-meta-item"><b>Semester/Module:</b> {metadata.semester_id}</div>}
            {metadata?.year_of_student && <div className="qec-pdf-meta-item"><b>Year of Study:</b> {metadata.year_of_student || '-'}</div>}
          </div>
          {/* {metadata.submitted_at && (
            <div className="qec-pdf-date">
              Submitted on: {new Date(metadata.submitted_at).toLocaleString()}
            </div>
          )} */}
          <div>
          <div className="qec-pdf-section-title fs-16">
                     Instruction:  {metadata.survey?.instructions}
                    </div>
            {/* <div className="qec-pdf-section-title">Survey Responses</div> */}
            {surveyData && surveyData.map((section, sectionIndex) => (
              <div key={section.section_id} className="qec-pdf-section">
                <div className="qec-pdf-section-title">
                  {section.section_title}
                </div>
                {section.questions && section.questions.map((question, questionIndex) => (
                  renderPDFQuestion(question, questionIndex)
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className='main-content'>
        <div className='row'>
          <div className='col-12'>
            <div className=" mb-3 page-title-box d-flex align-items-center justify-content-between">
              <div className="page-title-left">
                <h5 className="mb-0">Submitted QEC Survey</h5>
              </div>
              <div className="d-flex gap-2">
                <Link to="/general-qec-list" className="btn btn-secondary btn-sm">
                  <FiArrowLeft className="me-1" /> Back to Surveys
                </Link>

                <button onClick={() => setShowPdfPreview(true)} className="btn btn-outline-primary btn-sm">
                  <BsEyeFill size={16} className="m-1" color="green" /> Preview PDF
                </button>
                <button onClick={handleDownloadPDF} className="btn btn-outline-success btn-sm">
                  <FaPrint size={16} className="m-1" color="green" /> Download PDF
                </button>
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
                      {metadata?.course_title && <div className="col-md-4">
                        <div className="d-flex flex-column">
                          <span className="fw-bold">Course</span>
                          <span className="fw-medium">
                            {metadata.course_title} <span className="text-muted">({metadata.course_id})</span>
                          </span>
                        </div>
                      </div>}

                      {metadata?.department_name && <div className="col-md-4">
                        <div className="d-flex flex-column">
                          <span className="fw-bold">Department</span>
                          <span className="fw-medium">{metadata.department_name}</span>
                        </div>
                      </div>}

                      {metadata?.instructor_name && <div className="col-md-4">
                        <div className="d-flex flex-column">
                          <span className="fw-bold">Instructor</span>
                          <span className="fw-medium">{metadata.instructor_name}</span>
                        </div>
                      </div>}

                      {metadata?.program_name && <div className="col-md-4">
                        <div className="d-flex flex-column">
                          <span className="fw-bold">Program</span>
                          <span className="fw-medium">{metadata.program_name}</span>
                        </div>
                      </div>}

                      {metadata?.semester_id && <div className="col-md-4">
                        <div className="d-flex flex-column">
                          <span className="fw-bold">Semester/Module</span>
                          <span className="fw-medium">{metadata.semester_id}</span>
                        </div>
                      </div>}

                      {/* <div className="col-md-4">
                        <div className="d-flex flex-column">
                          <span className="text-muted small">Session</span>
                          <span className="fw-medium">{metadata.year_of_student}</span>
                        </div>
                      </div> */}
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
