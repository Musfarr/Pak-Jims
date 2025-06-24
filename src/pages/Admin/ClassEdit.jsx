import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { GetApi, PostApi, DeleteApi } from '@/utils/Api/ApiServices';
import { FiSave, FiArrowLeft, FiEye, FiTrash } from 'react-icons/fi';
import Swal from 'sweetalert2';
import Footer from '@/components/shared/Footer';

const ClassEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch class data by ID
  const { data: classResponse, isLoading: classLoading, isError: classError, error: classErrorData } = useQuery({
    queryKey: ['class', id],
    queryFn: () => GetApi(`/classes/${id}`),
    enabled: !!id
  });
  
  const classData = classResponse?.data || {};

  // Fetch shifts, programs, sections
  const { data: shiftsRes, isLoading: shiftsLoading } = useQuery({
    queryKey: ['shifts'],
    queryFn: () => GetApi('/shifts')
  });
  const { data: programsRes, isLoading: programsLoading } = useQuery({
    queryKey: ['programs'],
    queryFn: () => GetApi('/programs')
  });
  const { data: sectionsRes, isLoading: sectionsLoading } = useQuery({
    queryKey: ['sections'],
    queryFn: () => GetApi('/sections')
  });
  
  const shifts = shiftsRes?.data || [];
  const programs = programsRes?.data || [];
  const sections = sectionsRes?.data || [];

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm();

  // Prefill form with class data
  useEffect(() => {
    if (classData && Object.keys(classData).length > 0) {
      reset({
        name: classData.name || '',
        shift_id: classData.shift_id || '',
        program_id: classData.program_id || '',
        section_id: classData.section_id || '',
        admission_fee: classData.admission_fee || 0,
        month_fee: classData.month_fee || 0,
        exam_fee: classData.exam_fee || 0,
        pract_fee: classData.pract_fee || 0,
        card_fee: classData.card_fee || 0,
        activity_fee: classData.activity_fee || 0,
        comp_fee: classData.comp_fee || 0,
        test_fee: classData.test_fee || 0,
        participation_fee: classData.participation_fee || 0,
        marksheet_fee: classData.marksheet_fee || 0,
        certificate_fee: classData.certificate_fee || 0,
        no_of_student: classData.no_of_student || 0
      });
    }
  }, [classData, reset]);

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      await PostApi(`/classes/${id}`, data);
      Swal.fire({ 
        icon: 'success', 
        title: 'Success', 
        text: 'Class updated successfully!' 
      });
      navigate('/classes/list');
    } catch (err) {
      Swal.fire({ 
        icon: 'error', 
        title: 'Error', 
        text: err?.message || 'Failed to update class.' 
      });
    }
  };

  // Handle class deletion
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
        DeleteApi(`/classes/${id}`)
          .then(() => {
            Swal.fire(
              'Deleted!',
              'Class has been deleted.',
              'success'
            );
            navigate('/classes/list');
          })
          .catch(error => {
            Swal.fire(
              'Error!',
              'Failed to delete class.',
              'error'
            );
          });
      }
    });
  };

  if (classLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading class data...</p>
      </div>
    );
  }

  if (classError) {
    return (
      <div className="alert alert-danger m-5" role="alert">
        Error loading class: {classErrorData?.message || 'Unknown error'}
      </div>
    );
  }

  return (
    <>
      <div className='main-content'>
        <div className='row'>
          <div className='col-12'>
            <div className='card'>
              <div className='card-header d-flex justify-content-between align-items-center'>
                <h5 className='mb-0'>Edit Class</h5>
                <div className='d-flex gap-2'>
                  <Link to={`/classes/view/${id}`} className='btn btn-info btn-sm'>
                    <FiEye className='me-1' /> View
                  </Link>
                  <button 
                    className='btn btn-danger btn-sm'
                    onClick={handleDelete}
                  >
                    <FiTrash className='me-1' /> Delete
                  </button>
                </div>
              </div>
              
              <div className='card-body'>
                <form onSubmit={handleSubmit(onSubmit)}>
                  {/* Basic Class Information */}
                  <div className='row mb-4'>
                    <div className='col'>
                      <label className='form-label fw-semibold'>Class Name:</label>
                      <input 
                        type='text' 
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`} 
                        placeholder='Enter class name' 
                        {...register('name', { required: 'Class name is required' })} 
                      />
                      {errors.name && <div className='invalid-feedback'>{errors.name.message}</div>}
                    </div>
                  </div>

                  <div className='row mb-4'>
                    <div className='col-md-4'>
                      <label className='form-label fw-semibold'>Shift:</label>
                      <select 
                        className={`form-select ${errors.shift_id ? 'is-invalid' : ''}`} 
                        {...register('shift_id', { required: 'Shift is required' })} 
                        disabled={shiftsLoading}
                      >
                        <option value=''>Select shift</option>
                        {shifts.map(shift => (
                          <option key={shift.id} value={shift.id}>{shift.name}</option>
                        ))}
                      </select>
                      {errors.shift_id && <div className='invalid-feedback'>{errors.shift_id.message}</div>}
                    </div>
                    <div className='col-md-4'>
                      <label className='form-label fw-semibold'>Program:</label>
                      <select 
                        className={`form-select ${errors.program_id ? 'is-invalid' : ''}`} 
                        {...register('program_id', { required: 'Program is required' })} 
                        disabled={programsLoading}
                      >
                        <option value=''>Select program</option>
                        {programs.map(program => (
                          <option key={program.id} value={program.id}>{program.name}</option>
                        ))}
                      </select>
                      {errors.program_id && <div className='invalid-feedback'>{errors.program_id.message}</div>}
                    </div>
                    <div className='col-md-4'>
                      <label className='form-label fw-semibold'>Section:</label>
                      <select 
                        className={`form-select ${errors.section_id ? 'is-invalid' : ''}`} 
                        {...register('section_id', { required: 'Section is required' })} 
                        disabled={sectionsLoading}
                      >
                        <option value=''>Select section</option>
                        {sections.map(section => (
                          <option key={section.id} value={section.id}>{section.name}</option>
                        ))}
                      </select>
                      {errors.section_id && <div className='invalid-feedback'>{errors.section_id.message}</div>}
                    </div>
                  </div>

                  {/* Fee Structure Section */}
                  <h6 className='mb-3 border-bottom pb-2'>Fee Structure</h6>
                  <div className='row mb-4'>
                    <div className='col-md-4'>
                      <label className='form-label'>Admission Fee:</label>
                      <div className='input-group'>
                        <span className='input-group-text'>₨</span>
                        <input type='number' className='form-control' placeholder='0' {...register('admission_fee')} />
                      </div>
                    </div>
                    <div className='col-md-4'>
                      <label className='form-label'>Monthly Fee:</label>
                      <div className='input-group'>
                        <span className='input-group-text'>₨</span>
                        <input type='number' className='form-control' placeholder='0' {...register('month_fee')} />
                      </div>
                    </div>
                    <div className='col-md-4'>
                      <label className='form-label'>Examination Fee:</label>
                      <div className='input-group'>
                        <span className='input-group-text'>₨</span>
                        <input type='number' className='form-control' placeholder='0' {...register('exam_fee')} />
                      </div>
                    </div>
                  </div>
                  <div className='row mb-4'>
                    <div className='col-md-4'>
                      <label className='form-label'>Practical Fee:</label>
                      <div className='input-group'>
                        <span className='input-group-text'>₨</span>
                        <input type='number' className='form-control' placeholder='0' {...register('pract_fee')} />
                      </div>
                    </div>
                    <div className='col-md-4'>
                      <label className='form-label'>ID Card Fee:</label>
                      <div className='input-group'>
                        <span className='input-group-text'>₨</span>
                        <input type='number' className='form-control' placeholder='0' {...register('card_fee')} />
                      </div>
                    </div>
                    <div className='col-md-4'>
                      <label className='form-label'>Activity / Picnic Fee:</label>
                      <div className='input-group'>
                        <span className='input-group-text'>₨</span>
                        <input type='number' className='form-control' placeholder='0' {...register('activity_fee')} />
                      </div>
                    </div>
                  </div>
                  <div className='row mb-4'>
                    <div className='col-md-4'>
                      <label className='form-label'>Computer Fee:</label>
                      <div className='input-group'>
                        <span className='input-group-text'>₨</span>
                        <input type='number' className='form-control' placeholder='0' {...register('comp_fee')} />
                      </div>
                    </div>
                    <div className='col-md-4'>
                      <label className='form-label'>Test Fee:</label>
                      <div className='input-group'>
                        <span className='input-group-text'>₨</span>
                        <input type='number' className='form-control' placeholder='0' {...register('test_fee')} />
                      </div>
                    </div>
                    <div className='col-md-4'>
                      <label className='form-label'>Participation Fee:</label>
                      <div className='input-group'>
                        <span className='input-group-text'>₨</span>
                        <input type='number' className='form-control' placeholder='0' {...register('participation_fee')} />
                      </div>
                    </div>
                  </div>
                  <div className='row mb-4'>
                    <div className='col-md-4'>
                      <label className='form-label'>Marks Sheet Fee:</label>
                      <div className='input-group'>
                        <span className='input-group-text'>₨</span>
                        <input type='number' className='form-control' placeholder='0' {...register('marksheet_fee')} />
                      </div>
                    </div>
                    <div className='col-md-4'>
                      <label className='form-label'>Certificate Fee:</label>
                      <div className='input-group'>
                        <span className='input-group-text'>₨</span>
                        <input type='number' className='form-control' placeholder='0' {...register('certificate_fee')} />
                      </div>
                    </div>
                    <div className='col-md-4'>
                      <label className='form-label'>Max No of Students:</label>
                      <div className='input-group'>
                        <span className='input-group-text'>#</span>
                        <input type='number' className='form-control' placeholder='0' {...register('no_of_student')} />
                      </div>
                    </div>
                  </div>

                  <div className='card-footer d-flex justify-content-between align-items-center'>
                    {/* <button
                      type="button"
                      className="btn btn-danger"
                      onClick={handleDelete}
                    >
                      Delete
                    </button> */}
                    <div></div>
                    <div className='d-flex gap-2'>
                      <Link to="/classes/list" className='btn btn-secondary'>
                        <FiArrowLeft className='me-1' /> Cancel
                      </Link>
                      <button type='submit' className='btn btn-primary' disabled={isSubmitting}>
                        <FiSave className='me-1' /> {isSubmitting ? 'Saving...' : 'Update Class'}
                      </button>
                    </div>
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

export default ClassEdit;
