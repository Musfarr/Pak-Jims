import React, { useState } from 'react';
import PageHeader from '@/components/shared/pageHeader/PageHeader';
import PageHeaderWidgets from '@/components/shared/pageHeader/PageHeaderWidgets';
import Footer from '@/components/shared/Footer';
import { Link } from 'react-router-dom';
import { FiEdit, FiEye, FiTrash, FiSearch } from 'react-icons/fi';

const ClassList = () => {
  // Sample data for classes based on the image provided
  const [classes, setClasses] = useState([
    { id: 1, code: '10060', className: '1ST SEMESTER 1ST YEAR', shift: 'MORNING', program: 'BS PROGRAM', section: 'A' },
    { id: 2, code: '10010', className: '1ST YEAR', shift: 'MORNING', program: 'MBBS PROGRAM', section: 'A' },
    { id: 3, code: '10070', className: '2ND SEMESTER 1ST YEAR', shift: 'MORNING', program: 'BS PROGRAM', section: 'A' },
    { id: 4, code: '10020', className: '2ND YEAR', shift: 'MORNING', program: 'MBBS PROGRAM', section: 'A', highlighted: true },
    { id: 5, code: '10080', className: '3RD SEMESTER 2ND YEAR', shift: 'MORNING', program: 'BS PROGRAM', section: 'A' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterProgram, setFilterProgram] = useState('');
  const [filterShift, setFilterShift] = useState('');

  // Filter classes based on search term and filters
  const filteredClasses = classes.filter(classItem => {
    const matchesSearch = 
      classItem.className.toLowerCase().includes(searchTerm.toLowerCase()) || 
      classItem.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesProgram = filterProgram === '' || classItem.program === filterProgram;
    const matchesShift = filterShift === '' || classItem.shift === filterShift;
    
    return matchesSearch && matchesProgram && matchesShift;
  });

  // Handle class deletion
  const handleDeleteClass = (id) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      setClasses(classes.filter(classItem => classItem.id !== id));
    }
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
      <PageHeader>
        <PageHeaderWidgets />
      </PageHeader>
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
                  <div className='col-md-4'>
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
                  <div className='col-md-4'>
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
                  </div>
                </div>
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
                            <td>{classItem.code}</td>
                            <td>{classItem.className}</td>
                            <td>{classItem.shift}</td>
                            <td>{classItem.program}</td>
                            <td>{classItem.section}</td>
                            <td>
                              <div className='d-flex gap-2'>
                                <Link to={`/classes/view/${classItem.id}`} className='btn btn-sm btn-info'>
                                  <FiEye size={16} />
                                </Link>
                                <Link to={`/classes/edit/${classItem.id}`} className='btn btn-sm btn-warning'>
                                  <FiEdit size={16} />
                                </Link>
                                <button 
                                  className='btn btn-sm btn-danger'
                                  onClick={() => handleDeleteClass(classItem.id)}
                                >
                                  <FiTrash size={16} />
                                </button>
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
