import React, { useState, useEffect } from 'react';
import PageHeader from '@/components/shared/pageHeader/PageHeader';
import PageHeaderWidgets from '@/components/shared/pageHeader/PageHeaderWidgets';
import Footer from '@/components/shared/Footer';
import { Link } from 'react-router-dom';
import { FiEdit, FiEye, FiTrash, FiSearch, FiPlus } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import { GetApi, DeleteApi, PostApi } from '@/utils/Api/ApiServices';
import Swal from 'sweetalert2';
import { useAuth } from '../../context/AuthContext';
import useDebounce from '@/hooks/useDebounce';


const DepartmentList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [isDeleting, setIsDeleting] = useState(false);
  const { permissions } = useAuth();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  // Fetch departments from API with pagination
  const { data: departmentsResponse, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['departments', page, perPage, debouncedSearch],
    queryFn: () => GetApi(`/departments?per_page=${perPage}&page=${page}&search=${debouncedSearch}`)
  });

  // Extract departments and pagination info from response
  const departments = departmentsResponse?.data?.data || [];
  const pagination = departmentsResponse?.data?.pagination || {};
  const currentPage = pagination.current_page || page;
  const lastPage = pagination.total_pages || 1;
  const total = pagination.total || 0;
  const perPageFromApi = pagination.per_page || perPage;

  // Server-side filtering used, direct assignment
  const filteredDepartments = departments;


  // Handle department deletion
  const handleDeleteDepartment = (id) => {
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
        DeleteApi(`/departments/${id}`)
          .then(() => {
            refetch(); // Refresh the departments list
            Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: 'Department deleted successfully',
              confirmButtonColor: '#3085d6'
            });
          })
          .catch(error => {
            console.error('Error deleting department:', error);
            if (!error.response || error.response.status !== 422) {
              Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: error.message || 'Failed to delete department',
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

  // Handle department editing
  const handleEditDepartment = (department) => {
    Swal.fire({
      title: 'Edit Department',
      html: `
        <input id="swal-input1" class="swal2-input" placeholder="Prefix" value="${department.prefix || ''}" />
        <input id="swal-input2" class="swal2-input" placeholder="Name" value="${department.name || ''}" />
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Save',
      preConfirm: () => {
        const prefix = document.getElementById('swal-input1').value.trim();
        const name = document.getElementById('swal-input2').value.trim();
        if (!prefix || !name) {
          Swal.showValidationMessage('Both fields are required');
          return false;
        }
        return { prefix, name };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        setIsDeleting(true);
        const payload = { ...result.value, course_id: department.course_id };
        PostApi(`/departments/${department.id}`, payload)
          .then(() => {
            refetch();
            Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: 'Department updated successfully',
              confirmButtonColor: '#3085d6'
            });
          })
          .catch(error => {
            console.error('Error updating department:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: error.message || 'Failed to update department',
              confirmButtonColor: '#d33'
            });
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
        <div className='row'>
          <div className='col-12'>
            <div className='card'>
              <div className='card-header d-flex justify-content-between align-items-center'>
                <h5 className='mb-0'>Department List</h5>
                <Link to="/departments/add" className='btn btn-primary'>
                  <FiPlus className="me-1" /> Add New Department
                </Link>
              </div>
              <div className='card-body'>
                <div className='row mb-3'>
                  <div className='col-md-6'>
                    <div className='input-group'>
                      <span className='input-group-text'>
                        <FiSearch size={18} />
                      </span>
                      <input 
                        type='text' 
                        className='form-control' 
                        placeholder='Search by department name or prefix'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                
                {isLoading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : isError ? (
                  <div className="alert alert-danger">
                    {error?.message || 'Error loading departments'}
                  </div>
                ) : (
                  <div className='table-responsive'>
                    <table className='table table-hover'>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Prefix</th>
                          <th>Department Name</th>
                          <th>Associated Course</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredDepartments.length > 0 ? (
                          filteredDepartments.map((department, index) => {
                            return (
                              <tr key={department.id}>
                                <td>{(currentPage - 1) * perPageFromApi + index + 1}</td>
                                <td>{department.prefix}</td>
                                <td>{department.name}</td>
                                <td>{department?.course?.name}</td>
                                <td>
                                  <div className='d-flex gap-2'>
                                    {permissions.includes('edit_Departments') && (
                                      <button 
                                        className='btn btn-sm btn-warning'
                                        onClick={() => handleEditDepartment(department)}
                                        disabled={isDeleting}
                                      >
                                        <FiEdit size={16} />
                                      </button>
                                    )}
                                    {permissions.includes('delete_Departments') && (
                                      <button 
                                        className='btn btn-sm btn-danger'
                                        onClick={() => handleDeleteDepartment(department.id)}
                                        disabled={isDeleting}
                                      >
                                        <FiTrash size={16} />
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan="5" className="text-center">
                              {departments.length === 0 ? 'No departments found' : 'No matching departments'}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
                {/* Pagination Controls */}
                <div className="d-flex justify-content-between align-items-center mt-3 gap-3 flex-wrap">
                  <div className="text-muted small">
                    Page {currentPage} of {lastPage}
                  </div>
                  <div className="d-flex align-items-center gap-2 mx-auto">
                    <button 
                      className="btn btn-outline-primary btn-sm" 
                      disabled={currentPage === 1} 
                      onClick={() => setPage(currentPage - 1)}
                    >
                      Previous
                    </button>
                    <button 
                      className="btn btn-outline-primary btn-sm" 
                      disabled={currentPage === lastPage} 
                      onClick={() => setPage(currentPage + 1)}
                    >
                      Next
                    </button>
                  </div>
                  <div>
                    <select value={perPage} onChange={e => { setPerPage(Number(e.target.value)); setPage(1); }} className="form-select form-select-sm w-auto d-inline-block">
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

export default DepartmentList;
