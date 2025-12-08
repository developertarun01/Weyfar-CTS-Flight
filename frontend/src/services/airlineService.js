// services/airlineService.js - Updated version
import api from './api';

class AirlineService {
  constructor() {
    this.airlineCache = new Map();
  }

  async getAirlineName(airlineCode) {
    if (!airlineCode) {
      // console.log('❌ No airline code provided');
      return 'Flight';
    }

    // Check cache first
    if (this.airlineCache.has(airlineCode)) {
      return this.airlineCache.get(airlineCode);
    }

    try {
      // console.log('🛫 Fetching airline name for code:', airlineCode);
      
      const response = await api.get(`/travel/airlines?code=${airlineCode}`);
      // console.log('🛫 Airline API response:', response);
      
      if (response.success && response.data && response.data.name) {
        const airlineName = response.data.name;
        this.airlineCache.set(airlineCode, airlineName);
        // console.log('✅ Found airline name:', airlineName);
        return airlineName;
      } else {
        // console.log('❌ No airline name in response, using fallback');
        return this.getAirlineNameFromStaticMap(airlineCode);
      }
    } catch (error) {
      console.error('❌ Airline API error:', error);
      return this.getAirlineNameFromStaticMap(airlineCode);
    }
  }

  // Enhanced flight processing with debugging
  async enhanceFlightsWithAirlineNames(flights) {
    // console.log('🔄 Enhancing flights with airline names, count:', flights.length);
    
    const enhancedFlights = [];
    
    for (const [index, flight] of flights.entries()) {
      // console.log(`🔍 Processing flight ${index + 1}:`, {
      //   id: flight.id,
      //   validatingAirlineCodes: flight.validatingAirlineCodes,
      //   operating: flight.operating,
      //   carrierCode: flight.carrierCode,
      //   flightNumber: flight.flightNumber
      // });
      
      const airlineCode = this.getAirlineCodeFromFlight(flight);
      // console.log(`📋 Extracted airline code: "${airlineCode}"`);
      
      const airlineName = await this.getAirlineName(airlineCode);
      
      const enhancedFlight = {
        ...flight,
        airlineName: airlineName,
        displayName: `${airlineName} ${flight.flightNumber || ''}`.trim()
      };
      
      // console.log(`✅ Enhanced flight ${index + 1}:`, {
      //   airlineName: enhancedFlight.airlineName,
      //   displayName: enhancedFlight.displayName
      // });
      
      enhancedFlights.push(enhancedFlight);
    }
    
    // console.log('🎉 All flights enhanced:', enhancedFlights);
    return enhancedFlights;
  }

  getAirlineCodeFromFlight(flight) {
    const code = (
      flight.validatingAirlineCodes?.[0] ||
      flight.operating?.carrierCode ||
      flight.carrierCode ||
      ''
    );
    // console.log('🔍 Extracted airline code from flight:', code);
    return code;
  }

  getAirlineNameFromStaticMap(airlineCode) {
    const airlineMap = {
      'AI': 'Air India',
      '6E': 'IndiGo',
      'SG': 'SpiceJet',
      'UK': 'Vistara',
      'G8': 'Go First',
      'IX': 'Air India Express',
      'LH': 'Lufthansa',
      'EK': 'Emirates',
      'QR': 'Qatar Airways',
      'SQ': 'Singapore Airlines',
      'CX': 'Cathay Pacific',
      'BA': 'British Airways',
      'AF': 'Air France',
      'KL': 'KLM',
      'EY': 'Etihad Airways',
      'TK': 'Turkish Airlines',
      'F9': 'Frontier Airlines', // Based on your flight number F91043
      // Add more as needed
    };
    
    const name = airlineMap[airlineCode] || airlineCode || 'Flight';
    // console.log(`🗺️ Static map result for ${airlineCode}: ${name}`);
    return name;
  }
}

export default new AirlineService();