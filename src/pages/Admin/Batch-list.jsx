import React, { useState } from 'react';
import PageHeader from '@/components/shared/pageHeader/PageHeader';
import PageHeaderWidgets from '@/components/shared/pageHeader/PageHeaderWidgets';
import Footer from '@/components/shared/Footer';
import { Link } from 'react-router-dom';
import { FiEdit, FiEye, FiTrash, FiSearch, FiLoader } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import { GetApi, DeleteApi } from '@/utils/Api/ApiServices';
import Swal from 'sweetalert2';

const BatchList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProgram, setFilterProgram] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch batches and programs data
  const { data: batchesResponse, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['batches'],
    queryFn: () => GetApi('/batches')
  });

  const { data: programsResponse, isLoading: programsLoading } = useQuery({
    queryKey: ['programs'],
    queryFn: () => GetApi('/programs')
  });

  const batches = batchesResponse?.data || [];
  const programs = programsResponse?.data || [];

  // Create program options for filter
  const programOptions = [
    { value: '', label: 'All Programs' },
    ...(programs.map(program => ({
      value: program.id,
      label: program.name
    })) || [])
  ];

  // Filter batches based on search term and program filter
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
                <Link to="/batches/add" className='btn btn-primary'>
                  Add New Batch
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
                                  {/* <Link to={`/batches/view/${batch.id}`} className='btn btn-sm btn-info'>
                                    <FiEye size={16} />
                                  </Link>
                                  <Link to={`/batches/edit/${batch.id}`} className='btn btn-sm btn-warning'>
                                    <FiEdit size={16} />
                                  </Link> */}
                                  <button 
                                    className='btn btn-sm btn-danger'
                                    onClick={() => handleDeleteBatch(batch.id)}
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
                            <td colSpan="4" className="text-center">No batches found</td>
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

export default BatchList;
