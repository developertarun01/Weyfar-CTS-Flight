import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PassengerDetails from "../components/booking/PassengerDetails";
import BookingSummary from "../components/booking/BookingSummary";
import PaymentForm from "../components/booking/PaymentForm";
import { createBooking, validatePromoCode } from "../services/api";
import { ArrowLeft } from "lucide-react";
import CallBanner from "../components/CallBanner";

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { type, selectedItem, searchParams, formData } = location.state || {};

  const [currentStep, setCurrentStep] = useState(1);
  const [booking, setBooking] = useState(null);
  const [passengers, setPassengers] = useState([
    {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "",
      passportNumber: "",
      nationality: "",
    },
  ]);
  const [contactInfo, setContactInfo] = useState({
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
  });
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);

  // In Booking.jsx - Add this useEffect and update booking creation

  useEffect(() => {
    if (!type || !selectedItem) {
      navigate("/");
      return;
    }

    // Create initial booking object with proper structure
    const basePrice = parseFloat(
      selectedItem.price?.total || selectedItem.price || 0
    );

    // Ensure details has the expected structure based on type
    const bookingDetails = {
      ...selectedItem,
      ...searchParams,
      ...formData,
    };

    // ADD HOTEL-SPECIFIC DETAILS
    if (type === "hotels") {
      bookingDetails.hotelName = selectedItem.name;
      bookingDetails.location =
        selectedItem.address?.city || searchParams?.destination;
      bookingDetails.rating = selectedItem.rating;
      bookingDetails.amenities = selectedItem.amenities || [];
      bookingDetails.roomType = selectedItem.roomType;
      bookingDetails.checkInDate =
        formData?.checkInDate || searchParams?.checkInDate;
      bookingDetails.checkOutDate =
        formData?.checkOutDate || searchParams?.checkOutDate;
      bookingDetails.nights =
        searchParams?.nights ||
        Math.ceil(
          (new Date(formData?.checkOutDate) - new Date(formData?.checkInDate)) /
            (1000 * 60 * 60 * 24)
        );
      bookingDetails.guests =
        (formData?.adults || 1) + (formData?.children || 0);
      bookingDetails.rooms = formData?.rooms || 1;
    }

    // ADD CAR-SPECIFIC DETAILS
    if (type === "cars") {
      bookingDetails.carType = selectedItem.carType;
      bookingDetails.model = selectedItem.model;
      bookingDetails.provider = selectedItem.provider;
      bookingDetails.features = selectedItem.features || [];
      bookingDetails.transmission = selectedItem.transmission;
      bookingDetails.seats = selectedItem.seats;
      bookingDetails.bags = selectedItem.bags;
      bookingDetails.pickupLocation =
        selectedItem.pickupLocation || formData?.pickupLocation;
      bookingDetails.dropLocation =
        selectedItem.dropLocation ||
        formData?.dropLocation ||
        formData?.pickupLocation;
      bookingDetails.fromDateTime = formData?.fromDateTime;
      bookingDetails.toDateTime = formData?.toDateTime;
      bookingDetails.duration =
        selectedItem.duration ||
        `${searchParams?.days || 1} day${
          (searchParams?.days || 1) > 1 ? "s" : ""
        }`;
      bookingDetails.driverAge = formData?.age;
      bookingDetails.fuelPolicy = selectedItem.fuelPolicy || "Full to Full";
      bookingDetails.mileage = selectedItem.mileage || "Unlimited";
    }

    // ADD CRUISE-SPECIFIC DETAILS
    if (type === "cruises") {
      bookingDetails.cruiseLine = selectedItem.cruiseLine;
      bookingDetails.shipName = selectedItem.shipName;
      bookingDetails.destination =
        selectedItem.destination || searchParams?.destination;
      bookingDetails.nights = selectedItem.nights || searchParams?.nights;
      bookingDetails.departureDate =
        selectedItem.departureDate || searchParams?.departureDate;
      bookingDetails.itinerary = selectedItem.itinerary || [];
      bookingDetails.amenities = selectedItem.amenities || [];
      bookingDetails.passengers = formData?.adults || 1;
      bookingDetails.origin = formData?.origin;
    }

    setBooking({
      type,
      details: bookingDetails,
      passengers: [],
      contactInfo: {},
      pricing: {
        basePrice,
        discount: 0,
        finalPrice: basePrice,
        currency: "USD",
      },
      promoCode: "",
      status: "pending",
    });
  }, [type, selectedItem, searchParams, formData, navigate]);

  const handlePassengerChange = (field, value) => {
    if (field === "passengers") {
      setPassengers(value);
    } else if (field === "contactInfo") {
      setContactInfo(value);
    }
  };

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

  const handlePromoCodeApply = async () => {
    if (!promoCode.trim()) return;

    try {
      setLoading(true);
      const response = await validatePromoCode({
        code: promoCode,
        amount: booking.pricing.basePrice,
      });

      if (response.success) {
        setDiscount(response.data.discount);
        setBooking((prev) => ({
          ...prev,
          pricing: {
            ...prev.pricing,
            discount: response.data.discount,
            finalPrice: prev.pricing.basePrice - response.data.discount,
          },
          promoCode: promoCode,
        }));
        alert("Promo code applied successfully!");
      } else {
        alert("Invalid promo code");
      }
    } catch (error) {
      alert("Error applying promo code: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToPayment = () => {
    setCurrentStep(3);
  };

  const handlePaymentSuccess = async (paymentData) => {
    try {
      setLoading(true);

      // Create the booking with payment data
      const bookingData = {
        type: booking.type,
        details: booking.details,
        passengers,
        contactInfo,
        pricing: booking.pricing,
        promoCode: booking.promoCode,
        payment: paymentData,
        status: "confirmed",
        createdAt: new Date().toISOString(),
        _id: "BK_" + Math.random().toString(36).substr(2, 9).toUpperCase(),
      };

      // In a real app, you would send this to your backend
      // const response = await createBooking(bookingData);

      // For demo purposes, we'll simulate success
      setTimeout(() => {
        navigate("/thank-you", {
          state: {
            booking: bookingData,
            payment: paymentData,
          },
        });
      }, 1000);
    } catch (error) {
      alert("Error confirming booking: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentError = (errorMessage) => {
    alert(errorMessage);
  };

  if (!booking) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className=" callBanner container mx-auto px-4 py-8">
      <CallBanner />
      {/* Progress Steps */}
      <div className="flex justify-center mb-8 mt-8">
        <div className="flex items-center space-x-1 sm:space-x-8">
          <div
            className={`flex items-center ${
              currentStep >= 1 ? "text-[var(--primary)]" : "text-gray-400"
            }`}
          >
            <div
              className={`hidden sm:flex w-8 h-8 rounded-full  items-center justify-center border-2 ${
                currentStep >= 1
                  ? "bg-[var(--accent-dark)] border-[var(--primary)] text-white"
                  : "border-gray-300"
              }`}
            >
              1
            </div>
            <span className="ml-2 font-medium">Passenger Details</span>
          </div>

          <div className="w-3 sm:w-16 h-0.5 bg-gray-300"></div>

          <div
            className={`flex items-center ${
              currentStep >= 2 ? "text-[var(--primary)]" : "text-gray-400"
            }`}
          >
            <div
              className={`hidden sm:flex w-8 h-8 rounded-full  items-center justify-center border-2 ${
                currentStep >= 2
                  ? "bg-[var(--accent-dark)] border-[var(--primary)] text-white"
                  : "border-gray-300"
              }`}
            >
              2
            </div>
            <span className="ml-2 font-medium">Booking Summary</span>
          </div>

          <div className="w-3 sm:w-16 h-0.5 bg-gray-300"></div>

          <div
            className={`flex items-center ${
              currentStep >= 3 ? "text-[var(--primary)]" : "text-gray-400"
            }`}
          >
            <div
              className={`hidden sm:flex w-8 h-8 rounded-full  items-center justify-center border-2 ${
                currentStep >= 3
                  ? "bg-[var(--accent-dark)] border-[var(--primary)] text-white"
                  : "border-gray-300"
              }`}
            >
              3
            </div>
            <span className="ml-2 font-medium">Payment Details</span>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <button
        onClick={() =>
          currentStep > 1 ? setCurrentStep(currentStep - 1) : navigate(-1)
        }
        className="flex items-center text-[var(--primary)] hover:text-[var(--primary)] mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back
      </button>

      {/* Step 1: Passenger Details */}
      {currentStep === 1 && (
        <PassengerDetails
          passengers={passengers}
          contactInfo={contactInfo}
          onChange={handlePassengerChange}
          onNext={() => setCurrentStep(2)}
        />
      )}

      {/* Step 2: Booking Summary */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <BookingSummary
            booking={{
              ...booking,
              passengers,
              contactInfo,
            }}
            onProceedToPayment={handleProceedToPayment}
          />
        </div>
      )}

      {/* Step 3: Payment Details */}
      {currentStep === 3 && (
        <PaymentForm
          booking={{
            ...booking,
            passengers,
            contactInfo,
          }}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentError={handlePaymentError}
        />
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mb-4"></div>
            <p className="text-gray-700">
              {currentStep === 2
                ? "Processing your booking..."
                : currentStep === 3
                ? "Processing payment..."
                : "Loading..."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Booking;
