import React, { useState, useMemo } from "react";
import { User, Mail, Phone, MapPin, Calendar, AlertCircle } from "lucide-react";
import { getData } from "country-list";

const PassengerDetails = ({ passengers, contactInfo, onChange, onNext }) => {
  const [activePassenger, setActivePassenger] = useState(0);
  const [showValidation, setShowValidation] = useState(false);

  // Get countries data
  const countries = useMemo(() => {
    const countryData = getData();
    return countryData
      .map((country) => ({
        code: country.code,
        name: country.name,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const handlePassengerChange = (index, field, value) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index] = {
      ...updatedPassengers[index],
      [field]: value,
    };
    onChange("passengers", updatedPassengers);
  };

  const handleContactChange = (field, value) => {
    onChange("contactInfo", {
      ...contactInfo,
      [field]: value,
    });
  };

  const addPassenger = () => {
    onChange("passengers", [
      ...passengers,
      {
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        gender: "",
        passportNumber: "",
        nationality: "",
      },
    ]);
  };

  const removePassenger = (index) => {
    if (passengers.length > 1) {
      const updatedPassengers = passengers.filter((_, i) => i !== index);
      onChange("passengers", updatedPassengers);
      if (activePassenger >= updatedPassengers.length) {
        setActivePassenger(updatedPassengers.length - 1);
      }
    }
  };

  const getValidationErrors = () => {
    const errors = [];

    // Check passenger fields
    passengers.forEach((passenger, index) => {
      if (!passenger.firstName) {
        errors.push(`Passenger ${index + 1}: First Name is required`);
      }
      if (!passenger.lastName) {
        errors.push(`Passenger ${index + 1}: Last Name is required`);
      }
      if (!passenger.dateOfBirth) {
        errors.push(`Passenger ${index + 1}: Date of Birth is required`);
      }
      if (!passenger.gender) {
        errors.push(`Passenger ${index + 1}: Gender is required`);
      }
      if (!passenger.nationality) {
        errors.push(`Passenger ${index + 1}: Nationality is required`);
      }
    });

    // Check contact info fields
    if (!contactInfo.email) {
      errors.push("Email Address is required");
    }
    if (!contactInfo.phone) {
      errors.push("Phone Number is required");
    }
    if (!contactInfo.address.street) {
      errors.push("Street Address is required");
    }
    if (!contactInfo.address.city) {
      errors.push("City is required");
    }
    if (!contactInfo.address.state) {
      errors.push("State is required");
    }
    if (!contactInfo.address.zipCode) {
      errors.push("ZIP Code is required");
    }
    if (!contactInfo.address.country) {
      errors.push("Country is required");
    }

    return errors;
  };

  const isFormValid = () => {
    return getValidationErrors().length === 0;
  };

  const handleNextClick = () => {
    if (isFormValid()) {
      onNext();
    } else {
      setShowValidation(true);
    }
  };

  const validationErrors = getValidationErrors();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Passenger Details</h2>

      {/* Passenger Tabs */}
      <div className="flex space-x-2 mb-6 overflow-x-auto">
        {passengers.map((_, index) => (
          <button
            key={index}
            onClick={() => setActivePassenger(index)}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              activePassenger === index
                ? "bg-blue-100 border-[var(--primary)] text-[var(--primary)]"
                : "border-gray-300 text-gray-600 hover:bg-gray-50"
            }`}
          >
            Passenger {index + 1}
          </button>
        ))}
        <button
          onClick={addPassenger}
          className="px-4 py-2 rounded-lg border border-dashed border-gray-300 text-gray-600 hover:bg-gray-50"
        >
          + Add
        </button>
      </div>

      {/* Passenger Form */}
      {passengers.map((passenger, index) => (
        <div
          key={index}
          className={`space-y-4 ${
            activePassenger === index ? "block" : "hidden"
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <input
                type="text"
                value={passenger.firstName}
                onChange={(e) =>
                  handlePassengerChange(index, "firstName", e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--primary)] ${
                  showValidation && !passenger.firstName
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                }`}
                required
              />
              {showValidation && !passenger.firstName && (
                <p className="text-red-500 text-xs mt-1">
                  First Name is required
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                value={passenger.lastName}
                onChange={(e) =>
                  handlePassengerChange(index, "lastName", e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--primary)] ${
                  showValidation && !passenger.lastName
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                }`}
                required
              />
              {showValidation && !passenger.lastName && (
                <p className="text-red-500 text-xs mt-1">
                  Last Name is required
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Date of Birth *
              </label>
              <input
                type="date"
                value={passenger.dateOfBirth || "2000-01-01"}
                onChange={(e) =>
                  handlePassengerChange(index, "dateOfBirth", e.target.value)
                }
                max={new Date().toISOString().split("T")[0]}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--primary)] ${
                  showValidation && !passenger.dateOfBirth
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                }`}
                required
              />
              {showValidation && !passenger.dateOfBirth && (
                <p className="text-red-500 text-xs mt-1">
                  Date of Birth is required
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender *
              </label>
              <select
                value={passenger.gender}
                onChange={(e) =>
                  handlePassengerChange(index, "gender", e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--primary)] ${
                  showValidation && !passenger.gender
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                }`}
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {showValidation && !passenger.gender && (
                <p className="text-red-500 text-xs mt-1">Gender is required</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Passport Number
              </label>
              <input
                type="text"
                value={passenger.passportNumber}
                onChange={(e) =>
                  handlePassengerChange(index, "passportNumber", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nationality *
              </label>
              <select
                value={passenger.nationality}
                onChange={(e) =>
                  handlePassengerChange(index, "nationality", e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--primary)] ${
                  showValidation && !passenger.nationality
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                }`}
                required
              >
                <option value="">Select Nationality</option>
                {countries.map((country) => (
                  <option key={country.code} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
              {showValidation && !passenger.nationality && (
                <p className="text-red-500 text-xs mt-1">
                  Nationality is required
                </p>
              )}
            </div>
          </div>

          {passengers.length > 1 && (
            <button
              onClick={() => removePassenger(index)}
              className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors"
            >
              Remove Passenger
            </button>
          )}
        </div>
      ))}

      {/* Contact Information */}
      <div className="mt-8 pt-6 border-t">
        <h3 className="text-xl font-semibold mb-4">Contact Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="h-4 w-4 inline mr-1" />
              Email Address *
            </label>
            <input
              type="email"
              value={contactInfo.email}
              onChange={(e) => handleContactChange("email", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--primary)] ${
                showValidation && !contactInfo.email
                  ? "border-red-300 bg-red-50"
                  : "border-gray-300"
              }`}
              required
            />
            {showValidation && !contactInfo.email && (
              <p className="text-red-500 text-xs mt-1">
                Email Address is required
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="h-4 w-4 inline mr-1" />
              Phone Number *
            </label>
            <input
              type="tel"
              value={contactInfo.phone}
              onChange={(e) => handleContactChange("phone", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--primary)] ${
                showValidation && !contactInfo.phone
                  ? "border-red-300 bg-red-50"
                  : "border-gray-300"
              }`}
              required
            />
            {showValidation && !contactInfo.phone && (
              <p className="text-red-500 text-xs mt-1">
                Phone Number is required
              </p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-gray-700">
            <MapPin className="h-4 w-4 inline mr-1" />
            Address *
          </h4>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <input
                type="text"
                placeholder="Street Address"
                value={contactInfo.address.street}
                onChange={(e) =>
                  handleContactChange("address", {
                    ...contactInfo.address,
                    street: e.target.value,
                  })
                }
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--primary)] ${
                  showValidation && !contactInfo.address.street
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                }`}
                required
              />
              {showValidation && !contactInfo.address.street && (
                <p className="text-red-500 text-xs mt-1">
                  Street Address is required
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <input
                  type="text"
                  placeholder="City"
                  value={contactInfo.address.city}
                  onChange={(e) =>
                    handleContactChange("address", {
                      ...contactInfo.address,
                      city: e.target.value,
                    })
                  }
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--primary)] ${
                    showValidation && !contactInfo.address.city
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                  required
                />
                {showValidation && !contactInfo.address.city && (
                  <p className="text-red-500 text-xs mt-1">City is required</p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  placeholder="State"
                  value={contactInfo.address.state}
                  onChange={(e) =>
                    handleContactChange("address", {
                      ...contactInfo.address,
                      state: e.target.value,
                    })
                  }
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--primary)] ${
                    showValidation && !contactInfo.address.state
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                  required
                />
                {showValidation && !contactInfo.address.state && (
                  <p className="text-red-500 text-xs mt-1">State is required</p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  placeholder="ZIP Code"
                  value={contactInfo.address.zipCode}
                  onChange={(e) =>
                    handleContactChange("address", {
                      ...contactInfo.address,
                      zipCode: e.target.value,
                    })
                  }
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--primary)] ${
                    showValidation && !contactInfo.address.zipCode
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                  required
                />
                {showValidation && !contactInfo.address.zipCode && (
                  <p className="text-red-500 text-xs mt-1">
                    ZIP Code is required
                  </p>
                )}
              </div>
              <div>
                <select
                  value={contactInfo.address.country}
                  onChange={(e) =>
                    handleContactChange("address", {
                      ...contactInfo.address,
                      country: e.target.value,
                    })
                  }
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--primary)] ${
                    showValidation && !contactInfo.address.country
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                  required
                >
                  <option value="">Select Country</option>
                  {countries.map((country) => (
                    <option key={country.code} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </select>
                {showValidation && !contactInfo.address.country && (
                  <p className="text-red-500 text-xs mt-1">
                    Country is required
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleNextClick}
          className="px-8 py-3 rounded-lg font-medium text-lg transition-colors duration-200 bg-[var(--accent-dark)] hover:bg-[var(--accent)] text-white"
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
};

export default PassengerDetails;
