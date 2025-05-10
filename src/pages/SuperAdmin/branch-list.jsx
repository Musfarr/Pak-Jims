import PageHeader from '@/components/shared/pageHeader/PageHeader';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiEdit, FiUserPlus, FiPlus, FiFilter } from 'react-icons/fi';
import Pagination from '@/components/shared/Pagination';
import { useQuery } from '@tanstack/react-query';
import { GetApi } from '@/utils/Api/ApiServices';

const BranchList = () => {
    const [selectedInstitute, setSelectedInstitute] = useState('all');
    
    // Fetch branches data
    const { data: response, isLoading, isError } = useQuery({
        queryKey: ['branches'],
        queryFn: () => GetApi('/branches')
    });
    
    const branches = response?.data || [];
    
    // Fetch institutes data for filtering
    const { data: institutesResponse } = useQuery({
        queryKey: ['institutes'],
        queryFn: () => GetApi('/institutes')
    });
    
    const institutes = institutesResponse?.data || [];
    
    // Filter branches based on selected institute
    const filteredBranches = selectedInstitute === 'all' 
        ? branches 
        : branches.filter(branch => branch.institute_id === parseInt(selectedInstitute));
    
    // Handle institute filter change
    const handleInstituteChange = (e) => {
        setSelectedInstitute(e.target.value);
    };

    return (
        <>
            <PageHeader>
                <h4 className="mb-0">Branch List</h4>
            </PageHeader>
            <div className='main-content'>
                <div className='row'>
                    <div className='col-12'>
                        <div className='card'>
                            <div className='card-body'>
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h5 className="card-title">Branches</h5>
                                    
                                    {/* Filter */}
                                    <div className="col-md-4">
                                        <div className="d-flex align-items-center">
                                            <label htmlFor="instituteFilter" className="me-2">
                                                <FiFilter className="me-1" /> Filter by Institute:
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
                                    </div>
                                </div>
                                
                                {isLoading ? (
                                    <div className="text-center py-4">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                        <p className="mt-2">Loading branches...</p>
                                    </div>
                                ) : isError ? (
                                    <div className="alert alert-danger">
                                        Error loading branches. Please try again later.
                                    </div>
                                ) : (
                                    <div className='table-responsive'>
                                        <table className="table table-hover">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Branch Name</th>
                                                    <th>Address</th>
                                                    <th>Institute</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredBranches.map((branch) => (
                                                    <tr key={branch.id}>
                                                        <td>{branch.id}</td>
                                                        <td>{branch.name}</td>
                                                        <td>{branch.address}</td>
                                                        <td>{branch.institute_name || 'N/A'}</td>
                                                        <td>
                                                            <div className="d-flex gap-2">
                                                                <Link to={`/branch/edit/${branch.id}`} className="btn btn-sm btn-warning">
                                                                    <FiEdit />
                                                                </Link>
                                                                <Link 
                                                                    to={`/branch/create-admin/${branch.id}`} 
                                                                    state={{ instituteID : branch.institute_id }}
                                                                    className="btn btn-sm btn-success"
                                                                    title="Create Admin"
                                                                >
                                                                    <FiUserPlus size={16} />
                                                                    Create Admin
                                                                </Link>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {!isLoading && !isError && filteredBranches.length === 0 && (
                                    <div className="text-center py-4">
                                        <p className="text-muted">No branches found</p>
                                        <Link to="/branch/create" className="btn btn-primary">
                                            <FiPlus className="me-1" /> Add New Branch
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

export default BranchList;