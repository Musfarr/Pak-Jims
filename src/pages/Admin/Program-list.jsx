import React, { useState } from 'react';
import PageHeader from '@/components/shared/pageHeader/PageHeader';
import PageHeaderWidgets from '@/components/shared/pageHeader/PageHeaderWidgets';
import Footer from '@/components/shared/Footer';
import { Link } from 'react-router-dom';
import { FiEdit, FiPlus, FiTrash, FiSearch } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import { GetApi, DeleteApi, PostApi } from '@/utils/Api/ApiServices';
import Swal from 'sweetalert2';


const ProgramList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch programs from API
  const { data: response, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['programs'],
    queryFn: () => GetApi('/programs')
  });

  // Extract programs from response
  const programs = response?.data || [];

  // Filter programs based on search term
  const filteredPrograms = programs.filter(program => {
    if (!searchTerm) return true;
    return (
      program.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      program.prefix?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Handle program deletion
  const handleDeleteProgram = (id) => {
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
        DeleteApi(`/programs/${id}`)
          .then(() => {
            refetch(); // Refresh the programs list
            Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: 'Program deleted successfully',
              confirmButtonColor: '#3085d6'
            });
          })
          .catch(error => {
            console.error('Error deleting program:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: error.message || 'Failed to delete program',
              confirmButtonColor: '#d33'
            });
          })
          .finally(() => {
            setIsDeleting(false);
          });
      }
    });
  };

  // Handle program editing
  const handleEditProgram = (program) => {
    Swal.fire({
      title: 'Edit Program',
      html: `
        <input id="swal-input1" class="swal2-input" placeholder="Prefix" value="${program.prefix || ''}" />
        <input id="swal-input2" class="swal2-input" placeholder="Name" value="${program.name || ''}" />
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
        const payload = { ...result.value };
        PostApi(`/programs/${program.id}`, payload)
          .then(() => {
            refetch();
            Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: 'Program updated successfully',
              confirmButtonColor: '#3085d6'
            });
          })
          .catch(error => {
            console.error('Error updating program:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: error.message || 'Failed to update program',
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
                <h5 className='mb-0'>Program List</h5>
                <Link to="/programs/create" className='btn btn-primary'>
                  <FiPlus className="me-1" /> Add New Program
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
                        placeholder='Search by program name or prefix'
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
                    {error?.message || 'Error loading programs'}
                  </div>
                ) : (
                  <div className='table-responsive'>
                    <table className='table table-hover'>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Prefix</th>
                          <th>Name</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPrograms.length > 0 ? (
                          filteredPrograms.map((program, index) => (
                            <tr key={program.id}>
                              <td>{index + 1}</td>
                              <td>{program.prefix}</td>
                              <td>{program.name}</td>
                              <td>
                                <div className='d-flex gap-2'>
                                  
                                  <button 
  className='btn btn-sm btn-warning'
  onClick={() => handleEditProgram(program)}
  disabled={isDeleting}
>
  <FiEdit size={16} />
</button>
                                  <button 
                                    className='btn btn-sm btn-danger'
                                    onClick={() => handleDeleteProgram(program.id)}
                                    disabled={isDeleting}
                                  >
                                    <FiTrash size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="text-center">
                              {programs.length === 0 ? 'No programs found' : 'No matching programs'}
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

export default ProgramList;
