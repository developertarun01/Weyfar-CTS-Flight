const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { bookingSchema } = require('../middleware/validation');
const Joi = require('joi');

// Create a new booking
router.post('/', async (req, res, next) => {
  try {
    // Validate request body
    const validation = bookingSchema.validate(req.body);
    if (validation.error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.error.details
      });
    }

    await bookingController.createBooking(req, res, next);
  } catch (error) {
    next(error);
  }
});

// Get booking by ID
router.get('/:id', bookingController.getBooking);

// Validate promo code
router.post('/validate-promo', async (req, res, next) => {
  try {
    const schema = Joi.object({
      code: Joi.string().required(),
      amount: Joi.number().min(0).required()
    });

    const validation = schema.validate(req.body);
    if (validation.error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.error.details
      });
    }

    await bookingController.validatePromoCode(req, res, next);
  } catch (error) {
    next(error);
  }
});

module.exports = router;