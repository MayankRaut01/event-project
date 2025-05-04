// src/utils/dataUtils.js
export const formatDate = (dateString) => {
  try {
    // Check if dateString is valid
    if (!dateString) return 'Date unavailable';
    
    // Parse the date string to a Date object
    const date = new Date(dateString);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      console.warn('Invalid date format:', dateString);
      return 'Date unavailable';
    }
    
    // Format the date
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Date unavailable";
  }
};

export const formatDateTime = (dateString) => {
  try {
    // Check if dateString is valid
    if (!dateString) return 'Date unavailable';
    
    // Parse the date string to a Date object
    const date = new Date(dateString);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      console.warn('Invalid date format:', dateString);
      return 'Date unavailable';
    }
    
    // Format the date with time
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString(undefined, options);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Date unavailable";
  }
};

export const isEventInPast = (dateString) => {
  try {
    if (!dateString) return false;
    
    const eventDate = new Date(dateString);
    
    // Check if the date is valid
    if (isNaN(eventDate.getTime())) {
      console.warn('Invalid date format in isEventInPast:', dateString);
      return false;
    }
    
    const today = new Date();
    return eventDate < today;
  } catch (error) {
    console.error("Error checking if event is in past:", error);
    return false;
  }
};

export const extractEventProperties = (event) => {
  // Extract only the properties we need for display
  if (!event) return null;
  
  return {
    id: event.id,
    name: event.name || event.title || '',
    description: event.description || '',
    startDate: event.startDate || event.start_date || '',
    endDate: event.endDate || event.end_date || '',
    location: event.location || event.venue || '',
    imageUrl: event.imageUrl || '',
    price: event.price
  };
};

export default {
  formatDate,
  formatDateTime,
  isEventInPast,
  extractEventProperties
};