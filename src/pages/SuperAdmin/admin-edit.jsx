import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import PageHeader from '@/components/shared/pageHeader/PageHeader';
import { FiSave, FiX, FiTrash2 } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { GetApi, PostApi, DeleteApi } from '@/utils/Api/ApiServices';
import Swal from 'sweetalert2';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';

const AdminEdit = () => {
  const { id } = useParams(); // Admin ID
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { institute_id } = useAuth(); // Get institute_id from auth context
  
  // Form setup with validation
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  
  // Fetch admin data
  const { data: adminResponse, isLoading: adminLoading, isError: adminError, error: adminErrorData } = useQuery({
    queryKey: ['user', id],
    queryFn: () => GetApi(`/users/${id}`),
    enabled: !!id
  });
  
  const admin = adminResponse?.data;
  
  // Fetch branches for dropdown
  const { data: branchesResponse, isLoading: branchesLoading } = useQuery({
    queryKey: ['branches'],
    queryFn: () => GetApi('/branches')
  });
  
  const branches = branchesResponse?.data || [];
  
  // Filter branches by institute_id if available
  const filteredBranches = institute_id 
    ? branches.filter(branch => branch.institute_id === parseInt(institute_id))
    : branches;
  
  // Reset form when data is loaded
  React.useEffect(() => {
    if (admin) {
      reset({
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        username: admin.username,
        branch_id: admin.branch_id,
        institute_id: admin.institute_id,
        // Don't reset password fields
      });
    }
  }, [admin, reset]);
  
  // Update admin mutation
  const updateAdminMutation = useMutation({
    mutationFn: (data) => PostApi(`/users/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Administrator updated successfully',
        confirmButtonColor: '#3085d6'
      }).then(() => {
        navigate('/super-admin/admin/list');
      });
    },
    onError: (error) => {
      console.error('Error updating admin:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.message || 'Failed to update administrator',
        confirmButtonColor: '#d33'
      });
    }
  });
  
  // Delete admin mutation
  const deleteAdminMutation = useMutation({
    mutationFn: () => DeleteApi(`/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Administrator deleted successfully',
        confirmButtonColor: '#3085d6'
      }).then(() => {
        navigate('/super-admin/admin/list');
      });
    },
    onError: (error) => {
      console.error('Error deleting admin:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.message || 'Failed to delete administrator',
        confirmButtonColor: '#d33'
      });
    }
  });
  
  const onSubmit = (data) => {
    // Remove empty password fields if not changed
    if (!data.password) {
      delete data.password;
      delete data.password_confirmation;
    }
    
    // Add user_type to the data
    data.user_type = 'admin';
    
    // If institute_id is available from context, use it
    if (institute_id) {
      data.institute_id = institute_id;
    }
    
    updateAdminMutation.mutate(data);
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
        deleteAdminMutation.mutate();
      }
    });
  };
  
  if (adminLoading || branchesLoading) {
    return (
      <div className="d-flex justify-content-center m-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  
  if (adminError) {
    return (
      <div className="alert alert-danger m-5">
        {adminErrorData?.message || 'Error loading administrator data'}
      </div>
    );
  }

  return (
    <>
      <PageHeader>
        <h4 className="mb-0">Edit Administrator</h4>
      </PageHeader>
      <div className='main-content'>
        <div className='row'>
          <div className='col-12'>
            <div className='card'>
              <div className='card-body'>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="card-title">Administrator Information</h5>
                  <Link to="/super-admin/admin/list" className="btn btn-outline-secondary">
                    Back to Administrators
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
                      <label htmlFor="password" className="form-label">Password (leave blank to keep current)</label>
                      <input
                        type="password"
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        id="password"
                        {...register('password', { 
                          minLength: {
                            value: 8,
                            message: 'Password must be at least 8 characters'
                          }
                        })}
                        placeholder="Enter new password (optional)"
                      />
                      {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <label htmlFor="password_confirmation" className="form-label">Confirm Password</label>
                      <input
                        type="password"
                        className={`form-control ${errors.password_confirmation ? 'is-invalid' : ''}`}
                        id="password_confirmation"
                        {...register('password_confirmation', { 
                          validate: (value, formValues) => 
                            !formValues.password || value === formValues.password || 'Passwords do not match'
                        })}
                        placeholder="Confirm new password"
                      />
                      {errors.password_confirmation && <div className="invalid-feedback">{errors.password_confirmation.message}</div>}
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <label htmlFor="branch_id" className="form-label">Branch*</label>
                      <select
                        className={`form-select ${errors.branch_id ? 'is-invalid' : ''}`}
                        id="branch_id"
                        {...register('branch_id', { required: 'Branch is required' })}
                      >
                        <option value="">Select Branch</option>
                        {filteredBranches.map(branch => (
                          <option key={branch.id} value={branch.id}>
                            {branch.name}
                          </option>
                        ))}
                      </select>
                      {errors.branch_id && <div className="invalid-feedback">{errors.branch_id.message}</div>}
                    </div>
                    
                    {!institute_id && (
                      <div className="col-md-6 mb-3">
                        <label htmlFor="institute_id" className="form-label">Institute*</label>
                        <select
                          className={`form-select ${errors.institute_id ? 'is-invalid' : ''}`}
                          id="institute_id"
                          {...register('institute_id', { required: 'Institute is required' })}
                        >
                          <option value="">Select Institute</option>
                          {[...new Set(branches.map(branch => JSON.stringify({
                            id: branch.institute_id,
                            name: branch.institute_name
                          })))].map(institute => {
                            const { id, name } = JSON.parse(institute);
                            return (
                              <option key={id} value={id}>
                                {name}
                              </option>
                            );
                          })}
                        </select>
                        {errors.institute_id && <div className="invalid-feedback">{errors.institute_id.message}</div>}
                      </div>
                    )}
                  </div>
                  
                  <div className="d-flex justify-content-end gap-2 mt-4">
                    <button 
                      type="button" 
                      className="btn btn-danger" 
                      onClick={handleDelete}
                    >
                      <FiTrash2 className="me-1" /> Delete Administrator
                    </button>
                    <Link to="/super-admin/admin/list" className="btn btn-secondary">
                      <FiX className="me-1" /> Cancel
                    </Link>
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={updateAdminMutation.isLoading}
                    >
                      <FiSave className="me-1" /> 
                      {updateAdminMutation.isLoading ? 'Updating...' : 'Update Administrator'}
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

export default AdminEdit;
