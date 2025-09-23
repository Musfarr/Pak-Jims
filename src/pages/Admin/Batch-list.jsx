import React, { useState } from 'react';
import PageHeader from '@/components/shared/pageHeader/PageHeader';
import PageHeaderWidgets from '@/components/shared/pageHeader/PageHeaderWidgets';
import Footer from '@/components/shared/Footer';
import { Link } from 'react-router-dom';
import { FiEdit, FiEye, FiTrash, FiSearch, FiLoader } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import { GetApi, DeleteApi, PostApi } from '@/utils/Api/ApiServices';
import Swal from 'sweetalert2';
import { useAuth } from '../../context/AuthContext';

const BatchList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProgram, setFilterProgram] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Permissions
  const { permissions = [] } = useAuth();

  // Pagination state
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // Fetch batches and programs data
  const { data: batchesResponse, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['batches', page, perPage],
    queryFn: () => GetApi(`/batches?per_page=${perPage}&page=${page}`)
  });

  const { data: programsResponse, isLoading: programsLoading } = useQuery({
    queryKey: ['programs'],
    queryFn: () => GetApi('/programs-listing')
  });

  // Extract paginated batches and pagination info
  const batches = batchesResponse?.data || [];
  const pagination = batchesResponse?.data?.pagination || {};
  const currentPage = pagination.current_page || page;
  const lastPage = pagination.total_pages || 1;
  const perPageFromApi = pagination.per_page || perPage;
  const programs = programsResponse?.data || [];

  // Create program options for filter
  const programOptions = [
    { value: '', label: 'All Programs' },
    ...(programs.map(program => ({
      value: program.id,
      label: program.name
    })) || [])
  ];

  // Filter batches based on search term and program filter (current page only)
  const filteredBatches = batches.filter(batch => {
    const matchesSearch = 
      batch.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      batch.prefix?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesProgram = filterProgram === '' || batch.program_id?.toString() === filterProgram.toString();
    
    return matchesSearch && matchesProgram;
  });

  // Handle batch deletion
  const handleDeleteBatch = (id) => {
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
        setIsDeleting(true);
        DeleteApi(`/batches/${id}`)
          .then(() => {
            Swal.fire(
              'Deleted!',
              'Batch has been deleted.',
              'success'
            );
            refetch(); // Refresh the batches list
          })
          .catch(error => {
            console.error('Error deleting batch:', error);
            Swal.fire(
              'Error!',
              error.message || 'Failed to delete batch',
              'error'
            );
          })
          .finally(() => {
            setIsDeleting(false);
          });
      }
    });
  };

  // Handle batch editing
  const handleEditBatch = (batch) => {
    Swal.fire({
      title: 'Edit Batch',
      html: `
        <input id="swal-input1" class="swal2-input" placeholder="Prefix" value="${batch.prefix || ''}" />
        <input id="swal-input2" class="swal2-input" placeholder="Name" value="${batch.name || ''}" />
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
        const payload = { ...result.value, program_id: batch.program_id };
        PostApi(`/batches/${batch.id}`, payload)
          .then(() => {
            refetch();
            Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: 'Batch updated successfully',
              confirmButtonColor: '#3085d6'
            });
          })
          .catch(error => {
            console.error('Error updating batch:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: error.message || 'Failed to update batch',
              confirmButtonColor: '#d33'
            });
          })
          .finally(() => {
            setIsDeleting(false);
          });
      }
    });
  };


  // Find program name by ID
  const getProgramName = (programId) => {
    const program = programs.find(p => p.id.toString() === programId?.toString());
    return program ? program.name : 'Unknown Program';
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
                <h5 className='mb-0'>Batch List</h5>
                {permissions.includes("add_Batches") && (
                  <Link to="/batches/add" className='btn btn-primary'>
                    Add New Batch
                  </Link>
                )}
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
                        placeholder='Search by batch name or prefix'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  {/* <div className='col-md-6'>
                    <select 
                      className='form-select'
                      value={filterProgram}
                      onChange={(e) => setFilterProgram(e.target.value)}
                      disabled={programsLoading}
                    >
                      {programOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div> */}
                </div>

                {isLoading ? (
                  <div className="text-center py-4">
                    <FiLoader className="spinner-border" role="status" />
                    <p className="mt-2">Loading batches...</p>
                  </div>
                ) : isError ? (
                  <div className="alert alert-danger">
                    Error loading batches: {error?.message || 'Unknown error'}
                  </div>
                ) : (
                  <div className='table-responsive'>
                    <table className='table table-hover'>
                      <thead>
                        <tr>
                          <th>Prefix</th>
                          <th>Batch Name</th>
                          <th>Program</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredBatches.length > 0 ? (
                          filteredBatches.map(batch => (
                            <tr key={batch.id}>
                              <td>{batch.prefix}</td>
                              <td>{batch.name}</td>
                              <td>{getProgramName(batch.program_id)}</td>
                              <td>
                                <div className='d-flex gap-2'>
                                      {permissions.includes("edit_Batches") && (
                                        <button 
                                          className='btn btn-sm btn-warning'
                                          onClick={() => handleEditBatch(batch)}
                                          disabled={isDeleting}
                                        >
                                          <FiEdit size={16} />
                                        </button>
                                      )}
                                      {permissions.includes("delete_Batches") && (
                                        <button 
                                          className='btn btn-sm btn-danger'
                                          onClick={() => handleDeleteBatch(batch.id)}
                                          disabled={isDeleting}
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
                            <td colSpan="4" className="text-center">No batches found</td>
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

export default BatchList;
