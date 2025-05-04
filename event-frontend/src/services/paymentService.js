// src/services/paymentService.js
import axios from 'axios';
import authService from './authservice';

const API_URL = '/api/payments';

// Process payment
const processPayment = (bookingId, paymentDetails) => {
  const user = authService.getCurrentUser();
  
  if (!user) {
    return Promise.reject('User not authenticated');
  }
  
  const paymentData = {
    bookingId: bookingId,
    amount: paymentDetails.amount || 0,
    // Only include payment method info, not actual card details
    paymentMethod: 'credit_card'
  };
  
  return axios.post(API_URL, paymentData, {
    headers: {
      'Authorization': user.authHeader || '',
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    console.log("Payment response:", response);
    return response.data;
  })
  .catch(error => {
    console.error("Error processing payment:", error);
    throw error;
  });
};

// Get payment status
const getPaymentStatus = (paymentId) => {
  const user = authService.getCurrentUser();
  
  if (!user) {
    return Promise.reject('User not authenticated');
  }
  
  return axios.get(`${API_URL}/${paymentId}/status`, {
    headers: {
      'Authorization': user.authHeader || ''
    }
  })
  .then(response => {
    return response.data;
  })
  .catch(error => {
    console.error(`Error getting payment status:`, error);
    throw error;
  });
};

const paymentService = {
  processPayment,
  getPaymentStatus
};

export default paymentService;