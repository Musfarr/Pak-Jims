import React, { useState } from 'react';
import PageHeader from '@/components/shared/pageHeader/PageHeader';
import PageHeaderWidgets from '@/components/shared/pageHeader/PageHeaderWidgets';
import Footer from '@/components/shared/Footer';
import { Link } from 'react-router-dom';
import { FiEdit, FiEye, FiTrash, FiSearch, FiFilter } from 'react-icons/fi';

const CourseList = () => {
  // Sample data for courses
  const [courses, setCourses] = useState([
    { id: 1, code: 'MED101', prefix: 'MED', name: 'Introduction to Medical Sciences', program: 'MBBS', status: 'Active' },
    { id: 2, code: 'MED201', prefix: 'MED', name: 'Anatomy and Physiology', program: 'MBBS', status: 'Active' },
    { id: 3, code: 'DENT105', prefix: 'DENT', name: 'Dental Basics', program: 'BDS', status: 'Active' },
    { id: 4, code: 'PHARM110', prefix: 'PHARM', name: 'Pharmaceutical Chemistry', program: 'Pharm-D', status: 'Inactive' },
    { id: 5, code: 'MED301', prefix: 'MED', name: 'Pathology', program: 'MBBS', status: 'Active' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterProgram, setFilterProgram] = useState('');

  // Filter courses based on search term and program filter
  const filteredCourses = courses.filter(course => {
    return (
      (course.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
       course.code.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterProgram === '' || course.program === filterProgram)
    );
  });

  // Programs for filter dropdown
  const programs = ['MBBS', 'BDS', 'Pharm-D', 'DPT', 'BSN'];

  // Handle course deletion
  const handleDeleteCourse = (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      setCourses(courses.filter(course => course.id !== id));
    }
  };

  return (
    <>
      <PageHeader>
        <PageHeaderWidgets />
      </PageHeader>
      <div className='main-content'>
        <div className='row'>
          <div className='col-12'>
            <div className='card'>
              <div className='card-header d-flex justify-content-between align-items-center'>
                <h5 className='mb-0'>Course List</h5>
                <Link to="/courses/add" className='btn btn-primary'>
                  Add New Course
                </Link>
              </div>
              <div className='card-body'>
                <div className='row mb-3'>
                  <div className='col-md-6'>
                    <div className='input-group'>
                      <span className='input-group-text'>
                        <FiSearch size={18} />
                      </span>
                      <input 
                        type='text' 
                        className='form-control' 
                        placeholder='Search by course name or code'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className='col-md-6'>
                    <div className='input-group'>
                      <span className='input-group-text'>
                        <FiFilter size={18} />
                      </span>
                      <select 
                        className='form-select' 
                        value={filterProgram}
                        onChange={(e) => setFilterProgram(e.target.value)}
                      >
                        <option value=''>All Programs</option>
                        {programs.map((program, index) => (
                          <option key={index} value={program}>{program}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className='table-responsive'>
                  <table className='table table-hover'>
                    <thead>
                      <tr>
                        <th>Course Code</th>
                        <th>Prefix</th>
                        <th>Course Name</th>
                        <th>Program</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCourses.length > 0 ? (
                        filteredCourses.map(course => (
                          <tr key={course.id}>
                            <td>{course.code}</td>
                            <td>{course.prefix}</td>
                            <td>{course.name}</td>
                            <td>{course.program}</td>
                            <td>
                              <span className={`badge ${course.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
                                {course.status}
                              </span>
                            </td>
                            <td>
                              <div className='d-flex gap-2'>
                                <Link to={`/courses/view/${course.id}`} className='btn btn-sm btn-info'>
                                  <FiEye size={16} />
                                </Link>
                                <Link to={`/courses/edit/${course.id}`} className='btn btn-sm btn-warning'>
                                  <FiEdit size={16} />
                                </Link>
                                <button 
                                  className='btn btn-sm btn-danger'
                                  onClick={() => handleDeleteCourse(course.id)}
                                >
                                  <FiTrash size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center">No courses found</td>
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
  );
};

export default CourseList;
