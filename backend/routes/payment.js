const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { paymentSchema } = require('../middleware/validation');
const Joi = require('joi');

// Create payment order
router.post('/create-order', async (req, res, next) => {
  try {
    // Validate request body
    const validation = paymentSchema.validate(req.body);
    if (validation.error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.error.details
      });
    }

    await paymentController.createPaymentOrder(req, res, next);
  } catch (error) {
    next(error);
  }
});

// Verify payment
router.post('/verify', async (req, res, next) => {
  try {
    const schema = Joi.object({
      bookingId: Joi.string().required(),
      paymentId: Joi.string().required(),
      orderId: Joi.string().required(),
      signature: Joi.string().required()
    });

    const validation = schema.validate(req.body);
    if (validation.error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.error.details
      });
    }

    await paymentController.verifyPayment(req, res, next);
  } catch (error) {
    next(error);
  }
});

// Get payment status
router.get('/status/:bookingId', paymentController.getPaymentStatus);

module.exports = router;