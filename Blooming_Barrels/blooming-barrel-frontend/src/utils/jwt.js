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
