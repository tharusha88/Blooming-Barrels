import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaUser } from 'react-icons/fa';
import { toast } from 'react-toastify';
import AdminCard from './AdminCard';
import AdminTable from './AdminTable';
import SearchBar from './SearchBar';
import StatCard from './StatCard';
import LoadingSpinner from './LoadingSpinner';
import { getUsers } from '../../../utils/api';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  // role_id removed
    address: '',
    date_of_birth: '',
    password: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
    total: 0,
    totalPages: 0
  });

  // Load users from API
  const loadUsers = async (page = 1, search = '') => {
    try {
      setLoading(true);
      const response = await getUsers({ page, perPage: pagination.perPage, search });
      
      if (response.success) {
        setUsers(response.data.users);
        setPagination({
          page: response.data.pagination.page,
          perPage: response.data.pagination.perPage,
          total: response.data.pagination.total,
          totalPages: response.data.pagination.totalPages
        });
      } else {
        toast.error(response.error || 'Failed to load users');
      }
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers(1, searchTerm);
  }, [searchTerm]);

  const filteredUsers = users; // API already handles search filtering

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await deleteUser(userId);
        if (response.success) {
          toast.success('User deleted successfully');
          loadUsers(pagination.page, searchTerm); // Reload current page
        } else {
          toast.error(response.error || 'Error deleting user');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('Error deleting user');
      }
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormData({
      firstName: user.first_name || '',
      lastName: user.last_name || '',
      email: user.email || '',
  // role_id removed
      address: user.address || '',
      date_of_birth: user.date_of_birth || '',
      password: '' // Don't prefill password for security
    });
  };

  const handleSaveUser = async () => {
    try {
      let response;
      
      if (editingUser) {
        // Update existing user
        const updateData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          // role_id removed
          address: formData.address,
          date_of_birth: formData.date_of_birth,
          ...(formData.password && { password: formData.password }) // Only include password if provided
        };
        
        console.log('Updating user with data:', updateData);
        response = await updateUser(editingUser.id, updateData);
        console.log('Update response:', response);
        
        if (response.success) {
          toast.success('User updated successfully');
        } else {
          toast.error(response.error || 'Error updating user');
          return;
        }
      } else {
        // Create new user
        if (!formData.password) {
          toast.error('Password is required for new users');
          return;
        }
        
        response = await createUser({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          // role_id removed
          address: formData.address,
          date_of_birth: formData.date_of_birth,
          password: formData.password
        });
        
        if (response.success) {
          toast.success('User created successfully');
        } else {
          toast.error(response.error || 'Error creating user');
          return;
        }
      }
      
      // Reset form and reload users
      setEditingUser(null);
      setShowAddModal(false);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
  // role_id removed
        address: '',
        date_of_birth: '',
        password: ''
      });
      
      loadUsers(pagination.page, searchTerm);
      
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error('Error saving user');
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setShowAddModal(false);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
  // role_id removed
      address: '',
      date_of_birth: '',
      password: ''
    });
  };

  if (loading) {
    return <LoadingSpinner message="Loading users..." />;
  }

  const addButton = (
    <button 
      className="admin-btn"
      onClick={() => setShowAddModal(true)}
    >
      <FaPlus /> Add New User
    </button>
  );

  const tableColumns = [
    {
      key: 'id',
      title: 'ID',
      render: (value) => value
    },
    {
      key: 'name',
      title: 'Name',
      render: (value, user) => (
        <div className="user-info">
          <FaUser />
          {`${user.first_name || ''} ${user.last_name || ''}`.trim() || 'N/A'}
        </div>
      )
    },
    {
      key: 'email',
      title: 'Email',
      render: (value) => value
    },
    {
      key: 'created_at',
      title: 'Created',
      render: (value) => new Date(value).toLocaleDateString()
    }
  ];

  return (
    <div className="user-management">
      <AdminCard title="User Management" actions={addButton}>
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search users by name or email..."
        />

        <AdminTable 
          columns={tableColumns}
          data={filteredUsers}
          onEdit={handleEditUser}
          onDelete={(user) => handleDeleteUser(user.id)}
          loading={loading}
        />
        
        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="pagination">
            <button 
              onClick={() => loadUsers(1, searchTerm)}
              disabled={pagination.page === 1}
            >
              First
            </button>
            <button 
              onClick={() => loadUsers(pagination.page - 1, searchTerm)}
              disabled={pagination.page === 1}
            >
              Previous
            </button>
            <span className="pagination-info">
              Page {pagination.page} of {pagination.totalPages} 
              ({pagination.total} total users)
            </span>
            <button 
              onClick={() => loadUsers(pagination.page + 1, searchTerm)}
              disabled={pagination.page === pagination.totalPages}
            >
              Next
            </button>
            <button 
              onClick={() => loadUsers(pagination.totalPages, searchTerm)}
              disabled={pagination.page === pagination.totalPages}
            >
              Last
            </button>
          </div>
        )}
      </AdminCard>

      {/* User Stats */}
      <div className="stats-grid">
        <StatCard
          title="Total Users"
          value={pagination.total}
        />
  {/* StatCards for admin/regular users by role removed */}
      </div>

      {/* Edit/Add User Modal */}
      {(showAddModal || editingUser) && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingUser ? 'Edit User' : 'Add New User'}</h3>
              <button className="close-btn" onClick={handleCancelEdit}>×</button>
            </div>
            <div className="modal-body">
              <form onSubmit={(e) => { e.preventDefault(); handleSaveUser(); }}>
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
                <div className="form-row">
                  {/* Role selection removed */}
                  <div className="form-group">
                    <label>Date of Birth</label>
                    <input
                      type="date"
                      value={formData.date_of_birth}
                      onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    rows="3"
                  />
                </div>
                {!editingUser && (
                  <div className="form-group">
                    <label>Password</label>
                    <input
                      type="password"
                      value={formData.password || ''}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      required={!editingUser}
                      placeholder="Enter password for new user"
                    />
                  </div>
                )}
                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingUser ? 'Update User' : 'Create User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
