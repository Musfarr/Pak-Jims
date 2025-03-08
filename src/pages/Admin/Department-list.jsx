import React, { useState } from 'react';
import PageHeader from '@/components/shared/pageHeader/PageHeader';
import PageHeaderWidgets from '@/components/shared/pageHeader/PageHeaderWidgets';
import Footer from '@/components/shared/Footer';
import { Link } from 'react-router-dom';
import { FiEdit, FiEye, FiTrash, FiSearch } from 'react-icons/fi';

const DepartmentList = () => {
  // Sample data for departments
  const [departments, setDepartments] = useState([
    { id: 1, code: '10250', prefix: 'ST', name: 'SPEECH THERAPY', associatedCourse: 'BS MEDICAL TECHNOLOGY', status: 'Active' },
    { id: 2, code: '10251', prefix: 'MED', name: 'MEDICINE', associatedCourse: 'MBBS', status: 'Active' },
    { id: 3, code: '10252', prefix: 'DENT', name: 'DENTISTRY', associatedCourse: 'BDS', status: 'Active' },
    { id: 4, code: '10253', prefix: 'PHARM', name: 'PHARMACY', associatedCourse: 'PHARM-D', status: 'Inactive' },
    { id: 5, code: '10254', prefix: 'NURS', name: 'NURSING', associatedCourse: 'BSN', status: 'Active' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  // Filter departments based on search term
  const filteredDepartments = departments.filter(department => {
    return (
      department.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      department.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      department.prefix.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Handle department deletion
  const handleDeleteDepartment = (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      setDepartments(departments.filter(department => department.id !== id));
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
                <h5 className='mb-0'>Department List</h5>
                <Link to="/departments/add" className='btn btn-primary'>
                  Add New Department
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
                        placeholder='Search by department name, code or prefix'
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
                        <th>Prefix</th>
                        <th>Department Name</th>
                        <th>Associated Course</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDepartments.length > 0 ? (
                        filteredDepartments.map(department => (
                          <tr key={department.id}>
                            <td>{department.code}</td>
                            <td>{department.prefix}</td>
                            <td>{department.name}</td>
                            <td>{department.associatedCourse}</td>
                            <td>
                              <span className={`badge ${department.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
                                {department.status}
                              </span>
                            </td>
                            <td>
                              <div className='d-flex gap-2'>
                                <Link to={`/departments/view/${department.id}`} className='btn btn-sm btn-info'>
                                  <FiEye size={16} />
                                </Link>
                                <Link to={`/departments/edit/${department.id}`} className='btn btn-sm btn-warning'>
                                  <FiEdit size={16} />
                                </Link>
                                <button 
                                  className='btn btn-sm btn-danger'
                                  onClick={() => handleDeleteDepartment(department.id)}
                                >
                                  <FiTrash size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center">No departments found</td>
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

export default DepartmentList;
