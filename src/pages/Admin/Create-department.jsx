import React, { useState } from 'react';
import PageHeader from '@/components/shared/pageHeader/PageHeader';
import PageHeaderWidgets from '@/components/shared/pageHeader/PageHeaderWidgets';
import Footer from '@/components/shared/Footer';
import { Link, useNavigate } from 'react-router-dom';
import { FiSave, FiX } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { GetApi, PostApi } from '@/utils/Api/ApiServices';
import Swal from 'sweetalert2';

const CreateDepartment = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch courses for dropdown
  const { data: coursesResponse, isLoading: coursesLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: () => GetApi('/courses')
  });
  
  const courses = coursesResponse?.data?.data || [];
  
  // React Hook Form setup
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      prefix: '',
      name: '',
      course_id: ''
    }
  });
  
  // Handle form submission
  const onSubmit = (data) => {
    setIsSubmitting(true);
    
    PostApi('/departments', data)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Department created successfully',
          confirmButtonColor: '#3085d6'
        }).then(() => {
          navigate('/departments/list');
        });
      })
      .catch(error => {
        console.error('Error creating department:', error);
        // Only show error if it's not a 422 validation error (which is already handled by interceptor)
        if (!error.response || error.response.status !== 422) {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: error.message || 'Failed to create department',
            confirmButtonColor: '#d33'
          });
        }
      })
      .finally(() => {
        setIsSubmitting(false);
      });
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
              <div className='card-header'>
                <h5 className='mb-0'>Create New Department</h5>
              </div>
              <div className='card-body'>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className='row mb-4'>
                    <div className='col-md-6'>
                      <div className="form-group">
                        <label htmlFor="prefix" className="form-label">Prefix*</label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <i className="feather feather-tag"></i>
                          </span>
                          <input
                            type="text"
                            className={`form-control ${errors.prefix ? 'is-invalid' : ''}`}
                            id="prefix"
                            placeholder="Enter department prefix"
                            {...register('prefix', { required: 'Prefix is required' })}
                          />
                          {errors.prefix && <div className="invalid-feedback">{errors.prefix.message}</div>}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='row mb-4'>
                    <div className='col-12'>
                      <div className="form-group">
                        <label htmlFor="name" className="form-label">Department Name*</label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <i className="feather feather-briefcase"></i>
                          </span>
                          <input
                            type="text"
                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                            id="name"
                            placeholder="Enter department name"
                            {...register('name', { required: 'Department name is required' })}
                          />
                          {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='row mb-4'>
                    <div className='col-12'>
                      <div className="form-group">
                        <label htmlFor="course_id" className="form-label">Course*</label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <i className="feather feather-book"></i>
                          </span>
                          <select
                            id="course_id"
                            className={`form-select ${errors.course_id ? 'is-invalid' : ''}`}
                            {...register('course_id', { required: 'Course is required' })}
                            disabled={coursesLoading}
                          >
                            <option value="">Select course</option>
                            {courses.map(course => (
                              <option key={course.id} value={course.id}>
                                {course.name}
                              </option>
                            ))}
                          </select>
                          {errors.course_id && <div className="invalid-feedback">{errors.course_id.message}</div>}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='d-flex justify-content-end gap-2'>
                    <Link to="/departments/list" className='btn btn-secondary'>
                      <FiX className="me-1" /> Cancel
                    </Link>
                    <button 
                      type="submit" 
                      className='btn btn-primary'
                      disabled={isSubmitting || coursesLoading}
                    >
                      <FiSave className="me-1" /> 
                      {isSubmitting ? 'Saving...' : 'Save Department'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CreateDepartment;
