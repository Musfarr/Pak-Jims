import React, { useState } from 'react';
import CardHeader from '@/components/shared/CardHeader';
import CardLoader from '@/components/shared/CardLoader';
import useCardTitleActions from '@/hooks/useCardTitleActions';
import Pagination from '@/components/shared/Pagination';
import Dropdown from '@/components/shared/Dropdown';
import { Link } from 'react-router-dom';
import { FiEye, FiEdit, FiTrash, FiSearch } from 'react-icons/fi';

// Sample student data
const studentData = [
    { id: 1, name: 'Ahmed Khan', studentId: 'STD-2023-001', email: 'ahmed.khan@email.com', avatar: '/images/avatar/1.png', batch: 'MBBS Batch 2023', program: 'MBBS PROGRAM', gender: 'Male', status: 'Active', enrollmentDate: '21 Sep, 2023' },
    { id: 2, name: 'Sara Ali', studentId: 'STD-2023-002', email: 'sara.ali@email.com', avatar: '/images/avatar/2.png', batch: 'BS Batch 2023', program: 'BS PROGRAM', gender: 'Female', status: 'Active', enrollmentDate: '25 Sep, 2023' },
    { id: 3, name: 'Usman Ahmed', studentId: 'STD-2023-003', email: 'usman.ahmed@email.com', avatar: '/images/avatar/3.png', batch: 'BDS Batch 2023', program: 'BDS PROGRAM', gender: 'Male', status: 'Active', enrollmentDate: '16 Sep, 2023' },
    { id: 4, name: 'Ayesha Malik', studentId: 'STD-2023-004', email: 'ayesha.malik@email.com', avatar: '/images/avatar/4.png', batch: 'PHARM-D Batch 2023', program: 'PHARM-D PROGRAM', gender: 'Female', status: 'Inactive', enrollmentDate: '20 Sep, 2023' },
    { id: 5, name: 'Bilal Hassan', studentId: 'STD-2023-005', email: 'bilal.hassan@email.com', avatar: '/images/avatar/5.png', batch: 'BSN Batch 2023', program: 'BSN PROGRAM', gender: 'Male', status: 'Active', enrollmentDate: '20 Sep, 2023' },
];

const StudentsTable = ({ title }) => {
    const { refreshKey, isRemoved, isExpanded, handleRefresh, handleExpand, handleDelete } = useCardTitleActions();
    const [searchTerm, setSearchTerm] = useState('');
    const [programFilter, setProgramFilter] = useState('');
    const [batchFilter, setBatchFilter] = useState('');

    // Program options for filter
    const programOptions = [
        { value: '', label: 'All Programs' },
        { value: 'MBBS PROGRAM', label: 'MBBS PROGRAM' },
        { value: 'BS PROGRAM', label: 'BS PROGRAM' },
        { value: 'BDS PROGRAM', label: 'BDS PROGRAM' },
        { value: 'PHARM-D PROGRAM', label: 'PHARM-D PROGRAM' },
        { value: 'BSN PROGRAM', label: 'BSN PROGRAM' },
    ];

    // Batch options for filter
    const batchOptions = [
        { value: '', label: 'All Batches' },
        { value: 'MBBS Batch 2023', label: 'MBBS Batch 2023' },
        { value: 'BS Batch 2023', label: 'BS Batch 2023' },
        { value: 'BDS Batch 2023', label: 'BDS Batch 2023' },
        { value: 'PHARM-D Batch 2023', label: 'PHARM-D Batch 2023' },
        { value: 'BSN Batch 2023', label: 'BSN Batch 2023' },
    ];

    // Filter students based on search term and filters
    const filteredStudents = studentData.filter(student => {
        const matchesSearch = 
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesProgram = programFilter === '' || student.program === programFilter;
        const matchesBatch = batchFilter === '' || student.batch === batchFilter;
        
        return matchesSearch && matchesProgram && matchesBatch;
    });

    // Action options for dropdown
    const actionOptions = [
        { label: "View Student", onClick: (id) => handleViewStudent(id) },
        { label: "Edit Student", onClick: (id) => handleEditStudent(id) },
        { label: "Delete Student", onClick: (id) => handleDeleteStudent(id) },
    ];

    // Handle student actions
    const handleViewStudent = (id) => {
        window.location.href = `/students/view/${id}`;
    };

    const handleEditStudent = (id) => {
        window.location.href = `/students/edit/${id}`;
    };

    const handleDeleteStudent = (id) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            console.log('Deleting student with ID:', id);
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
                                    placeholder="Search by name, ID or email"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="col-md-4">
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
                        </div>
                        <div className="col-md-4">
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
                        </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="mb-0">Total Students: {filteredStudents.length}</h6>
                        <Link to="/students/add" className="btn btn-primary btn-sm">
                            Add New Student
                        </Link>
                    </div>

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
                                            <td>{student.studentId}</td>
                                            <td>
                                                <div className="d-flex align-items-center gap-3">
                                                    <div className="avatar-image">
                                                        <img src={student.avatar} className="img-fluid" alt="Student" />
                                                    </div>
                                                    <div>
                                                        <span className="d-block">{student.name}</span>
                                                        <small className="text-muted">{student.gender}</small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{student.email}</td>
                                            <td>{student.program}</td>
                                            <td>{student.batch}</td>
                                            <td>
                                                <span className={`badge ${student.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
                                                    {student.status}
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
                                                    <button 
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => handleDeleteStudent(student.id)}
                                                    >
                                                        <FiTrash size={16} />
                                                    </button>
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
                </div>

                <div className="card-footer">
                    <Pagination />
                </div>
                <CardLoader refreshKey={refreshKey} />
            </div>
        </div>
    );
};

export default StudentsTable;
