import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getStoredUser, getStoredToken } from '../utils/jwt';

/**
 * Usage:
 * <ProtectedRoute roles={["garden_expert"]}><Dashboard /></ProtectedRoute>
 * If roles omitted: only requires authentication.
 */
export default function ProtectedRoute({ roles, children }) {
  const location = useLocation();
  const token = getStoredToken();
  const user = getStoredUser();

  if (!token || !user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // Support user.role.name, user.role, or user.role_name
  const userRole = user.role?.name || user.role || user.role_name;
  if (roles && roles.length && !roles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
