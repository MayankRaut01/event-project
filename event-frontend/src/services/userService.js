// src/services/userService.js
import axios from 'axios';
import authService from './authservice';

const BASE_URL = 'http://localhost:8080';
const API_URL = `${BASE_URL}/api`;

// Get current user profile data with improved error handling
const getUserProfile = () => {
  const user = authService.getCurrentUser();
  
  if (!user) {
    console.error('getUserProfile: No authenticated user found');
    return Promise.reject('No authenticated user');
  }
  
  console.log('Fetching user profile for user ID:', user.id);
  
  return axios.get(`${API_URL}/users/profile`, {
    headers: {
      'Authorization': user.authHeader
    }
  })
  .then(response => {
    console.log('User profile fetched successfully:', response.data);
    return response.data;
  })
  .catch(error => {
    console.error('Error fetching user profile:', error);
    if (error.response) {
      console.error('Server response:', error.response.data);
      console.error('Status code:', error.response.status);
    }
    throw error;
  });
};

// Update user profile with role handling
const updateUserProfile = (profileData) => {
  const user = authService.getCurrentUser();
  
  if (!user) {
    console.error('updateUserProfile: No authenticated user found');
    return Promise.reject('No authenticated user');
  }
  
  console.log('Updating profile for user:', user.id);
  console.log('Update data:', { ...profileData, password: profileData.password ? '[REDACTED]' : undefined });
  
  // Ensure role is preserved if not explicitly changed
  const updatedData = {
    ...profileData,
    role: profileData.role || user.role
  };
  
  return axios.put(`${API_URL}/users/profile`, updatedData, {
    headers: {
      'Authorization': user.authHeader,
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    console.log('Profile updated successfully:', response.data);
    
    // Update localStorage with new profile data
    const updatedUser = {
      ...user,
      ...response.data,
      // Preserve role and auth information
      role: response.data.role || user.role,
      authHeader: user.authHeader
    };
    
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    return response.data;
  })
  .catch(error => {
    console.error('Error updating profile:', error);
    if (error.response) {
      console.error('Server response:', error.response.data);
      console.error('Status code:', error.response.status);
    }
    throw error;
  });
};

// Change password with improved security handling
const changePassword = (newPassword, currentPassword) => {
  const user = authService.getCurrentUser();
  
  if (!user) {
    console.error('changePassword: No authenticated user found');
    return Promise.reject('No authenticated user');
  }
  
  console.log('Attempting to change password for user:', user.id);
  
  return axios.post(`${API_URL}/users/change-password`, {
    currentPassword, // Add current password for verification
    newPassword
  }, {
    headers: {
      'Authorization': user.authHeader,
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    console.log('Password changed successfully');
    return response.data;
  })
  .catch(error => {
    console.error('Error changing password:', error);
    if (error.response) {
      console.error('Server response:', error.response.data);
      console.error('Status code:', error.response.status);
    }
    throw error;
  });
};

// Get user by ID - Admin only function
const getUserById = (userId) => {
  const currentUser = authService.getCurrentUser();
  
  if (!currentUser) {
    console.error('getUserById: No authenticated user found');
    return Promise.reject('No authenticated user');
  }
  
  // Check if user has admin role
  if (currentUser.role !== 'ADMIN') {
    console.error('getUserById: Access denied - Admin role required');
    return Promise.reject('Access denied - Admin privileges required');
  }
  
  console.log(`Fetching user with ID: ${userId}`);
  
  return axios.get(`${API_URL}/users/${userId}`, {
    headers: {
      'Authorization': currentUser.authHeader
    }
  })
  .then(response => {
    console.log('User fetched successfully:', response.data);
    return response.data;
  })
  .catch(error => {
    console.error(`Error fetching user with ID ${userId}:`, error);
    if (error.response) {
      console.error('Server response:', error.response.data);
      console.error('Status code:', error.response.status);
    }
    throw error;
  });
};

// Get all users - Admin only function
const getAllUsers = () => {
  const currentUser = authService.getCurrentUser();
  
  if (!currentUser) {
    console.error('getAllUsers: No authenticated user found');
    return Promise.reject('No authenticated user');
  }
  
  // Check if user has admin role
  if (currentUser.role !== 'ADMIN') {
    console.error('getAllUsers: Access denied - Admin role required');
    return Promise.reject('Access denied - Admin privileges required');
  }
  
  console.log('Fetching all users');
  
  return axios.get(`${API_URL}/users`, {
    headers: {
      'Authorization': currentUser.authHeader
    }
  })
  .then(response => {
    console.log('All users fetched successfully:', response.data);
    return response.data;
  })
  .catch(error => {
    console.error('Error fetching all users:', error);
    if (error.response) {
      console.error('Server response:', error.response.data);
      console.error('Status code:', error.response.status);
    }
    throw error;
  });
};

// Update user role - Admin only function
const updateUserRole = (userId, newRole) => {
  const currentUser = authService.getCurrentUser();
  
  if (!currentUser) {
    console.error('updateUserRole: No authenticated user found');
    return Promise.reject('No authenticated user');
  }
  
  // Check if user has admin role
  if (currentUser.role !== 'ADMIN') {
    console.error('updateUserRole: Access denied - Admin role required');
    return Promise.reject('Access denied - Admin privileges required');
  }
  
  // Validate role
  const validRoles = ['USER', 'ORGANIZER', 'ADMIN'];
  if (!validRoles.includes(newRole)) {
    console.error(`Invalid role: ${newRole}`);
    return Promise.reject(`Invalid role: ${newRole}. Must be one of: ${validRoles.join(', ')}`);
  }
  
  console.log(`Updating user ${userId} role to ${newRole}`);
  
  return axios.put(`${API_URL}/users/${userId}/role`, { role: newRole }, {
    headers: {
      'Authorization': currentUser.authHeader,
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    console.log('User role updated successfully:', response.data);
    return response.data;
  })
  .catch(error => {
    console.error(`Error updating role for user ${userId}:`, error);
    if (error.response) {
      console.error('Server response:', error.response.data);
      console.error('Status code:', error.response.status);
    }
    throw error;
  });
};

const userService = {
  getUserProfile,
  updateUserProfile,
  changePassword,
  getUserById,
  getAllUsers,
  updateUserRole
};

export default userService;