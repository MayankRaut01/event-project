import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authservice';
import { AuthContext } from '../contexts/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setCurrentUser } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    console.log('Login attempt with email:', email);

    try {
      const userData = await authService.login(email, password);
      console.log('Login successful, user data:', userData);
      
      // Update auth context if available
      if (setCurrentUser) {
        console.log('Updating AuthContext with user data');
        setCurrentUser(userData);
      }
      
      // Force page reload to update the AuthContext from localStorage
      console.log('Navigating to home page with window.location.href');
      window.location.href = '/';
    } catch (err) {
      console.error('Login error:', err);
      
      // More detailed error handling
      if (err.response) {
        console.error('Server response data:', err.response.data);
        console.error('Server response status:', err.response.status);
        
        if (err.response.status === 401) {
          setError('Invalid username or password. Please try again.');
        } else {
          setError(`Server error: ${err.response.data.message || 'Unknown error'}`);
        }
      } else if (err.request) {
        console.error('Request was made but no response received');
        setError('No response from server. Please try again later.');
      } else {
        setError(`Error: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow">
            <div className="card-body p-4">
              <h2 className="text-center mb-4">Log In</h2>
              
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Username or Email</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="email"
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    id="password"
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary w-100 py-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Logging in...
                    </>
                  ) : 'Log In'}
                </button>
              </form>
              
              <p className="text-center mt-3">
                Don't have an account? <Link to="/register">Register here</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;