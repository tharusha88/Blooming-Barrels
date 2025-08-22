
import React, { useEffect, useState } from 'react';
import { getCurrentUser } from '../utils/api';

const AccountOverview = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [passwordForm, setPasswordForm] = useState({ old_password: '', new_password: '', confirm_password: '' });
  const [passwordMsg, setPasswordMsg] = useState('');

  // Fetch user details
  useEffect(() => {
    setLoading(true);
    getCurrentUser()
      .then(data => {
        if (data.success && data.user) {
          setUser(data.user);
          setForm(data.user);
        } else if (data.user) {
          setUser(data.user);
          setForm(data.user);
        } else {
          setError(data.error || 'Failed to load user');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load user');
        setLoading(false);
      });
  }, []);

  // Handle form change
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle save
  const handleSave = e => {
    e.preventDefault();
    setLoading(true);
    fetch(`${API_BASE}/api/user`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setEditMode(false);
          setUser({ ...user, ...form });
        } else {
          setError(data.error || 'Failed to update user');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to update user');
        setLoading(false);
      });
  };

  // Handle password change
  const handlePasswordChange = e => {
    e.preventDefault();
    setPasswordMsg('');
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setPasswordMsg('New passwords do not match');
      return;
    }
    fetch(`${API_BASE}/api/user/password`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        old_password: passwordForm.old_password,
        new_password: passwordForm.new_password
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPasswordMsg('Password changed successfully');
          setPasswordForm({ old_password: '', new_password: '', confirm_password: '' });
        } else {
          setPasswordMsg(data.error || 'Failed to change password');
        }
      })
      .catch(() => setPasswordMsg('Failed to change password'));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!user) return <div>No user data</div>;

  return (
    <div className="account-overview" style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
      <h2>Account Overview</h2>
      <form onSubmit={handleSave} style={{ marginBottom: 32 }}>
        <div>
          <label>First Name:</label>
          <input name="first_name" value={form.first_name || ''} onChange={handleChange} disabled={!editMode} />
        </div>
        <div>
          <label>Last Name:</label>
          <input name="last_name" value={form.last_name || ''} onChange={handleChange} disabled={!editMode} />
        </div>
        <div>
          <label>Email:</label>
          <input name="email" value={form.email || ''} disabled readOnly />
        </div>
        <div>
          <label>Phone:</label>
          <input name="phone" value={form.phone || ''} onChange={handleChange} disabled={!editMode} />
        </div>
        <div>
          <label>Address:</label>
          <input name="address" value={form.address || ''} onChange={handleChange} disabled={!editMode} />
        </div>
        <div>
          <label>Date of Birth:</label>
          <input name="date_of_birth" type="date" value={form.date_of_birth || ''} onChange={handleChange} disabled={!editMode} />
        </div>
        {editMode ? (
          <>
            <button type="submit" disabled={loading}>Save</button>
            <button type="button" onClick={() => setEditMode(false)}>Cancel</button>
          </>
        ) : (
          <button type="button" onClick={() => setEditMode(true)}>Edit</button>
        )}
      </form>

      <h3>Change Password</h3>
      <form onSubmit={handlePasswordChange} style={{ marginBottom: 32 }}>
        <div>
          <label>Old Password:</label>
          <input name="old_password" type="password" value={passwordForm.old_password} onChange={e => setPasswordForm({ ...passwordForm, old_password: e.target.value })} required />
        </div>
        <div>
          <label>New Password:</label>
          <input name="new_password" type="password" value={passwordForm.new_password} onChange={e => setPasswordForm({ ...passwordForm, new_password: e.target.value })} required />
        </div>
        <div>
          <label>Confirm New Password:</label>
          <input name="confirm_password" type="password" value={passwordForm.confirm_password} onChange={e => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })} required />
        </div>
        <button type="submit">Change Password</button>
        {passwordMsg && <div style={{ color: passwordMsg.includes('success') ? 'green' : 'red', marginTop: 8 }}>{passwordMsg}</div>}
      </form>
    </div>
  );
};

export default AccountOverview;
