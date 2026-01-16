import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PaymentForm from '../components/booking/PaymentForm';
import { processPayment } from '../services/api';
import { CreditCard, Shield, CheckCircle } from 'lucide-react';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { booking } = location.state || {};
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [paymentResult, setPaymentResult] = useState(null);

  if (!booking) {
    navigate('/');
    return null;
  }

  useEffect(() => {
      if (window.innerWidth <= 655) {
        // For mobile - scroll to callBanner section
        const section1 = document.querySelector(".callBanner");
        if (section1) {
          const top = section1.offsetTop - 15; // 10px above section1
          window.scrollTo({ top, behavior: "smooth" });
        }
      } else {
        // For desktop - scroll to top of the page
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, []);

  const handlePaymentSuccess = async (paymentData) => {
    try {
      // Update booking with payment information
      const response = await processPayment({
        bookingId: booking._id,
        paymentData
      });

      if (response.success) {
        setPaymentStatus('success');
        setPaymentResult(response.data);
        
        // Redirect to thank you page after 2 seconds
        setTimeout(() => {
          navigate('/thank-you', {
            state: {
              booking: response.data.booking,
              payment: response.data.payment
            }
          });
        }, 2000);
      } else {
        setPaymentStatus('error');
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      setPaymentStatus('error');
    }
  };

  const handlePaymentError = (errorMessage) => {
    setPaymentStatus('error');
    alert(errorMessage);
  };

  if (paymentStatus === 'success') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-green-600 mb-4">Payment Successful!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for your payment. Your booking has been confirmed.
          </p>
          <div className="animate-pulse">
            <p className="text-gray-500">Redirecting to confirmation page...</p>
          </div>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'error') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
            <CreditCard className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-3xl font-bold text-red-600 mb-4">Payment Failed</h2>
          <p className="text-gray-600 mb-6">
            There was an issue processing your payment. Please try again or use a different payment method.
          </p>
          <button
            onClick={() => setPaymentStatus('pending')}
            className="bg-[var(--accent-dark)] hover:bg-[var(--accent)] text-white px-6 py-3 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="callBanner container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Complete Your Payment</h2>
          <p className="text-gray-600">Secure payment processed with encryption</p>
        </div>

        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4 bg-blue-50 px-6 py-3 rounded-lg">
            <Shield className="h-5 w-5 text-[var(--primary)]" />
            <span className="text-[var(--primary)] font-medium">Your payment is secure and encrypted</span>
          </div>
        </div>

        <PaymentForm
          booking={booking}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentError={handlePaymentError}
        />

        <div className="mt-8 bg-gray-50 p-6 rounded-lg">
          <h3 className="font-semibold mb-4">Payment Security</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Shield className="h-4 w-4 mr-2 text-green-600" />
              <span>256-bit SSL Encryption</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
              <span>PCI DSS Compliant</span>
            </div>
            <div className="flex items-center">
              <CreditCard className="h-4 w-4 mr-2 text-green-600" />
              <span>Secure Payment Gateway</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;