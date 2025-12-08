import React, { useState } from "react";
import { CreditCard, Lock, CheckCircle, Shield } from "lucide-react";

const PaymentForm = ({ booking, onPaymentSuccess, onPaymentError }) => {
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
    type: "visa",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  const cardTypes = [
    { value: "visa", label: "Visa" },
    { value: "mastercard", label: "MasterCard" },
    { value: "amex", label: "American Express" },
    { value: "discover", label: "Discover" },
    { value: "rupay", label: "RuPay" },
  ];

  const validateForm = () => {
    const newErrors = {};

    if (cardDetails.number.replace(/\s/g, "").length !== 16) {
      newErrors.number = "Card number must be 16 digits";
    }

    if (!cardDetails.name.trim()) {
      newErrors.name = "Cardholder name is required";
    }

    if (!cardDetails.expiry || !cardDetails.expiry.includes("/")) {
      newErrors.expiry = "Valid expiry date required (MM/YY)";
    }

    if (cardDetails.cvv.length < 3) {
      newErrors.cvv = "CVV must be at least 3 digits";
    }

    if (!cardDetails.type) {
      newErrors.type = "Please select card type";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCardChange = (field, value) => {
    setCardDetails((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Auto-detect card type from number
    if (field === "number") {
      const cleanedNumber = value.replace(/\s/g, "");
      if (/^4/.test(cleanedNumber)) {
        setCardDetails((prev) => ({ ...prev, type: "visa" }));
      } else if (/^5[1-5]/.test(cleanedNumber)) {
        setCardDetails((prev) => ({ ...prev, type: "mastercard" }));
      } else if (/^3[47]/.test(cleanedNumber)) {
        setCardDetails((prev) => ({ ...prev, type: "amex" }));
      } else if (/^6(?:011|5)/.test(cleanedNumber)) {
        setCardDetails((prev) => ({ ...prev, type: "discover" }));
      } else if (/^6/.test(cleanedNumber)) {
        setCardDetails((prev) => ({ ...prev, type: "rupay" }));
      }
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create payment data with card details (masked for security)
      const selectedCardType = cardTypes.find(
        (type) => type.value === cardDetails.type
      );
      const paymentData = {
        paymentId:
          "PAY_" + Math.random().toString(36).substr(2, 9).toUpperCase(),
        amount: booking.pricing.finalPrice,
        currency: booking.pricing.currency,
        status: "completed",
        method: paymentMethod === "credit" ? "Credit Card" : "Debit Card",
        cardLastFour: cardDetails.number.slice(-4),
        cardType: selectedCardType ? selectedCardType.label : "Credit Card",
        paidAt: new Date().toISOString(),
        cardDetails: {
          holderName: cardDetails.name,
          expiry: cardDetails.expiry,
          type: cardDetails.type,
          // Note: In real application, never store full card details
          // This is just for demo purposes
          number: "**** **** **** " + cardDetails.number.slice(-4),
        },
      };

      onPaymentSuccess(paymentData);
    } catch (error) {
      onPaymentError("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    return parts.length ? parts.join(" ") : value;
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\D/g, "").substring(0, 4);
    if (v.length >= 3) {
      return `${v.substring(0, 2)}/${v.substring(2)}`;
    }
    return value;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <CreditCard className="h-6 w-6 mr-2 text-[var(--primary)]" />
        Payment Details
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Payment Method</h3>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <label
              className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                paymentMethod === "credit"
                  ? "border-[var(--primary)] bg-blue-50"
                  : "border-gray-300 hover:bg-gray-50"
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="credit"
                checked={paymentMethod === "credit"}
                onChange={() => setPaymentMethod("credit")}
                className="h-4 w-4 text-[var(--primary)]"
              />
              <CreditCard className="h-5 w-5 mx-3 text-[var(--primary)]" />
              <span className="font-semibold">Credit Card</span>
            </label>

            <label
              className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                paymentMethod === "debit"
                  ? "border-[var(--primary)] bg-blue-50"
                  : "border-gray-300 hover:bg-gray-50"
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="debit"
                checked={paymentMethod === "debit"}
                onChange={() => setPaymentMethod("debit")}
                className="h-4 w-4 text-[var(--primary)]"
              />
              <CreditCard className="h-5 w-5 mx-3 text-[var(--primary)]" />
              <span className="font-semibold">Debit Card</span>
            </label>
          </div>

          {(paymentMethod === "credit" || paymentMethod === "debit") && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Card Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Type
                </label>
                <select
                  value={cardDetails.type}
                  onChange={(e) => handleCardChange("type", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
                    errors.type
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-[var(--primary)]"
                  }`}
                  required
                >
                  <option value="">Select Card Type</option>
                  {cardTypes.map((cardType) => (
                    <option key={cardType.value} value={cardType.value}>
                      {cardType.label}
                    </option>
                  ))}
                </select>
                {errors.type && (
                  <p className="text-red-500 text-sm mt-1">{errors.type}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={formatCardNumber(cardDetails.number)}
                  onChange={(e) => handleCardChange("number", e.target.value)}
                  maxLength={19}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
                    errors.number
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-[var(--primary)]"
                  }`}
                  required
                />
                {errors.number && (
                  <p className="text-red-500 text-sm mt-1">{errors.number}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={cardDetails.name}
                  onChange={(e) => handleCardChange("name", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
                    errors.name
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-[var(--primary)]"
                  }`}
                  required
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={formatExpiry(cardDetails.expiry)}
                    onChange={(e) => handleCardChange("expiry", e.target.value)}
                    maxLength={5}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
                      errors.expiry
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-[var(--primary)]"
                    }`}
                    required
                  />
                  {errors.expiry && (
                    <p className="text-red-500 text-sm mt-1">{errors.expiry}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    value={cardDetails.cvv}
                    onChange={(e) =>
                      handleCardChange("cvv", e.target.value.replace(/\D/g, ""))
                    }
                    maxLength={4}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
                      errors.cvv
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-[var(--primary)]"
                    }`}
                    required
                  />
                  {errors.cvv && (
                    <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-4">
                <Shield className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-600">
                  Your payment details are encrypted and secure
                </span>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className={`w-full py-3 px-4 rounded-lg font-medium mt-6 transition-colors duration-200 flex items-center justify-center ${
                  isProcessing
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-[var(--accent-dark)] hover:bg-[var(--accent)] text-white"
                }`}
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <Lock className="h-5 w-5 mr-2" />
                    Continue
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${booking.pricing.basePrice.toFixed(2)}</span>
              </div>
              {booking.pricing.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount:</span>
                  <span>-${booking.pricing.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg border-t pt-3">
                <span>Total:</span>
                <span>${booking.pricing.finalPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                What's Included
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Full booking confirmation</li>
                <li>• 24/7 customer support</li>
                <li>• Free cancellation within 24 hours</li>
                <li>• Email itinerary</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
