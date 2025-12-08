// services/cruiseSearchApi.js
import api from './api';

// Search ports via backend API
export const searchPortsAPI = async (query) => {
  try {
    // console.log(`Searching ports for: "${query}"`);
    const response = await api.post('/search/ports', { query });
    
    // Check if response has data array
    if (response && Array.isArray(response.data)) {
      return response.data.map(port => ({
        ...port,
        source: 'api'
      }));
    }
    
    console.warn('Unexpected API response format:', response);
    return [];
    
  } catch (error) {
    console.error('Error searching ports via API:', error);
    // Don't throw error, just return empty array to fallback to local data
    return [];
  }
};

// Search cruise lines via backend API
export const searchCruiseLinesAPI = async (query) => {
  try {
    // console.log(`Searching cruise lines for: "${query}"`);
    const response = await api.post('/search/cruise-lines', { query });
    
    if (response && Array.isArray(response.data)) {
      return response.data.map(line => ({
        ...line,
        source: 'api'
      }));
    }
    
    console.warn('Unexpected API response format:', response);
    return [];
    
  } catch (error) {
    console.error('Error searching cruise lines via API:', error);
    return [];
  }
};

// Search ships via backend API
export const searchShipsAPI = async (query) => {
  try {
    // console.log(`Searching ships for: "${query}"`);
    const response = await api.post('/search/ships', { query });
    
    if (response && Array.isArray(response.data)) {
      return response.data.map(ship => ({
        ...ship,
        source: 'api'
      }));
    }
    
    console.warn('Unexpected API response format:', response);
    return [];
    
  } catch (error) {
    console.error('Error searching ships via API:', error);
    return [];
  }
};