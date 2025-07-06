import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GetApi, DeleteApi } from '@/utils/Api/ApiServices';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { FiPlus, FiTrash2, FiTrash, FiEdit } from 'react-icons/fi';

const MySwal = withReactContent(Swal);

const TemplatesList = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await GetApi('templates');
      if (response.status) {
        setTemplates(response.data);
      } else {
        setError(response.message || 'Failed to fetch templates');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleDelete = async (id) => {
    const result = await MySwal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const response = await DeleteApi(`templates/${id}`);
        if (response.status) {
          await MySwal.fire(
            'Deleted!',
            'Template has been deleted.',
            'success'
          );
          fetchTemplates();
        } else {
          throw new Error(response.message || 'Failed to delete template');
        }
      } catch (err) {
        MySwal.fire('Error!', err.message, 'error');
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="main-content">
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className=" mb-3 page-title-box d-flex align-items-center justify-content-between">
            <h4 className="mb-0">Templates</h4>
            <div>
              <Link to="/templates/add" className="btn btn-primary">
                <i className="fas fa-plus me-2"></i>Add Template
              </Link>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover table-centered table-nowrap mb-0">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {templates.length > 0 ? (
                      templates.map((template) => (
                        <tr key={template.id}>
                          <td>{template.id}</td>
                          <td>{template.name}</td>
                          <td>
                            <div className="d-flex gap-2">
                              {/* <Link
                                to={`/templates/edit/${template.id}`}
                                className="btn btn-sm btn-outline-primary"
                              >
                                <FiEdit />
                              </Link> */}
                              <button 
                                className='btn btn-sm btn-danger'
                                onClick={() => handleDelete(template.id)}
                                >
                                <FiTrash size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center">
                          No templates found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default TemplatesList;
