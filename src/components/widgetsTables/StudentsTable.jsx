import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { GetApi, DeleteApi } from '@/utils/Api/ApiServices';
import CardHeader from '@/components/shared/CardHeader';
import CardLoader from '@/components/shared/CardLoader';
import useCardTitleActions from '@/hooks/useCardTitleActions';
import Pagination from '@/components/shared/Pagination';
import Dropdown from '@/components/shared/Dropdown';
import { Link, useNavigate } from 'react-router-dom';
import { FiEye, FiEdit, FiTrash, FiSearch } from 'react-icons/fi';
import Swal from 'sweetalert2';

const StudentsTable = ({ title }) => {
    const navigate = useNavigate();
    const { refreshKey, isRemoved, isExpanded, handleRefresh, handleExpand, handleDelete } = useCardTitleActions();
    const [searchTerm, setSearchTerm] = useState('');
    const [programFilter, setProgramFilter] = useState('');
    const [batchFilter, setBatchFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Fetch students data using React Query
    const { data: studentsResponse, isLoading, isError, error, refetch } = useQuery({
        queryKey: ['students'],
        queryFn: () => GetApi('/students')
    });

    // Extract students data from the response
    const studentsData = studentsResponse?.data?.data || [];

    // Filter students based on search term
    const filteredStudents = studentsData.filter(student => {
        const matchesSearch = 
            (student.name && student.name.toLowerCase().includes(searchTerm.toLowerCase())) || 
            (student.enrollment_no && student.enrollment_no.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (student.email && student.email.toLowerCase().includes(searchTerm.toLowerCase()));
        
        return matchesSearch;
    });

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredStudents.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Handle student actions
    const handleViewStudent = (id) => {
        navigate(`/students/view/${id}`);
    };

    const handleEditStudent = (id) => {
        navigate(`/students/edit/${id}`);
    };

    const handleDeleteStudent = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                DeleteApi(`/students/${id}`)
                    .then(() => {
                        Swal.fire(
                            'Deleted!',
                            'Student has been deleted.',
                            'success'
                        );
                        refetch(); // Refresh the data after deletion
                    })
                    .catch(error => {
                        Swal.fire(
                            'Error!',
                            'Failed to delete student.',
                            'error'
                        );
                        console.error('Error deleting student:', error);
                    });
            }
        });
    };

    if (isRemoved) {
        return null;
    }

    return (
        <div className="col-xxl-12">
            <div className={`card stretch stretch-full widget-tasks-content ${isExpanded ? "card-expand" : ""} ${refreshKey ? "card-loading" : ""}`}>
                <CardHeader title={title} refresh={handleRefresh} remove={handleDelete} expanded={handleExpand} />

                {refreshKey && <CardLoader />}

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
                                    placeholder="Search by name, ID or email"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        {/* <div className="col-md-4">
                            <select 
                                className="form-select"
                                value={programFilter}
                                onChange={(e) => setProgramFilter(e.target.value)}
                            >
                                {programOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div> */}
                        {/* <div className="col-md-4">
                            <select 
                                className="form-select"
                                value={batchFilter}
                                onChange={(e) => setBatchFilter(e.target.value)}
                            >
                                {batchOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div> */}
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="mb-0">Total Students: {filteredStudents.length}</h6>
                        <Link to="/students/add" className="btn btn-primary btn-sm">
                            Add New Student
                        </Link>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-4">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="mt-2">Loading students data...</p>
                        </div>
                    ) : isError ? (
                        <div className="alert alert-danger" role="alert">
                            Error loading students: {error?.message || 'Unknown error'}
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead>
                                    <tr>
                                        <th>Student ID</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Program</th>
                                        <th>Batch</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredStudents.length > 0 ? (
                                        filteredStudents.map((student) => (
                                            <tr key={student.id}>
                                                <td>{student.id || 'N/A'}</td>
                                                <td>
                                                    <div className="d-flex align-items-center gap-3">
                                                        <div className="avatar-image">
                                                            <img 
                                                                src={student.photo || '/images/avatar/default.png'} 
                                                                className="img-fluid" 
                                                                alt="Student" 
                                                                onError={(e) => {
                                                                    e.target.onerror = null;
                                                                    e.target.src = '/images/avatar/default.png';
                                                                }}
                                                            />
                                                        </div>
                                                        <div>
                                                            <span className="d-block">{student.name || 'N/A'}</span>
                                                            <small className="text-muted">{student.gender || 'N/A'}</small>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{student.email || 'N/A'}</td>
                                                <td>{student.course?.name || student.course_id || 'N/A'}</td>
                                                <td>{student.batch?.name || student.batch_id || 'N/A'}</td>
                                                <td>
                                                    <span className={`badge ${student.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>
                                                        {student.status || 'N/A'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="d-flex gap-2">
                                                        <Link to={`/students/view/${student.id}`} className="btn btn-sm btn-info">
                                                            <FiEye size={16} />
                                                        </Link>
                                                        <Link to={`/students/edit/${student.id}`} className="btn btn-sm btn-warning">
                                                            <FiEdit size={16} />
                                                        </Link>
                                                        {/* <button 
                                                            className="btn btn-sm btn-danger"
                                                            onClick={() => handleDeleteStudent(student.id)}
                                                        >
                                                            <FiTrash size={16} />
                                                        </button> */}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="text-center">No students found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {filteredStudents.length > itemsPerPage && (
                        <div className="d-flex justify-content-end mt-3">
                            <Pagination 
                                currentPage={currentPage} 
                                totalPages={totalPages} 
                                onPageChange={handlePageChange} 
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentsTable;
