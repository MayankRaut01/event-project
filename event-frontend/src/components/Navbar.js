// src/components/Navbar.js
import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

function Navbar() {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Add debugging to check user data on component mount
  useEffect(() => {
    if (currentUser) {
      console.log('Navbar: User is logged in:', currentUser);
      console.log('Navbar: User ID exists:', !!currentUser.id);
    } else {
      console.log('Navbar: No user is logged in');
      
      // Check if there's data in localStorage but not in context
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        console.log('Navbar: User data found in localStorage but not in AuthContext');
        try {
          const userData = JSON.parse(storedUser);
          console.log('Navbar: Stored user data:', userData);
          console.log('Navbar: Stored user ID exists:', !!userData.id);
        } catch (e) {
          console.error('Navbar: Error parsing stored user data:', e);
        }
      }
    }
  }, [currentUser]);
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  // Force a refresh of user data from localStorage
  const refreshUserData = () => {
    // This will reload the page and force a refresh of the AuthContext
    window.location.reload();
  };
  
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          EventMaster
        </Link>
        
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/events">Events</Link>
            </li>
            {currentUser && currentUser.role === 'ORGANIZER' && (
              <li className="nav-item">
                <Link className="nav-link" to="/events/create">Create Event</Link>
              </li>
            )}
            {currentUser && currentUser.role === 'ADMIN' && (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#/"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Admin
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <Link className="dropdown-item" to="/admin/categories">
                      Manage Categories
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/admin/users">
                      Manage Users
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/admin/events">
                      Manage Events
                    </Link>
                  </li>
                </ul>
              </li>
            )}
          </ul>
          
          <ul className="navbar-nav">
            {currentUser ? (
              <>
                {/* Debug section - only show in development */}
                {process.env.NODE_ENV === 'development' && (
                  <li className="nav-item">
                    <button 
                      className="nav-link text-warning border-0 bg-transparent"
                      onClick={refreshUserData}
                    >
                      <i className="bi bi-arrow-clockwise me-1"></i>
                      Refresh
                    </button>
                  </li>
                )}
                
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#/"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {currentUser.firstName || currentUser.email || 'User'}
                    {/* Add ID for debugging */}
                    {process.env.NODE_ENV === 'development' && (
                      <span className="text-muted small ms-1">(ID:{currentUser.id})</span>
                    )}
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <Link className="dropdown-item" to="/dashboard">
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/profile">
                        Profile
                      </Link>
                    </li>
                    {/* Add this new line for My Bookings */}
                    <li>
                      <Link className="dropdown-item" to="/my-bookings">
                        My Bookings
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button className="dropdown-item" onClick={handleLogout}>
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;