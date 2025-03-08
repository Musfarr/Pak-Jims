import React, { useState } from 'react';
import PageHeader from '@/components/shared/pageHeader/PageHeader';
import PageHeaderWidgets from '@/components/shared/pageHeader/PageHeaderWidgets';
import Footer from '@/components/shared/Footer';
import { Link } from 'react-router-dom';
import { FiEdit, FiEye, FiTrash, FiSearch } from 'react-icons/fi';

const BatchList = () => {
  // Sample data for batches
  const [batches, setBatches] = useState([
    { id: 1, code: 'B001', prefix: 'MB', batchName: 'MBBS Batch 2023', program: 'MBBS PROGRAM', status: 'Active' },
    { id: 2, code: 'B002', prefix: 'BS', batchName: 'BS Batch 2023', program: 'BS PROGRAM', status: 'Active' },
    { id: 3, code: 'B003', prefix: 'BD', batchName: 'BDS Batch 2023', program: 'BDS PROGRAM', status: 'Active' },
    { id: 4, code: 'B004', prefix: 'PD', batchName: 'PHARM-D Batch 2023', program: 'PHARM-D PROGRAM', status: 'Inactive' },
    { id: 5, code: 'B005', prefix: 'NS', batchName: 'BSN Batch 2023', program: 'BSN PROGRAM', status: 'Active' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterProgram, setFilterProgram] = useState('');

  // Program options for filter
  const programOptions = [
    { value: '', label: 'All Programs' },
    { value: 'MBBS PROGRAM', label: 'MBBS PROGRAM' },
    { value: 'BS PROGRAM', label: 'BS PROGRAM' },
    { value: 'BDS PROGRAM', label: 'BDS PROGRAM' },
    { value: 'PHARM-D PROGRAM', label: 'PHARM-D PROGRAM' },
    { value: 'BSN PROGRAM', label: 'BSN PROGRAM' },
  ];

  // Filter batches based on search term and program filter
  const filteredBatches = batches.filter(batch => {
    const matchesSearch = 
      batch.batchName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      batch.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.prefix.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesProgram = filterProgram === '' || batch.program === filterProgram;
    
    return matchesSearch && matchesProgram;
  });

  // Handle batch deletion
  const handleDeleteBatch = (id) => {
    if (window.confirm('Are you sure you want to delete this batch?')) {
      setBatches(batches.filter(batch => batch.id !== id));
    }
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
                        placeholder='Search by batch name, code or prefix'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className='col-md-6'>
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
                  </div>
                </div>
                <div className='table-responsive'>
                  <table className='table table-hover'>
                    <thead>
                      <tr>
                        <th>Code</th>
                        <th>Prefix</th>
                        <th>Batch Name</th>
                        <th>Program</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBatches.length > 0 ? (
                        filteredBatches.map(batch => (
                          <tr key={batch.id}>
                            <td>{batch.code}</td>
                            <td>{batch.prefix}</td>
                            <td>{batch.batchName}</td>
                            <td>{batch.program}</td>
                            <td>
                              <span className={`badge ${batch.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
                                {batch.status}
                              </span>
                            </td>
                            <td>
                              <div className='d-flex gap-2'>
                                <Link to={`/batches/view/${batch.id}`} className='btn btn-sm btn-info'>
                                  <FiEye size={16} />
                                </Link>
                                <Link to={`/batches/edit/${batch.id}`} className='btn btn-sm btn-warning'>
                                  <FiEdit size={16} />
                                </Link>
                                <button 
                                  className='btn btn-sm btn-danger'
                                  onClick={() => handleDeleteBatch(batch.id)}
                                >
                                  <FiTrash size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center">No batches found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
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
