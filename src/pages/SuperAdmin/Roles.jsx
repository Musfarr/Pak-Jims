import React, { useState, useEffect } from 'react';
import { GetApi } from '../../utils/Api/ApiServices';
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

  return (
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
                          <td>
                            <small>{getPermissionsString(role.modules)}</small>
                          </td>
                          <td>
                            <button className="btn btn-sm btn-warning">
                              Edit
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
  );
};

export default Roles;
