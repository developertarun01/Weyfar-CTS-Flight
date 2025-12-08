const amadeusService = require('../services/amadeusService');
const { validateSearchParams } = require('../middleware/validation');

exports.searchAirport = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters long'
      });
    }

    console.log('🔍 Airport search request for:', q);

    const results = await amadeusService.searchAirports(q);

    res.json({
      success: true,
      data: results,
      message: 'Airport search completed successfully'
    });
  } catch (error) {
    console.error('Airport search route error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search airports',
      error: error.message
    });
  }
}

// Search flights
exports.searchFlights = async (req, res, next) => {
  try {
    // Validate request parameters
    const validation = validateSearchParams('flight', req.body);
    if (validation.error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.error.details
      });
    }

    const flightData = await amadeusService.searchFlights(req.body);

    res.json({
      success: true,
      data: flightData,
      message: 'Flights fetched successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Search hotels
exports.searchHotels = async (req, res, next) => {
  try {
    // Validate request parameters
    const validation = validateSearchParams('hotel', req.body);
    if (validation.error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.error.details
      });
    }

    const hotelData = await amadeusService.searchHotels(req.body);

    res.json({
      success: true,
      data: hotelData,
      message: 'Hotels fetched successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Search cars
exports.searchCars = async (req, res, next) => {
  try {
    // Validate request parameters
    const validation = validateSearchParams('car', req.body);
    if (validation.error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.error.details
      });
    }

    // Call the Amadeus service for car search
    const carData = await amadeusService.searchCars(req.body);

    res.json({
      success: true,
      data: carData,
      message: 'Cars fetched successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Search cruises
exports.searchCruises = async (req, res, next) => {
  try {
    // Validate request parameters
    const validation = validateSearchParams('cruise', req.body);
    if (validation.error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.error.details
      });
    }

    // For demo purposes - in real implementation, integrate with cruise API
    const mockCruiseData = [
      {
        id: 1,
        cruiseLine: 'Royal Caribbean',
        shipName: 'Symphony of the Seas',
        destination: 'Caribbean',
        nights: 7,
        price: 899.99,
        departureDate: '2023-12-15',
        image: '/images/cruise-1.jpg',
        itinerary: ['Miami', 'Nassau', 'St. Thomas', 'St. Maarten']
      },
      {
        id: 2,
        cruiseLine: 'Norwegian',
        shipName: 'Norwegian Escape',
        destination: 'Bahamas',
        nights: 4,
        price: 549.99,
        departureDate: '2023-12-20',
        image: '/images/cruise-2.jpg',
        itinerary: ['Orlando', 'Great Stirrup Cay', 'Nassau']
      }
    ];

    res.json({
      success: true,
      data: mockCruiseData,
      message: 'Cruises fetched successfully'
    });
  } catch (error) {
    next(error);
  }
};