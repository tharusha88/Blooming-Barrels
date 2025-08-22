/**
 * API Configuration - Port Agnostic
 * This will automatically detect the current port and configure endpoints accordingly
 */

// Get current port from window location
const getCurrentPort = () => {
  return window.location.port || (window.location.protocol === 'https:' ? '443' : '80');
};

// Get current host
const getCurrentHost = () => {
  return window.location.hostname;
};

// Get current protocol
const getCurrentProtocol = () => {
  return window.location.protocol;
};

// Base URL for API calls - always relative to current origin
const getBaseURL = () => {
  const protocol = getCurrentProtocol();
  const host = getCurrentHost();
  const port = getCurrentPort();
  
  // For development, always use the current origin
  return `${protocol}//${host}:${port}`;
};

// API Endpoints Configuration
export const API_CONFIG = {
  BASE_URL: getBaseURL(),
  
  // Backend PHP server details (for reference)
  BACKEND_INFO: {
    HOST: 'localhost',
    PORT: 8000,
    PROTOCOL: 'http'
  }
};

export const API_ENDPOINTS = {
  // Authentication endpoints
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout'
  },
  
  // Admin endpoints - backend API (port-agnostic)
  ADMIN: {
    STATS: '/api/admin/stats',
    USERS: '/api/admin/users',
    PRODUCTS: '/api/admin/products',
    ROLES: '/api/admin/roles',
    SYSTEM_STATUS: '/api/admin/system-status',
    RECENT_ACTIVITY: '/api/admin/recent-activity'
  },
  
  // User endpoints
  USERS: {
    LIST: '/api/users',
    PROFILE: '/api/users/profile'
  },
  
  // Product endpoints
  PRODUCTS: {
    LIST: '/api/products',
    CATEGORIES: '/api/products/categories'
  },
  
  // Article endpoints
  ARTICLES: {
    LIST: '/api/articles',
    MINE: '/api/articles/mine'
  }
};

// Helper function to make API calls with automatic port handling
export const apiCall = async (endpoint, options = {}) => {
  const url = endpoint.startsWith('http') ? endpoint : `${API_CONFIG.BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  };
  
  // Add authorization header if token exists
  const token = localStorage.getItem('blooming_barrels_token');
  if (token) {
    defaultOptions.headers.Authorization = `Bearer ${token}`;
  }
  
  const finalOptions = { ...defaultOptions, ...options };
  
  try {
    const response = await fetch(url, finalOptions);
    
    // Handle different response types
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }
    
    if (!response.ok) {
      throw new Error(data.error || data.message || `HTTP error! status: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Debug helper to show current configuration
export const debugAPIConfig = () => {
  console.log('Current API Configuration:', {
    currentPort: getCurrentPort(),
    currentHost: getCurrentHost(),
    currentProtocol: getCurrentProtocol(),
    baseURL: getBaseURL(),
    endpoints: API_ENDPOINTS
  });
};

export default API_CONFIG;
