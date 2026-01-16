import React, { useState, useEffect } from "react";
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
  const [touched, setTouched] = useState({});

  const cardTypes = [
    {
      value: "visa",
      label: "Visa",
      pattern: /^4/,
      lengths: [16],
      cvvLength: 3,
    },
    {
      value: "mastercard",
      label: "MasterCard",
      pattern: /^5[1-5]/,
      lengths: [16],
      cvvLength: 3,
    },
    {
      value: "amex",
      label: "American Express",
      pattern: /^3[47]/,
      lengths: [15],
      cvvLength: 4,
    },
    {
      value: "discover",
      label: "Discover",
      pattern: /^6(?:011|5)/,
      lengths: [16],
      cvvLength: 3,
    },
    {
      value: "rupay",
      label: "RuPay",
      pattern: /^6/,
      lengths: [16],
      cvvLength: 3,
    },
  ];

  // Luhn Algorithm validation
  const validateLuhn = (cardNumber) => {
    const cleanNumber = cardNumber.replace(/\s/g, "");
    let sum = 0;
    let isEven = false;

    for (let i = cleanNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanNumber.charAt(i), 10);

      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  };

  // Expiry date validation
  const validateExpiryDate = (expiry) => {
    if (!expiry.includes("/")) return false;

    const [month, year] = expiry.split("/").map((part) => part.trim());
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);

    // Basic month validation
    if (monthNum < 1 || monthNum > 12) return false;

    // Get current date
    const now = new Date();
    const currentYear = now.getFullYear() % 100; // Last two digits
    const currentMonth = now.getMonth() + 1;

    // Year validation
    if (yearNum < currentYear) return false;
    if (yearNum === currentYear && monthNum < currentMonth) return false;

    // Future date validation (max 20 years in future)
    if (yearNum > currentYear + 20) return false;

    return true;
  };

  // Validate card number length based on card type
  const validateCardNumberLength = (number, cardType) => {
    const cleanNumber = number.replace(/\s/g, "");
    const typeConfig = cardTypes.find((type) => type.value === cardType);

    if (!typeConfig) return false;

    return typeConfig.lengths.includes(cleanNumber.length);
  };

  // Validate CVV length based on card type
  const validateCVVLength = (cvv, cardType) => {
    const typeConfig = cardTypes.find((type) => type.value === cardType);

    if (!typeConfig) return false;

    return cvv.length === typeConfig.cvvLength;
  };

  // Validate cardholder name
  const validateCardholderName = (name) => {
    if (!name.trim()) return false;

    // Basic name validation (allowing letters, spaces, hyphens, apostrophes)
    const nameRegex = /^[a-zA-Z\s'-]+$/;
    return nameRegex.test(name.trim()) && name.trim().length >= 2;
  };

  // Enhanced validation function
  const validateForm = () => {
    const newErrors = {};
    const cleanedCardNumber = cardDetails.number.replace(/\s/g, "");

    // Card number validation
    if (!cleanedCardNumber) {
      newErrors.number = "Card number is required";
    } else if (
      !validateCardNumberLength(cardDetails.number, cardDetails.type)
    ) {
      const typeConfig = cardTypes.find(
        (type) => type.value === cardDetails.type
      );
      if (typeConfig) {
        newErrors.number = `Card number must be ${
          typeConfig.lengths[0]
        } digits for ${cardDetails.type.toUpperCase()}`;
      } else {
        newErrors.number = "Invalid card number length";
      }
    } else if (!validateLuhn(cardDetails.number)) {
      newErrors.number = "Invalid card number";
    } else if (!/^\d+$/.test(cleanedCardNumber)) {
      newErrors.number = "Card number must contain only digits";
    }

    // Cardholder name validation
    if (!cardDetails.name.trim()) {
      newErrors.name = "Cardholder name is required";
    } else if (!validateCardholderName(cardDetails.name)) {
      newErrors.name =
        "Please enter a valid name (letters, spaces, hyphens, and apostrophes only)";
    }

    // Expiry date validation
    if (!cardDetails.expiry) {
      newErrors.expiry = "Expiry date is required";
    } else if (!cardDetails.expiry.includes("/")) {
      newErrors.expiry = "Please use MM/YY format";
    } else {
      const [month, year] = cardDetails.expiry.split("/");
      if (month.length !== 2 || year.length !== 2) {
        newErrors.expiry = "Please use MM/YY format (e.g., 12/25)";
      } else if (!validateExpiryDate(cardDetails.expiry)) {
        newErrors.expiry = "Invalid or expired date";
      }
    }

    // CVV validation
    if (!cardDetails.cvv) {
      newErrors.cvv = "CVV is required";
    } else if (!/^\d+$/.test(cardDetails.cvv)) {
      newErrors.cvv = "CVV must contain only digits";
    } else if (!validateCVVLength(cardDetails.cvv, cardDetails.type)) {
      const typeConfig = cardTypes.find(
        (type) => type.value === cardDetails.type
      );
      if (typeConfig) {
        newErrors.cvv = `CVV must be ${
          typeConfig.cvvLength
        } digits for ${cardDetails.type.toUpperCase()}`;
      }
    }

    // Card type validation
    if (!cardDetails.type) {
      newErrors.type = "Please select card type";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Field-specific validation functions
  const validateField = (field, value) => {
    switch (field) {
      case "number":
        const cleanedValue = value.replace(/\s/g, "");
        if (!cleanedValue) return "Card number is required";
        if (!/^\d+$/.test(cleanedValue))
          return "Card number must contain only digits";
        if (!validateCardNumberLength(value, cardDetails.type)) {
          const typeConfig = cardTypes.find(
            (type) => type.value === cardDetails.type
          );
          if (typeConfig) {
            return `Card number must be ${
              typeConfig.lengths[0]
            } digits for ${cardDetails.type.toUpperCase()}`;
          }
        }
        if (cleanedValue.length >= 13 && !validateLuhn(value)) {
          return "Invalid card number";
        }
        return "";

      case "name":
        if (!value.trim()) return "Cardholder name is required";
        if (!validateCardholderName(value)) return "Please enter a valid name";
        return "";

      case "expiry":
        if (!value) return "Expiry date is required";
        if (!value.includes("/")) return "Please use MM/YY format";
        if (value.length === 5 && !validateExpiryDate(value)) {
          return "Invalid or expired date";
        }
        return "";

      case "cvv":
        if (!value) return "CVV is required";
        if (!/^\d+$/.test(value)) return "CVV must contain only digits";
        if (!validateCVVLength(value, cardDetails.type)) {
          const typeConfig = cardTypes.find(
            (type) => type.value === cardDetails.type
          );
          if (typeConfig) {
            return `CVV must be ${
              typeConfig.cvvLength
            } digits for ${cardDetails.type.toUpperCase()}`;
          }
        }
        return "";

      default:
        return "";
    }
  };

  const handleCardChange = (field, value) => {
    setCardDetails((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Auto-detect card type from number
    if (field === "number") {
      const cleanedNumber = value.replace(/\s/g, "");

      // Find matching card type
      const detectedType = cardTypes.find((type) =>
        type.pattern.test(cleanedNumber)
      );

      if (detectedType) {
        setCardDetails((prev) => ({
          ...prev,
          type: detectedType.value,
        }));
      }
    }

    // Validate field on change if it's been touched
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors((prev) => ({
        ...prev,
        [field]: error,
      }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));

    const error = validateField(field, cardDetails[field]);
    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched on submit
    const allFields = ["number", "name", "expiry", "cvv", "type"];
    const newTouched = {};
    allFields.forEach((field) => (newTouched[field] = true));
    setTouched(newTouched);

    if (!validateForm()) {
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        const element = document.querySelector(`[name="${firstErrorField}"]`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          element.focus();
        }
      }
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

      // IMPORTANT: In a real application, you should NEVER send full card details
      // to your backend. Instead, use tokenization through a payment gateway.
      const paymentData = {
        paymentId:
          "PAY_" + Math.random().toString(36).substr(2, 9).toUpperCase(),
        amount: booking.pricing.finalPrice,
        currency: booking.pricing.currency,
        status: "completed",
        method: paymentMethod === "credit" ? "Credit Card" : "Debit Card",
        cardLastFour: cardDetails.number.replace(/\s/g, "").slice(-4),
        cardType: selectedCardType ? selectedCardType.label : "Credit Card",
        paidAt: new Date().toISOString(),
        // Only send masked/partial data to backend
        maskedCardDetails: {
          holderName: cardDetails.name,
          expiry: cardDetails.expiry,
          type: cardDetails.type,
          number:
            "**** **** **** " + cardDetails.number.replace(/\s/g, "").slice(-4),
          // Note: CVV is NOT stored or sent to backend in production
        },
      };

      // Security note: In production, you would:
      // 1. Use a payment gateway (Stripe, Braintree, etc.)
      // 2. Tokenize the card on client-side
      // 3. Send only the token to your backend
      // 4. Never store raw card details

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
    if (v.length >= 2) {
      const month = parseInt(v.substring(0, 2), 10);
      if (month > 12) {
        return "12" + (v.length > 2 ? "/" + v.substring(2) : "");
      }
    }
    if (v.length >= 3) {
      return `${v.substring(0, 2)}/${v.substring(2)}`;
    }
    return v;
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

              {/* Card Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Number
                  {errors.number ? (
                    <span className="text-red-500 text-sm ml-1">
                      ({errors.number})
                    </span>
                  ) : (
                    <span className="text-gray-500 text-xs ml-1">
                      {cardDetails.type === "amex"
                        ? "(15 digits)"
                        : "(16 digits)"}
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  name="number"
                  placeholder="1234 5678 9012 3456"
                  value={formatCardNumber(cardDetails.number)}
                  onChange={(e) => handleCardChange("number", e.target.value)}
                  onBlur={() => handleBlur("number")}
                  maxLength={19}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
                    errors.number
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-[var(--primary)]"
                  }`}
                  required
                />
              </div>

              {/* Cardholder Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={cardDetails.name}
                  onChange={(e) => handleCardChange("name", e.target.value)}
                  onBlur={() => handleBlur("name")}
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

              {/* Expiry Date and CVV */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date
                    {errors.expiry ? (
                      <span className="text-red-500 text-sm ml-1">
                        ({errors.expiry})
                      </span>
                    ) : (
                      <span className="text-gray-500 text-xs ml-1">
                        (MM/YY)
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    name="expiry"
                    placeholder="MM/YY"
                    value={formatExpiry(cardDetails.expiry)}
                    onChange={(e) => handleCardChange("expiry", e.target.value)}
                    onBlur={() => handleBlur("expiry")}
                    maxLength={5}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
                      errors.expiry
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-[var(--primary)]"
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV
                    <span className="ml-1 text-xs text-gray-500">
                      ({cardDetails.type === "amex" ? "4 digits" : "3 digits"})
                    </span>
                  </label>
                  <input
                    type="text"
                    name="cvv"
                    placeholder={cardDetails.type === "amex" ? "1234" : "123"}
                    value={cardDetails.cvv}
                    onChange={(e) =>
                      handleCardChange("cvv", e.target.value.replace(/\D/g, ""))
                    }
                    onBlur={() => handleBlur("cvv")}
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

              {/* Security Notice */}
              <div className="flex items-center space-x-2 pt-4">
                <Shield className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-600">
                  Your payment details are encrypted and secure
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className={`w-full py-3 px-4 rounded-lg font-medium mt-4 transition-colors duration-200 flex items-center justify-center ${
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

        {/* Order Summary (unchanged) */}
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
