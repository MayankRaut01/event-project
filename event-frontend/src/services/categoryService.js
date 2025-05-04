import axios from 'axios';

const API_URL = 'http://localhost:8080/api/categories';

// Get auth token from local storage
const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user && user.accessToken ? { Authorization: `Bearer ${user.accessToken}` } : {};
};

const getAllCategories = () => {
  return axios.get(API_URL);
};

const getCategoryById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

const createCategory = (categoryData) => {
  return axios.post(API_URL, categoryData, { headers: getAuthHeader() });
};

const updateCategory = (id, categoryData) => {
  return axios.put(`${API_URL}/${id}`, categoryData, { headers: getAuthHeader() });
};

const deleteCategory = (id) => {
  return axios.delete(`${API_URL}/${id}`, { headers: getAuthHeader() });
};

export default {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};