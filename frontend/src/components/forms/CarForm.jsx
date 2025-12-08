import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Calendar, User, ArrowRightLeft } from "lucide-react";
import AirportSearchInput from "./AirportSearchInput";
import { AirportDropdownProvider } from "./AirportDropdownContext";
import AirportDropdownContainer from "./AirportDropdownContainer";

const CarForm = () => {
  const navigate = useNavigate();
  const [validationErrors, setValidationErrors] = useState({});

  const getTodayAndFiveDaysLater = () => {
    const format = (d) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const hours = String(d.getHours()).padStart(2, "0");
      const minutes = String(d.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const now = new Date();
    const fiveDays = new Date(now);
    fiveDays.setDate(fiveDays.getDate() + 5);

    return {
      today: format(now),
      fiveDaysLater: format(fiveDays),
    };
  };

  const { today, fiveDaysLater } = getTodayAndFiveDaysLater();

  const [formData, setFormData] = useState({
    pickupLocation: "",
    dropLocation: "",
    fromDateTime: today,
    toDateTime: fiveDaysLater,
    age: 25,
  });

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    handleChange(name, value);
  };

  const swapLocations = () => {
    setFormData((prev) => ({
      ...prev,
      pickupLocation: prev.dropLocation,
      dropLocation: prev.pickupLocation,
    }));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.pickupLocation || formData.pickupLocation.length !== 3) {
      errors.pickupLocation = "Please select a valid pickup location";
    }

    if (formData.dropLocation && formData.dropLocation.length !== 3) {
      errors.dropLocation = "Please select a valid drop-off location";
    }

    if (!formData.fromDateTime) {
      errors.fromDateTime = "Pick-up date and time is required";
    }

    if (!formData.toDateTime) {
      errors.toDateTime = "Drop-off date and time is required";
    }

    if (formData.fromDateTime && formData.toDateTime) {
      const fromDate = new Date(formData.fromDateTime);
      const toDate = new Date(formData.toDateTime);
      
      if (toDate <= fromDate) {
        errors.toDateTime = "Drop-off must be after pick-up time";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Prepare data for API - send the raw form data, not the Amadeus formatted data
    const apiData = {
      pickupLocation: formData.pickupLocation.toUpperCase().substring(0, 3),
      dropLocation: formData.dropLocation 
        ? formData.dropLocation.toUpperCase().substring(0, 3)
        : formData.pickupLocation.toUpperCase().substring(0, 3),
      fromDateTime: formData.fromDateTime,
      toDateTime: formData.toDateTime,
      age: parseInt(formData.age)
    };

    // Console log the data being sent
    // console.log("=== CAR SEARCH FORM DATA ===");
    // console.log("Raw Form Data:", formData);
    // console.log("API Payload:", apiData);
    // console.log("=== END FORM DATA ===");

    // Mock API call simulation
    // console.log("📡 Mock API Call to Car Rental API...");
    // console.log("Parameters:", apiData);

    navigate("/results", {
      state: {
        searchType: "cars",
        formData: apiData, // Send the raw form data that API expects
        searchParams: {
          pickupLocation: formData.pickupLocation,
          dropLocation: formData.dropLocation || formData.pickupLocation,
          duration: `${formData.fromDateTime} to ${formData.toDateTime}`,
          driverAge: formData.age,
        },
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-8 gap-3 items-start">
        <AirportDropdownProvider>
          <div className="sm:col-span-2 relative">
            <div className="grid grid-cols-2 gap-3 relative items-start">
              {/* Pick-up Location */}
              <div>
                <AirportSearchInput
                  name="pickupLocation"
                  value={formData.pickupLocation}
                  onChange={handleChange}
                  placeholder="Pick-up Location (e.g., JFK or New York)"
                  required={true}
                  className="h-12"
                />
                {validationErrors.pickupLocation && (
                  <p className="text-red-500 text-xs mt-1 absolute">
                    {validationErrors.pickupLocation}
                  </p>
                )}
              </div>

              {/* Swap Button */}
              {/* <button
                type="button"
                onClick={swapLocations}
                className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 rounded-full p-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                title="Swap locations"
              >
                <ArrowRightLeft className="h-4 w-4 text-gray-600" />
              </button> */}

              {/* Drop-off Location */}
              <div>
                <AirportSearchInput
                  name="dropLocation"
                  value={formData.dropLocation}
                  onChange={handleChange}
                  placeholder="Drop-off Location (optional)"
                  required={false}
                  className="h-12"
                />
                {validationErrors.dropLocation && (
                  <p className="text-red-500 text-xs mt-1 absolute">
                    {validationErrors.dropLocation}
                  </p>
                )}
              </div>

              {/* Shared Dropdown Container */}
              <AirportDropdownContainer />
            </div>
          </div>
        </AirportDropdownProvider>

        {/* Pick-up Date & Time */}
        <div className="sm:col-span-2 relative">
          <div className="relative">
            <Calendar className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="datetime-local"
              name="fromDateTime"
              value={formData.fromDateTime}
              onChange={handleInputChange}
              min={new Date().toISOString().slice(0, 16)}
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--primary)] h-12"
              required
            />
            {validationErrors.fromDateTime && (
              <p className="text-red-500 text-xs mt-1 absolute">
                {validationErrors.fromDateTime}
              </p>
            )}
          </div>
        </div>

        {/* Drop-off Date & Time */}
        <div className="sm:col-span-2 relative">
          <div className="relative">
            <Calendar className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="datetime-local"
              name="toDateTime"
              value={formData.toDateTime}
              onChange={handleInputChange}
              min={
                formData.fromDateTime || new Date().toISOString().slice(0, 16)
              }
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--primary)] h-12"
              required
            />
            {validationErrors.toDateTime && (
              <p className="text-red-500 text-xs mt-1 absolute">
                {validationErrors.toDateTime}
              </p>
            )}
          </div>
        </div>

        {/* Driver's Age */}
        <div className="sm:col-span-1 relative">
          <div className="relative">
            <User className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--primary)] appearance-none h-12"
            >
              {Array.from({ length: 50 }, (_, i) => i + 21).map((age) => (
                <option key={age} value={age}>
                  {age} years
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Button */}
        <div className="sm:col-span-1 relative">
          <button
            type="submit"
            className="w-full bg-[var(--accent-dark)] hover:bg-[var(--accent)] text-white px-6 py-3 rounded-md font-medium transition-colors duration-200 flex items-center justify-center h-12"
          >
            Search
          </button>
        </div>
      </div>
    </form>
  );
};

export default CarForm;