import React, { useState } from 'react';
import PageHeader from '@/components/shared/pageHeader/PageHeader';
import { useAuth } from '../../context/AuthContext';
import { FiEdit, FiEye, FiTrash2, FiUserPlus } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Pagination from '@/components/shared/Pagination';
import { useQuery } from '@tanstack/react-query';
import { GetApi } from '@/utils/Api/ApiServices';




const InstituteList = () => {
  const { user, role, hasRole } = useAuth();

  const { data: response, isLoading, isError } = useQuery({
    queryKey: ['institutes'],
    queryFn: () => GetApi('/institutes')
  });


  
  const institutes = response?.data || [];

  // Sample data for institutes
  // const [institutes, setInstitutes] = useState([
  //   { 
  //     id: 1, 
  //     code: '1001', 
  //     name: 'GAMBAT MEDICAL COLLEGE', 
  //     registrationNo: '245', 
  //     isoNo: '123', 
  //     ntnNo: '123', 
  //     saleTax: '123', 
  //     phone: '0243-720400', 
  //     cell: '0243-720400', 
  //     website: 'www.gims.edu.pk', 
  //     email: 'info@gims.edu.pk', 
  //     address: 'Gambat',
  //     hasSuperAdmin: false
  //   },
  //   { 
  //     id: 2, 
  //     code: '1002', 
  //     name: 'DOW MEDICAL COLLEGE', 
  //     registrationNo: '246', 
  //     isoNo: '124', 
  //     ntnNo: '124', 
  //     saleTax: '124', 
  //     phone: '0243-720500', 
  //     cell: '0243-720500', 
  //     website: 'www.dow.edu.pk', 
  //     email: 'info@dow.edu.pk', 
  //     address: 'Karachi',
  //     hasSuperAdmin: true
  //   },
  //   { 
  //     id: 3, 
  //     code: '1003', 
  //     name: 'LIAQUAT MEDICAL COLLEGE', 
  //     registrationNo: '247', 
  //     isoNo: '125', 
  //     ntnNo: '125', 
  //     saleTax: '125', 
  //     phone: '0243-720600', 
  //     cell: '0243-720600', 
  //     website: 'www.lmc.edu.pk', 
  //     email: 'info@lmc.edu.pk', 
  //     address: 'Hyderabad',
  //     hasSuperAdmin: false
  //   },
  // ]);



  return (
    <>
      <PageHeader>
        <h4 className="mb-0">Institutes Management</h4>
      </PageHeader>
      <div className='main-content'>
        <div className='row'>
          <div className='col-12'>
            <div className='card'>
              <div className='card-body'>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="card-title">Institutes List</h5>
                  <Link to="/institutes/create" className="btn btn-primary">
                    Add New Institute
                  </Link>
                </div>
                
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>School Name</th>
                        <th>Registration No</th>
                        <th>ISO Certified No</th>
                        <th>NTN No</th>
                        <th>Phone No</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {institutes.map((institute) => (
                        <tr key={institute.id}>
                          <td>{institute.name}</td>
                          <td>{institute.registration_no}</td>
                          <td>{institute.iso_certified_no}</td>
                          <td>{institute.ntn_no}</td>
                          <td>{institute.phone_no}</td>
                          <td>{institute.email}</td>
                          <td>{institute.address}</td>
                          <td>
                            <div className="d-flex gap-2">
                              <Link to={`/institutes/edit/${institute.id}`} className="btn btn-sm btn-warning">
                                <FiEdit />
                              </Link>
                              <Link 
                                to={`/institutes/create-super-admin/${institute.id}`} 
                                className="btn btn-sm btn-success"
                                title="Create Super Admin"
                              >
                                <FiUserPlus />
                                Create Super Admin
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {institutes.length === 0 && (
                  <div className="text-center py-4">
                    <p className="text-muted">No institutes found</p>
                      <Link to="/institutes/create" className="btn btn-primary">
                        Add New Institute
                      </Link>
                  </div>
                )}
                
              </div>
              <div className="card-footer">
                <Pagination />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InstituteList;
