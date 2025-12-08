const mongoose = require('mongoose');

const promoCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true
  },
  discountValue: {
    type: Number,
    required: true,
    min: 0
  },
  maxDiscount: {
    type: Number,
    min: 0
  },
  minOrderValue: {
    type: Number,
    min: 0
  },
  validFrom: {
    type: Date,
    default: Date.now
  },
  validUntil: {
    type: Date
  },
  usageLimit: {
    type: Number,
    min: 0
  },
  usedCount: {
    type: Number,
    default: 0,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  applicableServices: [{
    type: String,
    enum: ['flight', 'hotel', 'car', 'cruise']
  }],
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
promoCodeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Check if promo code is valid
promoCodeSchema.methods.isValid = function() {
  if (!this.isActive) return false;
  if (this.validUntil && new Date() > this.validUntil) return false;
  if (this.usageLimit && this.usedCount >= this.usageLimit) return false;
  return true;
};

// Increment usage count
promoCodeSchema.methods.incrementUsage = function() {
  this.usedCount += 1;
  return this.save();
};

module.exports = mongoose.model('PromoCode', promoCodeSchema);