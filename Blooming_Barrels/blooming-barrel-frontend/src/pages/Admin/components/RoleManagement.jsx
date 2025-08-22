import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getPermissions, createRole, getRoles, createUser } from '../../../utils/api';
import './RoleManagement.css';

const RoleManagement = () => {
  const [groupedPermissions, setGroupedPermissions] = useState({});
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Role form state
  const [roleFormData, setRoleFormData] = useState({
    name: '',
    description: ''
  });
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  // User form state (camelCase keys)
  const [userFormData, setUserFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    roleId: '' // existing role dropdown
  });

  // Load permissions + existing roles
  const loadData = async () => {
    try {
      setLoading(true);
      const [permRes, roleRes] = await Promise.all([getPermissions(), getRoles()]);

      if (permRes.success) {
        setGroupedPermissions(permRes.data.grouped);
      } else {
        toast.error('Failed to load permissions');
      }

      if (roleRes.success) {
        setRoles(roleRes.data);
      } else {
        toast.error('Failed to load roles');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Permission toggle
  const handlePermissionToggle = (permissionId) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userFormData.email.trim() || !userFormData.password.trim()) {
      toast.error('User email and password are required');
      return;
    }

    let roleId = userFormData.roleId;

    try {
      // If creating new role
      if (!roleId && roleFormData.name.trim()) {
        if (!roleFormData.name.trim()) {
          toast.error('Role name is required when creating a new role');
          return;
        }

        const rolePayload = {
          ...roleFormData,
          permissions: selectedPermissions
        };

        const roleRes = await createRole(rolePayload);

        if (!roleRes.success) {
          toast.error(roleRes.error || 'Failed to create role');
          return;
        }

        roleId = roleRes.data.id; // assume backend returns created role id
        toast.success('Role created successfully');
      }

      // Now create user with assigned roleId
      const userPayload = {
  ...userFormData,
  role_id: parseInt(roleId, 10)
};

      const userRes = await createUser(userPayload);

      if (userRes.success) {
        toast.success('User created successfully');
        setRoleFormData({ name: '', description: '' });
        setSelectedPermissions([]);
        setUserFormData({
          email: '',
          password: '',
          firstName: '',
          lastName: '',
          phone: '',
          address: '',
          dateOfBirth: '',
          roleId: ''
        });
      } else {
        toast.error(userRes.error || 'Failed to create user');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error creating user/role');
    }
  };

  if (loading) {
    return <div className="loading">Loading data...</div>;
  }

  return (
    <div className="role-form-container">
      <h2>Create Role & User</h2>
      <form className="role-form" onSubmit={handleSubmit}>

        {/* Role Section */}
        <div className="section">
          <h3>Create New Role (optional)</h3>
          <p className="section-note">Fill this if you want to create a new role with permissions.</p>

          <div className="form-group">
            <label htmlFor="role-name">Role Name</label>
            <input
              id="role-name"
              type="text"
              value={roleFormData.name}
              onChange={(e) =>
                setRoleFormData({ ...roleFormData, name: e.target.value })
              }
              placeholder="Enter role name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="role-description">Description</label>
            <textarea
              id="role-description"
              value={roleFormData.description}
              onChange={(e) =>
                setRoleFormData({ ...roleFormData, description: e.target.value })
              }
              placeholder="Enter role description"
              rows="2"
            />
          </div>

          {roleFormData.name && (
            <div className="permissions-section">
              <h4>Select Permissions</h4>
              {Object.entries(groupedPermissions).map(([category, perms]) => (
                <div key={category} className="permission-category">
                  <h5>{category.replace('_', ' ').toUpperCase()}</h5>
                  <div className="permission-list">
                    {perms.map((permission) => (
                      <label
                        key={permission.id}
                        htmlFor={`perm-${permission.id}`}
                        className="permission-item"
                      >
                        <input
                          id={`perm-${permission.id}`}
                          type="checkbox"
                          checked={selectedPermissions.includes(permission.id)}
                          onChange={() => handlePermissionToggle(permission.id)}
                        />
                        <div className="permission-info">
                          <span className="permission-name">
                            {permission.name.replace('_', ' ')}
                          </span>
                          <span className="permission-description">
                            {permission.description}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User Section */}
        <div className="section">
          <h3>Create New User</h3>
          <p className="section-note">Assign user to a new or existing role.</p>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              id="email"
              type="email"
              value={userFormData.email}
              onChange={(e) =>
                setUserFormData({ ...userFormData, email: e.target.value })
              }
              required
              placeholder="Enter user email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              id="password"
              type="password"
              value={userFormData.password}
              onChange={(e) =>
                setUserFormData({ ...userFormData, password: e.target.value })
              }
              required
              placeholder="Enter password"
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                value={userFormData.firstName}
                onChange={(e) =>
                  setUserFormData({ ...userFormData, firstName: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                value={userFormData.lastName}
                onChange={(e) =>
                  setUserFormData({ ...userFormData, lastName: e.target.value })
                }
              />
            </div>
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              type="text"
              value={userFormData.phone}
              onChange={(e) =>
                setUserFormData({ ...userFormData, phone: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              value={userFormData.address}
              onChange={(e) =>
                setUserFormData({ ...userFormData, address: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Date of Birth</label>
            <input
              type="date"
              value={userFormData.dateOfBirth}
              onChange={(e) =>
                setUserFormData({
                  ...userFormData,
                  dateOfBirth: e.target.value
                })
              }
            />
          </div>

          <div className="form-group">
            <label>Assign Existing Role</label>
            <select
              value={userFormData.roleId}
              onChange={(e) =>
                setUserFormData({ ...userFormData, roleId: e.target.value })
              }
            >
              <option value="">-- Select Role --</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            Create User
          </button>
        </div>
      </form>
    </div>
  );
};

export default RoleManagement;
