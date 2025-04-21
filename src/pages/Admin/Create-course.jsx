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

const CreateCourse = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch programs for dropdown
  const { data: programsResponse, isLoading: programsLoading } = useQuery({
    queryKey: ['programs'],
    queryFn: () => GetApi('/programs')
  });
  
  const programs = programsResponse?.data || [];
  
  // React Hook Form setup
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      prefix: '',
      name: '',
      program_id: ''
    }
  });
  
  // Handle form submission
  const onSubmit = (data) => {
    setIsSubmitting(true);
    
    PostApi('/courses', data)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Course created successfully',
          confirmButtonColor: '#3085d6'
        }).then(() => {
          navigate('/courses/list');
        });
      })
      .catch(error => {
        console.error('Error creating course:', error);
        // Only show error if it's not a 422 validation error (which is already handled by interceptor)
        if (!error.response || error.response.status !== 422) {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: error.message || 'Failed to create course',
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
                <h5 className='mb-0'>Create New Course</h5>
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
                            placeholder="Enter course prefix"
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
                        <label htmlFor="name" className="form-label">Course Name*</label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <i className="feather feather-book"></i>
                          </span>
                          <input
                            type="text"
                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                            id="name"
                            placeholder="Enter course name"
                            {...register('name', { required: 'Course name is required' })}
                          />
                          {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='row mb-4'>
                    <div className='col-12'>
                      <div className="form-group">
                        <label htmlFor="program_id" className="form-label">Program*</label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <i className="feather feather-layers"></i>
                          </span>
                          <select
                            id="program_id"
                            className={`form-select ${errors.program_id ? 'is-invalid' : ''}`}
                            {...register('program_id', { required: 'Program is required' })}
                            disabled={programsLoading}
                          >
                            <option value="">Select program</option>
                            {programs.map(program => (
                              <option key={program.id} value={program.id}>
                                {program.name}
                              </option>
                            ))}
                          </select>
                          {errors.program_id && <div className="invalid-feedback">{errors.program_id.message}</div>}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='d-flex justify-content-end gap-2'>
                    <Link to="/courses/list" className='btn btn-secondary'>
                      <FiX className="me-1" /> Cancel
                    </Link>
                    <button 
                      type="submit" 
                      className='btn btn-primary'
                      disabled={isSubmitting || programsLoading}
                    >
                      <FiSave className="me-1" /> 
                      {isSubmitting ? 'Saving...' : 'Save Course'}
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

export default CreateCourse;
