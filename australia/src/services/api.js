import axios from 'axios';

// API base URL - Vercel will set this in production
const API_BASE_URL = import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? 'https://weyfar-flight-api.vercel.app/api'
    : 'http://localhost:5000/api'
  );

// console.log('API Base URL:', API_BASE_URL);

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 100000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    // console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    // Return the data property from the response
    return response.data;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);

    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error('Unauthorized access - please check your authentication');
    } else if (error.response?.status === 404) {
      console.error('Resource not found');
    } else if (error.response?.status >= 500) {
      console.error('Server error - please try again later');
    }

    return Promise.reject(error.response?.data || error.message);
  }
);

// Travel search APIs
export const searchFlights = (params) =>
  api.post('/travel/flights', params).then(response => response.data || []);

export const searchHotels = (params) =>
  api.post('/travel/hotels', params).then(response => response.data || []);

export const searchCars = (params) =>
  api.post('/travel/cars', params).then(response => response.data || []);

export const searchCruises = (params) =>
  api.post('/travel/cruises', params).then(response => response.data || []);

// Add these to your existing api.js file
// Search APIs
export const searchPorts = (query) => api.post('/search/ports', { query });
export const searchCruiseLines = (query) => api.post('/search/cruise-lines', { query });
export const searchShips = (query) => api.post('/search/ships', { query });
export const getPopularPorts = () => api.get('/search/popular-ports');
export const getPopularCruiseLines = () => api.get('/search/popular-cruise-lines');

// Booking APIs
export const createBooking = (bookingData) => api.post('/booking', bookingData);
export const getBooking = (id) => api.get(`/booking/${id}`);
export const validatePromoCode = (promoData) => api.post('/booking/validate-promo', promoData);

// Payment APIs
export const createPaymentOrder = (paymentData) => api.post('/payment/create-order', paymentData);
export const verifyPayment = (verificationData) => api.post('/payment/verify', verificationData);
export const getPaymentStatus = (bookingId) => api.get(`/payment/status/${bookingId}`);
export const processPayment = (paymentData) => api.post('/payment/process', paymentData);

// Health check
export const healthCheck = () => api.get('/health');

export default api;