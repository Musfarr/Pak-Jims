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
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch departments
  const { data: departmentsResponse, isLoading: isDepartmentsLoading } = useQuery({
    queryKey: ['departments'],
    queryFn: () => GetApi('/departments')
  });
  const departmentsData = departmentsResponse?.data?.data || [];
  const departmentOptions = [
    // { value: 'all', label: 'All Departments' },
    ...departmentsData.map(dep => ({ value: dep.id, label: dep.name }))
  ];
  // Fetch batches
  const { data: batchesResponse, isLoading: isBatchesLoading } = useQuery({
    queryKey: ['batches'],
    queryFn: () => GetApi('/batches')
  });
  const batchesData = batchesResponse?.data || [];
  const batchOptions = [
    // { value: 'all', label: 'All Batches' },
    ...batchesData.map(batch => ({ value: batch.id, label: batch.name }))
  ];
  // Fetch courses
  const { data: coursesResponse, isLoading: isCoursesLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: () => GetApi('/courses')
  });
  const coursesData = coursesResponse?.data?.data || [];
  const courseOptions = [
    // { value: 'all', label: 'All Courses' },
    ...coursesData.map(course => ({ value: course.id, label: course.name }))
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!term || selectedDepartments.length === 0 || selectedCourses.length === 0) {
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
      course_ids: selectedCourses.map(opt => opt.value),
      depart_ids: selectedDepartments.map(opt => opt.value),
      ...(userType !== 'student' ? {} : { batch_ids: selectedBatches.map(opt => opt.value) })
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
              <label className="form-label">Term</label>
              <input type="text" className="form-control" value={term} onChange={e => setTerm(e.target.value)} placeholder="e.g., 2024-spring" required />
            </div>
            <div className="mb-3">
              <label className="form-label">Departments</label>
              <Select
                isMulti
                isClearable
                options={departmentOptions}
                value={selectedDepartments}
                onChange={setSelectedDepartments}
                isLoading={isDepartmentsLoading}
                placeholder="Select departments..."
              />
            </div>
            {userType === 'student' && (
              <>
                <div className="mb-3">
                  <label className="form-label">Batches (Select Only For Students)</label>
                  <Select
                    isMulti
                    isClearable
                    options={batchOptions}
                    value={selectedBatches}
                    onChange={setSelectedBatches}
                    isLoading={isBatchesLoading}
                    placeholder="Select batches..."
                  />
                </div>
              </>
            )}
                <div className="mb-3">
                  <label className="form-label">Courses</label>
                  <Select
                    isMulti
                    isClearable
                    options={courseOptions}
                    value={selectedCourses}
                    onChange={setSelectedCourses}
                    isLoading={isCoursesLoading}
                    placeholder="Select courses..."
                  />
                </div>
            <button type="submit" className="btn btn-primary float-end" disabled={isSubmitting}>{isSubmitting ? 'Assigning...' : 'Assign Survey'}</button>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
};

export default QECAssign;
