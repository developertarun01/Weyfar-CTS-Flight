// Travel-related constants
const TRAVEL_CLASS = {
    ECONOMY: 'ECONOMY',
    PREMIUM_ECONOMY: 'PREMIUM_ECONOMY',
    BUSINESS: 'BUSINESS',
    FIRST: 'FIRST'
};

const TRIP_TYPE = {
    ROUND_TRIP: 'roundTrip',
    ONE_WAY: 'oneWay',
    MULTI_CITY: 'multiCity'
};

const BOOKING_STATUS = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    CANCELLED: 'cancelled',
    COMPLETED: 'completed'
};

const PAYMENT_STATUS = {
    PENDING: 'pending',
    COMPLETED: 'completed',
    FAILED: 'failed',
    REFUNDED: 'refunded'
};

// API response messages
const MESSAGES = {
    SUCCESS: 'Operation completed successfully',
    ERROR: 'An error occurred',
    NOT_FOUND: 'Resource not found',
    VALIDATION_ERROR: 'Validation failed',
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Access forbidden'
};

// Default pagination settings
const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100
};

// Currency options
const CURRENCIES = {
    USD: 'US Dollar',
    EUR: 'Euro',
    GBP: 'British Pound',
    INR: 'Indian Rupee'
};

// Countries list (abbreviated)
const COUNTRIES = [
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'CA', name: 'Canada' },
    { code: 'AU', name: 'Australia' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'IN', name: 'India' },
    { code: 'JP', name: 'Japan' }
];

module.exports = {
    TRAVEL_CLASS,
    TRIP_TYPE,
    BOOKING_STATUS,
    PAYMENT_STATUS,
    MESSAGES,
    PAGINATION,
    CURRENCIES,
    COUNTRIES
};