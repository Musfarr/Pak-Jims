import React, { useState, useEffect } from 'react';
import { GetApi, PostApi, DeleteApi } from '../../utils/Api/ApiServices';
import { toast } from 'react-toastify';

const Modules = () => {
  const [modules, setModules] = useState([]);
  const [moduleName, setModuleName] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch all modules
  const fetchModules = async () => {
    try {
      setLoading(true);
      const response = await GetApi('modules');
      if (response.status) {
        setModules(response.data);
      }
    } catch (error) {
      toast.error('Failed to fetch modules');
    } finally {
      setLoading(false);
    }
  };

  // Create new module
  const handleCreateModule = async (e) => {
    e.preventDefault();
    if (!moduleName.trim()) {
      toast.error('Module name is required');
      return;
    }

    try {
      const response = await PostApi('modules', { name: moduleName });
      if (response.status) {
        toast.success('Module created successfully');
        setModuleName('');
        fetchModules();
      }
    } catch (error) {
      toast.error('Failed to create module');
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  // Delete module handler
  const handleDeleteModule = async (id) => {
    if (!window.confirm('Are you sure you want to delete this module?')) return;
    try {
      const response = await DeleteApi(`modules/${id}`);
      if (response.status) {
        toast.success('Module deleted successfully');
        fetchModules();
      } else {
        toast.error(response.message || 'Failed to delete module');
      }
    } catch (error) {
      toast.error('Failed to delete module');
    }
  };

  return (
    <div className='main-content'>
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Modules Management</h4>
            </div>
            <div className="card-body ">
              {/* Create Module Form */}
              <div className="row mb-4">
                <div className="col-md-6">
                  <form onSubmit={handleCreateModule}>
                    <div className="form-group">
                      <label>Module Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={moduleName}
                        onChange={(e) => setModuleName(e.target.value)}
                        placeholder="Enter module name"
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-primary mt-2">
                      Create Module
                    </button>
                  </form>
                </div>
              </div>

              {/* Modules Table */}
              <div className="table-responsive ">
                <table className="table table-striped ">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Module Name</th>
                      <th>Created At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="3" className="text-center">
                          Loading...
                        </td>
                      </tr>
                    ) : modules.length > 0 ? (
                      modules.map((module) => (
                        <tr key={module.id}>
                          <td>{module.id}</td>
                          <td>{module.name}</td>
                          <td>{new Date(module.created_at).toLocaleDateString()}</td>
                          <td>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDeleteModule(module.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center">
                          No modules found
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

export default Modules;
