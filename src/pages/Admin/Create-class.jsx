import React from 'react';
import PageHeader from '@/components/shared/pageHeader/PageHeader';
import PageHeaderWidgets from '@/components/shared/pageHeader/PageHeaderWidgets';
import Footer from '@/components/shared/Footer';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { GetApi, PostApi } from '@/utils/Api/ApiServices';
import { FiSave, FiX, FiUsers, FiDollarSign, FiHash, FiType } from 'react-icons/fi';
import Swal from 'sweetalert2';

const CreateClass = () => {
  const navigate = useNavigate();
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

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    defaultValues: {
      name: '',
      shift_id: '',
      program_id: '',
      section_id: '',
      admission_fee: 0,
      month_fee: 0,
      exam_fee: 0,
      pract_fee: 0,
      card_fee: 0,
      activity_fee: 0,
      comp_fee: 0,
      test_fee: 0,
      participation_fee: 0,
      marksheet_fee: 0,
      certificate_fee: 0,
      no_of_student: 0
    }
  });

  const onSubmit = async (data) => {
    try {
      await PostApi('/classes', data);
      Swal.fire({ icon: 'success', title: 'Success', text: 'Class created successfully!' });
      reset();
      navigate('/classes/list');
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err?.message || 'Failed to create class.' });
    }
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
                <h5 className='mb-0'>Create New Class</h5>
              </div>
              <div className='card-body'>
                <form onSubmit={handleSubmit(onSubmit)}>
                  {/* Basic Class Information */}
                  <div className='row mb-4'>
                    <div className='col'>
                      <label className='form-label fw-semibold'>Class Name:</label>
                      <div className='input-group'>
                        <span className='input-group-text'><FiType /></span>
                        <input type='text' className={`form-control ${errors.name ? 'is-invalid' : ''}`} placeholder='Enter class name' {...register('name', { required: 'Class name is required' })} />
                        {errors.name && <div className='invalid-feedback'>{errors.name.message}</div>}
                      </div>
                    </div>
                  </div>

                  <div className='row mb-4'>
                    <div className='col-md-4'>
                      <label className='form-label fw-semibold'>Shift:</label>
                      <select className={`form-select ${errors.shift_id ? 'is-invalid' : ''}`} {...register('shift_id', { required: 'Shift is required' })} disabled={shiftsLoading}>
                        <option value=''>Select shift</option>
                        {shifts.map(shift => (
                          <option key={shift.id} value={shift.id}>{shift.name}</option>
                        ))}
                      </select>
                      {errors.shift_id && <div className='invalid-feedback'>{errors.shift_id.message}</div>}
                    </div>
                    <div className='col-md-4'>
                      <label className='form-label fw-semibold'>Program:</label>
                      <select className={`form-select ${errors.program_id ? 'is-invalid' : ''}`} {...register('program_id', { required: 'Program is required' })} disabled={programsLoading}>
                        <option value=''>Select program</option>
                        {programs.map(program => (
                          <option key={program.id} value={program.id}>{program.name}</option>
                        ))}
                      </select>
                      {errors.program_id && <div className='invalid-feedback'>{errors.program_id.message}</div>}
                    </div>
                    <div className='col-md-4'>
                      <label className='form-label fw-semibold'>Section:</label>
                      <select className={`form-select ${errors.section_id ? 'is-invalid' : ''}`} {...register('section_id', { required: 'Section is required' })} disabled={sectionsLoading}>
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
                        <span className='input-group-text'><FiDollarSign /></span>
                        <input type='number' className='form-control' placeholder='0' {...register('admission_fee')} />
                      </div>
                    </div>
                    <div className='col-md-4'>
                      <label className='form-label'>Monthly Fee:</label>
                      <div className='input-group'>
                        <span className='input-group-text'><FiDollarSign /></span>
                        <input type='number' className='form-control' placeholder='0' {...register('month_fee')} />
                      </div>
                    </div>
                    <div className='col-md-4'>
                      <label className='form-label'>Examination Fee:</label>
                      <div className='input-group'>
                        <span className='input-group-text'><FiDollarSign /></span>
                        <input type='number' className='form-control' placeholder='0' {...register('exam_fee')} />
                      </div>
                    </div>
                  </div>
                  <div className='row mb-4'>
                    <div className='col-md-4'>
                      <label className='form-label'>Practical Fee:</label>
                      <div className='input-group'>
                        <span className='input-group-text'><FiDollarSign /></span>
                        <input type='number' className='form-control' placeholder='0' {...register('pract_fee')} />
                      </div>
                    </div>
                    <div className='col-md-4'>
                      <label className='form-label'>ID Card Fee:</label>
                      <div className='input-group'>
                        <span className='input-group-text'><FiDollarSign /></span>
                        <input type='number' className='form-control' placeholder='0' {...register('card_fee')} />
                      </div>
                    </div>
                    <div className='col-md-4'>
                      <label className='form-label'>Activity / Picnic Fee:</label>
                      <div className='input-group'>
                        <span className='input-group-text'><FiDollarSign /></span>
                        <input type='number' className='form-control' placeholder='0' {...register('activity_fee')} />
                      </div>
                    </div>
                  </div>
                  <div className='row mb-4'>
                    <div className='col-md-4'>
                      <label className='form-label'>Computer Fee:</label>
                      <div className='input-group'>
                        <span className='input-group-text'><FiDollarSign /></span>
                        <input type='number' className='form-control' placeholder='0' {...register('comp_fee')} />
                      </div>
                    </div>
                    <div className='col-md-4'>
                      <label className='form-label'>Test Fee:</label>
                      <div className='input-group'>
                        <span className='input-group-text'><FiDollarSign /></span>
                        <input type='number' className='form-control' placeholder='0' {...register('test_fee')} />
                      </div>
                    </div>
                    <div className='col-md-4'>
                      <label className='form-label'>Participation Fee:</label>
                      <div className='input-group'>
                        <span className='input-group-text'><FiDollarSign /></span>
                        <input type='number' className='form-control' placeholder='0' {...register('participation_fee')} />
                      </div>
                    </div>
                  </div>
                  <div className='row mb-4'>
                    <div className='col-md-4'>
                      <label className='form-label'>Marks Sheet Fee:</label>
                      <div className='input-group'>
                        <span className='input-group-text'><FiDollarSign /></span>
                        <input type='number' className='form-control' placeholder='0' {...register('marksheet_fee')} />
                      </div>
                    </div>
                    <div className='col-md-4'>
                      <label className='form-label'>Certificate Fee:</label>
                      <div className='input-group'>
                        <span className='input-group-text'><FiDollarSign /></span>
                        <input type='number' className='form-control' placeholder='0' {...register('certificate_fee')} />
                      </div>
                    </div>
                    <div className='col-md-4'>
                      <label className='form-label'>Max No of Students:</label>
                      <div className='input-group'>
                        <span className='input-group-text'><FiUsers /></span>
                        <input type='number' className='form-control' placeholder='0' {...register('no_of_student')} />
                      </div>
                    </div>
                  </div>
                  <div className='d-flex justify-content-end gap-2 mt-4'>
                    <Link to="/classes/list" className='btn btn-secondary'>
                      <FiX className='me-1' /> Cancel
                    </Link>
                    <button type='submit' className='btn btn-primary' disabled={isSubmitting}>
                      <FiSave className='me-1' /> {isSubmitting ? 'Saving...' : 'Save Class'}
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

export default CreateClass;
