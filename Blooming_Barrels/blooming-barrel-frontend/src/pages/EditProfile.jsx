import React, { useState } from 'react';
import { updateUser } from '../utils/api'; // Import API function for updating user data

const EditProfile = ({ user, setUser, setView }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
  });

  const [error, setError] = useState(null);

  // Handle input field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission to update user data
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { success, error } = await updateUser(user.id, formData);
    if (success) {
      setUser(formData);  // Update user data in the parent component (AccountOverview)
      setView('overview');  // Switch back to the Account Overview page
    } else {
      setError(error);  // Handle errors
    }
  };

  return (
    <div className="edit-profile">
      <h2>Edit Profile</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Phone:</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Save Changes</button>
        <button type="button" onClick={() => setView('overview')}>Cancel</button>
      </form>
    </div>
  );
};

export default EditProfile;
