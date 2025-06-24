import React, { useState } from 'react';
import PageHeader from '@/components/shared/pageHeader/PageHeader';
import PageHeaderWidgets from '@/components/shared/pageHeader/PageHeaderWidgets';
import Footer from '@/components/shared/Footer';
import { Link } from 'react-router-dom';
import { FiEdit, FiEye, FiTrash, FiSearch, FiFilter, FiPlus } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import { GetApi, DeleteApi, PostApi } from '@/utils/Api/ApiServices';
import Swal from 'sweetalert2';

const CourseList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: coursesResponse, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['courses'],
    queryFn: () => GetApi('/courses')
  });

  const courses = coursesResponse?.data.data || [];

  // Filter courses based on search term
  const filteredCourses = courses?.filter(course => {
    return (
      (course.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
       course.prefix?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  // Handle course deletion
  const handleDeleteCourse = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        setIsDeleting(true);
        DeleteApi(`/courses/${id}`)
          .then(() => {
            refetch(); // Refresh the courses list
            Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: 'Course deleted successfully',
              confirmButtonColor: '#3085d6'
            });
          })
          .catch(error => {
            console.error('Error deleting course:', error);
            if (!error.response || error.response.status !== 422) {
              Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: error.message || 'Failed to delete course',
                confirmButtonColor: '#d33'
              });
            }
          })
          .finally(() => {
            setIsDeleting(false);
          });
      }
    });
  };

  // Handle course editing
  const handleEditCourse = (course) => {
    Swal.fire({
      title: 'Edit Course',
      html: `
        <input id="swal-input1" class="swal2-input" placeholder="Prefix" value="${course.prefix || ''}" />
        <input id="swal-input2" class="swal2-input" placeholder="Name" value="${course.name || ''}" />
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Save',
      preConfirm: () => {
        const prefix = document.getElementById('swal-input1').value.trim();
        const name = document.getElementById('swal-input2').value.trim();
        if (!prefix || !name) {
          Swal.showValidationMessage('Both fields are required');
          return false;
        }
        return { prefix, name };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        setIsDeleting(true);
        const payload = { ...result.value, program_id: course.program_id };
        PostApi(`/courses/${course.id}`, payload)
          .then(() => {
            refetch();
            Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: 'Course updated successfully',
              confirmButtonColor: '#3085d6'
            });
          })
          .catch(error => {
            console.error('Error updating course:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: error.message || 'Failed to update course',
              confirmButtonColor: '#d33'
            });
          })
          .finally(() => {
            setIsDeleting(false);
          });
      }
    });
  };


  return (
    <>
      {/* <PageHeader>
        <PageHeaderWidgets />
      </PageHeader> */}
      <div className='main-content'>
        <div className='row'>
          <div className='col-12'>
            <div className='card'>
              <div className='card-header d-flex justify-content-between align-items-center'>
                <h5 className='mb-0'>Course List</h5>
                <Link to="/courses/add" className='btn btn-primary'>
                  <FiPlus className="me-1" /> Add New Course
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
                        placeholder='Search by course name or prefix'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  {/* <div className='col-md-6'>
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
                        {programs.map((program) => (
                          <option key={program.id} value={program.id}>{program.name}</option>
                        ))}
                      </select>
                    </div>
                  </div> */}
                </div>
                
                {isLoading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : isError ? (
                  <div className="alert alert-danger">
                    {error?.message || 'Error loading courses'}
                  </div>
                ) : (
                  <div className='table-responsive'>
                    <table className='table table-hover'>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Prefix</th>
                          <th>Course Name</th>
                          <th>Program</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCourses.length > 0 ? (
                          filteredCourses.map((course, index) => {
                            return (
                              <tr key={course.id}>
                                <td>{index + 1}</td>
                                <td>{course.prefix}</td>
                                <td>{course.name}</td>
                                <td>{course?.program?.name || 'Unknown'}</td>
                                <td>
                                  <div className='d-flex gap-2'>
                                    
                                    <button 
                                      className='btn btn-sm btn-warning'
                                      onClick={() => handleEditCourse(course)}
                                      disabled={isDeleting}
                                    >
                                      <FiEdit size={16} />
                                    </button>
                                    <button 
                                      className='btn btn-sm btn-danger'
                                      onClick={() => handleDeleteCourse(course.id)}
                                      disabled={isDeleting}
                                    >
                                      <FiTrash size={16} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan="5" className="text-center">
                              {courses.length === 0 ? 'No courses found' : 'No matching courses'}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
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

export default CourseList;
