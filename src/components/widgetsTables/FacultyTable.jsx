import React, { useState } from 'react';
import CardHeader from '@/components/shared/CardHeader';
import CardLoader from '@/components/shared/CardLoader';
import useCardTitleActions from '@/hooks/useCardTitleActions';
import Pagination from '@/components/shared/Pagination';
import { Link } from 'react-router-dom';
import { FiEye, FiEdit, FiTrash, FiSearch } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';

// Sample faculty data
const facultyData = [
    { id: 1, name: 'Dr. Muhammad Ali', facultyId: 'FAC-2023-001', email: 'dr.ali@email.com', avatar: '/images/avatar/1.png', department: 'Medicine', designation: 'Professor', gender: 'Male', status: 'Active', joinDate: '15 Jan, 2023' },
    { id: 2, name: 'Dr. Fatima Khan', facultyId: 'FAC-2023-002', email: 'dr.fatima@email.com', avatar: '/images/avatar/2.png', department: 'Computer Science', designation: 'Associate Professor', gender: 'Female', status: 'Active', joinDate: '10 Feb, 2023' },
    { id: 3, name: 'Dr. Imran Ahmed', facultyId: 'FAC-2023-003', email: 'dr.imran@email.com', avatar: '/images/avatar/3.png', department: 'Engineering', designation: 'Assistant Professor', gender: 'Male', status: 'Active', joinDate: '05 Mar, 2023' },
    { id: 4, name: 'Dr. Saima Malik', facultyId: 'FAC-2023-004', email: 'dr.saima@email.com', avatar: '/images/avatar/4.png', department: 'Business', designation: 'Lecturer', gender: 'Female', status: 'On Leave', joinDate: '20 Apr, 2023' },
    { id: 5, name: 'Dr. Kamran Raza', facultyId: 'FAC-2023-005', email: 'dr.kamran@email.com', avatar: '/images/avatar/5.png', department: 'Arts & Humanities', designation: 'Professor', gender: 'Male', status: 'Active', joinDate: '12 May, 2023' },
];

const FacultyTable = ({ title }) => {
    const { refreshKey, isRemoved, isExpanded, handleRefresh, handleExpand, handleDelete } = useCardTitleActions();
    const [searchTerm, setSearchTerm] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('');
    const [designationFilter, setDesignationFilter] = useState('');





    const { data :departmentresponse , isLoading : isDepartmentLoading , isError : isDepartmentError , error : departmentError , refetch : departmentRefetch } = useQuery({
        queryKey : ['department'] ,
        queryFn : () => GetApi('/departments')
    })
    const departmentdata = departmentresponse?.data?.data || []


    

    const { data :facultyresponse , isLoading , isError , error , refetch } = useQuery({
        queryKey : ['faculty'] ,
        queryFn : () => GetApi('/faculties')
    })
    const facultydata = facultyresponse?.data?.data || []

    const filteredfaculty = facultydata.filter((faculty) => 
    faculty.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faculty.pmdc_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faculty.personal_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faculty.department?.toLowerCase().includes(departmentFilter.toLowerCase())
    )


    
 





    




    // Department options for filter
    const departmentOptions = [
        { value: '', label: 'All Departments' },
        { value: 'Medicine', label: 'Medicine' },
        { value: 'Computer Science', label: 'Computer Science' },
        { value: 'Engineering', label: 'Engineering' },
        { value: 'Business', label: 'Business' },
        { value: 'Arts & Humanities', label: 'Arts & Humanities' },
    ];

    // Designation options for filter
    const designationOptions = [
        { value: '', label: 'All Designations' },
        { value: 'Professor', label: 'Professor' },
        { value: 'Associate Professor', label: 'Associate Professor' },
        { value: 'Assistant Professor', label: 'Assistant Professor' },
        { value: 'Lecturer', label: 'Lecturer' },
        { value: 'Instructor', label: 'Instructor' },
    ];

    // Filter faculty based on search term and filters
    const filteredFaculty = facultyData.filter(faculty => {
        const matchesSearch = 
            faculty.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            faculty.facultyId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            faculty.email.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesDepartment = departmentFilter === '' || faculty.department === departmentFilter;
        const matchesDesignation = designationFilter === '' || faculty.designation === designationFilter;
        
        return matchesSearch && matchesDepartment && matchesDesignation;
    });

    // Handle faculty actions
    const handleViewFaculty = (id) => {
        window.location.href = `/faculty/view/${id}`;
    };

    const handleEditFaculty = (id) => {
        window.location.href = `/faculty/edit/${id}`;
    };

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
                                    placeholder="Search by name, ID or email"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="col-md-4">
                            <select 
                                className="form-select"
                                value={departmentFilter}
                                onChange={(e) => setDepartmentFilter(e.target.value)}
                            >
                                <option value="">All Departments</option>
                                {departmentdata.map(option => (
                                    <option key={option.id} value={option.name}>
                                        {option.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-4">
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
                        </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="mb-0">Total Faculty: {filteredFaculty.length}</h6>
                        <Link to="/faculty/add" className="btn btn-primary btn-sm">
                            Add New Faculty
                        </Link>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead>
                                <tr>
                                    <th>Faculty ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Department</th>
                                    <th>Designation</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredFaculty.length > 0 ? (
                                    filteredFaculty.map((faculty) => (
                                        <tr key={faculty.id}>
                                            <td>{faculty.facultyId}</td>
                                            <td>
                                                <div className="d-flex align-items-center gap-3">
                                                    <div className="avatar-image">
                                                        <img src={faculty.avatar} className="img-fluid" alt="Faculty" />
                                                    </div>
                                                    <div>
                                                        <span className="d-block">{faculty.name}</span>
                                                        <small className="text-muted">{faculty.gender}</small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{faculty.email}</td>
                                            <td>{faculty.department}</td>
                                            <td>{faculty.designation}</td>
                                            <td>
                                                <span className={`badge ${
                                                    faculty.status === 'Active' ? 'bg-success' : 
                                                    faculty.status === 'On Leave' ? 'bg-warning' : 
                                                    'bg-secondary'
                                                }`}>
                                                    {faculty.status}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="d-flex gap-2">
                                                    <Link to={`/faculty/view/${faculty.id}`} className="btn btn-sm btn-info">
                                                        <FiEye size={16} />
                                                    </Link>
                                                    <Link to={`/faculty/edit/${faculty.id}`} className="btn btn-sm btn-warning">
                                                        <FiEdit size={16} />
                                                    </Link>
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
