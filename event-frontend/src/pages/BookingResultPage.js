// src/pages/BookingResultPage.js
import React from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';

const BookingResultPage = () => {
  const location = useLocation();
  const { success, error, eventId, eventName } = location.state || {};
  
  // If navigated to directly without state, redirect to events
  if (!location.state) {
    return <Navigate to="/events" replace />;
  }
  
  return (
    <div className="container py-5">
      {success ? (
        <div className="text-center">
          <div className="mb-4">
            <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '5rem' }}></i>
          </div>
          
          <h1 className="mb-4">Booking Successful!</h1>
          <p className="lead">Your seat for "{eventName}" has been booked successfully.</p>
          
          <div className="mt-4">
            <Link to="/my-bookings" className="btn btn-primary me-3">
              View My Bookings
            </Link>
            <Link to="/events" className="btn btn-outline-primary">
              Browse More Events
            </Link>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <div className="mb-4">
            <i className="bi bi-exclamation-circle-fill text-danger" style={{ fontSize: '5rem' }}></i>
          </div>
          
          <h1 className="mb-4">Booking Failed</h1>
          <p className="lead">{error || 'Unable to book a seat for this event. Please try again.'}</p>
          
          <div className="alert alert-light">
            <small>Error details may be available in the browser console for developers.</small>
          </div>
          
          <div className="mt-4">
            <Link to={`/events/${eventId}`} className="btn btn-primary me-3">
              Try Again
            </Link>
            <Link to="/events" className="btn btn-outline-primary">
              Browse Other Events
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingResultPage;