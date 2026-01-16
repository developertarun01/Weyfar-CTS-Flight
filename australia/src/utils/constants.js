// Travel-related constants
export const TRAVEL_CLASS = {
  ECONOMY: 'ECONOMY',
  PREMIUM_ECONOMY: 'PREMIUM_ECONOMY',
  BUSINESS: 'BUSINESS',
  FIRST: 'FIRST'
};

export const TRIP_TYPE = {
  ROUND_TRIP: 'roundTrip',
  ONE_WAY: 'oneWay',
  MULTI_CITY: 'multiCity'
};

export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed'
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded'
};

// API response messages
export const MESSAGES = {
  SUCCESS: 'Operation completed successfully',
  ERROR: 'An error occurred',
  NOT_FOUND: 'Resource not found',
  VALIDATION_ERROR: 'Validation failed',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden'
};

// Default pagination settings
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100
};

// Currency options
export const CURRENCIES = {
  USD: 'US Dollar',
  EUR: 'Euro',
  GBP: 'British Pound',
  INR: 'Indian Rupee'
};

// Countries list (abbreviated)
export const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'IN', name: 'India' },
  { code: 'JP', name: 'Japan' }
];

// Airlines (for mock data)
export const AIRLINES = [
  { code: 'AA', name: 'American Airlines' },
  { code: 'DL', name: 'Delta Air Lines' },
  { code: 'UA', name: 'United Airlines' },
  { code: 'SW', name: 'Southwest Airlines' },
  { code: 'LH', name: 'Lufthansa' },
  { code: 'BA', name: 'British Airways' },
  { code: 'AF', name: 'Air France' },
  { code: 'EK', name: 'Emirates' }
];

// Hotel chains (for mock data)
export const HOTEL_CHAINS = [
  'Marriott',
  'Hilton',
  'Hyatt',
  'InterContinental',
  'Accor',
  'Wyndham',
  'Choice Hotels',
  'Best Western'
];

// Car rental companies
export const CAR_RENTAL_COMPANIES = [
  'Hertz',
  'Avis',
  'Enterprise',
  'Budget',
  'National',
  'Alamo',
  'Thrifty',
  'Dollar'
];

// Cruise lines
export const CRUISE_LINES = [
  'Royal Caribbean',
  'Norwegian Cruise Line',
  'Carnival Cruise Line',
  'MSC Cruises',
  'Princess Cruises',
  'Disney Cruise Line',
  'Holland America Line',
  'Celebrity Cruises'
];