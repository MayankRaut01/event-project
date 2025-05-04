import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import bookingService from '../services/bookingService';
import paymentService from '../services/paymentService';

const Payment = () => {
  const { bookingId: paramBookingId } = useParams();
  const navigate = useNavigate();
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Payment form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  
  // Helper function to safely format currency
  const formatCurrency = (amount) => {
    // Ensure amount is a number before calling toFixed
    if (amount === undefined || amount === null) {
      return '0.00';
    }
    return Number(amount).toFixed(2);
  };
  
  useEffect(() => {
    const fetchBooking = async () => {
      // Try to get bookingId from params, fall back to sessionStorage
      const bookingId = paramBookingId || sessionStorage.getItem('currentBookingId');
      console.log("Using booking ID:", bookingId);
      
      if (!bookingId) {
        setError('No booking ID available.');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        console.log("Fetching booking with ID:", bookingId);
        
        const bookingData = await bookingService.getBookingById(bookingId);
        console.log("Booking data received:", bookingData);
        
        if (!bookingData) {
          setError('Booking not found.');
          setLoading(false);
          return;
        }
        
        // Ensure totalAmount exists and is a number
        if (bookingData.totalAmount === undefined || bookingData.totalAmount === null) {
          bookingData.totalAmount = 0;
        }
        
        setBooking(bookingData);
        
        // Check if payment is needed (free event or already paid)
        if (bookingData.totalAmount === 0 || 
           (bookingData.status === 'CONFIRMED' && bookingData.payment)) {
          // Redirect to success page for free events or already paid bookings
          navigate(`/my-bookings?success=true`);
        }
      } catch (err) {
        console.error("Error fetching booking:", err);
        console.error("Error response data:", err.response?.data);
        console.error("Error status:", err.response?.status);
        setError('Failed to load booking details: ' + (err.message || 'Unknown error'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchBooking();
  }, [paramBookingId, navigate]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!booking) return;
    
    setSubmitting(true);
    setError('');
    
    try {
      // Only send payment method type, not the actual card details for security
      const paymentData = {
        bookingId: booking.id,
        amount: booking.totalAmount || 0,  // Handle undefined with fallback
        paymentMethod: 'CREDIT_CARD',
        // Don't include actual card details in the API request
      };
      
      console.log("Processing payment with data:", paymentData);
      
      // Process payment
      await paymentService.processPayment(paymentData);
      
      // Save the booking ID in session storage for the success page
      sessionStorage.setItem('lastPaidBookingId', booking.id);
      
      // Navigate to success page
      navigate('/payment-success?bookingId=' + booking.id);
    } catch (err) {
      console.error('Payment error:', err);
      setError('Payment failed. Please check your card details and try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading payment details...</p>
      </div>
    );
  }
  
  if (!booking) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          Booking not found or has been removed.
          <Link to="/my-bookings" className="d-block mt-3">Back to My Bookings</Link>
        </div>
      </div>
    );
  }
  
  // Ensure totalAmount is a number for display purposes
  const totalAmount = booking.totalAmount || 0;
  
  return (
    <div className="container py-5">
      <h1 className="mb-4">Complete Payment</h1>
      
      <div className="row">
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">Booking Summary</h5>
            </div>
            <div className="card-body">
              <h5>{booking.eventName}</h5>
              <p>
                <strong>Booking ID:</strong> {booking.id}
              </p>
              <p>
                <strong>Quantity:</strong> {booking.quantity} {booking.quantity > 1 ? 'tickets' : 'ticket'}
              </p>
              <p>
                <strong>Total Amount:</strong> ₹{formatCurrency(totalAmount)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Payment Details</h5>
            </div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger mb-3">{error}</div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="cardName" className="form-label">Cardholder Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="cardName"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="cardNumber" className="form-label">Card Number</label>
                  <input
                    type="text"
                    className="form-control"
                    id="cardNumber"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="XXXX XXXX XXXX XXXX"
                    required
                  />
                </div>
                
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="expiryDate" className="form-label">Expiry Date</label>
                    <input
                      type="text"
                      className="form-control"
                      id="expiryDate"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      placeholder="MM/YY"
                      required
                    />
                  </div>
                  
                  <div className="col-md-6">
                    <label htmlFor="cvv" className="form-label">CVV</label>
                    <input
                      type="text"
                      className="form-control"
                      id="cvv"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      placeholder="XXX"
                      required
                    />
                  </div>
                </div>
                
                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Processing Payment...
                      </>
                    ) : (
                      `Pay ₹${formatCurrency(totalAmount)}`
                    )}
                  </button>
                  
                  <Link to="/my-bookings" className="btn btn-outline-secondary">
                    Cancel
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;