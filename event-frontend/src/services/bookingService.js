import axios from 'axios';

// Base URL for API requests
const API_URL = '/api/bookings';

// Create a new booking
const createBooking = async (bookingData) => {
  try {
    console.log('bookingService - Creating booking with data:', bookingData);
    
    // Make sure userId is a number
    const formattedData = {
      ...bookingData,
      userId: bookingData.userId || 1, // Use provided userId or default to 1
    };
    
    const response = await axios.post(API_URL, formattedData);
    
    console.log('bookingService - Booking created successfully:', response.data);
    
    // The response should now be a direct number, not a string message
    const bookingId = response.data;
    
    return bookingId;
  } catch (error) {
    console.error('Error in bookingService.createBooking:', error);
    console.error('Error response:', error.response?.data);
    throw error;
  }
};

// Get all bookings for the current user
const getUserBookings = async (userId) => {
  try {
    // For testing, use a fixed user ID
    const userIdToUse = userId || 1;
    
    console.log('Fetching bookings for user ID:', userIdToUse);
    
    const response = await axios.get(`${API_URL}/user/${userIdToUse}`);
    
    console.log('Bookings response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Error in bookingService.getUserBookings:', error);
    console.error('Error details:', error.response?.data || error.message);
    return [];
  }
};

// Get a specific booking by ID
const getBookingById = async (bookingId) => {
  try {
    console.log(`Attempting to get booking with ID: ${bookingId}`);
    
    // First try the direct endpoint
    try {
      const response = await axios.get(`${API_URL}/${bookingId}`);
      console.log('Direct booking fetch successful:', response.data);
      return response.data;
    } catch (directError) {
      console.warn('Direct booking fetch failed, trying status endpoint:', directError);
      
      // If direct endpoint fails, try getting status (which we know exists)
      const statusResponse = await axios.get(`${API_URL}/${bookingId}/status`);
      console.log('Status response:', statusResponse.data);
      
      // If status exists but returns no full booking, try user bookings
      const userBookings = await getUserBookings(1); // Default to user 1
      const matchingBooking = userBookings.find(b => b.id == bookingId);
      
      if (matchingBooking) {
        console.log('Found booking in user bookings:', matchingBooking);
        return matchingBooking;
      }
      
      throw new Error('Booking not found through any method');
    }
  } catch (error) {
    console.error('Error in bookingService.getBookingById:', error);
    throw error;
  }
};

// Cancel a booking
const cancelBooking = async (bookingId) => {
  try {
    console.log('Cancelling booking with ID:', bookingId);
    // Use DELETE method as specified in the controller
    const response = await axios.delete(`${API_URL}/${bookingId}`);
    console.log('Cancellation response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in bookingService.cancelBooking:', error);
    console.error('Error details:', error.response?.data || error.message);
    throw error;
  }
};

// Get booking status
const getBookingStatus = async (bookingId) => {
  try {
    const response = await axios.get(`${API_URL}/${bookingId}/status`);
    return response.data;
  } catch (error) {
    console.error('Error in bookingService.getBookingStatus:', error);
    throw error;
  }
};

const bookingService = {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
  getBookingStatus
};

export default bookingService;