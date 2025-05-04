// src/pages/Register.js - Add role selection
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authservice';

function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    accountType: 'USER' // Default to regular user
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      
      // Format data for backend - adjust field names to match User model
      const registrationData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: formData.accountType // Make sure this field matches what the backend expects
      };
      
      console.log('Attempting registration with payload:', {
        ...registrationData,
        password: '[REDACTED]'
      });
      
      // Call the register method from authService
      const response = await authService.register(registrationData);
      
      console.log('Registration response:', response);
      
      // Navigate to login page after successful registration
      navigate('/login');
    } catch (err) {
      console.error('Registration error details:', err);
      
      // Detailed error logging
      if (err.response) {
        console.error('Server response data:', err.response.data);
        console.error('Server response status:', err.response.status);
        console.error('Server response headers:', err.response.headers);
        
        // Display user-friendly error message
        if (err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError(`Registration failed with status: ${err.response.status}`);
        }
      } else if (err.request) {
        console.error('No response received:', err.request);
        setError('Server did not respond. Please try again later.');
      } else {
        console.error('Error message:', err.message);
        setError(`Registration failed: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow">
            <div className="card-body p-4">
              <h2 className="card-title text-center mb-4">Create an Account</h2>
              
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="firstName" className="form-label">First Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="lastName" className="form-label">Last Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="accountType" className="form-label">Account Type</label>
                  <select
                    className="form-select"
                    id="accountType"
                    name="accountType"
                    value={formData.accountType}
                    onChange={handleChange}
                  >
                    <option value="USER">Regular User (Attendee)</option>
                    <option value="ORGANIZER">Event Organizer</option>
                  </select>
                  <div className="form-text">
                    Choose 'Event Organizer' if you want to create and manage events.
                  </div>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <div className="form-text">
                    Password must be at least 6 characters long.
                  </div>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Creating Account...
                      </>
                    ) : 'Create Account'}
                  </button>
                </div>
                
                <div className="mt-3 text-center">
                  <p>Already have an account? <Link to="/login">Log in</Link></p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;