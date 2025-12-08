const mongoose = require('mongoose');

const passengerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
  },
  passportNumber: {
    type: String,
    trim: true
  },
  nationality: {
    type: String,
    trim: true
  }
});

const contactSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true }
  }
});

const pricingSchema = new mongoose.Schema({
  basePrice: {
    type: Number,
    required: true,
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0
  },
  finalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD'
  }
});

const paymentSchema = new mongoose.Schema({
  paymentId: {
    type: String,
    trim: true
  },
  orderId: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paidAt: {
    type: Date
  }
});

const bookingSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['flight', 'hotel', 'car', 'cruise'],
    required: true
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  passengers: [passengerSchema],
  contactInfo: contactSchema,
  pricing: pricingSchema,
  promoCode: {
    type: String,
    trim: true
  },
  paymentOrderId: {
    type: String,
    trim: true
  },
  payment: paymentSchema,
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
bookingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create index for better query performance
bookingSchema.index({ createdAt: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ 'contactInfo.email': 1 });

module.exports = mongoose.model('Booking', bookingSchema);