import React from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import PageHeaderWidgets from '@/components/shared/pageHeader/PageHeaderWidgets'
import Footer from '@/components/shared/Footer'
import { useParams } from 'react-router-dom'
import { FiCheckCircle, FiFileText, FiList, FiTarget, FiUser } from 'react-icons/fi'
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
  const courses = courseResponse?.data.data || [];

  // Static QEC data for demonstration
  const qecData = {
    id: id || '1',
    title: "Annual Faculty Evaluation Survey",
    description: "Comprehensive evaluation of teaching faculty performance across all departments. This survey helps identify strengths and areas for improvement in teaching methodologies, course content delivery, and faculty engagement with students.",
    target_audience: "students",
    start_date: "2025-05-01",
    end_date: "2025-05-15",
    department: "",
    course: "",
    program: "",
    status: "active",
    created_at: "2025-04-22",
    questions: [
      {
        id: 1,
        text: "How satisfied are you with the teaching methodology used in this course?",
        type: "mcq",
        options: ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very Dissatisfied"]
      },
      {
        id: 2,
        text: "Which aspects of the course content were most beneficial to your learning?",
        type: "mcq",
        options: ["Lectures", "Practical Sessions", "Assignments", "Group Discussions", "Course Materials"]
      },
      {
        id: 3,
        text: "Please provide your feedback on the course structure and organization.",
        type: "textarea",
        options: []
      },
      {
        id: 4,
        text: "What suggestions do you have for improving this course in the future?",
        type: "textarea",
        options: []
      }
    ]
  };

  // Function to render question based on type
  const renderQuestion = (question, index) => {
    switch (question.type) {
      case 'mcq':
        return (
          <div className="mb-4" key={question.id}>
            <label className="form-label fw-semibold">{index + 1}. {question.text}</label>
            <div className="ps-4 mt-2">
              {question.options.map((option, idx) => (
                <div key={idx} className="form-check mb-2">
                  <input 
                    className="form-check-input" 
                    type="radio" 
                    name={`question_${question.id}`} 
                    id={`option_${question.id}_${idx}`}
                    disabled
                  />
                  <label className="form-check-label" htmlFor={`option_${question.id}_${idx}`}>
                    {option}
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
                {/* <p className="card-subtitle text-muted mb-0">{qecData.description}</p> */}
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
                          <FiFileText className="me-1" /> Total Questions: {qecData.questions.length}
                        </div>
                      </div>
                      <div className="card-body">
                        <div className="alert alert-info">
                          <FiCheckCircle className="me-2" />
                          This is a preview mode. The form is not fillable here. You can view how the questionnaire will appear to respondents.
                        </div>

                        <div className="mt-4">
                          <h6 className="fw-bold mb-3">Instructions</h6>
                          <p className="mb-4">Please answer all questions honestly. Your feedback is anonymous and will be used to improve teaching quality.</p>
                          
                          <div className="mb-4 border-bottom pb-3">
                            <h6 className="fw-bold">Questionnaire Items</h6>
                          </div>

                          {qecData.questions.map((question, index) => renderQuestion(question, index))}
                        </div>
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
