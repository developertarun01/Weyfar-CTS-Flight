const Booking = require('../models/Booking');
const PromoCode = require('../models/PromoCode');

// Create a new booking
exports.createBooking = async (req, res, next) => {
  try {
    const {
      type,
      details,
      passengers,
      contactInfo,
      promoCode
    } = req.body;

    // Calculate base price
    let totalPrice = details.basePrice || 0;

    // Apply promo code discount if provided
    let discount = 0;
    if (promoCode) {
      const promo = await PromoCode.findOne({ code: promoCode.toUpperCase(), isActive: true });
      
      if (promo) {
        if (promo.discountType === 'percentage') {
          discount = totalPrice * (promo.discountValue / 100);
        } else {
          discount = promo.discountValue;
        }
        
        // Ensure discount doesn't exceed maximum discount if specified
        if (promo.maxDiscount && discount > promo.maxDiscount) {
          discount = promo.maxDiscount;
        }
      }
    }

    const finalPrice = totalPrice - discount;

    // Create booking
    const booking = new Booking({
      type,
      details,
      passengers,
      contactInfo,
      pricing: {
        basePrice: totalPrice,
        discount,
        finalPrice,
        currency: 'USD'
      },
      promoCode: promoCode || null,
      status: 'pending'
    });

    await booking.save();

    res.status(201).json({
      success: true,
      data: booking,
      message: 'Booking created successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get booking by ID
exports.getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      data: booking,
      message: 'Booking retrieved successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Validate promo code
exports.validatePromoCode = async (req, res, next) => {
  try {
    const { code, amount } = req.body;
    
    const promoCode = await PromoCode.findOne({ 
      code: code.toUpperCase(), 
      isActive: true 
    });

    if (!promoCode) {
      return res.status(400).json({
        success: false,
        message: 'Invalid promo code'
      });
    }

    // Check if promo code has expired
    if (promoCode.validUntil && new Date() > promoCode.validUntil) {
      return res.status(400).json({
        success: false,
        message: 'Promo code has expired'
      });
    }

    // Calculate discount
    let discount = 0;
    if (promoCode.discountType === 'percentage') {
      discount = amount * (promoCode.discountValue / 100);
    } else {
      discount = promoCode.discountValue;
    }

    // Apply maximum discount if specified
    if (promoCode.maxDiscount && discount > promoCode.maxDiscount) {
      discount = promoCode.maxDiscount;
    }

    res.json({
      success: true,
      data: {
        code: promoCode.code,
        discount,
        discountType: promoCode.discountType,
        finalAmount: amount - discount
      },
      message: 'Promo code applied successfully'
    });
  } catch (error) {
    next(error);
  }
};