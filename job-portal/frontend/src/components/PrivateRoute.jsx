import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect based on user role
    switch (user.role) {
      case 'jobseeker':
        return <Navigate to="/user" />;
      case 'owner':
        return <Navigate to="/owner" />;
      case 'admin':
        return <Navigate to="/admin" />;
      default:
        return <Navigate to="/" />;
    }
  }

  return children;
};

export default PrivateRoute;