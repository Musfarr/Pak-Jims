import React, { useState } from 'react';
import PageHeader from '@/components/shared/pageHeader/PageHeader';
import PageHeaderWidgets from '@/components/shared/pageHeader/PageHeaderWidgets';
import Footer from '@/components/shared/Footer';
import { Link } from 'react-router-dom';
import { FiEdit, FiEye, FiTrash, FiSearch } from 'react-icons/fi';

const ProgramList = () => {
  // Sample data for programs
  const [programs, setPrograms] = useState([
    { id: 1, code: 'MBBS', name: 'Bachelor of Medicine and Bachelor of Surgery', duration: '5 years', status: 'Active' },
    { id: 2, code: 'BDS', name: 'Bachelor of Dental Surgery', duration: '4 years', status: 'Active' },
    { id: 3, code: 'PHARM-D', name: 'Doctor of Pharmacy', duration: '5 years', status: 'Active' },
    { id: 4, code: 'DPT', name: 'Doctor of Physical Therapy', duration: '5 years', status: 'Inactive' },
    { id: 5, code: 'BSN', name: 'Bachelor of Science in Nursing', duration: '4 years', status: 'Active' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  // Filter programs based on search term
  const filteredPrograms = programs.filter(program => {
    return (
      program.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      program.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Handle program deletion
  const handleDeleteProgram = (id) => {
    if (window.confirm('Are you sure you want to delete this program?')) {
      setPrograms(programs.filter(program => program.id !== id));
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
                <h5 className='mb-0'>Program List</h5>
                <Link to="/programs/add" className='btn btn-primary'>
                  Add New Program
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
                        placeholder='Search by program name or code'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className='table-responsive'>
                  <table className='table table-hover'>
                    <thead>
                      <tr>
                        <th>Program Code</th>
                        <th>Program Name</th>
                        <th>Duration</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPrograms.length > 0 ? (
                        filteredPrograms.map(program => (
                          <tr key={program.id}>
                            <td>{program.code}</td>
                            <td>{program.name}</td>
                            <td>{program.duration}</td>
                            <td>
                              <span className={`badge ${program.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
                                {program.status}
                              </span>
                            </td>
                            <td>
                              <div className='d-flex gap-2'>
                                <Link to={`/programs/view/${program.id}`} className='btn btn-sm btn-info'>
                                  <FiEye size={16} />
                                </Link>
                                <Link to={`/programs/edit/${program.id}`} className='btn btn-sm btn-warning'>
                                  <FiEdit size={16} />
                                </Link>
                                <button 
                                  className='btn btn-sm btn-danger'
                                  onClick={() => handleDeleteProgram(program.id)}
                                >
                                  <FiTrash size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center">No programs found</td>
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

export default ProgramList;
