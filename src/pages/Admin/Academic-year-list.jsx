import React, { useState } from 'react';
import PageHeader from '@/components/shared/pageHeader/PageHeader';
import PageHeaderWidgets from '@/components/shared/pageHeader/PageHeaderWidgets';
import Footer from '@/components/shared/Footer';
import { Link } from 'react-router-dom';
import { FiEdit, FiTrash, FiSearch, FiPlus } from 'react-icons/fi';

const AcademicYearList = () => {
  // Sample data for academic years based on the image provided
  const [academicYears, setAcademicYears] = useState([
    { id: 1, code: '1000', academicYear: 'SESSION 2020', isActive: true },
    { id: 2, code: '1001', academicYear: 'SESSION 2021', isActive: false },
    { id: 3, code: '1002', academicYear: 'SESSION 2022', isActive: false },
    { id: 4, code: '1003', academicYear: 'SESSION 2023', isActive: false },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  // Filter academic years based on search term
  const filteredAcademicYears = academicYears.filter(year => {
    return (
      year.academicYear.toLowerCase().includes(searchTerm.toLowerCase()) || 
      year.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Handle academic year deletion
  const handleDeleteAcademicYear = (id) => {
    if (window.confirm('Are you sure you want to delete this academic year?')) {
      setAcademicYears(academicYears.filter(year => year.id !== id));
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
                <h5 className='mb-0'>Academic Year List</h5>
                <Link to="/academic-years/add" className='btn btn-primary'>
                  <FiPlus className="me-1" /> Add New Academic Year
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
                        placeholder='Search by academic year or code'
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
                        <th>Code</th>
                        <th>Academic Year</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAcademicYears.length > 0 ? (
                        filteredAcademicYears.map(year => (
                          <tr 
                            key={year.id}
                            className={year.isActive ? 'table-success' : ''}
                          >
                            <td>{year.code}</td>
                            <td>{year.academicYear}</td>
                            <td>
                              <div className='d-flex gap-2'>
                                <Link to={`/academic-years/edit/${year.id}`} className='btn btn-sm btn-warning'>
                                  <FiEdit size={16} />
                                </Link>
                                <button 
                                  className='btn btn-sm btn-danger'
                                  onClick={() => handleDeleteAcademicYear(year.id)}
                                  disabled={year.isActive}
                                  title={year.isActive ? "Cannot delete active academic year" : "Delete academic year"}
                                >
                                  <FiTrash size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" className="text-center">No academic years found</td>
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

export default AcademicYearList;
