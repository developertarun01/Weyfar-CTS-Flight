const Amadeus = require('amadeus');

// Initialize Amadeus API client
let amadeus;
try {
  amadeus = new Amadeus({
    clientId: process.env.AMADEUS_API_KEY,
    clientSecret: process.env.AMADEUS_API_SECRET,
    hostname: 'test' // use 'production' when live
  });

  console.log('Amadeus client initialized successfully');
} catch (error) {
  console.error('Failed to initialize Amadeus client:', error.message);
  // Create a mock amadeus object to prevent crashes
  amadeus = {
    shopping: {
      flightOffersSearch: {
        get: () => Promise.reject(new Error('Amadeus not configured'))
      },
      hotelOffers: {
        get: () => Promise.reject(new Error('Amadeus not configured'))
      }
    },
    referenceData: {
      urls: {
        checkinLinks: {
          get: () => Promise.reject(new Error('Amadeus not configured'))
        }
      }
    }
  };
}

// Helper function to extract meaningful error information from Amadeus errors
const extractAmadeusError = (error) => {
  if (!error) return 'Unknown error';

  // If it's already a string or Error object
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;

  // If it's an object with code and description
  if (error.code && error.description) {
    return `Error ${error.code}: ${error.description}`;
  }

  // If it's an object with message
  if (error.message) {
    return error.message;
  }

  // If it's an object with status and result
  if (error.status && error.result) {
    try {
      const result = typeof error.result === 'string' ? JSON.parse(error.result) : error.result;
      if (result.errors && Array.isArray(result.errors) && result.errors.length > 0) {
        const firstError = result.errors[0];
        return `Error ${firstError.code || error.status}: ${firstError.title || firstError.detail || 'Unknown error'}`;
      }
    } catch (e) {
      // If parsing fails, fall through to default handling
    }
  }

  // Default: stringify the object but limit length
  try {
    const str = JSON.stringify(error);
    return str.length > 200 ? str.substring(0, 200) + '...' : str;
  } catch (e) {
    return 'Unable to parse error object';
  }
};

// Test connection with better error handling
const testAmadeusConnection = async () => {
  try {
    // ✅ Add airlineCode parameter
    const response = await amadeus.referenceData.urls.checkinLinks.get({
      airlineCode: 'BA'
    });
    console.log('Amadeus API connected successfully:', response.data);
    return true;
  } catch (error) {
    const errorMessage = extractAmadeusError(error);
    console.error('Amadeus API connection failed:', errorMessage);

    if (error.code === 38190 || error.code === 38191 ||
      (error.status && error.status >= 400 && error.status < 500)) {
      console.log('This appears to be an authentication or parameter issue. Please verify your AMADEUS_API_KEY/SECRET and required params.');
    }

    return false;
  }
};


// Test connection but don't block server startup
setTimeout(() => {
  testAmadeusConnection().then(isConnected => {
    if (!isConnected) {
      console.log('Application will use mock data for travel searches');
      console.log('To use real Amadeus data, ensure your API keys are correct and properly configured');
    }
  });
}, 1000);

module.exports = {
  amadeus,
  extractAmadeusError
};