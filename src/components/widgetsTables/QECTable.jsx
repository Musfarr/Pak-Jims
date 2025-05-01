import React, { useState } from 'react';
import CardHeader from '@/components/shared/CardHeader';
import CardLoader from '@/components/shared/CardLoader';
import useCardTitleActions from '@/hooks/useCardTitleActions';
import Pagination from '@/components/shared/Pagination';
import { Link, useNavigate } from 'react-router-dom';
import { FiEye, FiEdit, FiTrash, FiSearch } from 'react-icons/fi';
import Swal from 'sweetalert2';

const QECTable = ({ title }) => {
    const navigate = useNavigate();
    const { refreshKey, isRemoved, isExpanded, handleRefresh, handleExpand, handleDelete } = useCardTitleActions();
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Static QEC data for demonstration
    const qecData = [
        {
            id: 1,
            title: "Annual Faculty Assessment",
            description: "Comprehensive evaluation of teaching faculty performance across all departments",
            date: "2025-04-15",
            status: "active"
        },
        {
            id: 2,
            title: "Student Learning Outcomes",
            description: "Assessment of student achievement of program learning outcomes",
            date: "2025-03-22",
            status: "completed"
        },
        {
            id: 3,
            title: "Curriculum Review",
            description: "Systematic evaluation of curriculum relevance and effectiveness",
            date: "2025-05-10",
            status: "pending"
        },
        {
            id: 4,
            title: "Teaching Quality Assessment",
            description: "Evaluation of teaching methodologies and effectiveness",
            date: "2025-04-05",
            status: "active"
        },
        {
            id: 5,
            title: "Research Output Evaluation",
            description: "Assessment of faculty research productivity and impact",
            date: "2025-02-18",
            status: "completed"
        }
    ];

    // Filter QEC records based on search term
    const filteredQEC = qecData.filter(qec => {
        const matchesSearch = 
            (qec.title && qec.title.toLowerCase().includes(searchTerm.toLowerCase())) || 
            (qec.description && qec.description.toLowerCase().includes(searchTerm.toLowerCase()));
        
        return matchesSearch;
    });

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredQEC.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredQEC.length / itemsPerPage);

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Handle QEC actions
    const handleViewQEC = (id) => {
        navigate(`/qec/view/${id}`);
    };

    const handleEditQEC = (id) => {
        navigate(`/qec/edit/${id}`);
    };

    const handleDeleteQEC = (id) => {
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
                // Static deletion logic
                Swal.fire(
                    'Deleted!',
                    'QEC record has been deleted.',
                    'success'
                );
                // In real implementation, you would update the state here
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
                                    placeholder="Search by title or description"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="mb-0">Total QEC Records: {filteredQEC.length}</h6>
                        <Link to="/qec/add" className="btn btn-primary btn-sm">
                            Add New QEC
                        </Link>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Title</th>
                                    <th>Description</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredQEC.length > 0 ? (
                                    currentItems.map((qec) => (
                                        <tr key={qec.id}>
                                            <td>{qec.id || 'N/A'}</td>
                                            <td>{qec.title || 'N/A'}</td>
                                            <td>
                                                {qec.description 
                                                    ? (qec.description.length > 50 
                                                        ? `${qec.description.substring(0, 50)}...` 
                                                        : qec.description) 
                                                    : 'N/A'}
                                            </td>
                                            <td>{qec.date || 'N/A'}</td>
                                            <td>
                                                <span className={`badge ${qec.status === 'active' ? 'bg-success' : qec.status === 'completed' ? 'bg-info' : 'bg-warning'}`}>
                                                    {qec.status || 'N/A'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="d-flex gap-2">
                                                    <button 
                                                        className="btn btn-sm btn-outline-info" 
                                                        onClick={() => handleViewQEC(qec.id)}
                                                        title="View"
                                                    >
                                                        <FiEye />
                                                    </button>
                                                    <button 
                                                        className="btn btn-sm btn-outline-primary" 
                                                        onClick={() => handleEditQEC(qec.id)}
                                                        title="Edit"
                                                    >
                                                        <FiEdit />
                                                    </button>
                                                    <button 
                                                        className="btn btn-sm btn-outline-danger" 
                                                        onClick={() => handleDeleteQEC(qec.id)}
                                                        title="Delete"
                                                    >
                                                        <FiTrash />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center">
                                            No QEC records found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {filteredQEC.length > itemsPerPage && (
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

export default QECTable;
