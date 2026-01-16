import React from "react";
import {
  Calendar,
  Users,
  MapPin,
  Star,
  CreditCard,
  User,
  Mail,
  Phone,
  MapPin as AddressIcon,
} from "lucide-react";

const BookingSummary = ({ booking, onProceedToPayment }) => {
  if (!booking) return null;

  // console.log("Booking data:", booking);
  // console.log("Booking details:", booking.details);

  const renderBookingDetails = () => {
    switch (booking.type) {
      case "flights":
        const details = booking.details;
        return (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Flight:</span>
              <span>
                {details.airline} ({details.flightNumber})
              </span>
            </div>
            <div className="flex justify-between">
              <span>Route:</span>
              <span>
                {details.origin} → {details.destination}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Departure:</span>
              <span>
                {new Date(
                  details.departure?.time || details.fromDate
                ).toLocaleDateString()}{" "}
                at{" "}
                {new Date(
                  details.departure?.time || details.fromDate
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Arrival:</span>
              <span>
                {new Date(details.arrival?.time).toLocaleDateString()} at{" "}
                {new Date(details.arrival?.time).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Duration:</span>
              <span>{details.duration || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span>Passengers:</span>
              <span>
                {booking.passengers?.length ||
                  details.passengers ||
                  details.adults ||
                  1}{" "}
                {(booking.passengers?.length ||
                  details.passengers ||
                  details.adults ||
                  1) === 1
                  ? "person"
                  : "people"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Class:</span>
              <span className="capitalize">
                {(details.travelClass || details.class || "").toLowerCase()}
              </span>
            </div>
            {details.stops > 0 && (
              <div className="flex justify-between">
                <span>Stops:</span>
                <span>
                  {details.stops} {details.stops === 1 ? "stop" : "stops"}
                </span>
              </div>
            )}
          </div>
        );

      // In BookingSummary.jsx - Update the hotel case in renderBookingDetails()

      case "hotels":
        return (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Hotel:</span>
              <span>{booking.details.hotelName || booking.details.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Location:</span>
              <span>
                {booking.details.location ||
                  booking.details.address?.city ||
                  booking.details.destination}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Check-in:</span>
              <span>
                {new Date(booking.details.checkInDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Check-out:</span>
              <span>
                {new Date(booking.details.checkOutDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Duration:</span>
              <span>
                {booking.details.nights ||
                  Math.ceil(
                    (new Date(booking.details.checkOutDate) -
                      new Date(booking.details.checkInDate)) /
                      (1000 * 60 * 60 * 24)
                  )}{" "}
                night(s)
              </span>
            </div>
            <div className="flex justify-between">
              <span>Guests:</span>
              <span>
                {booking.details.guests ||
                  (booking.details.adults || 1) +
                    (booking.details.children || 0)}{" "}
                {(booking.details.guests ||
                  (booking.details.adults || 1) +
                    (booking.details.children || 0)) === 1
                  ? "person"
                  : "people"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Rooms:</span>
              <span>
                {booking.details.rooms || 1}{" "}
                {(booking.details.rooms || 1) === 1 ? "room" : "rooms"}
              </span>
            </div>
            {booking.details.roomType && (
              <div className="flex justify-between">
                <span>Room Type:</span>
                <span>{booking.details.roomType}</span>
              </div>
            )}
            {booking.details.rating && (
              <div className="flex justify-between">
                <span>Rating:</span>
                <span className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                  {booking.details.rating}
                </span>
              </div>
            )}
          </div>
        );

      case "cars":
        return (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Car Rental:</span>
              <span>
                {booking.details.carType} - {booking.details.provider}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Model:</span>
              <span>{booking.details.model}</span>
            </div>
            <div className="flex justify-between">
              <span>Pick-up:</span>
              <span>
                {booking.details.pickupLocation} on{" "}
                {new Date(booking.details.fromDateTime).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Drop-off:</span>
              <span>
                {booking.details.dropLocation || "Same as pick-up"} on{" "}
                {new Date(booking.details.toDateTime).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Duration:</span>
              <span>{booking.details.duration}</span>
            </div>
            <div className="flex justify-between">
              <span>Driver Age:</span>
              <span>{booking.details.driverAge} years</span>
            </div>
            <div className="flex justify-between">
              <span>Transmission:</span>
              <span className="capitalize">{booking.details.transmission}</span>
            </div>
            <div className="flex justify-between">
              <span>Capacity:</span>
              <span>
                {booking.details.seats} seats, {booking.details.bags} bags
              </span>
            </div>
            {booking.details.features &&
              booking.details.features.length > 0 && (
                <div className="flex justify-between">
                  <span>Features:</span>
                  <span className="text-sm">
                    {booking.details.features.slice(0, 3).join(", ")}
                    {booking.details.features.length > 3 && "..."}
                  </span>
                </div>
              )}
          </div>
        );

      // In BookingSummary.jsx - Update the cruise case in renderBookingDetails()
      case "cruises": // Changed from "cruise" to "cruises"
        return (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Cruise:</span>
              <span>{booking.details.cruiseLine}</span>
            </div>
            <div className="flex justify-between">
              <span>Ship:</span>
              <span>{booking.details.shipName}</span>
            </div>
            <div className="flex justify-between">
              <span>Destination:</span>
              <span>{booking.details.destination}</span>
            </div>
            <div className="flex justify-between">
              <span>Departure Port:</span>
              <span>{booking.details.origin}</span>
            </div>
            <div className="flex justify-between">
              <span>Duration:</span>
              <span>{booking.details.nights} nights</span>
            </div>
            <div className="flex justify-between">
              <span>Departure Date:</span>
              <span>
                {new Date(booking.details.departureDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Passengers:</span>
              <span>
                {booking.details.passengers || 1}{" "}
                {(booking.details.passengers || 1) === 1 ? "person" : "people"}
              </span>
            </div>
            {booking.details.itinerary &&
              booking.details.itinerary.length > 0 && (
                <div className="flex justify-between">
                  <span>Itinerary:</span>
                  <span className="text-sm text-right">
                    {booking.details.itinerary.join(" → ")}
                  </span>
                </div>
              )}
          </div>
        );

      default:
        return (
          <div className="text-gray-500">No booking details available</div>
        );
    }
  };

  const renderPassengerDetails = () => {
    if (!booking.passengers || booking.passengers.length === 0) {
      return (
        <div className="text-gray-500 mt-5 text-center py-4">
          No passenger details available
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {booking.passengers.map((passenger, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg mt-6 p-4 bg-gray-50"
          >
            <h4 className="font-semibold text-lg mb-3 flex items-center">
              <User className="h-5 w-5 mr-2 text-[var(--primary)]" />
              Passenger {index + 1}{" "}
              {index === 0 && (
                <span className="text-sm text-gray-600 ml-2">(Primary)</span>
              )}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">
                    {passenger.firstName} {passenger.lastName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date of Birth:</span>
                  <span>
                    {passenger.dateOfBirth
                      ? new Date(passenger.dateOfBirth).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Gender:</span>
                  <span className="capitalize">
                    {passenger.gender || "N/A"}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Passport Number:</span>
                  <span>{passenger.passportNumber || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Nationality:</span>
                  <span>{passenger.nationality || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderContactInfo = () => {
    if (!booking.contactInfo) {
      return null;
    }

    const { email, phone, address } = booking.contactInfo;

    return (
      <div className="border border-gray-200 rounded-lg p-4 mt-6 bg-gray-50">
        <h4 className="font-semibold text-lg mb-3 flex items-center">
          <Mail className="h-5 w-5 mr-2 text-[var(--primary)]" />
          Contact Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium">{email || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Phone:</span>
              <span>{phone || "N/A"}</span>
            </div>
          </div>
          {address && (
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <span className="text-gray-600 flex items-start">
                  <AddressIcon className="h-4 w-4 mr-1 mt-0.5" />
                  Address:
                </span>
                <div className="text-right">
                  <div>{address.street}</div>
                  <div>
                    {address.city}, {address.state} {address.zipCode}
                  </div>
                  <div>{address.country}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Passenger Details Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <details className="group">
          <summary className="flex justify-between items-center cursor-pointer list-none">
            <h2 className="text-2xl font-bold flex items-center">
              <Users className="h-6 w-6 mr-2 text-[var(--primary)]" />
              Passenger Details
            </h2>
            <svg
              className="w-5 h-5 transform group-open:rotate-180 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </summary>
          {renderPassengerDetails()}
        </details>
      </div>

      {/* Contact Information Section */}

      <div className="bg-white rounded-lg shadow-md p-6">
        {booking.contactInfo && (
          <details className="group">
            <summary className="flex justify-between items-center cursor-pointer list-none">
              <h2 className="text-2xl font-bold flex items-center">
                <Mail className="h-6 w-6 mr-2 text-[var(--primary)]" />
                Contact Information
              </h2>
              <svg
                className="w-5 h-5 transform group-open:rotate-180 transtion-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </summary>
            {renderContactInfo()}
          </details>
        )}
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <CreditCard className="h-6 w-6 mr-2 text-[var(--primary)]" />
          Booking Summary
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Booking Details
            </h3>
            {renderBookingDetails()}
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Price Breakdown
            </h3>
            <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between">
                <span>Base Price:</span>
                <span>${booking.pricing.basePrice.toFixed(2)}</span>
              </div>
              {booking.pricing.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount:</span>
                  <span>-${booking.pricing.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg border-t pt-3 mt-3">
                <span>Total:</span>
                <span>${booking.pricing.finalPrice.toFixed(2)}</span>
              </div>
              {booking.promoCode && (
                <div className="text-sm text-gray-600 mt-2">
                  Promo code applied: {booking.promoCode}
                </div>
              )}
            </div>

            <button
              onClick={onProceedToPayment}
              className="w-full bg-[var(--accent-dark)] hover:bg-[var(--accent)] text-white py-3 px-4 rounded-lg font-medium mt-6 transition-colors duration-200"
            >
              Proceed to Payment Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;
