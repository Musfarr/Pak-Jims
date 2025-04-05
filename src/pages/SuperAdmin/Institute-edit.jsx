import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import PageHeader from '@/components/shared/pageHeader/PageHeader';
import { useForm } from 'react-hook-form';
import { FiSave, FiX, FiTrash2 } from 'react-icons/fi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { GetApi, PutApi, DeleteApi, PostApi } from '@/utils/Api/ApiServices';
import Swal from 'sweetalert2';

const InstituteEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Fetch institute data
  const { data: response, isLoading, isError, error } = useQuery({
    queryKey: ['institute', id],
    queryFn: () => GetApi(`/institutes/${id}`),
    enabled: !!id
  });

  const institute = response?.data;
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  
  // Reset form when data is loaded
  React.useEffect(() => {
    if (institute) {
      reset({
        name: institute.name,
        registration_no: institute.registration_no,
        iso_certified_no: institute.iso_certified_no,
        ntn_no: institute.ntn_no,
        sales_tax: institute.sales_tax,
        phone_no: institute.phone_no,
        cell_no: institute.cell_no,
        website: institute.website,
        email: institute.email,
        address: institute.address
      });
    }
  }, [institute, reset]);
  
  
  // Update institute mutation
  const updateMutation = useMutation({
    mutationFn: (data) => PostApi(`/institutes/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['institutes']);
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Institute updated successfully',
        confirmButtonColor: '#3085d6'
      }).then(() => {
        navigate('/institutes');
      });
    },
    onError: (error) => {
      console.error('Error updating institute:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.message || 'Failed to update institute',
        confirmButtonColor: '#d33'
      });
    }
  });
  
  // Delete institute mutation
  const deleteMutation = useMutation({
    mutationFn: () => DeleteApi(`/institutes/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['institutes']);
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Institute deleted successfully',
        confirmButtonColor: '#3085d6'
      }).then(() => {
        navigate('/institutes');
      });
    },
    onError: (error) => {
      console.error('Error deleting institute:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.message || 'Failed to delete institute',
        confirmButtonColor: '#d33'
      });
    }
  });
  
  const onSubmit = (data) => {
    updateMutation.mutate(data);
  };
  
  const handleDelete = () => {
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
        deleteMutation.mutate();
      }
    });
  };
  
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center m-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="alert alert-danger m-5">
        {error?.message || 'Error loading institute data'}
      </div>
    );
  }

  return (
    <>
      <PageHeader>
        <h4 className="mb-0">Edit Institute</h4>
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
                  
                  <div className="d-flex justify-content-end gap-2 mt-4">
                    <button 
                      type="button" 
                      className="btn btn-danger" 
                      onClick={handleDelete}
                    >
                      <FiTrash2 className="me-1" /> Delete Institute
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-secondary" 
                      onClick={() => navigate('/institutes')}
                    >
                      <FiX className="me-1" /> Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={updateMutation.isLoading}
                    >
                      <FiSave className="me-1" /> 
                      {updateMutation.isLoading ? 'Updating...' : 'Update Institute'}
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

export default InstituteEdit;
