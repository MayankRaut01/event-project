import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import eventService from '../services/eventService';
import categoryService from '../services/categoryService';

const EditEvent = () => {
  const { id } = useParams();
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    location: '',
    imageUrl: '',
    capacity: 0,
    categories: []
  });
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventData, categoriesData] = await Promise.all([
          eventService.getEventById(id),
          categoryService.getAllCategories()
        ]);
        
        // Check if user is allowed to edit
        if (currentUser.id !== eventData.organizer.id && currentUser.role !== 'ADMIN') {
          navigate('/events/' + id);
          return;
        }
        
        // Format dates and times
        const startDate = new Date(eventData.startDate);
        const endDate = new Date(eventData.endDate);
        
        setFormData({
          name: eventData.name,
          description: eventData.description,
          startDate: startDate.toISOString().split('T')[0],
          startTime: startDate.toTimeString().slice(0, 5),
          endDate: endDate.toISOString().split('T')[0],
          endTime: endDate.toTimeString().slice(0, 5),
          location: eventData.location,
          imageUrl: eventData.imageUrl || '',
          capacity: eventData.capacity,
          categories: eventData.categories || []
        });
        
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load event data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, currentUser, navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleCategoryChange = (e) => {
    const options = e.target.options;
    const selectedCategories = [];
    
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedCategories.push({ id: parseInt(options[i].value) });
      }
    }
    
    setFormData({
      ...formData,
      categories: selectedCategories
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const startDateTime = `${formData.startDate}T${formData.startTime}:00`;
    const endDateTime = `${formData.endDate}T${formData.endTime}:00`;
    
    const eventData = {
      name: formData.name,
      description: formData.description,
      startDate: startDateTime,
      endDate: endDateTime,
      location: formData.location,
      imageUrl: formData.imageUrl,
      capacity: parseInt(formData.capacity),
      categories: formData.categories
    };
    
    try {
      setSaving(true);
      setError('');
      
      await eventService.updateEvent(id, eventData);
      navigate(`/events/${id}`);
    } catch (error) {
      console.error('Error updating event:', error);
      setError('Failed to update event');
    } finally {
      setSaving(false);
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
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow">
            <div className="card-body p-4">
              <h1 className="text-center mb-4">Edit Event</h1>
              
              {error && <div className="alert alert-danger">{error}</div>}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Event Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="startDate" className="form-label">Start Date</label>
                    <input
                      type="date"
                      className="form-control"
                      id="startDate"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="startTime" className="form-label">Start Time</label>
                    <input
                      type="time"
                      className="form-control"
                      id="startTime"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="endDate" className="form-label">End Date</label>
                    <input
                      type="date"
                      className="form-control"
                      id="endDate"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="endTime" className="form-label">End Time</label>
                    <input
                      type="time"
                      className="form-control"
                      id="endTime"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="location" className="form-label">Location</label>
                  <input
                    type="text"
                    className="form-control"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="imageUrl" className="form-label">Image URL</label>
                  <input
                    type="url"
                    className="form-control"
                    id="imageUrl"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="capacity" className="form-label">Capacity (0 for unlimited)</label>
                  <input
                    type="number"
                    className="form-control"
                    id="capacity"
                    name="capacity"
                    min="0"
                    value={formData.capacity}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="categories" className="form-label">Categories (hold Ctrl/Cmd to select multiple)</label>
                  <select 
                    multiple 
                    className="form-select" 
                    id="categories"
                    name="categories"
                    onChange={handleCategoryChange}
                    style={{ height: '150px' }}
                  >
                    {categories.map(category => (
                      <option 
                        key={category.id} 
                        value={category.id}
                        selected={formData.categories.some(c => c.id === category.id)}
                      >
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="d-grid gap-2">
                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Saving...
                      </>
                    ) : 'Update Event'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditEvent;