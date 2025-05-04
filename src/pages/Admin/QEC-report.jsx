import React, { useState } from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import Footer from '@/components/shared/Footer'
import { useParams } from 'react-router-dom'
import { FiCalendar, FiCheckCircle, FiDownloadCloud, FiFileText, FiList, FiSearch, FiTarget, FiUser } from 'react-icons/fi'
import getIcon from '@/utils/getIcon'
import { FaDownload } from 'react-icons/fa'




const QECReport = () => {
  const { id } = useParams();
  const [searchTerm, setSearchTerm] = useState('');

  // Static QEC data for demonstration
  const qecData = {
    id: id || '1',
    title: "Annual Faculty Evaluation Survey",
    description: "Comprehensive evaluation of teaching faculty performance across all departments",
    target_audience: "students",
    start_date: "2025-05-01",
    end_date: "2025-05-15",
    department: "Computer Science",
    course: "Introduction to Programming",
    status: "active"
  };

  // Static statistics data
  const statisticsData = [
    { amount: '78%', description: 'Response Rate', icon: 'feather-users', bgColor: 'bg-primary' },
    { amount: '156', description: 'Total Responses', icon: 'feather-file-text', bgColor: 'bg-success' },
    { amount: '42', description: 'Pending Responses', icon: 'feather-clock', bgColor: 'bg-warning' },
    { amount: '4.2/5', description: 'Average Rating', icon: 'feather-star', bgColor: 'bg-info' }
  ];

  // Static response data
  const responseData = [
    { 
      id: 1, 
      student_id: 'CS-2025-001', 
      name: 'Ahmed Khan', 
      department: 'Computer Science', 
      course: 'Introduction to Programming',
      submission_date: '2025-05-02',
      status: 'completed'
    },
    { 
      id: 2, 
      student_id: 'CS-2025-015', 
      name: 'Sara Ali', 
      department: 'Computer Science', 
      course: 'Introduction to Programming',
      submission_date: '2025-05-03',
      status: 'completed'
    },
    { 
      id: 3, 
      student_id: 'CS-2025-022', 
      name: 'Bilal Ahmed', 
      department: 'Computer Science', 
      course: 'Introduction to Programming',
      submission_date: '2025-05-03',
      status: 'completed'
    },
    { 
      id: 4, 
      student_id: 'CS-2025-037', 
      name: 'Aisha Malik', 
      department: 'Computer Science', 
      course: 'Introduction to Programming',
      submission_date: '2025-05-04',
      status: 'completed'
    },
    { 
      id: 5, 
      student_id: 'CS-2025-042', 
      name: 'Hassan Raza', 
      department: 'Computer Science', 
      course: 'Introduction to Programming',
      submission_date: '2025-05-04',
      status: 'completed'
    }
  ];

  // Filter responses based on search term
  const filteredResponses = responseData.filter(response => {
    const matchesSearch = 
      (response.name && response.name.toLowerCase().includes(searchTerm.toLowerCase())) || 
      (response.student_id && response.student_id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (response.department && response.department.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesSearch;
  });

  return (
    <>
      <PageHeader>
        <h4 className="mb-0">QEC Report: {qecData.title}</h4>
      </PageHeader>
      <div className='main-content'>
        <div className='row'>
          {/* Statistics Cards */}
          {statisticsData.map(({ amount, description, icon, bgColor }, index) => (
            <div key={index} className="col-xxl-3 col-md-6">
              <div className="card card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="me-3">
                    <h5 className="fs-4">{amount}</h5>
                    <span className="text-muted">{description}</span>
                  </div>
                  <div className={`avatar-text avatar-lg ${bgColor} text-white rounded`}>
                    <i>{React.cloneElement(getIcon(icon), {size:"16", strokeWidth:"2.4"})}</i>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* QEC Information Card */}
          {/* <div className="col-lg-12">
            <div className="card mb-4">
              <div className="card-header d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title mb-0">QEC Details</h5>
                </div>
                
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <table className="table table-sm">
                      <tbody>
                        <tr>
                          <td width="40%" className="fw-medium">Title:</td>
                          <td>{qecData.title}</td>
                        </tr>
                        <tr>
                          <td className="fw-medium">Target Audience:</td>
                          <td className="text-capitalize">{qecData.target_audience}</td>
                        </tr>
                        <tr>
                          <td className="fw-medium">Department:</td>
                          <td>{qecData.department}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="col-md-6">
                    <table className="table table-sm">
                      <tbody>
                        <tr>
                          <td width="40%" className="fw-medium">Course:</td>
                          <td>{qecData.course}</td>
                        </tr>
                        <tr>
                          <td className="fw-medium">Start Date:</td>
                          <td>{qecData.start_date}</td>
                        </tr>
                        <tr>
                          <td className="fw-medium">End Date:</td>
                          <td>{qecData.end_date}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div> */}

          {/* Response Table */}
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="card-title">Response Details</h5>
                <div>
                  <button className="btn btn-outline-success btn-sm d-flex align-items-center gap-2">
                    <FiDownloadCloud size={16} />
                    Download All
                  </button>
                </div>
              </div>
              <div className="card-body">
                <div className="row mb-3">
                  <div className="col-md-4">
                    <div className="input-group">
                      <span className="input-group-text">
                        <FiSearch size={18} />
                      </span>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Search by name or ID"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Student ID</th>
                        <th>Name</th>
                        <th>Department</th>
                        <th>Course</th>
                        <th>Submission Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredResponses.length > 0 ? (
                        filteredResponses.map((response) => (
                          <tr key={response.id}>
                            <td>{response.student_id}</td>
                            <td>{response.name}</td>
                            <td>{response.department}</td>
                            <td>{response.course}</td>
                            <td>{response.submission_date}</td>
                            <td>
                              <span className={`badge ${response.status === 'completed' ? 'bg-success' : 'bg-warning'}`}>
                                {response.status.charAt(0).toUpperCase() + response.status.slice(1)}
                              </span>
                            </td>
                            <td>
                              <button className="btn btn-outline-primary btn-sm">
                                <FaDownload />
                                
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center">
                            No responses found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
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

export default QECReport
