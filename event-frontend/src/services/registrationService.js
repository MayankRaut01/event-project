import axios from 'axios';

const API_URL = 'http://localhost:8080/api/registrations';

// Get auth token from local storage
const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user && user.accessToken ? { Authorization: `Bearer ${user.accessToken}` } : {};
};

const registerForEvent = (eventId) => {
  return axios.post(`${API_URL}/${eventId}`, {}, { headers: getAuthHeader() });
};

const cancelRegistration = (eventId) => {
  return axios.delete(`${API_URL}/${eventId}`, { headers: getAuthHeader() });
};

const getUserRegistrations = () => {
  return axios.get(API_URL, { headers: getAuthHeader() });
};

export default {
  registerForEvent,
  cancelRegistration,
  getUserRegistrations
};