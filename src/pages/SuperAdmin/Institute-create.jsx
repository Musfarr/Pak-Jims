import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageHeader from '@/components/shared/pageHeader/PageHeader';
import { useForm } from 'react-hook-form';
import { FiSave, FiX } from 'react-icons/fi';
import { PostApi } from '@/utils/Api/ApiServices';
import Swal from 'sweetalert2';

const InstituteCreate = () => {
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      registration_no: '',
      iso_certified_no: '',
      ntn_no: '',
      sales_tax: '',
      phone_no: '',
      cell_no: '',
      website: '',
      email: '',
      address: ''
    }
  });
  
  const onSubmit = async (data) => {
    try {
      const response = await PostApi('/institutes', data);
      
      if (response.status) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Institute created successfully',
          confirmButtonColor: '#3085d6'
        }).then(() => {
          navigate('/institutes');
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: response.message || 'Failed to create institute',
          confirmButtonColor: '#d33'
        });
      }
    } catch (error) {
      console.error('Error creating institute:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.message || 'An unexpected error occurred',
        confirmButtonColor: '#d33'
      });
    }
  };
  
  return (
    <>
      <PageHeader>
        <h4 className="mb-0">Create New Institute</h4>
      </PageHeader>
      <div className='main-content'>
        <div className='row'>
          <div className='col-12'>
            
            <div className='card'>
              <div className='card-body'>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="card-title">Institute Information</h5>
                  <Link to="/institutes" className="btn btn-outline-secondary">
                    Back to List
                  </Link>
                </div>
                
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="row">
                    <div className="col-md-12 mb-3">
                      <label htmlFor="name" className="form-label">Institute Name*</label>
                      <input
                        type="text"
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        id="name"
                        {...register('name', { required: 'Institute name is required' })}
                        placeholder="Enter institute name"
                      />
                      {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                    </div>
                    
                    <div className="col-md-4 mb-3">
                      <label htmlFor="registration_no" className="form-label">Registration No*</label>
                      <input
                        type="text"
                        className={`form-control ${errors.registration_no ? 'is-invalid' : ''}`}
                        id="registration_no"
                        {...register('registration_no', { required: 'Registration number is required' })}
                        placeholder="Enter registration number"
                      />
                      {errors.registration_no && <div className="invalid-feedback">{errors.registration_no.message}</div>}
                    </div>
                    
                    <div className="col-md-4 mb-3">
                      <label htmlFor="iso_certified_no" className="form-label">ISO Certified No</label>
                      <input
                        type="text"
                        className="form-control"
                        id="iso_certified_no"
                        {...register('iso_certified_no')}
                        placeholder="Enter ISO certification number"
                      />
                    </div>
                    
                    <div className="col-md-4 mb-3">
                      <label htmlFor="ntn_no" className="form-label">NTN No</label>
                      <input
                        type="text"
                        className="form-control"
                        id="ntn_no"
                        {...register('ntn_no')}
                        placeholder="Enter NTN number"
                      />
                    </div>
                    
                    <div className="col-md-4 mb-3">
                      <label htmlFor="sales_tax" className="form-label">Sales Tax</label>
                      <input
                        type="text"
                        className="form-control"
                        id="sales_tax"
                        {...register('sales_tax')}
                        placeholder="Enter sales tax"
                      />
                    </div>
                    
                    <div className="col-md-4 mb-3">
                      <label htmlFor="phone_no" className="form-label">Phone No</label>
                      <input
                        type="tel"
                        className="form-control"
                        id="phone_no"
                        {...register('phone_no')}
                        placeholder="Enter phone number"
                      />
                    </div>
                    
                    <div className="col-md-4 mb-3">
                      <label htmlFor="cell_no" className="form-label">Cell No</label>
                      <input
                        type="tel"
                        className="form-control"
                        id="cell_no"
                        {...register('cell_no')}
                        placeholder="Enter cell number"
                      />
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <label htmlFor="website" className="form-label">Website</label>
                      <input
                        type="text"
                        className="form-control"
                        id="website"
                        {...register('website')}
                        placeholder="Enter website URL"
                      />
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <label htmlFor="email" className="form-label">Email*</label>
                      <input
                        type="email"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        id="email"
                        {...register('email', { 
                          required: 'Email is required',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address'
                          }
                        })}
                        placeholder="Enter email address"
                      />
                      {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                    </div>
                    
                    <div className="col-md-12 mb-3">
                      <label htmlFor="address" className="form-label">Address</label>
                      <textarea
                        className="form-control"
                        id="address"
                        {...register('address')}
                        rows="3"
                        placeholder="Enter full address"
                      ></textarea>
                    </div>
                  </div>
                  
                  <div className="d-flex justify-content-end mt-4">
                    <Link to="/institutes" className="btn btn-secondary me-2">
                      <FiX className="me-1" /> Cancel
                    </Link>
                    <button type="submit" className="btn btn-primary">
                      <FiSave className="me-1" /> Create Institute
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InstituteCreate;
