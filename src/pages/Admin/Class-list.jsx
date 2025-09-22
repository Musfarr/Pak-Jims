import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { GetApi, DeleteApi } from '@/utils/Api/ApiServices';
import PageHeader from '@/components/shared/pageHeader/PageHeader';
import PageHeaderWidgets from '@/components/shared/pageHeader/PageHeaderWidgets';
import Footer from '@/components/shared/Footer';
import { Link } from 'react-router-dom';
import { FiEdit, FiEye, FiTrash, FiSearch } from 'react-icons/fi';
import Swal from 'sweetalert2';
import { useAuth } from '../../context/AuthContext';


const ClassList = () => {
  // Pagination state
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // Fetch classes data using React Query with pagination
  const { data: classesResponse, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['classes', page, perPage],
    queryFn: () => GetApi(`/classes?per_page=${perPage}&page=${page}`)
  });

  // Extract classes data and pagination info from the response
  const classesData = classesResponse?.data || [];
  const pagination = classesResponse?.pagination || {};
  const currentPage = pagination.current_page || page;
  const lastPage = pagination.total_pages || 1;
  const total = pagination.total || 0;
  const perPageFromApi = pagination.per_page || perPage;

  const [searchTerm, setSearchTerm] = useState('');
  const [filterProgram, setFilterProgram] = useState('');
  const [filterShift, setFilterShift] = useState('');
  const { permissions } = useAuth();

  // Filter classes based on search term
  const filteredClasses = classesData.filter(classItem => {
    const matchesSearch = 
      (classItem.name && classItem.name.toLowerCase().includes(searchTerm.toLowerCase())) || 
      (classItem.code && classItem.code.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesSearch;
  });

  // Handle per page change
  const handlePerPageChange = (e) => {
    setPerPage(Number(e.target.value));
    setPage(1);
  };

  // Handle class deletion
  const handleDeleteClass = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
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
            refetch(); // Refresh the data after deletion
          })
          .catch(error => {
            Swal.fire(
              'Error!',
              'Failed to delete class.',
              'error'
            );
            console.error('Error deleting class:', error);
          });
      }
    });
  };

  // Program options for filter
  const programOptions = [
    { value: '', label: 'All Programs' },
    { value: 'MBBS PROGRAM', label: 'MBBS PROGRAM' },
    { value: 'BS PROGRAM', label: 'BS PROGRAM' },
  ];

  // Shift options for filter
  const shiftOptions = [
    { value: '', label: 'All Shifts' },
    { value: 'MORNING', label: 'MORNING' },
    { value: 'EVENING', label: 'EVENING' },
  ];

  return (
    <>
      {/* <PageHeader>
        <PageHeaderWidgets />
      </PageHeader> */}
      <div className='main-content'>
        <div className='row'>
          <div className='col-12'>
            <div className='card'>
              <div className='card-header d-flex justify-content-between align-items-center'>
                <h5 className='mb-0'>Class List</h5>
                <Link to="/classes/add" className='btn btn-primary'>
                  Add New Class
                </Link>
              </div>
              <div className='card-body'>
                <div className='row mb-3'>
                  <div className='col-md-4'>
                    <div className='input-group'>
                      <span className='input-group-text'>
                        <FiSearch size={18} />
                      </span>
                      <input 
                        type='text' 
                        className='form-control' 
                        placeholder='Search by class name or code'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  {/* <div className='col-md-4'>
                    <select 
                      className='form-select'
                      value={filterProgram}
                      onChange={(e) => setFilterProgram(e.target.value)}
                    >
                      {programOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div> */}
                  {/* <div className='col-md-4'>
                    <select 
                      className='form-select'
                      value={filterShift}
                      onChange={(e) => setFilterShift(e.target.value)}
                    >
                      {shiftOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div> */}
                </div>

                {isLoading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading classes data...</p>
                  </div>
                ) : isError ? (
                  <div className="alert alert-danger" role="alert">
                    Error loading classes: {error?.message || 'Unknown error'}
                  </div>
                ) : (
                  <div className='table-responsive'>
                    <table className='table table-hover'>
                      <thead>
                        <tr>
                          <th>CODE</th>
                          <th>CLASS NAME</th>
                          <th>SHIFT</th>
                          <th>PROGRAM</th>
                          <th>SECTION</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredClasses.length > 0 ? (
                          filteredClasses.map(classItem => (
                            <tr 
                              key={classItem.id}
                              className={classItem.highlighted ? 'table-success' : ''}
                            >
                              <td>{classItem.code || 'N/A'}</td>
                              <td>{classItem.name || classItem.className || 'N/A'}</td>
                              <td>{classItem.shift?.name || classItem.shift_id || 'N/A'}</td>
                              <td>{classItem.program?.name || classItem.program_id || 'N/A'}</td>
                              <td>{classItem.section?.name || classItem.section_id || 'N/A'}</td>
                              <td>
                                <div className='d-flex gap-2'>
                                  <Link to={`/classes/view/${classItem.id}`} className='btn btn-sm btn-info'>
                                    <FiEye size={16} />
                                  </Link>
                                  {permissions.includes('edit_Classes') && (
                                    <Link to={`/classes/edit/${classItem.id}`} className='btn btn-sm btn-warning'>
                                      <FiEdit size={16} />
                                    </Link>
                                  )}
                                  {permissions.includes('delete_Classes') && (
                                    <button 
                                      className='btn btn-sm btn-danger'
                                      onClick={() => handleDeleteClass(classItem.id)}
                                    >
                                      <FiTrash size={16} />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" className="text-center">No classes found</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Pagination Controls */}
                <div className='d-flex justify-content-between align-items-center mt-3 gap-3 flex-wrap'>
                  <div className='text-muted small'>
                    Page {currentPage} of {lastPage}
                  </div>
                  <div className='d-flex align-items-center gap-2 mx-auto'>
                    <button
                      className='btn btn-outline-primary btn-sm'
                      disabled={currentPage === 1}
                      onClick={() => setPage(currentPage - 1)}
                    >
                      Previous
                    </button>
                    <button
                      className='btn btn-outline-primary btn-sm'
                      disabled={currentPage === lastPage}
                      onClick={() => setPage(currentPage + 1)}
                    >
                      Next
                    </button>
                  </div>
                  <div>
                    <select value={perPage} onChange={handlePerPageChange} className='form-select form-select-sm w-auto d-inline-block'>
                      {[10, 20, 50, 100].map(n => <option key={n} value={n}>{n} per page</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ClassList;
