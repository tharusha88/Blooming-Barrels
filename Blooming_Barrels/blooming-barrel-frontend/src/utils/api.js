// Define the base URL for your API
const API_BASE_URL = 'http://localhost:8000';  // Replace with your actual backend URL (or use environment variable for production)

// General API Helper function
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    credentials: 'include', // Important for session cookies
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// **Cart API** - Generalized function for adding/updating/removing from cart
const cartApi = async (method, product_id, quantity = 1) => {
  try {
    const data = await apiCall(`/api/cart${product_id ? `/${product_id}` : ''}`, {
      method,
      body: JSON.stringify({ product_id, quantity }),
    });
    return { success: true, cart: data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Cart API calls (using the generalized cartApi function)
export const getCart = async () => {
  try {
    const data = await apiCall('/api/cart');
    // If backend returns {items: [...]}, wrap as { cart: { items: [...] } }
    if (Array.isArray(data.items)) {
      return { success: true, cart: { items: data.items } };
    }
    // If backend returns array directly
    if (Array.isArray(data)) {
      return { success: true, cart: data };
    }
    // Fallback: return as-is
    return { success: true, cart: data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const addToCart = async (product_id, quantity = 1) => {
  return await cartApi('POST', product_id, quantity);
};

export const updateCartItem = async (product_id, quantity) => {
  return await cartApi('PUT', product_id, quantity);
};

export const removeFromCart = async (product_id) => {
  return await cartApi('DELETE', product_id);
};

// **User API** - For updating own profile
export const updateOwnProfile = async (userData) => {
  try {
    const data = await apiCall('/api/user', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
    return { success: true, user: data.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// **Authentication API**
export const login = async (email, password) => {
  try {
    const data = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    const user = data.user;
    if (user) {
      if (typeof user.role === 'string') {
        user.role = {
          id: user.role_id || 2,
          name: user.role.toLowerCase().replace(/\s+/g, '_'),
        };
      }
      user.role_name = user.role_name || (user.role ? user.role.name : 'user');
    }

    return {
      success: true,
      user: user,
      token: data.token || 'session-token',
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to login. Please check your credentials.',
    };
  }
};

// Register User
export const register = async (userData) => {
  try {
    const data = await apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return { success: true, user: data.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Logout
export const logout = async () => {
  try {
    await apiCall('/auth/logout', { method: 'POST' });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get Current User Data (for Profile)
export const getCurrentUser = async () => {
  try {
    const data = await apiCall('/api/user');
    return { success: true, user: data.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Change Password
export const changePassword = async (old_password, new_password) => {
  try {
    const data = await apiCall('/api/user/password', {
      method: 'PUT',
      body: JSON.stringify({ old_password, new_password }),
    });
    return { success: data.success };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Admin APIs for User and Role Management
export const getAdminStats = async () => {
  try {
    const data = await apiCall('/admin/stats');
    return { success: true, data: data.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Fetch Users
export const getUsers = async (options = {}) => {
  try {
    const { page = 1, perPage = 10, search = '' } = options;
    const params = new URLSearchParams({ page: page.toString(), limit: perPage.toString(), search });
    const data = await apiCall(`/admin/users?${params}`);
    return { success: true, data: data.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Update User (Admin)
export const updateUser = async (userId, userData) => {
  try {
    const data = await apiCall(`/admin/user/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
    return { success: true, data: data.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Delete User (Admin)
export const deleteUser = async (userId) => {
  try {
    const data = await apiCall(`/admin/user/${userId}`, { method: 'DELETE' });
    return { success: true, data: data.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Role Management API
export const getRoles = async () => {
  try {
    const data = await apiCall('/admin/roles');
    return { success: true, data: data.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Create Role (Admin)
export const createRole = async (roleData) => {
  try {
    const data = await apiCall('/admin/roles', {
      method: 'POST',
      body: JSON.stringify(roleData),
    });
    return { success: true, data: data.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Update Role (Admin)
export const updateRole = async (roleId, roleData) => {
  try {
    const data = await apiCall(`/admin/roles/${roleId}`, {
      method: 'PUT',
      body: JSON.stringify(roleData),
    });
    return { success: true, data: data.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Delete Role (Admin)
export const deleteRole = async (roleId) => {
  try {
    const data = await apiCall(`/admin/roles/${roleId}`, { method: 'DELETE' });
    return { success: true, data: data.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

