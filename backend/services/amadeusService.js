const { amadeus, extractAmadeusError } = require('../config/amadeus');
const airlineCodes = require('airline-codes');

// Fix the airline name function
function getAirlineName(airlineCode) {
  if (!airlineCode) return 'Unknown Airline';

  try {
    const airline = airlineCodes.findWhere({ iata: airlineCode });
    return airline ? airline.get('name') : airlineCode;
  } catch (error) {
    return airlineCode;
  }
}

class AmadeusService {
  // Check if Amadeus API is properly configured and working
  async isAmadeusAvailable() {
    try {
      // ✅ Call checkinLinks with a sample airline code (BA = British Airways)
      await amadeus.referenceData.urls.checkinLinks.get({
        airlineCode: 'BA'
      });

      // console.log('Amadeus API is available');
      return true;
    } catch (error) {
      const errorMessage = extractAmadeusError(error);
      // console.log('Amadeus API not available:', errorMessage);

      // If the error is just about airlineCode (bad input), we still treat API as "available"
      if (errorMessage.includes('MANDATORY DATA MISSING') || errorMessage.includes('airlineCode')) {
        // console.log('Amadeus API responded, so connectivity is fine (parameter issue, not connectivity)');
        return true;
      }

      return false;
    }
  }

  async searchAirports(keyword) {
    try {
      // console.log('🔍 Making REAL Amadeus API call for:', keyword);

      // Make API call to Amadeus
      const response = await amadeus.referenceData.locations.get({
        keyword: keyword,
        subType: 'AIRPORT,CITY',
        'page[limit]': 20,
        'page[offset]': 0,
        sort: 'analytics.travelers.score',
        view: 'FULL'
      });

      // console.log('✅ Real Amadeus API response received');
      // console.log('📊 Raw response data length:', response.data?.length || 0);

      if (!response.data || response.data.length === 0) {
        // console.log('📋 No results from Amadeus API');
        return this.getMockAirportData(keyword);
      }

      const formattedResults = this.formatAirportResponse(response.data);
      // console.log(`🎯 Found ${formattedResults.length} REAL Amadeus results for "${keyword}"`);

      return formattedResults;
    } catch (error) {
      // console.error('❌ Real Amadeus API call failed:');
      // console.error('💡 Error message:', error.message);
      // console.error('💡 Error code:', error.code);

      // Fallback to mock data
      // console.log('📋 Falling back to mock data due to API error');
      return this.getMockAirportData(keyword);
    }
  }

  // Format Amadeus API response
  formatAirportResponse(data) {
    if (!data || !Array.isArray(data)) {
      // console.log('❌ Invalid data format from Amadeus');
      return [];
    }

    // console.log(`📊 Processing ${data.length} raw results from Amadeus`);

    // First pass: process all locations
    const locations = data
      .map((location, index) => {
        try {
          const result = {
            id: location.id || `loc-${index}`,
            type: location.subType?.toLowerCase() || 'airport',
            name: location.name || 'Unknown Location',
            code: location.iataCode || '',
            city: location.address?.cityName || '',
            country: location.address?.countryName || '',
            region: location.address?.regionCode || '',
            coordinates: {
              latitude: location.geoCode?.latitude || 0,
              longitude: location.geoCode?.longitude || 0
            },
            relevance: location.analytics?.travelers?.score || 50,
            source: 'amadeus'
          };

          // Filter out invalid entries (no IATA code or name)
          if (!result.code && !result.name) {
            return null;
          }

          return result;
        } catch (error) {
          // console.error('Error formatting location:', error);
          return null;
        }
      })
      .filter(Boolean);

    // Group locations by city for finding the most relevant airport per city
    const cityGroups = {};

    locations.forEach(location => {
      if (location.city) {
        if (!cityGroups[location.city]) {
          cityGroups[location.city] = [];
        }
        cityGroups[location.city].push(location);
      }
    });

    // For each city, find the most relevant airport
    const cityAirportMap = {};
    Object.keys(cityGroups).forEach(city => {
      const cityLocations = cityGroups[city];

      // Find city entries first
      const cityEntry = cityLocations.find(loc => loc.type === 'city');
      if (cityEntry) {
        // If city entry exists, use its code
        cityAirportMap[city] = cityEntry.code;
      } else {
        // If no city entry, find the most relevant airport
        const airports = cityLocations.filter(loc => loc.type === 'airport');
        if (airports.length > 0) {
          // Sort airports by relevance and get the highest
          const mostRelevantAirport = [...airports].sort((a, b) => b.relevance - a.relevance)[0];
          cityAirportMap[city] = mostRelevantAirport.code;
        }
      }
    });

    // Assign city code to locations without city IATA code
    const formatted = locations.map(location => {
      // If this is a city entry, keep its code
      if (location.type === 'city') {
        return location;
      }

      // If this is an airport and its city has a designated code
      if (location.type === 'airport' && location.city && cityAirportMap[location.city]) {
        // Create a copy to avoid modifying original
        const enhancedLocation = { ...location };

        // If the airport doesn't have a city code field, add it
        // Or if you want to add a separate cityCode field:
        enhancedLocation.cityCode = cityAirportMap[location.city];

        return enhancedLocation;
      }

      return location;
    });

    // Sort by relevance
    const sorted = formatted.sort((a, b) => b.relevance - a.relevance);

    // console.log(`✅ Successfully formatted ${sorted.length} REAL locations`);
    return sorted;
  }

  // Enhanced mock data (fallback)
  getMockAirportData(keyword) {
    const searchTerm = keyword.toLowerCase();
    // console.log(`📋 Using MOCK data for search: "${keyword}"`);

    const globalAirports = [
      // ... (keep your existing mock data)
      { id: 'JFK', type: 'airport', name: 'John F Kennedy International Airport', code: 'JFK', city: 'New York', country: 'United States', relevance: 100, source: 'mock' },
      { id: 'DEL', type: 'airport', name: 'Indira Gandhi International Airport', code: 'DEL', city: 'Delhi', country: 'India', relevance: 92, source: 'mock' },
      { id: 'PEK', type: 'airport', name: 'Beijing Capital International Airport', code: 'PEK', city: 'Beijing', country: 'China', relevance: 95, source: 'mock' },
      // ... more airports
    ];

    const results = globalAirports.filter(location =>
      location.code.toLowerCase().includes(searchTerm) ||
      location.name.toLowerCase().includes(searchTerm) ||
      location.city.toLowerCase().includes(searchTerm) ||
      location.country.toLowerCase().includes(searchTerm)
    );

    return results.sort((a, b) => b.relevance - a.relevance);
  }

  // Flight search
  async searchFlights(params) {
    try {
      const isAvailable = await this.isAmadeusAvailable();
      if (!isAvailable) {
        // console.log('Using mock data for flight search');
        return this.getMockFlightData(params);
      }

      const requestParams = {
        originLocationCode: params.origin,
        destinationLocationCode: params.destination,
        departureDate: params.fromDate,
        adults: params.adults || 1,
        travelClass: params.travelClass || 'ECONOMY',
        max: 250,
        currencyCode: 'USD',
      };

      // ⭐ ONLY add children if it's > 0
      if (params.children && parseInt(params.children) > 0) {
        requestParams.children = parseInt(params.children);
      }

      // Add return date for round trips
      if (params.tripType === 'roundTrip' && params.toDate) {
        requestParams.returnDate = params.toDate;
      }

      // console.log('Searching flights with Amadeus API:', requestParams);

      const response = await amadeus.shopping.flightOffersSearch.get(requestParams);

      // Format the response for easier consumption
      return this.formatFlightResponse(response.data);
    } catch (error) {
      const errorMessage = extractAmadeusError(error);
      // console.error('Amadeus Flight Search Error:', errorMessage);

      // Fallback to mock data
      // console.log('Falling back to mock flight data');
      return this.getMockFlightData(params);
    }
  }

  async searchHotels(params) {
    try {
      // console.log('🚀 HYBRID HOTEL SEARCH ACTIVATED');
      // console.log('City:', params.destination, 'Dates:', params.checkInDate, 'to', params.checkOutDate);

      const isAvailable = await this.isAmadeusAvailable();

      // STEP 1: Try to get REAL data from multiple sources
      let realHotels = [];

      if (isAvailable) {
        realHotels = await this.getRealHotelDataFromAllSources(params);
        // console.log(`📊 Real data: ${realHotels.length} hotels found`);
      }

      // STEP 2: Always supplement with enhanced realistic data
      const enhancedHotels = await this.getEnhancedRealisticHotelData(params);
      // console.log(`🎯 Enhanced data: ${enhancedHotels.length} hotels generated`);

      // STEP 3: Combine and deduplicate
      const allHotels = this.combineAndEnrichHotels(realHotels, enhancedHotels, params);

      // console.log(`✅ FINAL RESULT: ${allHotels.length} total hotel offers for ${params.destination}`);

      return allHotels;

    } catch (error) {
      // console.error('Hybrid search failed, using enhanced data only:', error);
      return await this.getEnhancedRealisticHotelData(params);
    }
  }

  // STEP 1: Get REAL data from ALL possible Amadeus sources
  async getRealHotelDataFromAllSources(params) {
    const realHotels = [];

    // console.log('🔍 Scanning all real data sources...');

    // Source 1: Known working sandbox hotel IDs
    try {
      const sandboxHotels = await this.getSandboxHotelOffers(params);
      realHotels.push(...sandboxHotels);
      // console.log(`📍 Sandbox IDs: ${sandboxHotels.length} hotels`);
    } catch (error) {
      // console.log('❌ Sandbox hotels failed');
    }

    // Source 2: Try city-based hotel search (if endpoint exists)
    try {
      const cityHotels = await this.tryCityHotelSearch(params);
      realHotels.push(...cityHotels);
      // console.log(`🏙️ City search: ${cityHotels.length} hotels`);
    } catch (error) {
      // console.log('❌ City search not available');
    }

    // Source 3: Try alternative hotel endpoints
    try {
      const altHotels = await this.tryAlternativeEndpoints(params);
      realHotels.push(...altHotels);
      // console.log(`🔄 Alternative: ${altHotels.length} hotels`);
    } catch (error) {
      // console.log('❌ Alternative endpoints failed');
    }

    return this.deduplicateHotels(realHotels);
  }

  // Source 1: Get offers from known working sandbox hotel IDs
  async getSandboxHotelOffers(params) {
    try {
      // Expanded list of known working hotel IDs across different cities
      const hotelIdMap = {
        'NYC': ['MCLONGHM', 'NYPARHOT', 'NYCBARCL', 'NYCHILTH'],
        'DEL': ['MCLONGHM', 'DELITC', 'DELOBER'],
        'LON': ['MCLONGHM', 'LONHILT', 'LONSHER'],
        'PAR': ['MCLONGHM', 'PARRITZ', 'PARSOFI'],
        'LAX': ['MCLONGHM', 'LAXBEVH'],
        'CHI': ['MCLONGHM', 'CHIMARR'],
        'default': ['MCLONGHM', 'NYPARHOT'] // Fallback
      };

      const hotelIds = hotelIdMap[params.destination] || hotelIdMap.default;
      // console.log(`Using hotel IDs: ${hotelIds.join(', ')}`);

      const response = await amadeus.shopping.hotelOffersSearch.get({
        hotelIds: hotelIds.join(','),
        checkInDate: params.checkInDate,
        checkOutDate: params.checkOutDate,
        roomQuantity: params.rooms || 1,
        adults: params.adults || 1,
        bestRateOnly: true,
        paymentPolicy: 'NONE'
      });

      return this.formatHotelResponse(response.data || []);

    } catch (error) {
      // console.error('Sandbox hotel offers failed:', error.message);
      return [];
    }
  }

  // Source 2: Try city-based hotel search
  async tryCityHotelSearch(params) {
    try {
      // Try the hotel offers endpoint with city code
      const response = await amadeus.shopping.hotelOffers.get({
        cityCode: params.destination,
        checkInDate: params.checkInDate,
        checkOutDate: params.checkOutDate,
        roomQuantity: params.rooms || 1,
        adults: params.adults || 1,
        radius: 20,
        radiusUnit: 'KM',
        bestRateOnly: true
      });

      return this.formatHotelResponse(response.data || []);

    } catch (error) {
      throw new Error('City search not supported');
    }
  }

  // Source 3: Try alternative endpoints
  async tryAlternativeEndpoints(params) {
    const altResults = [];

    // Try different parameter combinations
    const attempts = [
      async () => {
        const response = await amadeus.shopping.hotelOffersSearch.get({
          cityCode: params.destination,
          checkInDate: params.checkInDate,
          checkOutDate: params.checkOutDate,
          adults: params.adults || 1
        });
        return response.data || [];
      }
    ];

    for (let attempt of attempts) {
      try {
        const result = await attempt();
        if (result.length > 0) {
          altResults.push(...this.formatHotelResponse(result));
        }
      } catch (error) {
        // Continue with next attempt
      }
    }

    return altResults;
  }

  // STEP 2: Enhanced Realistic Hotel Data (COMPREHENSIVE)
  async getEnhancedRealisticHotelData(params) {
    const city = params.destination;
    const nights = Math.ceil((new Date(params.checkOutDate) - new Date(params.checkInDate)) / (1000 * 60 * 60 * 24));

    // EXTENSIVE hotel database for major cities
    const cityHotelDatabase = {
      'NYC': [
        { name: 'The Plaza Hotel', chain: 'Fairmont', basePrice: 600, rating: 4.9, type: 'Luxury', landmarks: ['Central Park', '5th Avenue'] },
        { name: 'Waldorf Astoria', chain: 'Hilton', basePrice: 550, rating: 4.8, type: 'Luxury', landmarks: ['Park Avenue'] },
        { name: 'The Ritz-Carlton', chain: 'Ritz-Carlton', basePrice: 500, rating: 4.7, type: 'Luxury', landmarks: ['Battery Park'] },
        { name: 'Marriott Marquis', chain: 'Marriott', basePrice: 300, rating: 4.4, type: 'Business', landmarks: ['Times Square'] },
        { name: 'Hilton Midtown', chain: 'Hilton', basePrice: 280, rating: 4.3, type: 'Business', landmarks: ['6th Avenue'] },
        { name: 'Sheraton Times Square', chain: 'Sheraton', basePrice: 250, rating: 4.2, type: 'Business', landmarks: ['Times Square'] },
        { name: 'Hyatt Grand Central', chain: 'Hyatt', basePrice: 220, rating: 4.1, type: 'Business', landmarks: ['Grand Central'] },
        { name: 'Westin New York', chain: 'Westin', basePrice: 270, rating: 4.3, type: 'Business', landmarks: ['Times Square'] },
        { name: 'Holiday Inn Manhattan', chain: 'Holiday Inn', basePrice: 180, rating: 4.0, type: 'Mid-range', landmarks: ['Financial District'] },
        { name: 'DoubleTree by Hilton', chain: 'Hilton', basePrice: 200, rating: 4.1, type: 'Mid-range', landmarks: ['Chelsea'] },
        { name: 'Courtyard by Marriott', chain: 'Marriott', basePrice: 190, rating: 4.0, type: 'Mid-range', landmarks: ['Midtown'] },
        { name: 'Four Points by Sheraton', chain: 'Sheraton', basePrice: 170, rating: 3.9, type: 'Mid-range', landmarks: ['Financial District'] },
        { name: 'Pod Times Square', chain: 'Pod', basePrice: 120, rating: 3.8, type: 'Budget', landmarks: ['Times Square'] },
        { name: 'YOTEL New York', chain: 'YOTEL', basePrice: 110, rating: 3.7, type: 'Budget', landmarks: ['Hell\'s Kitchen'] },
        { name: 'HI NYC Hostel', chain: 'Hostelling', basePrice: 60, rating: 3.5, type: 'Budget', landmarks: ['Upper West Side'] }
      ],

      'DEL': [
        { name: 'The Oberoi New Delhi', chain: 'Oberoi', basePrice: 250, rating: 4.8, type: 'Luxury', landmarks: ['Diplomatic Enclave'] },
        { name: 'Taj Palace Delhi', chain: 'Taj', basePrice: 220, rating: 4.7, type: 'Luxury', landmarks: ['Chanakyapuri'] },
        { name: 'ITC Maurya', chain: 'ITC', basePrice: 200, rating: 4.6, type: 'Luxury', landmarks: ['Diplomatic Enclave'] },
        { name: 'The Leela Palace', chain: 'Leela', basePrice: 230, rating: 4.7, type: 'Luxury', landmarks: ['Chanakyapuri'] },
        { name: 'Jaypee Vasant Continental', chain: 'Jaypee', basePrice: 150, rating: 4.3, type: 'Business', landmarks: ['Vasant Vihar'] },
        { name: 'The Lalit New Delhi', chain: 'Lalit', basePrice: 140, rating: 4.2, type: 'Business', landmarks: ['Connaught Place'] },
        { name: 'Radisson Blu Delhi', chain: 'Radisson', basePrice: 130, rating: 4.1, type: 'Business', landmarks: ['Paschim Vihar'] },
        { name: 'Holiday Inn Delhi', chain: 'Holiday Inn', basePrice: 120, rating: 4.0, type: 'Mid-range', landmarks: ['Mayur Vihar'] },
        { name: 'Lemon Tree Premier', chain: 'Lemon Tree', basePrice: 100, rating: 3.9, type: 'Mid-range', landmarks: ['Aerocity'] },
        { name: 'Ibis New Delhi', chain: 'Ibis', basePrice: 80, rating: 3.8, type: 'Budget', landmarks: ['Aerocity'] },
        { name: 'Hotel Suryaa New Delhi', chain: 'Suryaa', basePrice: 90, rating: 3.7, type: 'Budget', landmarks: ['Friends Colony'] },
        { name: 'The Park New Delhi', chain: 'The Park', basePrice: 110, rating: 4.0, type: 'Boutique', landmarks: ['Connaught Place'] },
        { name: 'Eros Hotel New Delhi', chain: 'Eros', basePrice: 95, rating: 3.8, type: 'Budget', landmarks: ['Nehru Place'] },
        { name: 'Shangri-La Eros', chain: 'Shangri-La', basePrice: 210, rating: 4.5, type: 'Luxury', landmarks: ['Connaught Place'] },
        { name: 'Crowne Plaza Okhla', chain: 'Crowne Plaza', basePrice: 125, rating: 4.1, type: 'Business', landmarks: ['Okhla'] }
      ],

      'LON': [
        { name: 'The Savoy', chain: 'Fairmont', basePrice: 450, rating: 4.8, type: 'Luxury', landmarks: ['The Strand'] },
        { name: 'The Ritz London', chain: 'Ritz', basePrice: 500, rating: 4.9, type: 'Luxury', landmarks: ['Piccadilly'] },
        { name: 'Claridge\'s', chain: 'Maybourne', basePrice: 480, rating: 4.8, type: 'Luxury', landmarks: ['Mayfair'] },
        { name: 'The Langham London', chain: 'Langham', basePrice: 400, rating: 4.7, type: 'Luxury', landmarks: ['Regent Street'] },
        { name: 'Park Plaza Westminster', chain: 'Park Plaza', basePrice: 250, rating: 4.3, type: 'Business', landmarks: ['Westminster'] },
        { name: 'Hilton London Bankside', chain: 'Hilton', basePrice: 220, rating: 4.2, type: 'Business', landmarks: ['Southwark'] },
        { name: 'Marriott County Hall', chain: 'Marriott', basePrice: 280, rating: 4.4, type: 'Business', landmarks: ['South Bank'] },
        { name: 'The Tower Hotel', chain: 'Guoman', basePrice: 180, rating: 4.0, type: 'Mid-range', landmarks: ['Tower Bridge'] },
        { name: 'Premier Inn Hub', chain: 'Premier Inn', basePrice: 120, rating: 3.9, type: 'Budget', landmarks: ['Covent Garden'] },
        { name: 'Travelodge Central', chain: 'Travelodge', basePrice: 100, rating: 3.7, type: 'Budget', landmarks: ['City of London'] },
        { name: 'Point A Hotel', chain: 'Point A', basePrice: 90, rating: 3.6, type: 'Budget', landmarks: ['Liverpool Street'] },
        { name: 'The Hoxton', chain: 'Hoxton', basePrice: 200, rating: 4.3, type: 'Boutique', landmarks: ['Shoreditch'] },
        { name: 'CitizenM Tower Hill', chain: 'CitizenM', basePrice: 150, rating: 4.2, type: 'Boutique', landmarks: ['Tower Hill'] },
        { name: 'The Ned', chain: 'The Ned', basePrice: 350, rating: 4.6, type: 'Luxury', landmarks: ['Bank'] },
        { name: 'Ham Yard Hotel', chain: 'Firmdale', basePrice: 380, rating: 4.7, type: 'Boutique', landmarks: ['Soho'] }
      ],

      'PAR': [
        { name: 'The Ritz Paris', chain: 'Ritz', basePrice: 700, rating: 4.9, type: 'Luxury', landmarks: ['Place Vendôme'] },
        { name: 'Four Seasons George V', chain: 'Four Seasons', basePrice: 650, rating: 4.8, type: 'Luxury', landmarks: ['Champs-Élysées'] },
        { name: 'Hotel de Crillon', chain: 'Rosewood', basePrice: 600, rating: 4.8, type: 'Luxury', landmarks: ['Place de la Concorde'] },
        { name: 'Shangri-La Paris', chain: 'Shangri-La', basePrice: 550, rating: 4.7, type: 'Luxury', landmarks: ['Eiffel Tower'] },
        { name: 'Le Bristol Paris', chain: 'Oetker', basePrice: 580, rating: 4.8, type: 'Luxury', landmarks: ['Faubourg Saint-Honoré'] },
        { name: 'Pullman Paris Tour Eiffel', chain: 'Pullman', basePrice: 300, rating: 4.3, type: 'Business', landmarks: ['Eiffel Tower'] },
        { name: 'Novotel Paris Centre', chain: 'Novotel', basePrice: 180, rating: 4.1, type: 'Mid-range', landmarks: ['Les Halles'] },
        { name: 'Mercure Paris Centre', chain: 'Mercure', basePrice: 160, rating: 4.0, type: 'Mid-range', landmarks: ['Tour Eiffel'] },
        { name: 'Ibis Paris Tour Eiffel', chain: 'Ibis', basePrice: 120, rating: 3.8, type: 'Budget', landmarks: ['Eiffel Tower'] },
        { name: 'Generator Paris', chain: 'Generator', basePrice: 80, rating: 3.6, type: 'Budget', landmarks: ['Canal Saint-Martin'] },
        { name: 'Hotel du Louvre', chain: 'Hyatt', basePrice: 280, rating: 4.4, type: 'Business', landmarks: ['Louvre Museum'] },
        { name: 'Le Marais House', chain: 'Boutique', basePrice: 200, rating: 4.2, type: 'Boutique', landmarks: ['Le Marais'] },
        { name: 'Hotel Saint-Germain', chain: 'Relais', basePrice: 220, rating: 4.3, type: 'Boutique', landmarks: ['Saint-Germain-des-Prés'] },
        { name: 'Renaissance Paris', chain: 'Marriott', basePrice: 240, rating: 4.3, type: 'Business', landmarks: ['Arc de Triomphe'] },
        { name: 'Hôtel Fabric', chain: 'Boutique', basePrice: 140, rating: 4.1, type: 'Boutique', landmarks: ['Oberkampf'] }
      ]
    };

    // Get city-specific hotels or generate generic ones
    let cityHotels = cityHotelDatabase[city];

    if (!cityHotels) {
      // Generate generic hotels for unknown cities
      cityHotels = this.generateGenericHotels(city, 12);
    }

    // console.log(`🏨 Generating ${cityHotels.length} realistic hotels for ${city}`);

    return cityHotels.map((hotel, index) => {
      const priceVariation = 0.85 + (Math.random() * 0.3); // 0.85 to 1.15 variation
      const finalPrice = hotel.basePrice * priceVariation * nights;

      const coordinates = this.getCityCoordinates(city);

      return {
        id: `enhanced-${city}-${index + 1}`,
        name: hotel.name,
        rating: hotel.rating,
        chain: hotel.chain,
        type: hotel.type,
        address: this.generateAddress(city, index),
        coordinates: {
          latitude: coordinates.lat + (Math.random() - 0.5) * 0.03,
          longitude: coordinates.lng + (Math.random() - 0.5) * 0.03
        },
        price: {
          total: finalPrice.toFixed(2),
          currency: 'USD',
          base: (finalPrice / nights).toFixed(2),
          taxes: (finalPrice * 0.15).toFixed(2)
        },
        checkIn: params.checkInDate,
        checkOut: params.checkOutDate,
        roomType: this.getRoomType(hotel.type),
        description: this.getHotelDescription(hotel.name, hotel.type, city, hotel.landmarks),
        amenities: this.getAmenities(hotel.type),
        images: [
          `/images/hotels/${hotel.type.toLowerCase()}-${(index % 5) + 1}.jpg`
        ],
        distance: {
          value: (0.5 + Math.random() * 4).toFixed(1),
          unit: 'km',
          to: hotel.landmarks ? hotel.landmarks[0] : 'city center'
        },
        landmarks: hotel.landmarks || ['city center'],
        source: 'enhanced-realistic',
        realData: false,
        features: this.getHotelFeatures(hotel.type)
      };
    });
  }

  // STEP 3: Combine and enrich all hotel data
  combineAndEnrichHotels(realHotels, enhancedHotels, params) {
    const combined = [...realHotels];
    const realHotelNames = new Set(realHotels.map(hotel => hotel.name));

    // Add enhanced hotels that don't duplicate real ones
    enhancedHotels.forEach(enhancedHotel => {
      if (!realHotelNames.has(enhancedHotel.name)) {
        combined.push(enhancedHotel);
      }
    });

    // Sort by rating (highest first) then by price (lowest first)
    return combined.sort((a, b) => {
      if (b.rating !== a.rating) {
        return b.rating - a.rating;
      }
      return parseFloat(a.price.total) - parseFloat(b.price.total);
    });
  }

  // Helper methods
  getCityCoordinates(city) {
    const coordinates = {
      'NYC': { lat: 40.7128, lng: -74.0060 },
      'DEL': { lat: 28.6139, lng: 77.2090 },
      'LON': { lat: 51.5074, lng: -0.1278 },
      'PAR': { lat: 48.8566, lng: 2.3522 },
      'default': { lat: 40.7128, lng: -74.0060 }
    };
    return coordinates[city] || coordinates.default;
  }

  generateAddress(city, index) {
    const streets = ['Main Street', 'Central Avenue', 'Park Road', 'Market Street', 'Broadway', 'High Street'];
    const areas = {
      'NYC': ['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island'],
      'DEL': ['Connaught Place', 'Chanakyapuri', 'Karol Bagh', 'Paharganj', 'Aerocity'],
      'LON': ['West End', 'City of London', 'South Bank', 'Kensington', 'Chelsea'],
      'PAR': ['Le Marais', 'Saint-Germain', 'Champs-Élysées', 'Montmartre', 'Latin Quarter']
    };

    return {
      line1: `${Math.floor(100 + Math.random() * 900)} ${streets[index % streets.length]}`,
      city: city,
      country: this.getCountryCode(city),
      postalCode: `${Math.floor(10000 + Math.random() * 90000)}`,
      area: areas[city] ? areas[city][index % areas[city].length] : 'Central'
    };
  }

  // ... include all other helper methods from previous solutions
  getCountryCode(city) {
    const countryMap = {
      'NYC': 'US', 'DEL': 'IN', 'LON': 'GB', 'PAR': 'FR'
    };
    return countryMap[city] || 'US';
  }

  getRoomType(hotelType) {
    const roomTypes = {
      'Luxury': ['Executive Suite', 'Presidential Suite', 'Deluxe King Room', 'Premium Suite'],
      'Business': ['Executive Room', 'Club Room', 'Superior King', 'Business Suite'],
      'Mid-range': ['Standard Room', 'Superior Room', 'Family Room', 'Deluxe Room'],
      'Budget': ['Standard Room', 'Economy Room', 'Basic Room', 'Compact Room'],
      'Boutique': ['Designer Room', 'Boutique Suite', 'Art Room', 'Signature Room']
    };
    const types = roomTypes[hotelType] || ['Standard Room'];
    return types[Math.floor(Math.random() * types.length)];
  }

  getHotelDescription(name, type, city, landmarks) {
    const landmarkText = landmarks && landmarks.length > 0 ?
      ` near ${landmarks.join(' and ')}` : ' in the city center';

    const descriptions = {
      'Luxury': `Experience unparalleled luxury at ${name}${landmarkText}. Featuring exquisite accommodations, world-class amenities, and impeccable service.`,
      'Business': `Perfect for business travelers, ${name} offers modern amenities, high-speed internet, and convenient access to ${city}'s business district${landmarkText}.`,
      'Mid-range': `Comfortable and affordable, ${name} provides great value${landmarkText} with all essential amenities for a pleasant stay in ${city}.`,
      'Budget': `Economical and convenient, ${name} offers comfortable accommodations${landmarkText} at an unbeatable price in ${city}.`,
      'Boutique': `Unique and charming, ${name} combines personalized service with distinctive style${landmarkText}, offering a memorable stay in ${city}.`
    };
    return descriptions[type] || `Comfortable accommodations at ${name}${landmarkText} in ${city}.`;
  }

  getAmenities(hotelType) {
    const baseAmenities = ['Free WiFi', 'Air Conditioning'];

    const typeAmenities = {
      'Luxury': ['Swimming Pool', 'Spa', 'Fitness Center', 'Fine Dining', 'Concierge', 'Room Service', 'Business Center', 'Valet Parking'],
      'Business': ['Business Center', 'Meeting Rooms', 'Fitness Center', 'Restaurant', 'Room Service', 'Laundry Service'],
      'Mid-range': ['Swimming Pool', 'Fitness Center', 'Restaurant', 'Parking', 'Breakfast Included'],
      'Budget': ['24-hour Front Desk', 'Laundry Service', 'Luggage Storage'],
      'Boutique': ['Designer Interiors', 'Art Gallery', 'Specialty Restaurant', 'Roof Terrace', 'Library']
    };

    return [...baseAmenities, ...(typeAmenities[hotelType] || [])];
  }

  getHotelFeatures(hotelType) {
    const features = {
      'Luxury': ['Luxury Spa', 'Fine Dining', 'Concierge Service', 'Pool', 'Fitness Center'],
      'Business': ['Business Center', 'Meeting Rooms', 'Work Desk', 'Express Check-in'],
      'Mid-range': ['Comfortable Rooms', 'Good Location', 'Friendly Service'],
      'Budget': ['Great Value', 'Central Location', 'Basic Comfort'],
      'Boutique': ['Unique Design', 'Personalized Service', 'Local Culture']
    };
    return features[hotelType] || ['Comfortable Stay'];
  }

  deduplicateHotels(hotels) {
    const seen = new Set();
    return hotels.filter(hotel => {
      const key = `${hotel.name}-${hotel.address?.line1}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  generateGenericHotels(city, count) {
    const chains = ['Marriott', 'Hilton', 'Hyatt', 'Holiday Inn', 'Radisson', 'Sheraton'];
    const types = ['Luxury', 'Business', 'Mid-range', 'Budget'];

    return Array.from({ length: count }, (_, index) => ({
      name: `${chains[index % chains.length]} ${city}`,
      chain: chains[index % chains.length],
      basePrice: [80, 120, 180, 250][index % 4],
      rating: (3 + Math.random() * 2).toFixed(1),
      type: types[index % types.length]
    }));
  }

  // In your amadeusService.js - Update the car search method:

  async searchCars(params) {
    try {
      const isAvailable = await this.isAmadeusAvailable();

      if (!isAvailable) {
        console.log('🚗 Amadeus not available, using enhanced mock car data');
        return this.getEnhancedMockCarData(params);
      }

      console.log('🚗 Attempting REAL Amadeus car search...');

      // Format dates properly for Amadeus
      const pickUpDate = params.fromDateTime.split('T')[0];
      const pickUpTime = params.fromDateTime.split('T')[1];
      const dropOffDate = params.toDateTime.split('T')[0];
      const dropOffTime = params.toDateTime.split('T')[1];

      let carData = [];

      try {
        // Method 1: Car Rental Availability (Primary endpoint)
        console.log('Trying Car Rental Availability endpoint...');
        const response = await amadeus.shopping.availability.carAvailabilities.get({
          pickUp: params.pickupLocation,
          dropOff: params.dropLocation || params.pickupLocation,
          pickUpDate: pickUpDate,
          pickUpTime: pickUpTime,
          dropOffDate: dropOffDate,
          dropOffTime: dropOffTime,
          currency: 'USD',
          lang: 'EN'
        });

        carData = this.formatCarResponse(response.data || []);
        console.log(`✅ Real Amadeus car data: ${carData.length} results`);

      } catch (apiError) {
        console.log('❌ Car Availability failed, trying Flight Availabilities...');

        try {
          // Method 2: Flight Availabilities (as fallback - sometimes works for cars)
          const altResponse = await amadeus.shopping.availability.flightAvailabilities.post(
            JSON.stringify({
              originDestinations: [{
                id: "1",
                originLocationCode: params.pickupLocation,
                destinationLocationCode: params.dropLocation || params.pickupLocation,
                departureDateTime: {
                  date: pickUpDate,
                  time: pickUpTime
                }
              }],
              travelers: [{
                id: "1",
                travelerType: "ADULT"
              }],
              sources: ["GDS"]
            })
          );

          carData = this.formatCarResponse(altResponse.data || []);
          console.log(`✅ Alternative endpoint: ${carData.length} results`);

        } catch (altError) {
          console.log('❌ All Amadeus endpoints failed, checking API permissions...');

          // Check if it's a permission issue vs data issue
          if (altError.message && altError.message.includes('not found')) {
            console.log('🔒 Endpoint not found - likely a permissions issue with test API key');
          } else if (altError.message && altError.message.includes('unauthorized')) {
            console.log('🔒 Unauthorized - car rental API not available in your plan');
          } else {
            console.log('🔍 Generic API error - car rental likely not supported in test environment');
          }

          carData = this.getEnhancedMockCarData(params);
        }
      }

      // If no real data found, supplement with enhanced mock data
      if (carData.length === 0) {
        console.log('📋 No real car data found, using enhanced mock data');
        carData = this.getEnhancedMockCarData(params);
      }

      return carData;

    } catch (error) {
      console.error('🚗 Car search error:', error.message);
      console.log('🔄 Falling back to enhanced mock car data');
      return this.getEnhancedMockCarData(params);
    }
  }

  // Format car response from Amadeus
  formatCarResponse(data) {
    if (!data || !Array.isArray(data)) {
      return [];
    }

    console.log(`Formatting ${data.length} car offers from Amadeus`);

    return data.map((car, index) => {
      const vehicle = car.vehicle || {};
      const offer = car.offers?.[0] || {};
      const price = offer.price || {};

      return {
        id: car.id || `car-${index}`,
        provider: vehicle.carAcrissCode || 'Hertz',
        carType: this.mapCarType(vehicle.category || 'standard'),
        model: vehicle.model || 'Standard Vehicle',
        price: {
          total: price.total || '45.99',
          currency: price.currency || 'USD'
        },
        duration: car.rentalDuration || '3 days',
        image: '/images/car-1.jpg',
        features: this.getCarFeatures(vehicle.category),
        pickupLocation: car.pickUpLocation || '',
        dropLocation: car.dropOffLocation || '',
        fromDateTime: car.pickUpDateTime || '',
        toDateTime: car.dropOffDateTime || '',
        transmission: vehicle.transmissionType || 'automatic',
        seats: vehicle.seats || 5,
        bags: vehicle.bags || 2,
        source: 'amadeus'
      };
    });
  }

  // Enhanced mock data with realistic variations
  getEnhancedMockCarData(params) {
    const fromDate = new Date(params.fromDateTime);
    const toDate = new Date(params.toDateTime);
    const days = Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24));

    // Realistic car database with location-specific pricing
    const locationRates = {
      'NYC': { base: 45, premium: 1.4 }, // New York - expensive
      'LAX': { base: 42, premium: 1.3 }, // Los Angeles
      'CHI': { base: 38, premium: 1.2 }, // Chicago
      'MIA': { base: 35, premium: 1.1 }, // Miami
      'DFW': { base: 32, premium: 1.0 }, // Dallas
      'DEN': { base: 36, premium: 1.1 }, // Denver
      'JFK': { base: 48, premium: 1.5 }, // JFK Airport premium
      'LGA': { base: 46, premium: 1.4 }, // LaGuardia
      'default': { base: 35, premium: 1.0 }
    };

    const location = params.pickupLocation.toUpperCase();
    const locationData = locationRates[location] || locationRates.default;

    const carDatabase = [
      {
        provider: 'Hertz',
        carType: 'Economy',
        model: 'Toyota Corolla',
        basePrice: locationData.base,
        features: ['5 Seats', 'Automatic', 'Air Conditioning', 'Bluetooth'],
        transmission: 'automatic',
        seats: 5,
        bags: 2,
        image: 'economy-1'
      },
      {
        provider: 'Avis',
        carType: 'Compact',
        model: 'Honda Civic',
        basePrice: locationData.base * 1.1,
        features: ['5 Seats', 'Automatic', 'Air Conditioning', 'USB Ports'],
        transmission: 'automatic',
        seats: 5,
        bags: 2,
        image: 'compact-1'
      },
      {
        provider: 'Enterprise',
        carType: 'Mid-size',
        model: 'Toyota Camry',
        basePrice: locationData.base * 1.3,
        features: ['5 Seats', 'Automatic', 'Air Conditioning', 'GPS Ready'],
        transmission: 'automatic',
        seats: 5,
        bags: 3,
        image: 'midsize-1'
      },
      {
        provider: 'National',
        carType: 'SUV',
        model: 'Ford Escape',
        basePrice: locationData.base * 1.8,
        features: ['5 Seats', 'Automatic', 'Air Conditioning', 'All-Wheel Drive'],
        transmission: 'automatic',
        seats: 5,
        bags: 4,
        image: 'suv-1'
      },
      {
        provider: 'Alamo',
        carType: 'Luxury',
        model: 'BMW 3 Series',
        basePrice: locationData.base * 2.5,
        features: ['5 Seats', 'Automatic', 'Leather Seats', 'Premium Sound'],
        transmission: 'automatic',
        seats: 5,
        bags: 2,
        image: 'luxury-1'
      }
    ];

    return carDatabase.map((car, index) => {
      // Add random variation ±15%
      const priceVariation = 0.85 + (Math.random() * 0.3);
      const baseDailyRate = car.basePrice * priceVariation * locationData.premium;

      // Age surcharge for drivers under 25
      const ageSurcharge = params.age < 25 ? 1.25 : 1.0;

      const finalPrice = baseDailyRate * days * ageSurcharge;
      const taxes = finalPrice * 0.18;

      return {
        id: `car-${location}-${index + 1}`,
        provider: car.provider,
        carType: car.carType,
        model: car.model,
        price: {
          total: (finalPrice + taxes).toFixed(2),
          currency: 'USD',
          base: finalPrice.toFixed(2),
          taxes: taxes.toFixed(2)
        },
        duration: `${days} day${days > 1 ? 's' : ''}`,
        image: `/images/cars/${car.image}.jpg`,
        features: car.features,
        pickupLocation: params.pickupLocation,
        dropLocation: params.dropLocation || params.pickupLocation,
        fromDateTime: params.fromDateTime,
        toDateTime: params.toDateTime,
        transmission: car.transmission,
        seats: car.seats,
        bags: car.bags,
        fuelPolicy: 'Full to Full',
        mileage: 'Unlimited',
        source: 'enhanced-mock',
        realData: false,
        locationPremium: location !== 'default' ? 'Yes' : 'No',
        youngDriverSurcharge: params.age < 25 ? '25%' : 'None'
      };
    });
  }

  // Helper methods for car search
  mapCarType(acrissCode) {
    const typeMap = {
      'ECAR': 'Economy',
      'CCAR': 'Compact',
      'ICAR': 'Intermediate',
      'SCAR': 'Standard',
      'FCAR': 'Full-size',
      'PFAR': 'Premium',
      'LFAR': 'Luxury',
      'SUAR': 'SUV',
      'MVAR': 'Minivan',
      'SPAR': 'Special'
    };
    return typeMap[acrissCode] || 'Standard';
  }

  getCarFeatures(category) {
    const featureMap = {
      'ECAR': ['5 Seats', 'Automatic', 'Air Conditioning'],
      'CCAR': ['5 Seats', 'Automatic', 'Air Conditioning', 'Bluetooth'],
      'ICAR': ['5 Seats', 'Automatic', 'Dual AC', 'USB Ports'],
      'SCAR': ['5 Seats', 'Automatic', 'Dual AC', 'Premium Audio'],
      'FCAR': ['5 Seats', 'Automatic', 'Dual AC', 'Leather Seats'],
      'SUV': ['5-7 Seats', 'Automatic', 'Air Conditioning', 'All-Wheel Drive'],
      'LUXURY': ['5 Seats', 'Automatic', 'Leather Seats', 'Premium Sound']
    };
    return featureMap[category] || ['5 Seats', 'Automatic', 'Air Conditioning'];
  }

  getLocationMultiplier(location) {
    const multipliers = {
      'NYC': 1.3,  // New York - expensive
      'LAX': 1.2,  // Los Angeles
      'CHI': 1.1,  // Chicago
      'MIA': 1.0,  // Miami - average
      'DFW': 0.9,  // Dallas - cheaper
      'DEN': 0.95, // Denver
      'default': 1.0
    };
    return multipliers[location] || multipliers.default;
  }

  // Cruise search (mock - Amadeus doesn't have cruise API)
  async searchCruises(params) {
    // console.log('Using mock cruise data (Amadeus cruise API not available)');
    return this.getMockCruiseData(params);
  }

  // Format flight response with deduplication
  formatFlightResponse(data) {
    if (!data || !Array.isArray(data)) {
      console.log('No flight data received from Amadeus');
      return [];
    }

    console.log(`Received ${data.length} raw flight offers from Amadeus`);

    const formattedFlights = data.map(offer => {
      const itineraries = offer.itineraries || [];
      const firstSegment = itineraries[0]?.segments?.[0] || {};
      const lastSegment = itineraries[0]?.segments?.[itineraries[0]?.segments?.length - 1] || {};
      const price = offer.price || {};
      const airlineCode = firstSegment.carrierCode;

      // Get airline name from code
      const airlineName = getAirlineName(airlineCode) || airlineCode;

      const originalPrice = price.total || '0';
      const originalCurrency = price.currency || 'USD';

      let usdPrice = originalPrice;
      if (originalCurrency === "EUR") {
        const euroAmount = parseFloat(originalPrice);
        if (!isNaN(euroAmount)) {
          usdPrice = (euroAmount * 1.17).toFixed(2);
        }
      }

      return {
        id: offer.id,
        airlineCode: airlineCode,
        airline: airlineName,
        flightNumber: `${airlineCode}${firstSegment.number || ''}`,
        departure: {
          airport: firstSegment.departure?.iataCode,
          time: firstSegment.departure?.at,
          terminal: firstSegment.departure?.terminal
        },
        arrival: {
          airport: lastSegment.arrival?.iataCode,
          time: lastSegment.arrival?.at,
          terminal: lastSegment.arrival?.terminal
        },
        duration: itineraries[0]?.duration,
        stops: (itineraries[0]?.segments?.length || 1) - 1,
        price: {
          total: usdPrice,
          currency: 'USD'
        },
        class: offer.class?.[0] || 'ECONOMY',
        source: 'amadeus'
      };
    });

    // CRITICAL: Deduplicate flights from Amadeus
    // const uniqueFlights = this.deduplicateFlights(formattedFlights);

    // console.log(`Filtered ${formattedFlights.length} raw flights to ${uniqueFlights.length} unique flights`);

    return formattedFlights;
  }

  // Fix the deduplicateFlights method - it should allow same airline, different flights
  deduplicateFlights(flights) {
    if (!flights || !Array.isArray(flights)) return [];

    const seen = new Set();
    const uniqueFlights = [];

    for (const flight of flights) {
      // Create a unique key that allows same airline but different flights
      // Include airline, flight number, departure time, and arrival time
      // This allows multiple flights from the same airline with different schedules
      const key = `${flight.airlineCode}-${flight.flightNumber}-${flight.departure.time}-${flight.arrival.time}`;

      if (!seen.has(key)) {
        seen.add(key);
        uniqueFlights.push(flight);
      } else {
        // Debug log to see what's being filtered out
        console.log(`Filtering out duplicate flight: ${flight.airlineCode} ${flight.flightNumber} at ${flight.departure.time}`);
      }
    }

    // Additional filtering: Remove unrealistic flights
    return uniqueFlights.filter(flight => {
      // Filter out flights with incorrect arrival airports
      if (flight.arrival.airport === 'ZVJ') {
        console.log(`Filtering out flight with incorrect airport ZVJ: ${flight.flightNumber}`);
        return false;
      }

      // Filter out flights with the same departure and arrival
      if (flight.departure.airport === flight.arrival.airport) {
        console.log(`Filtering out flight with same departure/arrival: ${flight.flightNumber}`);
        return false;
      }

      // Filter out flights with invalid times
      if (!flight.departure.time || !flight.arrival.time) {
        return false;
      }

      return true;
    });
  }

  // Format hotel response
  formatHotelResponse(data) {
    if (!data || !Array.isArray(data)) {
      // console.log('No hotel data received from Amadeus');
      return [];
    }

    // console.log(`Received ${data.length} hotel offers from Amadeus`);

    return data.map(hotel => {
      const offer = hotel.offers?.[0] || {};
      const price = offer.price || {};
      const hotelInfo = hotel.hotel || {};

      return {
        id: hotelInfo.hotelId,
        name: hotelInfo.name,
        rating: hotelInfo.rating || 0,
        address: {
          line1: hotelInfo.address?.lines?.[0],
          city: hotelInfo.address?.cityName,
          country: hotelInfo.address?.countryCode
        },
        coordinates: {
          latitude: hotelInfo.geoCode?.latitude,
          longitude: hotelInfo.geoCode?.longitude
        },
        price: {
          total: price.total,
          currency: price.currency,
          base: price.base
        },
        checkIn: offer.checkInDate,
        checkOut: offer.checkOutDate,
        roomType: offer.room?.typeEstimated?.category || 'Standard',
        description: offer.room?.description?.text,
        source: 'amadeus' // Mark as real data
      };
    });
  }

  // In amadeusService.js - REPLACE the getMockFlightData function
  getMockFlightData(params) {
    const { origin, destination, fromDate, toDate, tripType, adults = 1 } = params;

    // Enhanced airlines database with proper codes
    const airlines = [
      { code: 'AA', name: 'American Airlines' },
      { code: 'DL', name: 'Delta Air Lines' },
      { code: 'UA', name: 'United Airlines' },
      { code: 'EK', name: 'Emirates' },
      { code: 'LH', name: 'Lufthansa' },
      { code: 'BA', name: 'British Airways' },
      { code: 'AF', name: 'Air France' },
      { code: 'QR', name: 'Qatar Airways' },
      { code: 'EY', name: 'Etihad Airways' },
      { code: 'TK', name: 'Turkish Airlines' },
      { code: 'VS', name: 'Virgin Atlantic' },
      { code: 'B6', name: 'JetBlue Airways' },
      { code: 'WN', name: 'Southwest Airlines' },
      { code: 'AC', name: 'Air Canada' },
      { code: 'JL', name: 'Japan Airlines' }
    ];

    // Generate realistic base price based on route
    const getBasePrice = (origin, destination) => {
      const routeFactors = {
        'JFK-LAX': 350, 'JFK-LHR': 600, 'JFK-CDG': 550,
        'LAX-JFK': 350, 'LAX-LHR': 700, 'LAX-SYD': 1200,
        'LHR-JFK': 600, 'LHR-DXB': 450, 'LHR-SIN': 800,
        'default': 300
      };

      const route = `${origin}-${destination}`;
      return routeFactors[route] || routeFactors.default;
    };

    const basePrice = getBasePrice(origin, destination);
    const results = [];

    // Generate 10-15 unique flights instead of just 2
    const numFlights = 10 + Math.floor(Math.random() * 6);

    for (let i = 0; i < numFlights; i++) {
      const airline = airlines[i % airlines.length];
      const flightNum = `${airline.code}${100 + i}`;

      // Generate unique departure times (spread throughout the day)
      const hour = 6 + Math.floor(Math.random() * 14); // 6 AM to 8 PM
      const minute = Math.floor(Math.random() * 60);
      const departureTime = `${fromDate}T${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`;

      // Calculate realistic duration (3-12 hours)
      const durationHours = 3 + Math.floor(Math.random() * 10);
      const durationMinutes = Math.floor(Math.random() * 60);
      const duration = `PT${durationHours}H${durationMinutes}M`;

      // Calculate arrival time
      const arrivalDate = new Date(departureTime);
      arrivalDate.setHours(arrivalDate.getHours() + durationHours);
      arrivalDate.setMinutes(arrivalDate.getMinutes() + durationMinutes);
      const arrivalTime = arrivalDate.toISOString().replace('Z', '');

      // Price variation (±20%)
      const priceVariation = 0.8 + (Math.random() * 0.4);
      const price = (basePrice * priceVariation * adults).toFixed(2);

      // Stops (0, 1, or 2)
      const stopsOptions = [0, 0, 0, 1, 1, 2]; // Weighted towards non-stop
      const stops = stopsOptions[Math.floor(Math.random() * stopsOptions.length)];

      // For stops, generate layover airport
      const layoverAirports = ['ORD', 'DFW', 'ATL', 'LAX', 'DEN', 'JFK', 'LHR', 'CDG', 'DXB'];
      const layover = stops > 0 ? layoverAirports[Math.floor(Math.random() * layoverAirports.length)] : null;

      results.push({
        id: `mock-${origin}-${destination}-${i}`,
        airlineCode: airline.code,
        airline: airline.name,
        flightNumber: flightNum,
        departure: {
          airport: origin,
          time: departureTime,
          terminal: Math.floor(Math.random() * 5) + 1
        },
        arrival: {
          airport: destination, // FIXED: Use actual destination, not ZVJ
          time: arrivalTime,
          terminal: Math.floor(Math.random() * 5) + 1
        },
        duration: duration,
        stops: stops,
        price: {
          total: price,
          currency: 'USD'
        },
        class: params.travelClass || 'ECONOMY',
        source: 'mock',
        layover: layover
      });
    }

    // For round trips, generate return flights
    if (tripType === 'roundTrip' && toDate) {
      const returnFlights = this.getMockFlightData({
        ...params,
        origin: destination,
        destination: origin,
        fromDate: toDate,
        tripType: 'oneWay'
      });

      // Combine with outbound flights (in real app, you'd pair them)
      // For simplicity, we'll just add them as separate one-way options
      results.push(...returnFlights.map(f => ({
        ...f,
        id: f.id.replace('mock-', 'mock-return-'),
        tripType: 'roundTrip'
      })));
    }

    console.log(`Generated ${results.length} unique mock flights for ${origin} → ${destination}`);
    return results;
  }

  // Mock hotel data for development
  getMockHotelData(params) {
    const nights = Math.ceil((new Date(params.checkOutDate) - new Date(params.checkInDate)) / (1000 * 60 * 60 * 24));
    const basePrice = 100 + Math.floor(Math.random() * 200);

    const results = [
      {
        id: 'mock-1',
        name: 'Luxury Hotel',
        rating: 4.5,
        address: {
          line1: '123 Main Street',
          city: params.destination,
          country: 'US'
        },
        coordinates: {
          latitude: 40.7128,
          longitude: -74.0060
        },
        price: {
          total: (basePrice * nights).toFixed(2),
          currency: 'USD',
          base: (basePrice * nights).toFixed(2)
        },
        checkIn: params.checkInDate,
        checkOut: params.checkOutDate,
        roomType: 'Deluxe King',
        description: 'Spacious room with king bed and city view',
        amenities: ['Free WiFi', 'Swimming Pool', 'Fitness Center', 'Restaurant'],
        source: 'mock'
      },
      {
        id: 'mock-2',
        name: 'Budget Inn',
        rating: 3.2,
        address: {
          line1: '456 Side Street',
          city: params.destination,
          country: 'US'
        },
        coordinates: {
          latitude: 40.7138,
          longitude: -74.0070
        },
        price: {
          total: (basePrice * 0.6 * nights).toFixed(2),
          currency: 'USD',
          base: (basePrice * 0.6 * nights).toFixed(2)
        },
        checkIn: params.checkInDate,
        checkOut: params.checkOutDate,
        roomType: 'Standard Queen',
        description: 'Comfortable room with queen bed',
        amenities: ['Free WiFi', 'Parking', 'Breakfast Included'],
        source: 'mock'
      }
    ];

    // console.log(`Generated ${results.length} mock hotel offers`);
    return results;
  }

  // Mock car data for development
  getMockCarData(params) {
    const days = Math.ceil((new Date(params.toDateTime) - new Date(params.fromDateTime)) / (1000 * 60 * 60 * 24));
    const basePrice = 30 + Math.floor(Math.random() * 70);

    const results = [
      {
        id: 'mock-1',
        provider: 'Hertz',
        carType: 'Economy',
        model: 'Toyota Corolla',
        price: (basePrice * days).toFixed(2),
        duration: `${days} days`,
        image: '/images/car-1.jpg',
        features: ['5 Seats', 'Automatic', 'Air Conditioning'],
        pickupLocation: params.pickupLocation,
        dropLocation: params.dropLocation || params.pickupLocation,
        fromDateTime: params.fromDateTime,
        toDateTime: params.toDateTime,
        source: 'mock'
      },
      {
        id: 'mock-2',
        provider: 'Avis',
        carType: 'SUV',
        model: 'Honda CR-V',
        price: (basePrice * 1.5 * days).toFixed(2),
        duration: `${days} days`,
        image: '/images/car-2.jpg',
        features: ['5 Seats', 'Automatic', 'Air Conditioning', 'GPS'],
        pickupLocation: params.pickupLocation,
        dropLocation: params.dropLocation || params.pickupLocation,
        fromDateTime: params.fromDateTime,
        toDateTime: params.toDateTime,
        source: 'mock'
      }
    ];

    // console.log(`Generated ${results.length} mock car offers`);
    return results;
  }

  // Mock cruise data for development
  getMockCruiseData(params) {
    const basePrice = 500 + Math.floor(Math.random() * 1000);

    const results = [
      {
        id: 'mock-1',
        cruiseLine: 'Royal Caribbean',
        shipName: 'Symphony of the Seas',
        destination: params.destination || 'Caribbean',
        nights: params.nights || 7,
        price: (basePrice * (params.nights || 7)).toFixed(2),
        departureDate: params.fromDate || '2023-12-15',
        image: '/images/cruise-1.jpg',
        itinerary: ['Miami', 'Nassau', 'St. Thomas', 'St. Maarten'],
        amenities: ['All Meals Included', 'Swimming Pools', 'Entertainment', 'Fitness Center'],
        source: 'mock'
      },
      {
        id: 'mock-2',
        cruiseLine: 'Norwegian',
        shipName: 'Norwegian Escape',
        destination: params.destination || 'Bahamas',
        nights: params.nights || 4,
        price: (basePrice * 0.8 * (params.nights || 4)).toFixed(2),
        departureDate: params.fromDate || '2023-12-20',
        image: '/images/cruise-2.jpg',
        itinerary: ['Orlando', 'Great Stirrup Cay', 'Nassau'],
        amenities: ['All Meals Included', 'Casino', 'Spa', 'Multiple Restaurants'],
        source: 'mock'
      }
    ];

    // console.log(`Generated ${results.length} mock cruise offers`);
    return results;
  }
}

module.exports = new AmadeusService();