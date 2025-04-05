import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import PageHeader from '@/components/shared/pageHeader/PageHeader';
import { FiSave, FiX, FiTrash2 } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { GetApi, PostApi, DeleteApi } from '@/utils/Api/ApiServices';
import Swal from 'sweetalert2';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const BranchEdit = () => {
  const { id } = useParams(); // Branch ID
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Fetch branch data
  const { data: response, isLoading, isError, error } = useQuery({
    queryKey: ['branch', id],
    queryFn: () => GetApi(`/branches/${id}`),
    enabled: !!id
  });

  const branch = response?.data;
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  
  // Reset form when data is loaded
  React.useEffect(() => {
    if (branch) {
      reset({
        name: branch.name,
        address: branch.address,
        institute_id: branch.institute_id
      });
    }
  }, [branch, reset]);
  
  // Update branch mutation
  const updateMutation = useMutation({
    mutationFn: (data) => PostApi(`/branches/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['branches']);
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Branch updated successfully',
        confirmButtonColor: '#3085d6'
      }).then(() => {
        navigate('/branch/list');
      });
    },
    onError: (error) => {
      console.error('Error updating branch:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.message || 'Failed to update branch',
        confirmButtonColor: '#d33'
      });
    }
  });
  
  // Delete branch mutation
  const deleteMutation = useMutation({
    mutationFn: () => DeleteApi(`/branches/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['branches']);
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Branch deleted successfully',
        confirmButtonColor: '#3085d6'
      }).then(() => {
        navigate('/branch/list');
      });
    },
    onError: (error) => {
      console.error('Error deleting branch:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.message || 'Failed to delete branch',
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
        {error?.message || 'Error loading branch data'}
      </div>
    );
  }

  return (
    <>
      <PageHeader>
        <h4 className="mb-0">Edit Branch</h4>
      </PageHeader>
      <div className='main-content'>
        <div className='row'>
          <div className='col-12'>
            <div className='card'>
              <div className='card-body'>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="card-title">Branch Information</h5>
                  <Link to="/branch/list" className="btn btn-outline-secondary">
                    Back to List
                  </Link>
                </div>
                
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="row">
                    <div className="col-md-12 mb-3">
                      <label htmlFor="name" className="form-label">Branch Name*</label>
                      <input
                        type="text"
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        id="name"
                        {...register('name', { required: 'Branch name is required' })}
                        placeholder="Enter branch name"
                      />
                      {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                    </div>
                    
                    <div className="col-md-12 mb-3">
                      <label htmlFor="address" className="form-label">Address*</label>
                      <textarea
                        className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                        id="address"
                        {...register('address', { required: 'Address is required' })}
                        rows="3"
                        placeholder="Enter branch address"
                      ></textarea>
                      {errors.address && <div className="invalid-feedback">{errors.address.message}</div>}
                    </div>
                    
                    <input type="hidden" {...register('institute_id')} />
                  </div>
                  
                  <div className="d-flex justify-content-end gap-2 mt-4">
                    <button 
                      type="button" 
                      className="btn btn-danger" 
                      onClick={handleDelete}
                    >
                      <FiTrash2 className="me-1" /> Delete Branch
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-secondary" 
                      onClick={() => navigate('/branch/list')}
                    >
                      <FiX className="me-1" /> Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={updateMutation.isLoading}
                    >
                      <FiSave className="me-1" /> 
                      {updateMutation.isLoading ? 'Updating...' : 'Update Branch'}
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

export default BranchEdit;
