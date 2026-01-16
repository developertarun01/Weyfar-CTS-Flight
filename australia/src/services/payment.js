import axios from 'axios';

// Mock payment service - in real app, integrate with Razorpay/PayPal
export const PaymentService = {
  // Initialize payment (mock)
  async initializePayment(amount, currency = 'USD') {
    return {
      id: 'order_' + Math.random().toString(36).substr(2, 9),
      amount: amount * 100, // in cents
      currency: currency.toLowerCase(),
      status: 'created'
    };
  },

  // Process payment (mock)
  async processPayment(orderId, paymentData) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate successful payment 90% of the time
    const success = Math.random() > 0.1;
    
    if (success) {
      return {
        success: true,
        paymentId: 'pay_' + Math.random().toString(36).substr(2, 9),
        orderId,
        status: 'completed',
        amount: paymentData.amount,
        currency: paymentData.currency
      };
    } else {
      throw new Error('Payment failed. Please try again.');
    }
  },

  // Validate card (mock)
  validateCard(card) {
    const errors = {};
    
    // Basic validation
    if (!card.number || card.number.replace(/\s/g, '').length !== 16) {
      errors.number = 'Invalid card number';
    }
    
    if (!card.name || card.name.trim().length < 2) {
      errors.name = 'Invalid cardholder name';
    }
    
    if (!card.expiry || !/^\d{2}\/\d{2}$/.test(card.expiry)) {
      errors.expiry = 'Invalid expiry date';
    }
    
    if (!card.cvv || card.cvv.length < 3) {
      errors.cvv = 'Invalid CVV';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  // Format currency
  formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }
};

export default PaymentService;