import React, { useState, useEffect } from 'react';
import EventCard from '../components/EventCard';
// eslint-disable-next-line no-unused-vars
import CategoryBadge from '../components/CategoryBadge';
import eventService from '../services/eventService';
import categoryService from '../services/categoryService';

const EventsList = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]); // Add this state for filtered events
  const [categories, setCategories] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data for EventsList...');
        
        // Get events
        const eventsResponse = await eventService.getAllEvents();
        console.log('Raw events response:', eventsResponse);
        
        // Check if events response is valid
        if (!eventsResponse) {
          console.error('Events response is undefined or null');
          setEvents([]);
          setFilteredEvents([]);
        } else {
          // Log the type of the response
          console.log('Events response type:', typeof eventsResponse);
          
          // Determine how to handle the response based on its type
          let eventsData;
          if (typeof eventsResponse === 'object' && eventsResponse !== null) {
            if (Array.isArray(eventsResponse)) {
              console.log('Events response is already an array');
              eventsData = eventsResponse;
            } else if (eventsResponse.data) {
              console.log('Events response has data property:', eventsResponse.data);
              eventsData = eventsResponse.data;
            } else {
              console.log('Events response is an object without data property');
              eventsData = [];
            }
          } else {
            console.log('Events response is not an object');
            eventsData = [];
          }
          
          console.log('Final events data:', eventsData);
          console.log('Events data length:', eventsData.length);
          
          setEvents(eventsData);
          setFilteredEvents(eventsData); // Also set filtered events
        }
        
        // Get categories
        try {
          const categoriesResponse = await categoryService.getAllCategories();
          console.log('Categories response:', categoriesResponse);
          
          // Handle the categories response similarly to events
          let categoriesData;
          if (categoriesResponse) {
            if (Array.isArray(categoriesResponse)) {
              categoriesData = categoriesResponse;
            } else if (categoriesResponse.data && Array.isArray(categoriesResponse.data)) {
              categoriesData = categoriesResponse.data;
            } else {
              console.warn('Categories response is not an array, defaulting to empty array');
              categoriesData = [];
            }
          } else {
            categoriesData = [];
          }
          
          console.log('Final categories data:', categoriesData);
          setCategories(categoriesData);
        } catch (categoryError) {
          console.error('Error fetching categories:', categoryError);
          setCategories([]); // Set to empty array on error
        }
        
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Add the missing function for handling search
  const handleSearch = () => {
    console.log('Searching for:', searchTerm);
    if (!searchTerm.trim()) {
      // If search term is empty, reset to all events
      setFilteredEvents(events);
      return;
    }

    const term = searchTerm.toLowerCase();
    const results = events.filter(event => 
      event.title?.toLowerCase().includes(term) || 
      event.description?.toLowerCase().includes(term) ||
      event.location?.toLowerCase().includes(term)
    );
    
    setFilteredEvents(results);
  };

  // Add the missing function for handling category change
  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    
    if (!categoryId) {
      // If no category selected, show all events
      setFilteredEvents(events);
      return;
    }
    
    // Filter events by selected category
    const results = events.filter(event => {
      // Handle cases where event.categoryId might be a string or number
      return event.categoryId === categoryId || 
        event.categoryId === parseInt(categoryId, 10) ||
        (event.categories && Array.isArray(event.categories) && 
         event.categories.some(cat => cat.id === categoryId || cat.id === parseInt(categoryId, 10)));
    });
    
    setFilteredEvents(results);
  };
  
  // Rest of your component remains the same...
  
  return (
    <div className="container py-5">
      <h1 className="mb-4">All Events</h1>
      
      <div className="row mb-4">
        <div className="col-md-6 mb-3 mb-md-0">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button 
              className="btn btn-primary" 
              type="button" 
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        </div>
        <div className="col-md-6">
          <select 
            className="form-select" 
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="">All Categories</option>
            {Array.isArray(categories) && categories.length > 0 ? (
              categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))
            ) : (
              <option disabled>No categories available</option>
            )}
          </select>
        </div>
      </div>
      
      <div className="row">
        {loading ? (
          <div className="col-12 text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : filteredEvents.length > 0 ? (
          filteredEvents.map(event => (
            <div className="col-md-4 mb-4" key={event.id}>
              <EventCard event={event} />
            </div>
          ))
        ) : (
          <div className="col-12">
            <div className="alert alert-info">
              No events found. Please try a different search or category.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsList;