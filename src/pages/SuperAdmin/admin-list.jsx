import PageHeader from '@/components/shared/pageHeader/PageHeader';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiEdit, FiFilter, FiMail, FiPhone, FiPlus } from 'react-icons/fi';
import Pagination from '@/components/shared/Pagination';
import { useQuery } from '@tanstack/react-query';
import { GetApi } from '@/utils/Api/ApiServices';

const AdminList = () => {
    const [selectedInstitute, setSelectedInstitute] = useState('all');
    const [selectedBranch, setSelectedBranch] = useState('all');
    
    // Fetch admins data
    const { data: adminsResponse, isLoading: adminsLoading, isError: adminsError } = useQuery({
        queryKey: ['users'],
        queryFn: () => GetApi('/users')
    });
    
    const admins = adminsResponse?.data || [];
    
    // Fetch institutes data for filter
    const { data: institutesResponse } = useQuery({
        queryKey: ['institutes'],
        queryFn: () => GetApi('/institutes')
    });
    
    const institutes = institutesResponse?.data || [];
    
    // Fetch branches data for filter
    const { data: branchesResponse } = useQuery({
        queryKey: ['branches'],
        queryFn: () => GetApi('/branches')
    });
    
    const branches = branchesResponse?.data || [];
    
    // Get branches for selected institute
    const getFilteredBranches = () => {
        if (selectedInstitute === 'all') {
            return branches;
        }
        return branches.filter(branch => branch.institute_id === parseInt(selectedInstitute));
    };
    
    // Filter admins based on selected filters
    const getFilteredAdmins = () => {
        let filtered = [...admins];
        
        // Filter by institute
        if (selectedInstitute !== 'all') {
            filtered = filtered.filter(admin => 
                admin.institute_id === parseInt(selectedInstitute)
            );
        }
        
        // Filter by branch
        if (selectedBranch !== 'all') {
            filtered = filtered.filter(admin => 
                admin.branch_id === parseInt(selectedBranch)
            );
        }
        
        return filtered;
    };
    
    const filteredAdmins = getFilteredAdmins();
    
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

                                    <div className="d-flex gap-3 align-items-center">
                                        {/* Filters */}
                                        <div className="d-flex align-items-center me-3">
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
                                        
                                        <div className="d-flex align-items-center me-3">
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

                                        {/* Add Admin Button */}
                                        <Link to="/super-admin/admin/create" className="btn btn-primary btn-sm">
                                            <FiPlus className="me-1" /> Add Admin
                                        </Link>
                                    </div>
                                </div>
                                
                                {adminsLoading ? (
                                    <div className="d-flex justify-content-center py-4">
                                        <div className="spinner-border" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                ) : adminsError ? (
                                    <div className="alert alert-danger">
                                        Error loading administrators. Please try again.
                                    </div>
                                ) : (
                                    <>
                                        <div className='table-responsive'>
                                            <table className="table table-hover">
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Name</th>
                                                        <th>Contact</th>
                                                        <th>Branch</th>
                                                        <th>Institute</th>
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
                                                            <td>{admin.branch_name}</td>
                                                            <td>{admin.institute_name}</td>
                                                            <td>
                                                                <div className="d-flex gap-2">
                                                                    <Link 
                                                                        to={`/super-admin/admin/edit/${admin.id}`} 
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
                                                <Link to="/super-admin/admin/create" className="btn btn-primary btn-sm mt-2">
                                                    <FiPlus className="me-1" /> Add Admin
                                                </Link>
                                            </div>
                                        )}
                                    </>
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
