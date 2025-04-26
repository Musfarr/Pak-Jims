import React, { useState } from 'react';
import PageHeader from '@/components/shared/pageHeader/PageHeader';
import PageHeaderWidgets from '@/components/shared/pageHeader/PageHeaderWidgets';
import Footer from '@/components/shared/Footer';
import { Link } from 'react-router-dom';
import { FiEdit, FiEye, FiTrash, FiSearch, FiPlus } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import { GetApi, DeleteApi } from '@/utils/Api/ApiServices';
import Swal from 'sweetalert2';

const DepartmentList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch departments from API
  const { data: departmentsResponse, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['departments'],
    queryFn: () => GetApi('/departments')
  });

  // Extract departments from response
  const departments = departmentsResponse?.data?.data || [];

  // Filter departments based on search term
  const filteredDepartments = departments.filter(department => {
    return (
      department.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      department.prefix?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

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

  return (
    <>
      <PageHeader>
        <PageHeaderWidgets />
      </PageHeader>
      <div className='main-content'>
        <div className='row'>
          <div className='col-12'>
            <div className='card'>
              <div className='card-header d-flex justify-content-between align-items-center'>
                <h5 className='mb-0'>Department List</h5>
                <Link to="/departments/create" className='btn btn-primary'>
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
                                <td>{index + 1}</td>
                                <td>{department.prefix}</td>
                                <td>{department.name}</td>
                                <td>{department?.course?.name}</td>
                                <td>
                                  <div className='d-flex gap-2'>
                                    {/* <Link to={`/departments/edit/${department.id}`} className='btn btn-sm btn-warning'>
                                      <FiEdit size={16} />
                                    </Link> */}
                                    <button 
                                      className='btn btn-sm btn-danger'
                                      onClick={() => handleDeleteDepartment(department.id)}
                                      disabled={isDeleting}
                                    >
                                      <FiTrash size={16} />
                                    </button>
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
