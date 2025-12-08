const Razorpay = require('razorpay');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

class PaymentService {
  // Create a new payment order
  async createOrder(amount, currency = 'INR') {
    try {
      const options = {
        amount: Math.round(amount * 100), // convert to paise
        currency,
        receipt: `receipt_${Date.now()}`,
        payment_capture: 1 // auto capture payment
      };
      
      const order = await razorpay.orders.create(options);
      return order;
    } catch (error) {
      console.error('Razorpay order creation error:', error);
      throw new Error('Failed to create payment order');
    }
  }

  // Verify payment signature
  async verifyPayment(paymentId, orderId, signature) {
    try {
      const crypto = require('crypto');
      const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
      hmac.update(orderId + '|' + paymentId);
      const generatedSignature = hmac.digest('hex');
      
      return generatedSignature === signature;
    } catch (error) {
      console.error('Payment verification error:', error);
      return false;
    }
  }

  // Get payment details
  async getPaymentDetails(paymentId) {
    try {
      const payment = await razorpay.payments.fetch(paymentId);
      return payment;
    } catch (error) {
      console.error('Error fetching payment details:', error);
      throw new Error('Failed to fetch payment details');
    }
  }

  // Refund payment
  async refundPayment(paymentId, amount) {
    try {
      const refund = await razorpay.payments.refund(paymentId, {
        amount: Math.round(amount * 100)
      });
      return refund;
    } catch (error) {
      console.error('Error processing refund:', error);
      throw new Error('Failed to process refund');
    }
  }
}

module.exports = new PaymentService();