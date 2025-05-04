import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import eventService from '../services/eventService';
import registrationService from '../services/registrationService';

const Dashboard = () => {
  const { currentUser } = useContext(AuthContext);
  
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [organizedEvents, setOrganizedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        let userRegistrations = [];
        let userOrganizedEvents = [];
        
        if (currentUser.role === 'USER' || currentUser.role === 'ORGANIZER') {
          userRegistrations = await registrationService.getUserRegistrations(currentUser.id);
        }
        
        if (currentUser.role === 'ORGANIZER' || currentUser.role === 'ADMIN') {
          userOrganizedEvents = await eventService.getEventsByOrganizer(currentUser.id);
        }
        
        setRegisteredEvents(userRegistrations);
        setOrganizedEvents(userOrganizedEvents);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [currentUser]);
  
  const handleCancelRegistration = async (registrationId) => {
    try {
      await registrationService.cancelRegistration(registrationId);
      setRegisteredEvents(prevRegistrations => 
        prevRegistrations.filter(reg => reg.id !== registrationId)
      );
    } catch (error) {
      console.error('Error cancelling registration:', error);
      setError('Failed to cancel registration');
    }
  };
  
  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-5">
      <h1 className="mb-4">Dashboard</h1>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="row mb-5">
        <div className="col-md-4 mb-4">
          <div className="card stats-card h-100">
            <div className="card-body">
              <h5 className="card-title">Welcome back</h5>
              <h2 className="mb-0">{currentUser.firstName} {currentUser.lastName}</h2>
              <p className="text-muted">{currentUser.role}</p>
            </div>
          </div>
        </div>
        
        {(currentUser.role === 'USER' || currentUser.role === 'ORGANIZER') && (
          <div className="col-md-4 mb-4">
            <div className="card stats-card h-100">
              <div className="card-body">
                <h5 className="card-title">My Registrations</h5>
                <h2 className="mb-0">{registeredEvents.length}</h2>
                <p className="text-muted">Registered events</p>
              </div>
            </div>
          </div>
        )}
        
        {(currentUser.role === 'ORGANIZER' || currentUser.role === 'ADMIN') && (
          <div className="col-md-4 mb-4">
            <div className="card stats-card h-100">
              <div className="card-body">
                <h5 className="card-title">My Events</h5>
                <h2 className="mb-0">{organizedEvents.length}</h2>
                <p className="text-muted">Organized events</p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {(currentUser.role === 'USER' || currentUser.role === 'ORGANIZER') && (
        <div className="mb-5">
          <div className="d-flex align-items-center mb-3">
            <h2 className="mb-0">My Registrations</h2>
          </div>
          
          {registeredEvents.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Date</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {registeredEvents.map(registration => (
                    <tr key={registration.id}>
                      <td>
                        <Link to={`/events/${registration.event.id}`}>
                          {registration.event.name}
                        </Link>
                      </td>
                      <td>{new Date(registration.event.startDate).toLocaleDateString()}</td>
                      <td>{registration.event.location}</td>
                      <td>
                        <span className={`badge ${registration.status === 'CONFIRMED' ? 'bg-success' : 'bg-warning'}`}>
                          {registration.status}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleCancelRegistration(registration.id)}
                          disabled={registration.status === 'CANCELLED'}
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>You haven't registered for any events yet.</p>
          )}
        </div>
      )}
      
      {(currentUser.role === 'ORGANIZER' || currentUser.role === 'ADMIN') && (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="mb-0">My Events</h2>
            <Link to="/events/create" className="btn btn-primary">Create Event</Link>
          </div>
          
          {organizedEvents.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Event Name</th>
                    <th>Date</th>
                    <th>Location</th>
                    <th>Registrations</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {organizedEvents.map(event => (
                    <tr key={event.id}>
                      <td>
                        <Link to={`/events/${event.id}`}>
                          {event.name}
                        </Link>
                      </td>
                      <td>{new Date(event.startDate).toLocaleDateString()}</td>
                      <td>{event.location}</td>
                      <td>
                        {event.registrations ? event.registrations.length : 0}
                        {event.capacity > 0 ? `/${event.capacity}` : ''}
                      </td>
                      <td>
                        <Link to={`/events/edit/${event.id}`} className="btn btn-sm btn-outline-primary me-2">
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>You haven't created any events yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;