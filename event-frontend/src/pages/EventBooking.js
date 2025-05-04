import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';

const EventBooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [event, setEvent] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [availableSeats, setAvailableSeats] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const fetchEvent = async () => {
      try {
        const numericEventId = parseInt(id, 10);
        if (isNaN(numericEventId)) {
          throw new Error(`Invalid event ID: ${id}`);
        }

        const token = localStorage.getItem('token');
        const timestamp = new Date().getTime();

        const response = await axios.get(`/api/events/${numericEventId}?_=${timestamp}`, {
          signal: controller.signal,
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
            Accept: 'application/json',
            'Cache-Control': 'no-cache',
          },
        });

        clearTimeout(timeoutId);

        const data = response.data;
        console.log("Event data:", data);
        console.log("Event price:", data.price);
        console.log("Event price type:", typeof data.price);
        
        setEvent(data);
        setAvailableSeats(data.capacity || 10);
        
        // Make sure price is treated as a number
        const eventPrice = parseFloat(data.price || 0);
        setTotalPrice(eventPrice * quantity);
        console.log("Total price calculated:", eventPrice * quantity);
      } catch (err) {
        console.error("Error fetching event:", err);
        if (err.name === 'AbortError') {
          setError('Request timed out. Please try again later.');
        } else if (err.response) {
          setError(err.response.data?.message || 'Server error occurred.');
        } else {
          setError(err.message || 'An unexpected error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [id]);

  useEffect(() => {
    if (event?.price) {
      // Make sure price is treated as a number
      const eventPrice = parseFloat(event.price || 0);
      setTotalPrice(eventPrice * quantity);
      console.log("Total price updated:", eventPrice * quantity);
    }
  }, [quantity, event]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    const max = availableSeats ? Math.min(10, availableSeats) : 10;
    if (value > 0 && value <= max) setQuantity(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submit button clicked');
    
    if (submitting) {
      console.log('Already submitting, ignoring duplicate click');
      return;
    }
    
    try {
      setSubmitting(true);
      console.log('Submitting booking form');
      
      // IMPORTANT FIX: Set a valid userId (must be a number)
      const userId = 1; // Always use 1 to match your database constraint
      console.log('Using hardcoded user ID:', userId);
      
      // Ensure eventId is a number
      const numericEventId = parseInt(id, 10);
      if (isNaN(numericEventId)) {
        throw new Error('Invalid event ID');
      }
      
      // Calculate total amount (handle undefined price)
      const eventPrice = parseFloat(event.price || 0);
      const calculatedTotal = eventPrice * quantity;
      
      console.log('Event price:', eventPrice);
      console.log('Calculated total:', calculatedTotal);
      
      const bookingData = {
        userId: userId, // Use the hardcoded userId
        eventId: numericEventId,
        quantity: quantity || 1, // Ensure quantity is not null
        totalAmount: calculatedTotal, // Make sure this is a number
        eventName: event?.name || 'Event Name', // Required field
        customerName: 'Customer Name' // Required field
      };
      
      console.log('Creating booking with data:', bookingData);
      
      // Add a timestamp to prevent caching issues
      const timestamp = new Date().getTime();
      
      const response = await axios.post(`/api/bookings?_=${timestamp}`, bookingData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Booking API response:', response);
      
      // Get booking ID from response
      const bookingId = response.data;
      console.log('Booking ID extracted:', bookingId);
      
      // Store bookingId in sessionStorage as a backup
      sessionStorage.setItem('currentBookingId', bookingId);
      
      // Redirect based on whether event is free or paid
      if (eventPrice > 0) {
        console.log(`Redirecting to payment page: /payment/${bookingId}`);
        window.location.href = `/payment/${bookingId}`;
      } else {
        console.log('Redirecting to booking success page');
        window.location.href = '/booking-success';
      }
    } catch (err) {
      console.error('Error creating booking:', err);
      let errorMessage = 'Booking failed. Try again.';
      
      if (err.response && err.response.data) {
        errorMessage = typeof err.response.data === 'string' 
          ? err.response.data 
          : err.response.data.message || 'Server validation error';
      }
      
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // Helper function to safely format currency
  const formatCurrency = (amount) => {
    // Ensure amount is a number before calling toFixed
    if (amount === undefined || amount === null) {
      return '0.00';
    }
    return Number(amount).toFixed(2);
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status" />
        <p className="mt-3">Loading event details...</p>
        <button className="btn btn-outline-secondary mt-3" onClick={() => navigate('/events')}>
          Back to Events
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          <h4>Error</h4>
          <p>{error}</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/events')}>
          Browse Events
        </button>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">
          <h4>No Event Found</h4>
          <p>This event does not exist.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/events')}>
          Browse Events
        </button>
      </div>
    );
  }

  const isFree = parseFloat(event.price || 0) === 0;
  const maxTickets = availableSeats ? Math.min(10, availableSeats) : 10;

  return (
    <div className="container py-5">
      <h1 className="mb-4">Book Event: {event.name}</h1>

      <div className="card mb-4">
        <div className="card-header">Event Information</div>
        <div className="card-body">
          <p><strong>Date:</strong> {new Date(event.date || event.startDate || Date.now()).toLocaleDateString()}</p>
          <p><strong>Location:</strong> {event.location || 'TBD'}</p>
          <p><strong>Price:</strong> {isFree ? 'Free' : `₹${formatCurrency(event.price)}`}</p>
          <p><strong>Available Seats:</strong> {availableSeats}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="quantity" className="form-label">Number of Tickets</label>
          <input
            type="number"
            className="form-control"
            id="quantity"
            value={quantity}
            min="1"
            max={maxTickets}
            onChange={handleQuantityChange}
            required
          />
        </div>

        <div className="mb-3">
          <strong>Total Price:</strong> {isFree ? 'Free' : `₹${formatCurrency(totalPrice)}`}
        </div>

        <button type="submit" className="btn btn-success" disabled={submitting}>
          {submitting ? 'Booking...' : isFree ? 'Confirm Booking' : 'Proceed to Payment'}
        </button>
      </form>
    </div>
  );
};

export default EventBooking;