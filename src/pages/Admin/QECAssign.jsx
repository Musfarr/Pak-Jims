import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { GetApi, PostApi } from '@/utils/Api/ApiServices';
import Swal from 'sweetalert2';
import Select from 'react-select';

const QECAssign = () => {
  const { id } = useParams(); // survey_id from URL
  const navigate = useNavigate();
  const [term, setTerm] = useState('');
  const [userType, setUserType] = useState('student'); // New state for type
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch departments
  const { data: departmentsResponse, isLoading: isDepartmentsLoading } = useQuery({
    queryKey: ['departments'],
    queryFn: () => GetApi('/departments-listing')
  });
  const departmentsData = departmentsResponse?.data || [];
  const departmentOptions = [
    // { value: 'all', label: 'All Departments' },
    ...departmentsData.map(dep => ({ value: dep.id, label: dep.name }))
  ];
  // Fetch batches
  const { data: batchesResponse, isLoading: isBatchesLoading } = useQuery({
    queryKey: ['batches'],
    queryFn: () => GetApi('/batches-listing')
  });
  const batchesData = batchesResponse?.data || [];
  const batchOptions = [
    // { value: 'all', label: 'All Batches' },
    ...batchesData.map(batch => ({ value: batch.id, label: batch.name }))
  ];
  // Fetch courses
  const { data: coursesResponse, isLoading: isCoursesLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: () => GetApi('/courses-listing')
  });
  const coursesData = coursesResponse?.data || [];
  const courseOptions = [
    // { value: 'all', label: 'All Courses' },
    ...coursesData.map(course => ({ value: course.id, label: course.name }))
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!term) {
      Swal.fire({
        icon: 'error',
        title: 'Incomplete!',
        text: 'Please fill all fields and select at least one from each dropdown.',
        confirmButtonColor: '#3085d6'
      });
      return;
    }
    setIsSubmitting(true);
    const payload = {
      survey_id: id,
      term,
      ...(userType !== 'student' ? {} : { course_ids: coursesData.map(c => c.id) }),
      depart_ids: userType === 'faculty' && selectedDepartment ? [selectedDepartment.value] : departmentsData.map(d => d.id),
      ...(userType !== 'student' ? {} : { batch_ids: selectedBatch ? [selectedBatch.value] : batchesData.map(b => b.id) })
    };
    PostApi('/survey-assign', payload)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Assigned!',
          text: 'Survey assigned successfully.',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          navigate(`/qec/assignments/${id}`);
        });
      })
      .catch(() => {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to assign survey. Please try again.',
          confirmButtonColor: '#3085d6'
        });
      })
      .finally(() => setIsSubmitting(false));
  };

  return (
    <div className='main-content'> 
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">
          <h5>Assign Survey</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Type</label>
              <select
                className="form-select"
                value={userType}
                onChange={e => setUserType(e.target.value)}
              >
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Semester/Module</label>
              <input type="text" className="form-control" value={term} onChange={e => setTerm(e.target.value)} placeholder="e.g., 2024-spring" required />
            </div>

            {userType === 'faculty' && (
            <div className="mb-3">
              <label className="form-label">Department (Optional - Default All)</label>
              <Select
                isClearable
                options={departmentOptions}
                value={selectedDepartment}
                onChange={setSelectedDepartment}
                isLoading={isDepartmentsLoading}
                placeholder="Select a department..."
              />
            </div>
            )}
            {userType === 'student' && (
              <>
                <div className="mb-3">
                  <label className="form-label">Batch (Optional - Default All)</label>
                  <Select
                    isClearable
                    options={batchOptions}
                    value={selectedBatch}
                    onChange={setSelectedBatch}
                    isLoading={isBatchesLoading}
                    placeholder="Select a batch..."
                  />
                </div>
              </>
            )}
            <button type="submit" className="btn btn-primary float-end" disabled={isSubmitting}>{isSubmitting ? 'Assigning...' : 'Assign Survey'}</button>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
};

export default QECAssign;
