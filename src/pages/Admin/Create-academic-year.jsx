import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { FiX, FiPlus, FiCalendar, FiTrash, FiEdit } from 'react-icons/fi';
import { GetApi, DeleteApi, PostApi } from '@/utils/Api/ApiServices';
import Swal from 'sweetalert2';




const CreateAcademicYear = () => {


  const [isDeleting, setIsDeleting] = useState(false);

  // React Hook Form
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { academicYear: '' }
  });

  // React Query: fetch academic years
  const { data: yearsResponse, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['academic-years'],
    queryFn: () => GetApi('/academic-years')
  });
  const academicYears = yearsResponse?.data || [];

  // Form submit handler
  const onSubmit = async (data) => {
    try {
      await PostApi('/academic-years', { name: data.academicYear });
      Swal.fire({ icon: 'success', title: 'Success', text: 'Academic year created!' });
      reset();
      refetch();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err?.message || 'Failed to create academic year.' });
    }
  };


  // Handle academic year editing
  const handleEditAcademicYear = (year) => {
    Swal.fire({
      title: 'Edit Academic Year',
      html: `
        <input id="swal-input1" class="swal2-input" placeholder="Academic Year" value="${year.name || ''}" />
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Save',
      preConfirm: () => {
        const name = document.getElementById('swal-input1').value.trim();
        if (!name) {
          Swal.showValidationMessage('Name is required');
          return false;
        }
        return { name };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        setIsDeleting(true);
        const payload = { ...result.value };
        PostApi(`/academic-years/${year.id}`, payload)
          .then(() => {
            refetch();
            Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: 'Academic year updated successfully',
              confirmButtonColor: '#3085d6'
            });
          })
          .catch(error => {
            console.error('Error updating academic year:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: error.message || 'Failed to update academic year',
              confirmButtonColor: '#d33'
            });
          })
          .finally(() => {
            setIsDeleting(false);
          });
      }
    });
  };

  const handleDeleteAcademicYear = (id) => {
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
        DeleteApi(`/academic-years/${id}`)
          .then(() => {
            refetch(); // Refresh the academic years list
            Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: 'Academic year deleted successfully',
              confirmButtonColor: '#3085d6'
            });
          })
          .catch(error => {
            console.error('Error deleting academic year:', error);
            if (!error.response || error.response.status !== 422) {
              Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: error.message || 'Failed to delete academic year',
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

  return (
    <>
      {/* <PageHeader>
        <PageHeaderWidgets />
      </PageHeader> */}
      <div className='main-content'>
        <div className='col'>
          <div className='card'>
            <div className='card-header'>
              <h5 className='mb-0'>Create Academic Year</h5>
            </div>
            <div className='card-body' style={{ height: '180px' }}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className='mb-4'>
                  <label htmlFor='academicYearInput' className='form-label fw-semibold'>Academic Year :</label>
                  <div className='input-group'>
                    <span className='input-group-text'><FiCalendar /></span>
                    <input
                      type='text'
                      id='academicYearInput'
                      className={`form-control ${errors.academicYear ? 'is-invalid' : ''}`}
                      placeholder='Enter academic year (e.g., SESSION 2025)'
                      {...register('academicYear', { required: 'Academic year is required' })}
                      required
                    />
                    {errors.academicYear && <div className='invalid-feedback'>{errors.academicYear.message}</div>}
                  </div>
                </div>

                <div className='d-flex gap-2 mt-4'>
                  <Link to="/admin-dashboard" className='btn btn-secondary ms-auto'>
                    <FiX className='me-1' /> Cancel
                  </Link>
                  <button type='submit' className='btn btn-success' disabled={isSubmitting}>
                    <FiPlus className='me-1' /> {isSubmitting ? 'Adding...' : 'Add New'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className='col'>
          <div className='card mt-4'>
            <div className='card-header'>Academic Years List</div>
            <div className='card-body' style={{ height: "280px", overflow: "scroll" }}>
              {isLoading ? (
                <div>Loading...</div>
              ) : isError ? (
                <div className='text-danger'>Error: {error?.message || 'Failed to load academic years.'}</div>
              ) : academicYears.length === 0 ? (
                <div>No academic years found.</div>
              ) : (
                <div className='table-responsive'>
                  <table className='table table-hover'>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Academic Year</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {academicYears.map((year) => (
                        <tr key={year.id}>
                          <td>{year.id}</td>
                          <td>{year.name}</td>
                          <td>
                            <div className='d-flex gap-2'>
                              
                              <button 
                                className='btn btn-sm btn-warning'
                                onClick={() => handleEditAcademicYear(year)}
                                disabled={isDeleting}
                              >
                                <FiEdit size={16} />
                              </button>
                              <button 
                                className='btn btn-sm btn-danger'
                                onClick={() => handleDeleteAcademicYear(year.id)}
                                disabled={isDeleting}
                              >
                                <FiTrash size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateAcademicYear;
