import React, { useState, useEffect } from 'react';
import { GetApi, DeleteApi } from '../../utils/Api/ApiServices';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await GetApi('roles');
      if (response.status) {
        setRoles(response.data);
      }
    } catch (error) {
      toast.error('Failed to fetch roles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const getPermissionsString = (modules) => {
    return Object.entries(modules)
      .map(([moduleName, permissions]) => `${moduleName}: ${permissions.join(', ')}`)
      .join('; ');
  };

  // Delete role handler
  const handleDeleteRole = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this role?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });
    if (!result.isConfirmed) return;
    try {
      const response = await DeleteApi(`roles/${id}`);
      if (response.status) {
        toast.success('Role deleted successfully');
        fetchRoles();
      } else {
        toast.error(response.message || 'Failed to delete role');
      }
    } catch (error) {
      toast.error('Failed to delete role');
    }
  };


  return (
    <div className="main-content">
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Roles Management</h4>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Role Name</th>
                      <th>Modules & Permissions</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="4" className="text-center">
                          Loading...
                        </td>
                      </tr>
                    ) : roles.length > 0 ? (
                      roles.map((role) => (
                        <tr key={role.id}>
                          <td>{role.id}</td>
                          <td>{role.name}</td>
                          <td className="text-wrap ">
                            <p>
                              {getPermissionsString(role.modules)
                                .split('delete;')
                                .filter(line => line.trim() !== '')
                                .map((line, idx, arr) => (
                                  <React.Fragment key={idx}>
                                    {line.trim()}{idx !== arr.length - 1 && 'delete;'}<br />
                                  </React.Fragment>
                                ))}
                            </p>
                          </td>
                          <td>
                            {/* <button className="btn btn-sm btn-warning mr-2">
                              Edit
                            </button> */}
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDeleteRole(role.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center">
                          No roles found
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

export default Roles;
