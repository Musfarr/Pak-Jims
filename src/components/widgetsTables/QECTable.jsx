import React, { useState } from 'react';
import CardHeader from '@/components/shared/CardHeader';
import CardLoader from '@/components/shared/CardLoader';
import useCardTitleActions from '@/hooks/useCardTitleActions';
import Pagination from '@/components/shared/Pagination';
import { Link, useNavigate } from 'react-router-dom';
import { FiEye, FiEdit, FiTrash, FiSearch, FiCheckSquare } from 'react-icons/fi';
import Swal from 'sweetalert2';
import { FaDownLong, FaRegHandPointRight } from 'react-icons/fa6';
import SelectDropdown from '@/components/shared/SelectDropdown';
import Dropdown from '@/components/shared/Dropdown';
import { DeleteApi, GetApi } from '@/utils/Api/ApiServices';
import { useQuery } from '@tanstack/react-query';


const QECTable = ({ title }) => {
    const navigate = useNavigate();
    const { refreshKey, isRemoved, isExpanded, handleRefresh, handleExpand, handleDelete } = useCardTitleActions();
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [isDeleting, setIsDeleting] = useState(false);

    // Fetch QEC data using React Query
    const { 
        data: qecResponse, 
        isLoading, 
        error, 
        refetch 
    } = useQuery({
        queryKey: ['surveys', currentPage, perPage],
        queryFn: () => GetApi(`/surveys?per_page=${perPage}&page=${currentPage}`)
    });

    // Process the API response
    const qecData = qecResponse?.data || [];
    const pagination = qecResponse?.pagination || qecResponse?.data?.pagination || {};
    const totalPages = pagination.total_pages || 1;
    const total = pagination.total || qecData.length;
    const perPageFromApi = pagination.per_page || perPage;
    const currentPageFromApi = pagination.current_page || currentPage;


    const statusOptions = [
        { value: "Assigned", label: "Assigned" },
        { value: "Unassigned", label: "Unassigned" },
    ];

    // Filter QEC records based on search term (current page only)
    const filteredQEC = qecData.filter(qec => {
        const matchesSearch = 
            (qec?.title && qec?.title.toLowerCase().includes(searchTerm.toLowerCase())) || 
            (qec?.description && qec?.description.toLowerCase().includes(searchTerm.toLowerCase()));
        
        return matchesSearch;
    });

    // No need for client-side pagination logic, backend handles it
    const currentItems = filteredQEC;

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // // Handle QEC actions
    // const handleQECDownload = (id) => {
        
    //     const url = `./src/assets/pdfs/${id}.pdf`;

    //     const link = document.createElement('a');
    //     link.href = url;
    //     link.download = `QEC-${id}.pdf`;


    //     document.body.appendChild(link);
    //     link.click();
    //     document.body.removeChild(link);
    // };








    const handleEditQEC = (id) => {
        navigate(`/qec/edit/${id}`);
    };



    const handleViewQEC = (id) => {
        navigate(`/qec/view/${id}`);
    };

    const handleViewAssignmentDetails = (id) => {
        navigate(`/qec/assignments/${id}`);
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
                    setIsDeleting(true);
                    DeleteApi(`/surveys/${id}`)
                      .then(() => {
                        refetch(); // Refresh the programs list
                        Swal.fire({
                          icon: 'success',
                          title: 'Success!',
                          text: 'QEC deleted successfully',
                          confirmButtonColor: '#3085d6'
                        });
                      })
                      .catch(error => {
                        console.error('Error deleting QEC:', error);
                        Swal.fire({
                          icon: 'error',
                          title: 'Error!',
                          text: error.message || 'Failed to delete QEC',
                          confirmButtonColor: '#d33'
                        });
                      })
                      .finally(() => {
                        setIsDeleting(false);
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

                {(refreshKey || isLoading) && <CardLoader />}

                <div className="card-body  ">
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

                    {/* <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="mb-0">Total QEC Records: {filteredQEC.length}</h6>
                        <Link to="/qec/add" className="btn btn-primary btn-sm">
                            Add New QEC
                        </Link>
                    </div> */}

                    <div className="table-responsie  ">
                        <table className="table table-hover ">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Title</th>
                                    <th>Description</th>      
                                    {/* <th>Status</th> */}
                                    <th>Assignments</th>                               
                                    <th>Actions</th>
                                    <th>Assign</th>
                                </tr>
                            </thead>
                            <tbody >
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="7" className="text-center">
                                            Loading QEC data...
                                        </td>
                                    </tr>
                                ) : error ? (
                                    <tr>
                                        <td colSpan="7" className="text-center text-danger">
                                            Error loading QEC data. Please try again.
                                        </td>
                                    </tr>
                                ) : filteredQEC.length > 0 ? (
                                    currentItems.map((qec) => (
                                        <tr key={qec?.id}>
                                            <td>{qec?.id || '-'}</td>
                                            <td>{qec?.name || '-'}</td>
                                            <td>{qec?.title || '-'}</td>
                                            <td>
                                                {qec?.description 
                                                    ? (qec?.description.length > 30 
                                                        ? `${qec?.description.substring(0, 30)}...` 
                                                        : qec?.description) 
                                                    : '-'}
                                            </td>
                                            {/* <td>
                                                <span className={`badge bg-soft-${qec.status === "assigned" ? "success" : "danger"} text-${qec.status === "assigned" ? "primary" : "danger"}`}>
                                                    {qec.status || "unassigned"}
                                                </span>
                                            </td> */}
                                            
                                            <td>
                                                <button 
                                                    className="btn btn-sm btn-outline-primary" 
                                                    onClick={() => handleViewAssignmentDetails(qec.id)}
                                                    title="View Assignment Details"
                                                >
                                                    <FiCheckSquare className="me-1" /> Assignments
                                                </button>
                                            </td>
                                            <td>
                                                <div className="d-flex gap-2">
                                                    <button 
                                                        className="btn btn-sm btn-outline-success" 
                                                        onClick={() => navigate(`/qec/assign/${qec.id}`)}
                                                        title="View Report"
                                                    >
                                                        Assign
                                                    </button>
                                          
                                                    {/* <button 
                                                        className="btn btn-sm btn-outline-secondary" 
                                                        onClick={() => navigate(`/qec/report/${assignment.survey_id}`)}
                                                        title="View Report"
                                                    >
                                                        Report
                                                    </button> */}


                                                </div>
                                            </td>
                                            <td>
                                                <div className="d-flex gap-2">
                                                    <button 
                                                        className="btn btn-sm btn-outline-primary" 
                                                        onClick={() => handleViewQEC(qec.id)}
                                                        title="View"
                                                    >
                                                        <FiEye />
                                                    </button>
                                                    <button 
                                                        className="btn btn-sm btn-outline-warning" 
                                                        onClick={() => handleEditQEC(qec.id)}
                                                        title="Edit"
                                                    >
                                                        <FiEdit />
                                                    </button>
                                                    <button 
                                            className='btn btn-sm btn-danger'
                                            onClick={() => handleDeleteQEC(qec.id)}
                                            disabled={isDeleting}
                                            >
                                            <FiTrash size={16} />
                                            </button>
                                                    {/* <button 
                                                        className="btn btn-sm btn-outline-info" 
                                                        onClick={() => HandleQecPrint(qec.id)}
                                                        title="Download"
                                                    >
                                                        <FaDownLong />
                                                    </button> */}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center">
                                            No QEC records found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mt-3 gap-3 flex-wrap">
                        <div className="text-muted small">
                            Page {currentPageFromApi} of {totalPages}
                        </div>
                        <div className="d-flex align-items-center gap-2 mx-auto">
                            <button 
                                className="btn btn-outline-primary btn-sm" 
                                disabled={currentPageFromApi === 1} 
                                onClick={() => setCurrentPage(currentPageFromApi - 1)}
                            >
                                Previous
                            </button>
                            <button 
                                className="btn btn-outline-primary btn-sm" 
                                disabled={currentPageFromApi === totalPages} 
                                onClick={() => setCurrentPage(currentPageFromApi + 1)}
                            >
                                Next
                            </button>
                        </div>
                        <div>
                            <select value={perPage} onChange={e => { setPerPage(Number(e.target.value)); setCurrentPage(1); }} className="form-select form-select-sm w-auto d-inline-block">
                                {[10, 20, 50, 100].map(n => <option key={n} value={n}>{n} per page</option>)}
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QECTable;
