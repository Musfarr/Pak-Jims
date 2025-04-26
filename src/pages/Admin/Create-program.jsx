import React, { useState } from 'react';
import PageHeader from '@/components/shared/pageHeader/PageHeader';
import PageHeaderWidgets from '@/components/shared/pageHeader/PageHeaderWidgets';
import Footer from '@/components/shared/Footer';
import { Link, useNavigate } from 'react-router-dom';
import Input from '@/components/shared/Input';
import { FiSave, FiX } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { PostApi } from '@/utils/Api/ApiServices';
import Swal from 'sweetalert2';

const CreateProgram = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // React Hook Form setup
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      prefix: '',
      name: '' // Changed from programName to name to match API
    }
  });
  
  // Handle form submission
  const onSubmit = (data) => {
    setIsSubmitting(true);
    
    PostApi('/programs', data)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Program created successfully',
          confirmButtonColor: '#3085d6'
        }).then(() => {
          navigate('/programs/list');
        });
      })
      .catch(error => {
        console.error('Error creating program:', error);
        // Only show error if it's not a 422 validation error (which is already handled by interceptor)
        if (!error.response || error.response.status !== 422) {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: error.message || 'Failed to create program',
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
      {/* <PageHeader>
        <PageHeaderWidgets />
      </PageHeader> */}
      <div className='main-content'>
        <div className='row'>
          <div className='col-12'>
            <div className='card'>
              <div className='card-header'>
                <h5 className='mb-0'>Create New Program</h5>
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
                            placeholder="Enter program prefix"
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
                        <label htmlFor="name" className="form-label">Program Name*</label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <i className="feather feather-file-text"></i>
                          </span>
                          <input
                            type="text"
                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                            id="name"
                            placeholder="Enter program name"
                            {...register('name', { required: 'Program name is required' })}
                          />
                          {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='d-flex justify-content-end gap-2'>
                    <Link to="/programs/list" className='btn btn-secondary'>
                      <FiX className="me-1" /> Cancel
                    </Link>
                    <button 
                      type="submit" 
                      className='btn btn-primary'
                      disabled={isSubmitting}
                    >
                      <FiSave className="me-1" /> 
                      {isSubmitting ? 'Saving...' : 'Save Program'}
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

export default CreateProgram;
