import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/events/${id}`);
        setEvent(response.data);
      } catch (err) {
        console.error('Error fetching event:', err);
        setError('Failed to load event details');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) fetchEvent();
  }, [id]);
  
  const handleBookClick = () => {
    console.log('Booking event', id);
    navigate(`/events/${id}/book`);
  };
  
  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Loading event details...</p>
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
        <Link to="/events" className="btn btn-primary">Browse Events</Link>
      </div>
    );
  }
  
  if (!event) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">
          <h4>Event Not Found</h4>
          <p>The requested event could not be found.</p>
        </div>
        <Link to="/events" className="btn btn-primary">Browse Events</Link>
      </div>
    );
  }
  
  const eventDate = new Date(event.date || event.startDate || Date.now());
  
  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-md-8">
          <h1 className="mb-4">{event.name || event.title}</h1>
          
          {event.imageUrl && (
            <img 
              src={event.imageUrl} 
              alt={event.name || "Event"} 
              className="img-fluid rounded mb-4" 
              style={{maxHeight: "400px", width: "100%", objectFit: "cover"}}
            />
          )}
          
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">About This Event</h5>
              <p className="card-text">{event.description}</p>
            </div>
          </div>
          
          <div className="card mb-4">
            <div className="card-header">
              Details
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <p><i className="bi bi-calendar me-2"></i> <strong>Date:</strong> {eventDate.toLocaleDateString()}</p>
                  {event.time && (
                    <p><i className="bi bi-clock me-2"></i> <strong>Time:</strong> {event.time}</p>
                  )}
                  <p><i className="bi bi-geo-alt me-2"></i> <strong>Location:</strong> {event.location || 'TBD'}</p>
                </div>
                <div className="col-md-6">
                  <p><i className="bi bi-tag me-2"></i> <strong>Price:</strong> {event.price === 0 ? 'Free' : `₹${event.price?.toFixed(2) || '0.00'}`}</p>
                  {event.organizer && (
                    <p><i className="bi bi-person me-2"></i> <strong>Organizer:</strong> {event.organizer.name || 'Unknown'}</p>
                  )}
                  {event.capacity && (
                    <p><i className="bi bi-people me-2"></i> <strong>Capacity:</strong> {event.capacity} seats</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card sticky-top" style={{top: "20px"}}>
            <div className="card-header">
              Registration
            </div>
            <div className="card-body">
              <p className="mb-3">
                <strong>Date:</strong> {eventDate.toLocaleDateString()}
              </p>
              <p className="mb-3">
                <strong>Price:</strong> {event.price === 0 ? 'Free' : `₹${event.price?.toFixed(2) || '0.00'}`}
              </p>
              
              <button 
                className="btn btn-primary btn-lg w-100"
                onClick={handleBookClick}
              >
                Book a Seat
              </button>
              
              <div className="mt-3 text-muted small">
                <p className="mb-1">
                  <i className="bi bi-shield-check me-1"></i> 
                  Secure booking
                </p>
                <p className="mb-1">
                  <i className="bi bi-clock-history me-1"></i>
                  Easy cancellation
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;