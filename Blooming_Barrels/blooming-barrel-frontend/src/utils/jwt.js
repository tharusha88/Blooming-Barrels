/* ---------- Save ---------- */
export const storeToken = (token, user = null) => {
  localStorage.setItem('blooming_barrels_token', token);

  if (user) {
    localStorage.setItem('blooming_barrels_user', JSON.stringify(user));
  }
};

export const storeUser = (user) => {
  localStorage.setItem('blooming_barrels_user', JSON.stringify(user));
};

/* ---------- Get ---------- */
export const getToken = () => localStorage.getItem('blooming_barrels_token');

export const getStoredToken = () => localStorage.getItem('blooming_barrels_token');

export const getUser = () => {
  const user = localStorage.getItem('blooming_barrels_user');
  return user ? JSON.parse(user) : null;
};

export const getStoredUser = () => {
  const user = localStorage.getItem('blooming_barrels_user');
  return user ? JSON.parse(user) : null;
};

/* ---------- Remove ---------- */
export const removeToken = () => {
  localStorage.removeItem('blooming_barrels_token');
};

export const removeUser = () => {
  localStorage.removeItem('blooming_barrels_user');
};

export const clearAuth = () => {
  removeToken();
  removeUser();
};

// Helper: whether token exists
export const isAuthenticated = () => {
  const t = getToken();
  return !!t;
};

// Helper: headers for authenticated JSON requests
export const getAuthHeaders = () => {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};
