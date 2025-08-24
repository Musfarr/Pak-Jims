import React, { useState, useEffect, useMemo } from 'react';
import { GetApi, PostApi } from '../../utils/Api/ApiServices';
import { toast } from 'react-toastify';

const CreateRole = () => {
  const [modules, setModules] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [roleName, setRoleName] = useState('');
  const [selectedModules, setSelectedModules] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchModules = async () => {
    try {
      const response = await GetApi('modules');
      if (response.status) {
        setModules(response.data);
      }
    } catch (error) {
      toast.error('Failed to fetch modules');
    }
  };

  const fetchPermissions = async () => {
    try {
      const response = await GetApi('modules/permissions');
      if (response.status) {
        setPermissions(response.data);
      }
    } catch (error) {
      toast.error('Failed to fetch permissions');
    }
  };

  useEffect(() => {
    fetchModules();
    fetchPermissions();
  }, []);

  // Merge modules from both endpoints to ensure all modules with permissions are rendered
  const modulesForRender = useMemo(() => {
    const permsModules = permissions.map(p => ({ id: Number(p.module_id), name: p.module_name }));
    const mapById = new Map(modules.map(m => [Number(m.id), { ...m, id: Number(m.id) }]));
    permsModules.forEach(pm => {
      if (!mapById.has(pm.id)) {
        mapById.set(pm.id, pm);
      }
    });
    return Array.from(mapById.values());
  }, [modules, permissions]);

  const handlePermissionChange = (moduleId, permissionId, checked) => {
    setSelectedModules(prev => {
      const updated = { ...prev };
      if (!updated[moduleId]) {
        updated[moduleId] = [];
      }
      
      if (checked) {
        updated[moduleId] = [...updated[moduleId], permissionId];
      } else {
        updated[moduleId] = updated[moduleId].filter(id => id !== permissionId);
      }
      
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!roleName.trim()) {
      toast.error('Role name is required');
      return;
    }

    if (Object.keys(selectedModules).length === 0) {
      toast.error('Please select at least one permission');
      return;
    }

    const payload = {
      name: roleName,
      module_permissions: Object.entries(selectedModules).map(([moduleId, permissions]) => ({
        module_id: parseInt(moduleId),
        permissions: permissions
      }))
    };

    try {
      const response = await PostApi('roles', payload);
      if (response.status) {
        toast.success('Role created successfully');
        setRoleName('');
        setSelectedModules({});
      }
    } catch (error) {
      toast.error('Failed to create role');
    }
  };

  const getPermissionsForModule = (moduleId) => {
    const moduleData = permissions.find(p => Number(p.module_id) === Number(moduleId));
    return moduleData ? moduleData.permissions : [];
  };

  // Select/Deselect all permissions for a module
  const handleSelectAll = (moduleId, allPermissionIds, selectAll) => {
    setSelectedModules(prev => {
      const updated = { ...prev };
      if (selectAll) {
        updated[moduleId] = allPermissionIds;
      } else {
        updated[moduleId] = [];
      }
      return updated;
    });
  };

  return (
    <div className="main-content">
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Create New Role</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group mb-3">
                      <label>Role Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={roleName}
                        onChange={(e) => setRoleName(e.target.value)}
                        placeholder="Enter role name"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12">
                    <h5>Select Permissions</h5>
                    {modulesForRender.length === 0 ? (
                      <p>Loading modules...</p>
                    ) : (
                      modulesForRender.map((module) => {
                        const modulePermissions = getPermissionsForModule(module.id);
                        return (
                          <div key={module.id} className="card mb-3">
                            <div className="card-header d-flex justify-content-between align-items-center">
                              <h6 className="mb-0">{module.name}</h6>
                              {modulePermissions.length > 0 && (
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => handleSelectAll(
                                    module.id,
                                    modulePermissions.map(p => p.id),
                                    !selectedModules[module.id] || selectedModules[module.id].length !== modulePermissions.length
                                  )}
                                >
                                  {selectedModules[module.id] && selectedModules[module.id].length === modulePermissions.length ? 'Deselect All' : 'Select All'}
                                </button>
                              )}
                            </div>
                            <div className="card-body">
                              <div className="row">
                                {modulePermissions.map((permission) => (
                                  <div key={permission.id} className="col-md-3">
                                    <div className="form-check">
                                      <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id={`permission-${module.id}-${permission.id}`}
                                        checked={
                                          selectedModules[module.id]?.includes(permission.id) || false
                                        }
                                        onChange={(e) =>
                                          handlePermissionChange(
                                            module.id,
                                            permission.id,
                                            e.target.checked
                                          )
                                        }
                                      />
                                      <label
                                        className="form-check-label"
                                        htmlFor={`permission-${module.id}-${permission.id}`}
                                      >
                                        {permission.name}
                                      </label>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                <button type="submit" className="btn btn-primary float-end">
                  Create Role
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default CreateRole;
