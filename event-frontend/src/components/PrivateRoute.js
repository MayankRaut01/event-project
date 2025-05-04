// src/components/PrivateRoute.js
import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const PrivateRoute = ({ children, adminOnly = false, organizerOnly = false }) => {
  const { currentUser } = useContext(AuthContext);
  const location = useLocation();
  
  // For debugging
  console.log('PrivateRoute check for path:', location.pathname);
  console.log('User authentication status:', !!currentUser);
  if (currentUser) {
    console.log('User role:', currentUser.role);
  }
  
  // If not logged in, redirect to login
  if (!currentUser) {
    console.log('User not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  // For admin-only routes
  if (adminOnly && currentUser.role !== 'ADMIN') {
    console.log('Admin access required but user is not admin');
    return <Navigate to="/" replace />;
  }
  
  // For organizer-only routes
  if (organizerOnly && 
      currentUser.role !== 'ORGANIZER' && 
      currentUser.role !== 'ADMIN') {
    console.log('Organizer access required but user is not organizer or admin');
    return <Navigate to="/" replace />;
  }
  
  // If all checks pass, render the children
  console.log('Access granted');
  return children;
};

export default PrivateRoute;