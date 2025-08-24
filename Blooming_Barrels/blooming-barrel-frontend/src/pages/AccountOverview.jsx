import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCurrentUser } from '../utils/api';
import Navbar from '../components/Navigation/Navbar';
import './AccountOverview.css';

const AccountOverview = () => {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('overview'); // 'overview', 'editProfile', 'changePassword'
  const [form, setForm] = useState({});
  const [originalForm, setOriginalForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Password change state
  const [passwordForm, setPasswordForm] = useState({ 
    old_password: '', 
    new_password: '', 
    confirm_password: '' 
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState('');

  // Fetch user details on component mount
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getCurrentUser();
      
      if (data.success && data.user) {
        setUser(data.user);
        setForm(data.user);
        setOriginalForm(data.user);
      } else if (data.user) {
        setUser(data.user);
        setForm(data.user);
        setOriginalForm(data.user);
      } else {
        setError(data.error || 'Failed to load user data');
      }
    } catch (err) {
      console.error('Error loading user data:', err);
      setError('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle navigation between views
  const handleEditProfile = () => {
    setView('editProfile');
    setError(null);
    setSuccessMessage('');
  };

  const handleChangePassword = () => {
    setView('changePassword');
    setPasswordMsg('');
    setPasswordForm({ old_password: '', new_password: '', confirm_password: '' });
  };

  const handleBackToOverview = () => {
    setView('overview');
    setForm(originalForm); // Reset form to original values
    setError(null);
    setSuccessMessage('');
    setPasswordMsg('');
  };

  // Handle saving profile changes
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMessage('');
    
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: form.first_name,
          last_name: form.last_name,
          phone: form.phone,
          address: form.address,
          date_of_birth: form.date_of_birth
        })
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        const updatedUser = { ...user, ...form };
        setUser(updatedUser);
        setOriginalForm(updatedUser);
        setSuccessMessage('Profile updated successfully!');
        // Stay on edit form to show success message, then redirect after delay
        setTimeout(() => {
          setView('overview');
          setSuccessMessage('');
        }, 2000);
      } else {
        setError(result.error || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Handle password form changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
    if (passwordMsg) setPasswordMsg('');
  };

  // Handle password change submission
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordMsg('');
    
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setPasswordMsg('New passwords do not match');
      setPasswordLoading(false);
      return;
    }
    
    if (passwordForm.new_password.length < 6) {
      setPasswordMsg('New password must be at least 6 characters long');
      setPasswordLoading(false);
      return;
    }
    
    try {
      const response = await fetch('/api/user/password', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          old_password: passwordForm.old_password,
          new_password: passwordForm.new_password
        })
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        setPasswordMsg('Password changed successfully!');
        setPasswordForm({ old_password: '', new_password: '', confirm_password: '' });
        setTimeout(() => {
          setView('overview');
          setPasswordMsg('');
        }, 2000);
      } else {
        setPasswordMsg(result.error || 'Failed to change password');
      }
    } catch (err) {
      console.error('Error changing password:', err);
      setPasswordMsg('Failed to change password. Please try again.');
    } finally {
      setPasswordLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your account information...</p>
      </div>
    );
  }
  
  // Error state
  if (error && !user) {
    return (
      <div className="error-container">
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
        <button onClick={loadUserData} className="btn btn-primary" style={{marginTop: '1rem'}}>
          Try Again
        </button>
      </div>
    );
  }
  
  // No user data state
  if (!user) {
    return (
      <div className="error-container">
        <div className="error-message">No user data available</div>
        <button onClick={loadUserData} className="btn btn-primary" style={{marginTop: '1rem'}}>
          Reload
        </button>
      </div>
    );
  }

  // Render different views based on current state
  const renderOverview = () => (
    <>
  {/* <Navbar /> removed duplicate inside overview */}
      <div className="account-header">
        <h1 className="page-title">Account Overview</h1>
        <p className="page-subtitle">View and manage your account information</p>
      </div>

      <div className="account-content">
        {/* User Details Section */}
        <div className="account-section">
          <div className="section-header">
            <h2 className="section-title">Personal Information</h2>
            <div className="section-divider"></div>
          </div>
          
          <div className="user-details">
            <div className="detail-item">
              <span className="detail-label">First Name:</span>
              <span className="detail-value">{user.first_name || 'Not provided'}</span>
            </div>
            
            <div className="detail-item">
              <span className="detail-label">Last Name:</span>
              <span className="detail-value">{user.last_name || 'Not provided'}</span>
            </div>
            
            <div className="detail-item">
              <span className="detail-label">Email Address:</span>
              <span className="detail-value">{user.email || 'Not provided'}</span>
            </div>
            
            <div className="detail-item">
              <span className="detail-label">Phone Number:</span>
              <span className="detail-value">{user.phone || 'Not provided'}</span>
            </div>
            
            <div className="detail-item">
              <span className="detail-label">Date of Birth:</span>
              <span className="detail-value">
                {user.date_of_birth ? new Date(user.date_of_birth).toLocaleDateString() : 'Not provided'}
              </span>
            </div>
            
            <div className="detail-item">
              <span className="detail-label">Address:</span>
              <span className="detail-value">{user.address || 'Not provided'}</span>
            </div>
          </div>
          
          <div className="overview-actions">
            <button onClick={handleEditProfile} className="btn btn-primary">
              Edit Profile
            </button>
          </div>
        </div>

        {/* Security Section */}
        <div className="account-section">
          <div className="section-header">
            <h2 className="section-title">Security</h2>
            <div className="section-divider"></div>
          </div>
          
          <div className="security-info">
            <p className="security-text">Keep your account secure by regularly updating your password.</p>
          </div>
          
          <div className="overview-actions">
            <button onClick={handleChangePassword} className="btn btn-secondary">
              Change Password
            </button>
          </div>
        </div>

        {/* Dashboard Links Section */}
        <div className="account-section">
          <div className="section-header">
            <h2 className="section-title">Dashboard</h2>
            <div className="section-divider"></div>
          </div>
          <div className="dashboard-links">
            <Link to="/order-history" className="dashboard-link">My Orders</Link>
            <Link to="/wishlist" className="dashboard-link">My Wishlist</Link>
            <Link to="/cart" className="dashboard-link">My Cart</Link>
          </div>
        </div>
      </div>
    </>
  );

  const renderEditProfile = () => (
    <>
      <div className="account-header">
        <h1 className="page-title">Edit Profile</h1>
        <p className="page-subtitle">Update your personal information</p>
      </div>

      <div className="account-content">
        {/* Success Message */}
        {successMessage && (
          <div className="message success">
            <span className="message-icon">✓</span>
            {successMessage}
          </div>
        )}
        
        {/* Error Message */}
        {error && (
          <div className="message error">
            <span className="message-icon">⚠️</span>
            {error}
          </div>
        )}

        <div className="account-section">
          <form onSubmit={handleSaveProfile} className="profile-form">
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input 
                  name="first_name" 
                  type="text"
                  value={form.first_name || ''} 
                  onChange={handleChange} 
                  className="form-input"
                  placeholder="Enter your first name"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input 
                  name="last_name" 
                  type="text"
                  value={form.last_name || ''} 
                  onChange={handleChange} 
                  className="form-input"
                  placeholder="Enter your last name"
                />
              </div>
              
              <div className="form-group full-width">
                <label className="form-label">Email Address</label>
                <input 
                  name="email" 
                  type="email"
                  value={form.email || ''} 
                  disabled 
                  readOnly
                  className="form-input readonly"
                />
                <small className="form-hint">Email cannot be changed</small>
              </div>
              
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input 
                  name="phone" 
                  type="tel"
                  value={form.phone || ''} 
                  onChange={handleChange} 
                  className="form-input"
                  placeholder="Enter your phone number"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Date of Birth</label>
                <input 
                  name="date_of_birth" 
                  type="date" 
                  value={form.date_of_birth || ''} 
                  onChange={handleChange} 
                  className="form-input"
                />
              </div>
              
              <div className="form-group full-width">
                <label className="form-label">Address</label>
                <input 
                  name="address" 
                  type="text"
                  value={form.address || ''} 
                  onChange={handleChange} 
                  className="form-input"
                  placeholder="Enter your address"
                />
              </div>
            </div>
            
            <div className="form-actions">
              <button 
                type="submit" 
                disabled={saving} 
                className="btn btn-primary"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button 
                type="button" 
                onClick={handleBackToOverview} 
                disabled={saving}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );

  const renderChangePassword = () => (
    <>
      <div className="account-header">
        <h1 className="page-title">Change Password</h1>
        <p className="page-subtitle">Update your account password</p>
      </div>

      <div className="account-content">
        <div className="account-section">
          <form onSubmit={handlePasswordSubmit} className="password-form">
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input 
                name="old_password" 
                type="password" 
                value={passwordForm.old_password} 
                onChange={handlePasswordChange} 
                required
                className="form-input"
                placeholder="Enter your current password"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input 
                name="new_password" 
                type="password" 
                value={passwordForm.new_password} 
                onChange={handlePasswordChange} 
                required
                minLength="6"
                className="form-input"
                placeholder="Enter your new password"
              />
              <small className="form-hint">Password must be at least 6 characters long</small>
            </div>
            
            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input 
                name="confirm_password" 
                type="password" 
                value={passwordForm.confirm_password} 
                onChange={handlePasswordChange} 
                required
                className="form-input"
                placeholder="Confirm your new password"
              />
            </div>
            
            <div className="form-actions">
              <button 
                type="submit" 
                disabled={passwordLoading}
                className="btn btn-primary"
              >
                {passwordLoading ? 'Changing...' : 'Change Password'}
              </button>
              <button 
                type="button" 
                onClick={handleBackToOverview} 
                disabled={passwordLoading}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
            
            {passwordMsg && (
              <div className={`message ${passwordMsg.includes('success') ? 'success' : 'error'}`}>
                <span className="message-icon">
                  {passwordMsg.includes('success') ? '✓' : '⚠️'}
                </span>
                {passwordMsg}
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );

  return (
    <>
      <Navbar />
      <div className="account-bg-image">
        <div className="account-overview">
          {view === 'overview' && renderOverview()}
          {view === 'editProfile' && renderEditProfile()}
          {view === 'changePassword' && renderChangePassword()}
        </div>
      </div>
    </>
  );
};

export default AccountOverview;