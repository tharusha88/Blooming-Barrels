// API Configuration
const API_BASE_URL = 'http://localhost:8000';

// Debug test function - remove after testing
export const testDatabaseSetup = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/test_api_simple.php`);
    const data = await response.json();
    console.log('🔍 Database Setup Test:', data);
    return data;
  } catch (error) {
    console.error('❌ Database test failed:', error);
    return { success: false, error: error.message };
  }
};

// API Helper function
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

// Authentication API
export const login = async (email, password) => {
  try {
    const data = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    // Ensure consistent role format
    const user = data.user;
    if (user) {
      // If role is a string, convert it to the expected format
      if (typeof user.role === 'string') {
        user.role = {
          id: user.role_id || 2, // Default to regular user role if not specified
          name: user.role.toLowerCase().replace(/\s+/g, '_')
        };
      }
      // Ensure role_name is set
      user.role_name = user.role_name || (user.role ? user.role.name : 'user');
    }
    
    return { 
      success: true, 
      user: user,
      token: data.token || 'session-token' // For compatibility
    };
  } catch (error) {
    console.error('Login error:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to login. Please check your credentials.'
    };
  }
};

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

export const logout = async () => {
  try {
    await apiCall('/auth/logout', { method: 'POST' });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getCurrentUser = async () => {
  try {
    const data = await apiCall('/api/user');
    return { success: true, user: data.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Mock data for components that haven't been connected yet
export const mockStats = {
  totalUsers: 10,
  totalProducts: 5,
  totalOrders: 2,
  totalWishlistItems: 3
};

export const mockUsers = [
  { id: 1, name: 'Test User', email: 'test@example.com', role: 'admin' },
  { id: 2, name: 'Jane Doe', email: 'jane@example.com', role: 'user' }
];

export const mockProducts = [
  { id: 1, name: 'Sample Product', price: 10 },
  { id: 2, name: 'Another Product', price: 20 }
];

// Legacy mock login function for backward compatibility
export const mockLogin = (email, password) => {
  if (email === 'test@example.com' && password === 'password123') {
    return { success: true, token: 'mock-token', user: mockUsers[0] };
  }
  return { success: false, error: 'Invalid credentials' };
};

// Admin API
export const getAdminStats = async () => {
  try {
    const data = await apiCall('/admin/stats');
    return { success: true, data: data.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getRecentActivity = async () => {
  try {
    const data = await apiCall('/admin/activity');
    return { success: true, data: data.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// User Management API
export const getUsers = async (options = {}) => {
  try {
    const { page = 1, perPage = 10, search = '' } = options;
    const params = new URLSearchParams({ 
      page: page.toString(), 
      limit: perPage.toString(), 
      search 
    });
    const data = await apiCall(`/admin/users?${params}`);
    return { success: true, data: data.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const createUser = async (userData) => {
  try {
    const data = await apiCall('/admin/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return { success: true, data: data.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

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

export const deleteUser = async (userId) => {
  try {
    const data = await apiCall(`/admin/user/${userId}`, {
      method: 'DELETE',
    });
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


export const getRoleDetails = async (roleId) => {
  try {
    const data = await apiCall(`/admin/roles/${roleId}`);
    return { success: true, data: data.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};


export const getPermissions = async () => {
  try {
    const data = await apiCall('/admin/permissions');
    return { success: true, data: data.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};


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


export const updateRolePermissions = async (roleId, permissions) => {
  try {
    const data = await apiCall(`/admin/role-permissions/${roleId}`, {
      method: 'PUT',
      body: JSON.stringify({ permissions }),
    });
    return { success: true, data: data.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};


export const deleteRole = async (roleId) => {
  try {
    const data = await apiCall(`/admin/roles/${roleId}`, {
      method: 'DELETE',
    });
    return { success: true, data: data.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
