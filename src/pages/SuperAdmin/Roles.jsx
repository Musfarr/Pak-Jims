import React, { useState, useEffect } from 'react';
import { GetApi, DeleteApi, PostApi } from '../../utils/Api/ApiServices';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentRole, setCurrentRole] = useState(null);
  const [modules, setModules] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [editedRoleName, setEditedRoleName] = useState('');
  const [selectedModules, setSelectedModules] = useState({});

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
    fetchRoles();
    fetchModules();
    fetchPermissions();
  }, []);

  const getPermissionsString = (modules) => {
    return Object.entries(modules)
      .map(([moduleName, permissions]) => `${moduleName}: ${permissions.join(', ')}`)
      .join('; ');
  };

  const handleEditRole = async (role) => {
    setCurrentRole(role);
    setEditedRoleName(role.name);

    const modulePermissionsMap = {};

    const moduleNameToIdMap = {};
    // Build name->id map from modules endpoint
    modules.forEach(module => {
      moduleNameToIdMap[module.name] = Number(module.id);
    });
    // Also include any modules discovered only via permissions endpoint
    permissions.forEach(p => {
      const name = p.module_name;
      const id = Number(p.module_id);
      if (!(name in moduleNameToIdMap)) {
        moduleNameToIdMap[name] = id;
      }
    });

    Object.entries(role.modules).forEach(([moduleName, permissionNames]) => {
      const moduleId = moduleNameToIdMap[moduleName];
      if (moduleId !== undefined) {
        const modulePermissions = permissions.find(p => Number(p.module_id) === Number(moduleId));
        if (modulePermissions) {
          const permissionIds = [];
          permissionNames.forEach(permName => {
            const permission = modulePermissions.permissions.find(p => p.name.toLowerCase() === permName.toLowerCase());
            if (permission) {
              permissionIds.push(permission.id);
            }
          });
          modulePermissionsMap[Number(moduleId)] = permissionIds;
        }
      }
    });

    setSelectedModules(modulePermissionsMap);

    // Prepare a merged list of modules from both endpoints for rendering
    const modulesForRender = (() => {
      const fromPermissions = permissions.map(p => ({ id: Number(p.module_id), name: p.module_name }));
      const byId = new Map(modules.map(m => [Number(m.id), { id: Number(m.id), name: m.name }]));
      fromPermissions.forEach(pm => {
        if (!byId.has(pm.id)) byId.set(pm.id, pm);
      });
      return Array.from(byId.values());
    })();

    const generateModalContent = () => {
      let content = `
        <div class="form-group mb-3">
          <label>Role Name</label>
          <input 
            type="text" 
            id="edit-role-name" 
            class="form-control" 
            value="${role.name}" 
            placeholder="Enter role name"
          />
        </div>
        <h5 class="mt-4">Select Permissions</h5>
      `;

      if (modulesForRender.length === 0) {
        content += '<p>Loading modules...</p>';
      } else {
        modulesForRender.forEach(module => {
          const modulePermissions = getPermissionsForModule(module.id);
          if (modulePermissions.length > 0) {
            content += `
              <div class="card mb-3">
                <div class="card-header d-flex justify-content-between align-items-center">
                  <h6 class="mb-0">${module.name}</h6>
                  <button 
                    type="button" 
                    class="btn btn-sm btn-outline-primary select-all-btn" 
                    data-module-id="${module.id}"
                  >
                    ${modulePermissionsMap[module.id]?.length === modulePermissions.length ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
                <div class="card-body">
                  <div class="row">
            `;

            modulePermissions.forEach(permission => {
              const isChecked = modulePermissionsMap[module.id]?.includes(permission.id) ? 'checked' : '';
              content += `
                <div class="col-md-3">
                  <div class="form-check">
                    <input 
                      type="checkbox" 
                      class="form-check-input permission-checkbox" 
                      id="edit-permission-${module.id}-${permission.id}" 
                      data-module-id="${module.id}" 
                      data-permission-id="${permission.id}" 
                      ${isChecked}
                    />
                    <label class="form-check-label" for="edit-permission-${module.id}-${permission.id}">
                      ${permission.name}
                    </label>
                  </div>
                </div>
              `;
            });

            content += `
                  </div>
                </div>
              </div>
            `;
          }
        });
      }

      return content;
    };

    const result = await Swal.fire({
      title: `Edit Role: ${role.name}`,
      html: generateModalContent(),
      width: '800px',
      showCancelButton: true,
      confirmButtonText: 'Save Changes',
      cancelButtonText: 'Cancel',
      didOpen: () => {
        document.querySelectorAll('.select-all-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const moduleId = parseInt(btn.getAttribute('data-module-id'));
            const modulePermissions = getPermissionsForModule(moduleId);
            const allPermissionIds = modulePermissions.map(p => p.id);
            const allCheckboxes = document.querySelectorAll(`input[data-module-id="${moduleId}"]`);

            const allSelected = [...allCheckboxes].every(cb => cb.checked);

            allCheckboxes.forEach(cb => {
              cb.checked = !allSelected;
            });

            btn.textContent = !allSelected ? 'Deselect All' : 'Select All';
          });
        });

        document.getElementById('edit-role-name').value = role.name;
      },
      preConfirm: () => {
        const roleName = document.getElementById('edit-role-name').value;
        if (!roleName.trim()) {
          Swal.showValidationMessage('Role name is required');
          return false;
        }

        const selectedModulesMap = {};
        document.querySelectorAll('.permission-checkbox:checked').forEach(checkbox => {
          const moduleId = parseInt(checkbox.getAttribute('data-module-id'));
          const permissionId = parseInt(checkbox.getAttribute('data-permission-id'));

          if (!selectedModulesMap[moduleId]) {
            selectedModulesMap[moduleId] = [];
          }

          selectedModulesMap[moduleId].push(permissionId);
        });

        if (Object.keys(selectedModulesMap).length === 0) {
          Swal.showValidationMessage('Please select at least one permission');
          return false;
        }

        return { roleName, selectedModulesMap };
      }
    });

    if (result.isConfirmed && result.value) {
      const { roleName, selectedModulesMap } = result.value;

      setEditedRoleName(roleName);
      setSelectedModules(selectedModulesMap);

      await handleSaveRole(roleName, selectedModulesMap);
    }
  };

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

  const getPermissionsForModule = (moduleId) => {
    const moduleData = permissions.find(p => Number(p.module_id) === Number(moduleId));
    return moduleData ? moduleData.permissions : [];
  };

  const handleSaveRole = async (roleName, modulesData) => {
    const nameToUse = roleName || editedRoleName;
    const modulesToUse = modulesData || selectedModules;

    if (!nameToUse.trim()) {
      toast.error('Role name is required');
      return;
    }

    if (Object.keys(modulesToUse).length === 0) {
      toast.error('Please select at least one permission');
      return;
    }

    const payload = {
      name: nameToUse,
      module_permissions: Object.entries(modulesToUse).map(([moduleId, permissions]) => ({
        module_id: parseInt(moduleId),
        permissions: permissions
      }))
    };

    try {
      const response = await PostApi(`roles/${currentRole.id}`, payload);
      if (response.status) {
        toast.success('Role updated successfully');
        fetchRoles();
      } else {
        toast.error(response.message || 'Failed to update role');
      }
    } catch (error) {
      toast.error('Failed to update role');
    }
  };

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
                            <td className="text-wrap">
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
                              <button
                                className="btn btn-sm btn-warning me-2"
                                onClick={() => handleEditRole(role)}
                              >
                                <FiEdit className="me-1" /> Edit
                              </button>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDeleteRole(role.id)}
                              >
                                <FiTrash2 className="me-1" /> Delete
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
