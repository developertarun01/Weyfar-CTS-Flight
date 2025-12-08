const Joi = require('joi');

// Validation schemas for different search types
const searchSchemas = {
  flight: Joi.object({
    tripType: Joi.string().valid('roundTrip', 'oneWay').required(),
    origin: Joi.string().min(3).max(3).required(),
    destination: Joi.string().min(3).max(3).required(),
    fromDate: Joi.date().iso().min(new Date().toISOString().split('T')[0]).required(),
    toDate: Joi.when('tripType', {
      is: 'roundTrip',
      then: Joi.date().iso().min(Joi.ref('fromDate')).required(), // ← Also change here
      otherwise: Joi.optional()
    }),
    adults: Joi.number().min(1).max(100).default(1),
    children: Joi.number().min(0).max(100).default(0),
    travelClass: Joi.string().valid('ECONOMY', 'PREMIUM_ECONOMY', 'BUSINESS', 'FIRST').default('ECONOMY'),
    airline: Joi.string().min(3)
  }),

  hotel: Joi.object({
    destination: Joi.string().min(3).required(),
    checkInDate: Joi.date().iso().min(new Date().toISOString().split('T')[0]).required(),
    checkOutDate: Joi.date().iso().min(Joi.ref('checkInDate')).required(),
    rooms: Joi.number().min(1).max(10).default(1),
    adults: Joi.number().min(1).max(100).default(1),
    children: Joi.number().min(0).max(100).default(0)
  }),

  car: Joi.object({
    pickupLocation: Joi.string().min(3).required(),
    dropLocation: Joi.string().min(3).required(),
    fromDateTime: Joi.date().iso().min(new Date().toISOString().split('T')[0]).required(),
    toDateTime: Joi.date().iso().min(Joi.ref('fromDateTime')).required(),
    age: Joi.number().min(21).max(80).required()
  }),

  cruise: Joi.object({
    origin: Joi.string().length(3).required().messages({
      'string.length': 'Departure port must be a 3-letter IATA code',
      'any.required': 'Departure port is required'
    }),
    destination: Joi.string().length(3).required().messages({
      'string.length': 'Destination must be a 3-letter IATA code',
      'any.required': 'Destination is required'
    }),
    departureDate: Joi.date().iso().min(new Date().toISOString().split('T')[0]).required().messages({
      'date.min': 'Departure date must be in the future',
      'any.required': 'Departure date is required'
    }),
    nights: Joi.number().min(1).max(30).required().messages({
      'number.min': 'Duration must be at least 1 night',
      'number.max': 'Duration cannot exceed 30 nights',
      'any.required': 'Duration is required'
    }),
    adults: Joi.number().min(1).max(100).required().messages({
      'number.min': 'At least 1 passenger is required',
      'number.max': 'Maximum 100 passengers allowed',
      'any.required': 'Number of passengers is required'
    }),
    children: Joi.number().min(0).max(100).required().messages({
      'number.min': 'At least 1 passenger is required',
      'number.max': 'Maximum 100 passengers allowed',
      'any.required': 'Number of passengers is required'
    }),
    cruiseLine: Joi.string().allow('').optional(),
    shipName: Joi.string().allow('').optional()
  })
};

// Validation function
const validateSearchParams = (type, data) => {
  const schema = searchSchemas[type];
  if (!schema) {
    return { error: new Error(`Invalid search type: ${type}`) };
  }

  const result = schema.validate(data, { abortEarly: false });
  console.log(`Validation result for ${type}:`, {
    data: data,
    error: result.error ? result.error.details : 'No errors'
  });
  return result;
};

// Booking validation schema
const bookingSchema = Joi.object({
  type: Joi.string().valid('flight', 'hotel', 'car', 'cruise').required(),
  details: Joi.object().required(),
  passengers: Joi.array().items(Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    dateOfBirth: Joi.date().required(),
    gender: Joi.string().valid('male', 'female', 'other').required(),
    passportNumber: Joi.string().optional(),
    nationality: Joi.string().optional()
  })).min(1).required(),
  contactInfo: Joi.object({
    email: Joi.string().email().required(),
    phone: Joi.string().min(10).max(15).required(),
    address: Joi.object({
      street: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      zipCode: Joi.string().required(),
      country: Joi.string().required()
    }).required()
  }).required(),
  promoCode: Joi.string().optional()
});

// Payment validation schema
const paymentSchema = Joi.object({
  bookingId: Joi.string().required(),
  amount: Joi.number().min(0).required(),
  currency: Joi.string().default('USD')
});

module.exports = {
  validateSearchParams,
  bookingSchema,
  paymentSchema
};