import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ 
  children, 
  requiresOwner = false,
  requiresCustomer = false 
}) => {
  const { isAuthenticated, isCustomer, isRestaurantOwner, loading } = useAuth();

  if (loading) {
    return null; // or a spinner if you want
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (requiresOwner && !isRestaurantOwner) {
    return <Navigate to="/" replace />;
  }

  if (requiresCustomer && !isCustomer) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;