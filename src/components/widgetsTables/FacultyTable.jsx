import React, { useState } from 'react';
import CardHeader from '@/components/shared/CardHeader';
import CardLoader from '@/components/shared/CardLoader';
import useCardTitleActions from '@/hooks/useCardTitleActions';
import Pagination from '@/components/shared/Pagination';
import { Link } from 'react-router-dom';
import { FiEye, FiEdit, FiTrash, FiSearch } from 'react-icons/fi';
import Swal from 'sweetalert2';
import { DeleteApi, GetApi } from '@/utils/Api/ApiServices';
import { useQuery } from '@tanstack/react-query';



const FacultyTable = ({ title }) => {
    const { refreshKey, isRemoved, isExpanded, handleRefresh, handleExpand, handleDelete } = useCardTitleActions();
    const [searchTerm, setSearchTerm] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('');
    const [designationFilter, setDesignationFilter] = useState('');



    const { data :facultyresponse , isLoading , isError , error , refetch } = useQuery({
        queryKey : ['faculty'] ,
        queryFn : () => GetApi('/faculties')
    })
    const facultydata = facultyresponse?.data?.data || []

    const filteredfaculty = facultydata.filter((faculty) => 
    faculty.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faculty.pmdc_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faculty.personal_email?.toLowerCase().includes(searchTerm.toLowerCase()))


    
    const { data :departmentresponse , isLoading : isDepartmentLoading , isError : isDepartmentError , error : departmentError , refetch : departmentRefetch } = useQuery({
        queryKey : ['department'] ,
        queryFn : () => GetApi('/departments')
    })
    const departmentdata = departmentresponse?.data?.data || []







    const handleDeleteFaculty = (id) => {
        if (window.confirm('Are you sure you want to delete this faculty member?')) {
            console.log('Deleting faculty with ID:', id);
            // Delete logic would go here
        }
    };

    if (isRemoved) {
        return null;
    }

    return (
        <div className="col-xxl-12">
            <div className={`card stretch stretch-full widget-tasks-content ${isExpanded ? "card-expand" : ""} ${refreshKey ? "card-loading" : ""}`}>
                <CardHeader title={title} refresh={handleRefresh} remove={handleDelete} expanded={handleExpand} />

                <div className="card-body">
                    <div className="row mb-3">
                        <div className="col-md-4">
                            <div className="input-group">
                                <span className="input-group-text">
                                    <FiSearch size={18} />
                                </span>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Search by name, PMDC No or email"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        {/* <div className="col-md-4">
                            <select 
                                className="form-select"
                                value={departmentFilter}
                                onChange={(e) => setDepartmentFilter(e.target.value)}
                            >
                                <option value="">All Departments</option>
                                {departmentdata.map(option => (
                                    <option key={option.id} value={option.id}>
                                        {option.name}
                                    </option>
                                ))}
                            </select>
                        </div> */}
                        {/* <div className="col-md-4">
                            <select 
                                className="form-select"
                                value={designationFilter}
                                onChange={(e) => setDesignationFilter(e.target.value)}
                            >
                                {designationOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div> */}
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="mb-0">Total Faculty: {filteredfaculty.length}</h6>
                        <Link to="/create-faculty" className="btn btn-primary btn-sm">
                            Add New Faculty
                        </Link>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead>
                                <tr>
                                    <th>PMDC NO</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Department</th>
                                    <th>Designation</th>
                                    
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredfaculty.length > 0 ? (
                                    filteredfaculty.map((faculty) => (
                                        <tr key={faculty.id}>
                                            <td>{faculty.pmdc_no}</td>
                                            <td>
                                                <div className="d-flex align-items-center gap-3">
                                                    <div className="avatar-image">
                                                        <img src={faculty.avatar || "/images/avatar/default.png"} className="img-fluid" alt="Faculty" />
                                                    </div>
                                                    <div>
                                                        <span className="d-block">{faculty.name}</span>
                                                        <small className="text-muted">{faculty.gender}</small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{faculty.personal_email}</td>
                                            <td>{faculty.department}</td>
                                            <td>{faculty.designation}</td>
                                            
                                            <td>
                                                <div className="d-flex gap-2">
                                                    {/* <Link to={`/faculty/view/${faculty.id}`} className="btn btn-sm btn-info">
                                                        <FiEye size={16} />
                                                    </Link>
                                                    <Link to={`/faculty/edit/${faculty.id}`} className="btn btn-sm btn-warning">
                                                        <FiEdit size={16} />
                                                    </Link> */}
                                                    <button 
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => handleDeleteFaculty(faculty.id)}
                                                    >
                                                        <FiTrash size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center">No faculty members found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="card-footer">
                    <Pagination />
                </div>
                <CardLoader refreshKey={refreshKey} />
            </div>
        </div>
    );
};

export default FacultyTable;
