// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authservice';

// Create the auth context
export const AuthContext = createContext();

// Create the auth provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Load user from localStorage on initial render
  useEffect(() => {
    const loadUser = () => {
      try {
        const user = authService.getCurrentUser();
        if (user) {
          console.log('User loaded from localStorage:', user);
          
          // Check if the user has a valid ID or auth header
          if ((!user.id && !user.userId && !user._id) && !user.authHeader) {
            console.error('User data missing ID and authHeader:', user);
            return;
          }
          
          setCurrentUser(user);
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadUser();
  }, []);
  
  // Login method that uses authService
  const login = async (emailOrCredentials, password) => {
    try {
      // Check if first parameter is an object or email string
      let email, pwd;
      
      if (typeof emailOrCredentials === 'object') {
        // It's a credentials object
        email = emailOrCredentials.email;
        pwd = emailOrCredentials.password;
      } else {
        // It's separate email and password parameters
        email = emailOrCredentials;
        pwd = password;
      }
      
      // Call the authService login method
      const userData = await authService.login(email, pwd);
      
      // Update context state
      setCurrentUser(userData);
      
      return userData;
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };
  
  // Register method that uses authService
  const register = async (userData) => {
    return authService.register(userData);
  };
  
  // Logout method that uses authService
  const logout = () => {
    authService.logout();
    setCurrentUser(null);
  };
  
  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!currentUser;
  };
  
  // Get user ID with fallbacks
  const getUserId = () => {
    if (!currentUser) return null;
    return currentUser.id || currentUser.userId || currentUser._id;
  };
  
  // Get auth header for API requests
  const getAuthHeader = () => {
    if (!currentUser) return {};
    return currentUser.authHeader ? { 'Authorization': currentUser.authHeader } : {};
  };
  
  // Context value
  const value = {
    currentUser,
    login,
    register,
    logout,
    isAuthenticated,
    getUserId,
    getAuthHeader,
    loading
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};