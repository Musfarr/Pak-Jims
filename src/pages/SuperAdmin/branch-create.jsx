import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import PageHeader from '@/components/shared/pageHeader/PageHeader';
import { FiSave, FiX } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { PostApi } from '@/utils/Api/ApiServices';
import Swal from 'sweetalert2';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const BranchCreate = () => {
  const { id } = useParams(); // Institute ID
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      address: '',
      institute_id: id
    }
  });
  
  // Create branch mutation
  const createBranchMutation = useMutation({
    mutationFn: (data) => PostApi('/branches', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['branches']);
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Branch created successfully',
        confirmButtonColor: '#3085d6'
      }).then(() => {
        navigate('/branch/list');
      });
    },
    onError: (error) => {
      console.error('Error creating branch:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.message || 'Failed to create branch',
        confirmButtonColor: '#d33'
      });
    }
  });
  
  const onSubmit = (data) => {
    createBranchMutation.mutate(data);
  };
  
  return (
    <>
      <PageHeader>
        <h4 className="mb-0">Create New Branch</h4>
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
                  
                  <div className="d-flex justify-content-end mt-4">
                    <Link to="/branch/list" className="btn btn-secondary me-2">
                      <FiX className="me-1" /> Cancel
                    </Link>
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={createBranchMutation.isLoading}
                    >
                      <FiSave className="me-1" /> 
                      {createBranchMutation.isLoading ? 'Creating...' : 'Create Branch'}
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

export default BranchCreate;