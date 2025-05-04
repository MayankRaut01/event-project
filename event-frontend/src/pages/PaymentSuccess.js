// src/pages/PaymentSuccess.js
import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import bookingService from '../services/bookingService';

function PaymentSuccess() {
  const { bookingId: pathBookingId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const queryBookingId = queryParams.get('bookingId');
  
  // Use the bookingId from either path params or query params
  const bookingId = pathBookingId || queryBookingId;
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    // Fetch booking details
    const fetchBooking = async () => {
      if (!bookingId) {
        setError('No booking ID provided');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        console.log("Fetching booking with ID:", bookingId);
        const bookingData = await bookingService.getBookingById(bookingId);
        console.log("Booking data received:", bookingData);
        setBooking(bookingData);
      } catch (err) {
        console.error("Error fetching booking:", err);
        setError('Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBooking();
  }, [bookingId]);
  
  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{error}</div>
        <Link to="/events" className="btn btn-primary">
          Back to Events
        </Link>
      </div>
    );
  }
  
  if (!booking) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">Booking not found</div>
        <Link to="/events" className="btn btn-primary">
          Back to Events
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container py-5 text-center">
      <div className="mb-4">
        <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '5rem' }}></i>
      </div>
      
      <h1 className="mb-4">Payment Successful!</h1>
      <p className="lead">Thank you for your booking. Your tickets have been confirmed.</p>
      
      <div className="card my-4 mx-auto" style={{ maxWidth: '600px' }}>
        <div className="card-body text-start">
          <h5 className="card-title">Booking Details</h5>
          <hr />
          
          <div className="mb-3">
            <strong>Booking ID:</strong> {booking.id}
          </div>
          
          <div className="mb-3">
            <strong>Event:</strong> {booking.eventName}
          </div>
          
          <div className="mb-3">
            <strong>Quantity:</strong> {booking.quantity} ticket(s)
          </div>
          
          <div className="mb-3">
            <strong>Total Paid:</strong> ₹{booking.totalAmount.toFixed(2)}
          </div>
        </div>
      </div>
      
      <p>A confirmation email has been sent to your registered email address.</p>
      
      <div className="mt-4">
        <Link to="/my-bookings" className="btn btn-primary me-3">
          View My Bookings
        </Link>
        <Link to="/events" className="btn btn-outline-primary">
          Browse More Events
        </Link>
      </div>
    </div>
  );
}

export default PaymentSuccess;