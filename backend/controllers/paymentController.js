const paymentService = require('../services/paymentService');
const Booking = require('../models/Booking');

// Create payment order
exports.createPaymentOrder = async (req, res, next) => {
  try {
    const { bookingId, amount, currency } = req.body;

    // Verify booking exists
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Create payment order
    const order = await paymentService.createOrder(amount, currency);

    // Update booking with payment order ID
    booking.paymentOrderId = order.id;
    await booking.save();

    res.json({
      success: true,
      data: order,
      message: 'Payment order created successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Verify payment
exports.verifyPayment = async (req, res, next) => {
  try {
    const { bookingId, paymentId, orderId, signature } = req.body;

    // Verify payment
    const isVerified = await paymentService.verifyPayment(
      paymentId, 
      orderId, 
      signature
    );

    if (!isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }

    // Update booking status
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    booking.status = 'confirmed';
    booking.payment = {
      paymentId,
      orderId,
      status: 'completed',
      paidAt: new Date()
    };

    await booking.save();

    res.json({
      success: true,
      data: booking,
      message: 'Payment verified successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get payment status
exports.getPaymentStatus = async (req, res, next) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      data: {
        status: booking.status,
        payment: booking.payment
      },
      message: 'Payment status retrieved successfully'
    });
  } catch (error) {
    next(error);
  }
};