import api from './api';

class AirportSearchService {
  // Search airports and cities using real Amadeus API
  async searchLocations(query) {
    try {
      if (!query || query.length < 3) {
        return [];
      }

      // console.log('🔍 Searching locations for:', query);

      // Try real Amadeus API first
      const amadeusResults = await this.searchAmadeus(query);

      if (amadeusResults && amadeusResults.length > 0) {
        // console.log('✅ Found real Amadeus data:', amadeusResults.length, 'results');
        return amadeusResults;
      }

      // Fallback to mock data
      // console.log('📋 Using mock data as fallback');
      return this.getMockLocations(query);
    } catch (error) {
      console.error('❌ Airport search error:', error);
      // console.log('📋 Falling back to mock data due to error');
      return this.getMockLocations(query);
    }
  }

  // Real Amadeus API call
  async searchAmadeus(query) {
    try {
      // console.log('🌐 Making real API call to backend for:', query);

      const response = await api.get(`/travel/airports?q=${encodeURIComponent(query)}`);

      if (response.success && response.data) {
        // console.log('✅ Backend API call successful');
        return response.data;
      } else {
        throw new Error('Invalid response format from backend');
      }
    } catch (error) {
      console.error('❌ Backend API call failed:', error);
      throw error; // Re-throw to trigger fallback
    }
  }

  // Update mock data format to match Amadeus API response
  getMockLocations(query) {
    const searchTerm = query.toLowerCase();

    const locations = [
      // United States
      { id: 'JFK', type: 'airport', name: 'John F Kennedy International Airport', code: 'JFK', city: 'New York', country: 'United States', relevance: 100, source: 'mock' },
      { id: 'LAX', type: 'airport', name: 'Los Angeles International Airport', code: 'LAX', city: 'Los Angeles', country: 'United States', relevance: 95, source: 'mock' },
      { id: 'NYC', type: 'city', name: 'New York', code: 'NYC', city: 'New York', country: 'United States', relevance: 98, source: 'mock' },

      // India
      { id: 'DEL', type: 'airport', name: 'Indira Gandhi International Airport', code: 'DEL', city: 'Delhi', country: 'India', relevance: 92, source: 'mock' },
      { id: 'BOM', type: 'airport', name: 'Chhatrapati Shivaji Maharaj International Airport', code: 'BOM', city: 'Mumbai', country: 'India', relevance: 90, source: 'mock' },
      { id: 'BLR', type: 'airport', name: 'Kempegowda International Airport', code: 'BLR', city: 'Bengaluru', country: 'India', relevance: 85, source: 'mock' },
      { id: 'MAA', type: 'airport', name: 'Chennai International Airport', code: 'MAA', city: 'Chennai', country: 'India', relevance: 82, source: 'mock' },
      { id: 'HYD', type: 'airport', name: 'Rajiv Gandhi International Airport', code: 'HYD', city: 'Hyderabad', country: 'India', relevance: 80, source: 'mock' },

      // China
      { id: 'PEK', type: 'airport', name: 'Beijing Capital International Airport', code: 'PEK', city: 'Beijing', country: 'China', relevance: 95, source: 'mock' },
      { id: 'PVG', type: 'airport', name: 'Shanghai Pudong International Airport', code: 'PVG', city: 'Shanghai', country: 'China', relevance: 93, source: 'mock' },
      { id: 'CAN', type: 'airport', name: 'Guangzhou Baiyun International Airport', code: 'CAN', city: 'Guangzhou', country: 'China', relevance: 88, source: 'mock' },

      // Europe
      { id: 'LHR', type: 'airport', name: 'Heathrow Airport', code: 'LHR', city: 'London', country: 'United Kingdom', relevance: 96, source: 'mock' },
      { id: 'CDG', type: 'airport', name: 'Charles de Gaulle Airport', code: 'CDG', city: 'Paris', country: 'France', relevance: 90, source: 'mock' },
      { id: 'FRA', type: 'airport', name: 'Frankfurt Airport', code: 'FRA', city: 'Frankfurt', country: 'Germany', relevance: 88, source: 'mock' },
      { id: 'LON', type: 'city', name: 'London', code: 'LON', city: 'London', country: 'United Kingdom', relevance: 97, source: 'mock' },

      // Other major cities
      { id: 'DXB', type: 'airport', name: 'Dubai International Airport', code: 'DXB', city: 'Dubai', country: 'United Arab Emirates', relevance: 94, source: 'mock' },
      { id: 'SIN', type: 'airport', name: 'Singapore Changi Airport', code: 'SIN', city: 'Singapore', country: 'Singapore', relevance: 92, source: 'mock' },
      { id: 'BKK', type: 'airport', name: 'Suvarnabhumi Airport', code: 'BKK', city: 'Bangkok', country: 'Thailand', relevance: 86, source: 'mock' },
      { id: 'SYD', type: 'airport', name: 'Sydney Airport', code: 'SYD', city: 'Sydney', country: 'Australia', relevance: 84, source: 'mock' },
    ];

    const results = locations.filter(location =>
      location.code.toLowerCase().includes(searchTerm) ||
      location.name.toLowerCase().includes(searchTerm) ||
      location.city.toLowerCase().includes(searchTerm) ||
      location.country.toLowerCase().includes(searchTerm)
    );

    return results.sort((a, b) => b.relevance - a.relevance);
  }

  // Format location for display
  formatLocation(location) {
    if (location.type === 'city') {
      return `${location.city}, ${location.country} (${location.code})`;
    }
    return `${location.name} (${location.code}), ${location.city}, ${location.country}`;
  }

  // Get display label for dropdown
  getDisplayLabel(location) {
    const isRealData = location.source === 'amadeus';
    const sourceBadge = isRealData ? ' • 🌐 Live' : ' • 📋 Demo';

    if (location.type === 'city') {
      return {
        primary: `${location.city}, ${location.country}`,
        secondary: `City • ${location.code}`,
        type: 'city',
        isRealData
      };
    }
    return {
      primary: `${location.name} (${location.code})`,
      secondary: `${location.city}, ${location.country}`,
      type: 'airport',
      isRealData
    };
  }
}

export default new AirportSearchService();