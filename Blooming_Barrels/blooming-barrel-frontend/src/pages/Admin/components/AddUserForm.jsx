import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import './AddUserForm.css';

const AddUserForm = ({ roles, onUserAdded }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    dob: '',
    role_id: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    console.log(`Form field changed - ${name}:`, value);
    if (name === 'role_id') {
      console.log('Selected role ID:', value, 'Type:', typeof value);
      const selectedRole = roles.find(r => r.id.toString() === value);
      console.log('Selected role details:', selectedRole);
    }
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!form.role_id) {
        toast.error('Please select a role');
        setLoading(false);
        return;
      }

      // Prepare user data
      const [firstName, ...lastNameParts] = form.name.split(' ');
      const userData = {
        first_name: firstName || '',
        last_name: lastNameParts.join(' ') || '',
        email: form.email,
        password: form.password,
        phone: form.phone,
        address: form.address,
        dob: form.dob,
        role_id: parseInt(form.role_id, 10) // Convert role_id to number
      };

      console.log('Creating user with data:', userData);

      console.log('Sending user data:', userData); // Debug log

      // Make API call to register user
      const response = await fetch('http://localhost/backend/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
        credentials: 'include' // Important for sessions/cookies
      });

      const data = await response.json();
      console.log('Response data:', data); // Debug log
      
      if (response.ok) {
        toast.success('User added successfully!');
        setForm({ name: '', email: '', password: '', phone: '', address: '', dob: '', role_id: '' });
        if (onUserAdded) onUserAdded(data.user);
      } else {
        throw new Error(data.error || 'Failed to add user');
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to add user. Please try again.';
      toast.error(errorMessage);
      console.error('User creation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="add-user-form" onSubmit={handleSubmit}>
      <h3>Add New User</h3>
      
      <div className="form-group">
        <label>Name</label>
        <input name="name" value={form.name} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input name="password" type="password" value={form.password} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Phone</label>
        <input name="phone" value={form.phone} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Address</label>
        <input name="address" value={form.address} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Date of Birth</label>
        <input name="dob" type="date" value={form.dob} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>User Role</label>
        {console.log('Available roles:', roles)}
        <select 
          name="role_id" 
          value={form.role_id} 
          onChange={handleChange} 
          required
        >
          <option value="">Select Role</option>
          {roles && roles.length > 0 ? (
            roles.map(role => (
              <option key={role.id} value={role.id.toString()}>
                {role.name}
              </option>
            ))
          ) : (
            <option value="" disabled>Loading roles...</option>
          )}
        </select>
        {roles && roles.length === 0 && (
          <small style={{color: '#dc3545'}}>No roles available. Please create roles first.</small>
        )}
      </div>
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Adding...' : 'Add User'}
      </button>
    </form>
  );
};

export default AddUserForm;
