import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import PageHeader from '@/components/shared/pageHeader/PageHeader';
import { FiSave, FiX } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { GetApi, PostApi } from '@/utils/Api/ApiServices';
import Swal from 'sweetalert2';


const InstituteCreateSuperAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const location = useLocation();
  const instituteID = location.state?.instituteID;
  const [loading, setLoading] = useState(false);

  console.log(instituteID)
  // React Hook Form setup
  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      username: '',
      password: '',
      password_confirmation: '',
      branch_id: id,
      user_type: 'admin',
      institute_id: instituteID,
    }
  });
  
  // // Fetch branch data
  // const { data: branchResponse, isLoading } = useQuery({
  //   queryKey: ['branch', id],
  //   queryFn: () => GetApi(`/branches/${id}`),
  //   enabled: !!id
  // });
  
  // const branch = branchResponse?.data;
  
  // Create admin mutation
  const createAdminMutation = useMutation({

    mutationFn: (data) => PostApi('/users', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      setLoading(false)
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Administrator created successfully',
        confirmButtonColor: '#3085d6'
      }).then(() => {
        navigate('/branch/list');
      });
    },
    onError: (error) => {
      console.error('Error creating admin:', error);
      setLoading(false)
      if(error.status !== 422){
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: error.message || 'Failed to create administrator',
          confirmButtonColor: '#d33'
        });
      }
    }
  });
  
  // Handle form submission
  const onSubmit = (data) => {
    // // Add institute_id from branch data
    // if (branch?.institute_id) {
    //   data.institute_id = branch.institute_id;
    // }
    setLoading(true)
    createAdminMutation.mutate(data);
  };
  
  // Cancel and go back
  const handleCancel = () => {
    navigate('/branch/list');
  };
  
  // if (isLoading) {
  //   return (
  //     <div className="d-flex justify-content-center m-5">
  //       <div className="spinner-border" role="status">
  //         <span className="visually-hidden">Loading...</span>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <>
      {/* <PageHeader>
        <h4 className="mb-0">Create Admin for {branch?.name || 'Branch'}</h4>
      </PageHeader> */}
      <div className='main-content'>
        <div className='row'>
          <div className='col-12'>
            <div className='card'>
              <div className='card-body'>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="card-title">Admin Information</h5>
                  <Link to="/branch/list" className="btn btn-outline-secondary">
                    Back to Branches
                  </Link>
                </div>
                
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="name" className="form-label">Full Name*</label>
                      <input
                        type="text"
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        id="name"
                        {...register('name', { required: 'Name is required' })}
                        placeholder="Enter full name"
                      />
                      {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
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
                            value: /^\S+@\S+\.\S+$/,
                            message: 'Please enter a valid email address'
                          }
                        })}
                        placeholder="Enter email address"
                      />
                      {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <label htmlFor="phone" className="form-label">Phone Number*</label>
                      <input
                        type="tel"
                        className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                        id="phone"
                        {...register('phone', { required: 'Phone number is required' })}
                        placeholder="Enter phone number"
                      />
                      {errors.phone && <div className="invalid-feedback">{errors.phone.message}</div>}
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="username" className="form-label">Username*</label>
                      <input
                        type="text"
                        className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                        id="username"
                        {...register('username', { required: 'Username is required' })}
                        placeholder="Enter username"
                      />
                      {errors.username && <div className="invalid-feedback">{errors.username.message}</div>}
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <label htmlFor="password" className="form-label">Password*</label>
                      <input
                        type="password"
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        id="password"
                        {...register('password', { 
                          required: 'Password is required',
                          minLength: {
                            value: 8,
                            message: 'Password must be at least 8 characters'
                          }
                        })}
                        placeholder="Enter password"
                      />
                      {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <label htmlFor="password_confirmation" className="form-label">Confirm Password*</label>
                      <input
                        type="password"
                        className={`form-control ${errors.password_confirmation ? 'is-invalid' : ''}`}
                        id="password_confirmation"
                        {...register('password_confirmation', { 
                          required: 'Please confirm password',
                          validate: (value, formValues) => value === formValues.password || 'Passwords do not match'
                        })}
                        placeholder="Confirm password"
                      />
                      {errors.password_confirmation && <div className="invalid-feedback">{errors.password_confirmation.message}</div>}
                    </div>
                    
                    {/* Hidden fields */}
                    <input type="hidden" {...register('branch_id')} />
                    <input type="hidden" {...register('user_type')} />
                  </div>
                  
                  <div className="d-flex justify-content-end mt-4">
                    <button type="button" className="btn btn-secondary me-2" onClick={handleCancel}>
                      <FiX className="me-1" /> Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      <FiSave className="me-1" /> 
                      {loading ? 'Creating...' : 'Create Admin'}
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

export default InstituteCreateSuperAdmin;
