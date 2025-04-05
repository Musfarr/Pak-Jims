import PageHeader from '@/components/shared/pageHeader/PageHeader';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiEdit, FiFilter, FiMail, FiPhone } from 'react-icons/fi';
import Pagination from '@/components/shared/Pagination';

const AdminList = () => {
    const [admins, setAdmins] = useState([
        { 
          id: 1, 
          name: 'John Doe', 
          email: 'john.doe@gims.edu.pk',
          phone: '0243-720400',
          branch: 'GAMBAT MEDICAL COLLEGE',
          branchId: 1,
          institute: 'GIMS Health College',
          instituteId: 1,
          status: 'active'
        },
        { 
          id: 2, 
          name: 'Jane Smith', 
          email: 'jane.smith@dow.edu.pk',
          phone: '0243-720500',
          branch: 'DOW MEDICAL COLLEGE',
          branchId: 2,
          institute: 'DOW University',
          instituteId: 2,
          status: 'active'
        },
        { 
          id: 3, 
          name: 'Robert Johnson', 
          email: 'robert.johnson@lmc.edu.pk',
          phone: '0243-720600',
          branch: 'LIAQUAT MEDICAL COLLEGE',
          branchId: 3,
          institute: 'GIMS Health College',
          instituteId: 1,
          status: 'inactive'
        },
    ]);
    
    const [filteredAdmins, setFilteredAdmins] = useState([]);
    const [selectedInstitute, setSelectedInstitute] = useState('all');
    const [selectedBranch, setSelectedBranch] = useState('all');
    
    // Sample institutes data for the filter
    const institutes = [
        { id: 1, name: 'GIMS Health College' },
        { id: 2, name: 'DOW University' },
        { id: 3, name: 'Liaquat University' }
    ];
    
    // Sample branches data for the filter
    const branches = [
        { id: 1, name: 'GAMBAT MEDICAL COLLEGE', instituteId: 1 },
        { id: 2, name: 'DOW MEDICAL COLLEGE', instituteId: 2 },
        { id: 3, name: 'LIAQUAT MEDICAL COLLEGE', instituteId: 1 }
    ];
    
    // Get branches for selected institute
    const getFilteredBranches = () => {
        if (selectedInstitute === 'all') {
            return branches;
        }
        return branches.filter(branch => branch.instituteId === parseInt(selectedInstitute));
    };
    
    // Filter admins when selectedInstitute or selectedBranch changes
    useEffect(() => {
        let filtered = [...admins];
        
        // Filter by institute
        if (selectedInstitute !== 'all') {
            filtered = filtered.filter(admin => 
                admin.instituteId === parseInt(selectedInstitute)
            );
        }
        
        // Filter by branch
        if (selectedBranch !== 'all') {
            filtered = filtered.filter(admin => 
                admin.branchId === parseInt(selectedBranch)
            );
        }
        
        setFilteredAdmins(filtered);
    }, [selectedInstitute, selectedBranch, admins]);
    
    // Handle institute filter change
    const handleInstituteChange = (e) => {
        setSelectedInstitute(e.target.value);
        setSelectedBranch('all'); // Reset branch filter when institute changes
    };
    
    // Handle branch filter change
    const handleBranchChange = (e) => {
        setSelectedBranch(e.target.value);
    };

    return (
        <>
            <PageHeader>
                <h4 className="mb-0">Admin Management</h4>
            </PageHeader>
            <div className='main-content'>
                <div className='row'>
                    <div className='col-12'>
                        <div className='card'>
                            <div className='card-body'>
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h5 className="card-title">Branch Administrators</h5>

                                    {/* Filters */}
                                    <div className="d-flex gap-3">
                                        <div className="d-flex align-items-center">
                                            <label htmlFor="instituteFilter" className="me-2">
                                                <FiFilter className="me-1" /> Institute:
                                            </label>
                                            <select 
                                                id="instituteFilter" 
                                                className="form-select-sm" 
                                                value={selectedInstitute}
                                                onChange={handleInstituteChange}
                                            >
                                                <option value="all">All Institutes</option>
                                                {institutes.map(institute => (
                                                    <option key={institute.id} value={institute.id}>
                                                        {institute.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        
                                        <div className="d-flex align-items-center">
                                            <label htmlFor="branchFilter" className="me-2">
                                                <FiFilter className="me-1" /> Branch:
                                            </label>
                                            <select 
                                                id="branchFilter" 
                                                className="form-select-sm" 
                                                value={selectedBranch}
                                                onChange={handleBranchChange}
                                            >
                                                <option value="all">All Branches</option>
                                                {getFilteredBranches().map(branch => (
                                                    <option key={branch.id} value={branch.id}>
                                                        {branch.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className='table-responsive'>
                                    <table className="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Name</th>
                                                <th>Contact</th>
                                                <th>Branch</th>
                                                <th>Institute</th>
                                                {/* <th>Status</th> */}
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredAdmins.map((admin) => (
                                                <tr key={admin.id}>
                                                    <td>{admin.id}</td>
                                                    <td>{admin.name}</td>
                                                    <td>
                                                        <div>
                                                            <div><FiMail size={14} className="me-1" /> {admin.email}</div>
                                                            <div><FiPhone size={14} className="me-1" /> {admin.phone}</div>
                                                        </div>
                                                    </td>
                                                    <td>{admin.branch}</td>
                                                    <td>{admin.institute}</td>
                                                    {/* <td>
                                                        <span className={`badge ${admin.status === 'active' ? 'bg-success' : 'bg-danger'}`}>
                                                            {admin.status}
                                                        </span>
                                                    </td> */}
                                                    <td>
                                                        <div className="d-flex gap-2">
                                                            <Link 
                                                                to={`/admin/edit/${admin.id}`} 
                                                                className="btn btn-sm btn-warning"
                                                                title="Edit Admin"
                                                            >
                                                                <FiEdit size={16} />
                                                            </Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {filteredAdmins.length === 0 && (
                                    <div className="text-center py-4">
                                        <p className="text-muted">No administrators found</p>
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

export default AdminList;
