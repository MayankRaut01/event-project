// src/services/authservice.js
import axios from 'axios';

const API_URL = '/api/auth'; // For auth endpoints
const USER_API_URL = '/api/users'; // For user operations

// Register user - using the correct endpoint
const register = (userData) => {
  console.log('Sending registration request to:', `${USER_API_URL}/register`);
  console.log('With data:', {
    ...userData,
    password: '[REDACTED]'
  });
  
  // Add more detailed logging for API calls
  return axios.post(`${USER_API_URL}/register`, userData, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    console.log('Registration successful. Response:', response.data);
    return response.data;
  })
  .catch(error => {
    console.error('Registration request failed with error:', error);
    
    if (error.response) {
      console.error('Error response:', {
        data: error.response.data,
        status: error.response.status,
        headers: error.response.headers
      });
    }
    
    // Re-throw the error to be handled by the component
    throw error;
  });
};

// Login user with Basic Auth - updated to support email/username
const login = (usernameOrEmail, password) => {
  console.log('Attempting login with username/email:', usernameOrEmail);
  
  // Create Authorization header with Base64 encoded credentials
  const encodedCredentials = btoa(`${usernameOrEmail}:${password}`);
  
  return axios.post(`${API_URL}/login`, {}, {
    headers: {
      'Authorization': `Basic ${encodedCredentials}`,
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    console.log('Login response:', response);
    const userData = response.data;
    
    // Check if user data exists
    if (!userData) {
      console.error('Empty response data from login');
      throw new Error('Invalid response from server');
    }
    
    // Create a user object with the response data
    const formattedUserData = {
      ...userData,
      username: usernameOrEmail,
      // If no ID is provided in the response, use username as ID
      id: userData.id || userData.userId || userData._id || usernameOrEmail,
      // Store the auth header for future API requests
      authHeader: `Basic ${encodedCredentials}`,
      // Ensure role is stored correctly - strip ROLE_ prefix if present
      role: userData.role || 
            (userData.authorities && userData.authorities[0]?.authority?.replace('ROLE_', '')) || 
            'USER'
    };
    
    // Log the full user data for debugging
    console.log('Login successful, user data:', formattedUserData);
    
    // Save the user in localStorage
    localStorage.setItem('user', JSON.stringify(formattedUserData));
    
    return formattedUserData;
  })
  .catch(error => {
    console.error('Login error:', error);
    
    if (error.response) {
      console.error('Server response:', error.response.data);
      console.error('Status code:', error.response.status);
    }
    
    throw error;
  });
};

// Logout user
const logout = () => {
  localStorage.removeItem('user');
};

// Get current user from localStorage
const getCurrentUser = () => {
  try {
    const userJson = localStorage.getItem('user');
    if (!userJson) {
      return null;
    }
    
    const user = JSON.parse(userJson);
    
    // Ensure the user has an ID
    if (!user.id) {
      // If ID is missing but userId or _id exists, use that
      const userId = user.userId || user._id || user.username;
      if (userId) {
        user.id = userId;
        // Update the stored user data
        localStorage.setItem('user', JSON.stringify(user));
      }
    }
    
    // Ensure role is properly formatted (convert from ROLE_XXX if needed)
    if (user.role && user.role.startsWith('ROLE_')) {
      user.role = user.role.replace('ROLE_', '');
      localStorage.setItem('user', JSON.stringify(user));
    }
    
    return user;
  } catch (error) {
    console.error('authService: Error parsing user data from localStorage:', error);
    localStorage.removeItem('user'); // Clear invalid data
    return null;
  }
};

// Validate current user session
const validateSession = () => {
  const user = getCurrentUser();
  
  if (!user) {
    return false;
  }
  
  // Consider a user valid if they have either an ID, username, or authHeader
  if ((!user.id && !user.userId && !user._id && !user.username) && !user.authHeader) {
    console.error('authService: User data incomplete:', user);
    return false;
  }
  
  return true;
};

// Get auth header for API calls
const getAuthHeader = () => {
  const user = getCurrentUser();
  if (!user || !user.authHeader) return {};
  return { 'Authorization': user.authHeader };
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  validateSession,
  getAuthHeader
};

export default authService;