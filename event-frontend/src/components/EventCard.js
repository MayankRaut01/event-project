// src/components/EventCard.js
import React from 'react';
import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
  // Basic validation
  if (!event || typeof event !== 'object') {
    return null;
  }
  
  // Extract data with safe fallbacks
  const eventId = event.id ? String(event.id) : 'new';
  const eventName = event.name || 'Unnamed Event';
  const eventDescription = event.description || 'No description available';
  const eventLocation = event.location || 'TBD';
  const startDate = event.startDate;
  const imageUrl = event.imageUrl;
  
  // Format the date
  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'Date TBD';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (e) {
      return 'Date Error';
    }
  };

  const formattedStartDate = formatDate(startDate);

  return (
    <div className="card h-100 shadow-sm">
      {/* Add image with error handling */}
      {imageUrl && (
        <div className="card-img-container" style={{ height: "180px", overflow: "hidden" }}>
          <img 
            src={imageUrl}
            className="card-img-top" 
            alt={eventName}
            style={{ height: "100%", objectFit: "cover", width: "100%" }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none'; // Hide image on error
            }}
          />
        </div>
      )}
      
      <div className="card-body">
        <h5 className="card-title">{eventName}</h5>
        <p className="card-text">
          {eventDescription.length > 100 
            ? `${eventDescription.substring(0, 100)}...` 
            : eventDescription}
        </p>
        
        <div className="mb-3">
          <div className="d-flex align-items-center mb-2">
            <i className="bi bi-calendar-event me-2 text-primary"></i>
            <span>{formattedStartDate}</span>
          </div>
          <div className="d-flex align-items-center">
            <i className="bi bi-geo-alt me-2 text-primary"></i>
            <span>{eventLocation}</span>
          </div>
        </div>
        
        <Link to={`/events/${eventId}`} className="btn btn-primary w-100">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default EventCard;