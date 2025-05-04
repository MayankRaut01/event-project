// src/pages/Home.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import EventCard from '../components/EventCard';
import eventService from '../services/eventService';

const Home = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all events for comparison
        const events = await eventService.getAllEvents();
        console.log("All events:", events);
        setAllEvents(events || []);
        
        // Fetch upcoming events for display
        const upcoming = await eventService.getUpcomingEvents();
        console.log("Upcoming events:", upcoming);
        setUpcomingEvents(upcoming || []);
        
        // If we don't have upcoming events but we have all events, 
        // use all events as a fallback
        if ((!upcoming || upcoming.length === 0) && events && events.length > 0) {
          console.log("No upcoming events, using all events instead");
          setUpcomingEvents(events);
        }
      } catch (err) {
        console.error("Error fetching events:", err);
        setError(`Failed to load events: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, []);
  
  return (
    <div>
      {/* Hero section */}
      <section className="bg-primary text-white py-5 mb-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-3">Find Your Next Amazing Event</h1>
              <p className="lead mb-4">Discover, register and participate in events that match your interests.</p>
              <Link to="/events" className="btn btn-light btn-lg">Browse Events</Link>
            </div>
            <div className="col-lg-6">
              {/* Interactive Calendar Graphic */}
              <div className="hero-image-container d-flex align-items-center justify-content-center">
                {/* Calendar-inspired animated graphic */}
                <div className="calendar-graphic">
                  <div className="calendar-header d-flex justify-content-between align-items-center p-2">
                    <div className="calendar-month">MAY</div>
                    <div className="calendar-controls">
                      <i className="bi bi-chevron-left me-2"></i>
                      <i className="bi bi-chevron-right"></i>
                    </div>
                  </div>
                  <div className="calendar-body">
                    {/* Calendar days - will be animated */}
                    {Array.from({ length: 12 }, (_, i) => (
                      <div key={i} className={`calendar-day ${i % 3 === 0 ? 'calendar-event' : ''}`}>
                        {i + 15}
                        {i % 3 === 0 && <div className="day-indicator"></div>}
                      </div>
                    ))}
                  </div>
                  <div className="event-highlight pulse-animation">
                    <i className="bi bi-calendar-event me-2"></i>
                    <span>LIVE NOW</span>
                  </div>
                </div>
                
                {/* Floating elements */}
                <div className="floating-element location-pin">
                  <i className="bi bi-geo-alt-fill"></i>
                </div>
                <div className="floating-element ticket">
                  <i className="bi bi-ticket-perforated-fill"></i>
                </div>
                <div className="floating-element notification">
                  <i className="bi bi-bell-fill"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Error message */}
      {error && (
        <div className="container alert alert-danger mt-3">
          <p><strong>Error:</strong> {error}</p>
          <p>Please check the console for more details.</p>
        </div>
      )}
      
      {/* Upcoming events section */}
      <section className="container mb-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Upcoming Events</h2>
          <Link to="/events" className="btn btn-outline-primary">View All</Link>
        </div>
        
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading events...</p>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {upcomingEvents && upcomingEvents.length > 0 ? (
              upcomingEvents.map(event => (
                <div className="col" key={event.id || `event-${Math.random()}`}>
                  <EventCard event={event} />
                </div>
              ))
            ) : (
              <div className="col-12 text-center py-5">
                <div className="alert alert-info">
                  <i className="bi bi-calendar-x me-2"></i>
                  No upcoming events available.
                </div>
              </div>
            )}
          </div>
        )}
      </section>
      
      {/* Features section */}
      <section className="bg-light py-5">
        <div className="container">
          <h2 className="text-center mb-4">Why Choose EventMaster</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <i className="bi bi-calendar-check text-primary" style={{ fontSize: '2rem' }}></i>
                  <h5 className="mt-3">Easy Registration</h5>
                  <p className="text-muted">Register for events with just a few clicks.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <i className="bi bi-people text-primary" style={{ fontSize: '2rem' }}></i>
                  <h5 className="mt-3">Community</h5>
                  <p className="text-muted">Connect with people sharing similar interests.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <i className="bi bi-person-plus text-primary" style={{ fontSize: '2rem' }}></i>
                  <h5 className="mt-3">Host Events</h5>
                  <p className="text-muted">Create and manage your own events.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;