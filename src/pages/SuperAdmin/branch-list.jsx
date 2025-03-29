import PageHeader from '@/components/shared/pageHeader/PageHeader';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiEdit, FiUserPlus, FiPlus, FiFilter } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import Pagination from '@/components/shared/Pagination';

const BranchList = () => {
    const { hasRole } = useAuth();
    const [branches, setBranches] = useState([
        { 
          id: 1, 
          code: '1001', 
          name: 'GAMBAT MEDICAL COLLEGE', 
          address: 'Gambat',
          institute: 'GIMS Health College',
          instituteId: 1,
          hasAdmin: false
        },
        { 
          id: 2, 
          code: '1002', 
          name: 'DOW MEDICAL COLLEGE', 
          address: 'Karachi',
          institute: 'DOW University',
          instituteId: 2,
          hasAdmin: true
        },
        { 
          id: 3, 
          code: '1003', 
          name: 'LIAQUAT MEDICAL COLLEGE', 
          address: 'Hyderabad',
          institute: 'GIMS Health College',
          instituteId: 1,
          hasAdmin: false
        },
    ]);
    
    const [filteredBranches, setFilteredBranches] = useState([]);
    const [selectedInstitute, setSelectedInstitute] = useState('all');
    
    // Sample institutes data for the filter
    const institutes = [
        { id: 1, name: 'GIMS Health College' },
        { id: 2, name: 'DOW University' },
        { id: 3, name: 'Liaquat University' }
    ];
    
    // Filter branches when selectedInstitute changes
    useEffect(() => {
        if (selectedInstitute === 'all') {
            setFilteredBranches(branches);
        } else {
            const filtered = branches.filter(branch => 
                branch.instituteId === parseInt(selectedInstitute)
            );
            setFilteredBranches(filtered);
        }
    }, [selectedInstitute, branches]);
    
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
                                    {/* {hasRole('superadmin') && (
                                        <Link to="/institutes" className="btn btn-primary">
                                            <FiPlus className="me-1" /> Add New Branch
                                        </Link>
                                    )} */}

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
                                                    <td>{branch.institute}</td>
                                                    <td>
                                                        <div className="d-flex gap-2">
                                                            {/* <Link to={`/branch/edit/${branch.id}`} className="btn btn-sm btn-warning">
                                                                <FiEdit />
                                                            </Link> */}
                                                            <Link 
                                                                to={`/branch/create-admin/${branch.id}`} 
                                                                className={`btn btn-sm ${branch.hasAdmin ? 'btn-secondary' : 'btn-success'}`}
                                                                title={branch.hasAdmin ? "Update Admin" : "Create Admin"}
                                                            >
                                                                <FiUserPlus size={16} />
                                                                {branch.hasAdmin ? ' Update' : ' Create '} Admin
                                                            </Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {filteredBranches.length === 0 && (
                                    <div className="text-center py-4">
                                        <p className="text-muted">No branches found</p>
                                        {/* {hasRole('superadmin') && (
                                            <Link to="/institutes" className="btn btn-primary">
                                                <FiPlus className="me-1" /> Add New Branch
                                            </Link>
                                        )} */}
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