// src/services/eventService.js
import axios from 'axios';
import authService from './authservice';

const API_URL = '/api/events';

// Add this utility function to sanitize data and remove circular references
const sanitizeData = (data) => {
  // Simple way to remove circular references - we do a JSON conversion
  try {
    return JSON.parse(JSON.stringify(data));
  } catch (e) {
    console.error("Error sanitizing data:", e);
    // If there's an error, create a simpler version of the data
    if (Array.isArray(data)) {
      return data.map(item => ({
        id: item.id,
        name: item.name || item.title,
        description: item.description,
        startDate: item.startDate || item.start_date,
        endDate: item.endDate || item.end_date,
        location: item.location,
        imageUrl: item.imageUrl,
        price: item.price,
        // Don't include relationships that might cause circular references
      }));
    }
    return {};
  }
};

// Get all events - fixed to properly handle auth
const getAllEvents = async () => {
  try {
    console.log('Fetching events from API...');
    
    // Get the authentication header
    const authHeader = authService.getAuthHeader();
    console.log('Using auth header:', authHeader);
    
    // Make the request
    const response = await axios.get(API_URL, {
      headers: authHeader
    });
    
    console.log('API response:', response.data);
    
    // Process the response data
    if (response.data) {
      // Check if response.data is already an array
      if (Array.isArray(response.data)) {
        console.log('Returning', response.data.length, 'events from API');
        return sanitizeData(response.data); // Use sanitizeData here
      } 
      // Check if it's a wrapped object with a data property
      else if (response.data.data && Array.isArray(response.data.data)) {
        console.log('Returning', response.data.data.length, 'events from API data property');
        return sanitizeData(response.data.data); // Use sanitizeData here
      }
      // It might be a single object
      else {
        console.log('Returning single event as array');
        return sanitizeData([response.data]); // Use sanitizeData here
      }
    }
    
    console.log('No events found in API response');
    return [];
  } catch (error) {
    console.error('Error fetching events:', error);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    // Return empty array on error
    return [];
  }
};

// Get upcoming events
const getUpcomingEvents = async () => {
  try {
    console.log('Fetching upcoming events from API...');
    
    // Get the authentication header
    const authHeader = authService.getAuthHeader();
    
    // Make the request to the specific upcoming endpoint
    const response = await axios.get(`${API_URL}/upcoming`, {
      headers: authHeader
    });
    
    console.log('Upcoming events API response:', response);
    
    // Process the response data
    if (response.data) {
      // Check if response.data is already an array
      if (Array.isArray(response.data)) {
        console.log('Returning', response.data.length, 'upcoming events from API');
        return sanitizeData(response.data);
      } 
      // Check if it's a wrapped object with a data property
      else if (response.data.data && Array.isArray(response.data.data)) {
        console.log('Returning', response.data.data.length, 'upcoming events from API data property');
        return sanitizeData(response.data.data);
      }
      // It might be a single object
      else {
        console.log('Returning single upcoming event as array');
        return sanitizeData([response.data]);
      }
    }
    
    console.log('No upcoming events found in API response');
    return [];
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    // Return empty array on error
    return [];
  }
};

// Get event by ID
const getEventById = async (id) => {
  try {
    console.log(`Fetching event with ID ${id}...`);
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: authService.getAuthHeader()
    });
    
    console.log(`Response for event ${id}:`, response);
    return sanitizeData(response.data); // Sanitize here too
  } catch (error) {
    console.error(`Error fetching event with ID ${id}:`, error);
    throw error;
  }
};

// Create new event
const createEvent = async (eventData) => {
  return axios.post(API_URL, eventData, {
    headers: {
      ...authService.getAuthHeader(),
      'Content-Type': 'application/json'
    }
  });
};

// Update existing event
const updateEvent = async (id, eventData) => {
  return axios.put(`${API_URL}/${id}`, eventData, {
    headers: {
      ...authService.getAuthHeader(),
      'Content-Type': 'application/json'
    }
  });
};

// Delete event
const deleteEvent = async (id) => {
  return axios.delete(`${API_URL}/${id}`, {
    headers: authService.getAuthHeader()
  });
};

// Register for event (current user)
const registerForEvent = async (eventId) => {
  try {
    console.log('Attempting to book seat for event:', eventId);
    const user = authService.getCurrentUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Log current user ID for debugging
    console.log('Current user ID:', user.id);
    
    const response = await axios.post(`${API_URL}/${eventId}/register/${user.id}`, {}, {
      headers: authService.getAuthHeader()
    });
    
    return sanitizeData(response.data); // Sanitize here too
  } catch (error) {
    console.error('Error booking seat for event:', error);
    throw error;
  }
};

// Register for event with specific user ID
const registerForEventWithUserId = async (eventId, userId) => {
  try {
    console.log(`Registering for event: ${eventId} User ID: ${userId}`);
    const response = await axios.post(`${API_URL}/${eventId}/register/${userId}`, {}, {
      headers: authService.getAuthHeader()
    });
    return sanitizeData(response.data); // Sanitize here too
  } catch (error) {
    console.error('Error registering for event with ID:', error);
    throw error;
  }
};

// Register for event with custom user object
const registerForEventWithUser = async (eventId, user) => {
  if (!user || !user.id) {
    throw new Error('Invalid user or missing user ID');
  }
  
  console.log(`Registering for event: ${eventId} User ID: ${user.id}`);
  return axios.post(`${API_URL}/${eventId}/register/${user.id}`, {}, {
    headers: authService.getAuthHeader()
  });
};

// Get all event categories
const getAllCategories = async () => {
  try {
    const response = await axios.get('/api/categories', {
      headers: authService.getAuthHeader()
    });
    return sanitizeData(response.data); // Sanitize here too
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

// Get user's registered events
const getUserEvents = async () => {
  try {
    const response = await axios.get('/api/user/events', {
      headers: authService.getAuthHeader()
    });
    return sanitizeData(response.data); // Sanitize here too
  } catch (error) {
    console.error('Error fetching user events:', error);
    return [];
  }
};

// Get user's bookings
const getUserBookings = async () => {
  try {
    const response = await axios.get('/api/bookings', {
      headers: authService.getAuthHeader()
    });
    return sanitizeData(response.data); // Sanitize here too
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    return [];
  }
};

const eventService = {
  getAllEvents,
  getUpcomingEvents,  // Added this line
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  registerForEventWithUser,
  registerForEventWithUserId,
  getAllCategories,
  getUserEvents,
  getUserBookings
};

export default eventService;