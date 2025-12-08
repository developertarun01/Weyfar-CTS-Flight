import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Users,
  ArrowRightLeft,
  ChevronDown,
  Plus,
  Minus,
} from "lucide-react";
import AirportSearchInput from "./AirportSearchInput";
import { AirportDropdownProvider } from "./AirportDropdownContext";
import AirportDropdownContainer from "./AirportDropdownContainer";

const FlightForm = () => {
  const navigate = useNavigate();

  // Add to your component state
  const [isGuestSelectorOpen, setIsGuestSelectorOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  
  const today = new Date().toISOString().split("T")[0];
  const today2 = new Date();
  today2.setDate(today2.getDate() + 5); // ✅ add 5 days
  const fiveDaysLater = today2.toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    tripType: "roundTrip",
    origin: "",
    destination: "",
    fromDate: today,
    toDate: fiveDaysLater,
    adults: 1,
    children: 0,
    travelClass: "ECONOMY",
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

  // Add this handler function
  const handleGuestChange = (type, value) => {
    setFormData((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const swapLocations = () => {
    setFormData((prev) => ({
      ...prev,
      origin: prev.destination,
      destination: prev.origin,
    }));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.origin || formData.origin.length !== 3) {
      errors.origin = "Please select a valid origin airport";
    }

    if (!formData.destination || formData.destination.length !== 3) {
      errors.destination = "Please select a valid destination airport";
    }

    if (formData.origin === formData.destination) {
      errors.destination = "Origin and destination cannot be the same";
    }

    if (!formData.fromDate) {
      errors.fromDate = "Departure date is required";
    }

    if (formData.tripType === "roundTrip" && !formData.toDate) {
      errors.toDate = "Return date is required for round trips";
    }

    if (
      formData.toDate &&
      formData.fromDate &&
      new Date(formData.toDate) <= new Date(formData.fromDate)
    ) {
      errors.toDate = "Return date must be after departure date";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Prepare data for backend API
    const apiData = {
      tripType: formData.tripType,
      origin: formData.origin.toUpperCase().substring(0, 3), // Ensure 3-letter code
      destination: formData.destination.toUpperCase().substring(0, 3), // Ensure 3-letter code
      fromDate: formData.fromDate,
      toDate: formData.tripType === "roundTrip" ? formData.toDate : undefined,
      adults: parseInt(formData.adults),
      children: parseInt(formData.children),
      travelClass: formData.travelClass,
    };

    // Navigate to results page with search parameters
    navigate("/results", {
      state: {
        searchType: "flights",
        formData: apiData, // Send the properly formatted data
        searchParams: {
          origin: formData.origin,
          destination: formData.destination,
          fromDate: formData.fromDate,
          toDate: formData.toDate,
          passengers: parseInt(formData.adults) + parseInt(formData.children),
        },
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      {/* Row 1: Trip Type - Responsive for mobile */}
      <div className="flex items-center space-x-6 justify-center sm:justify-start">
        {/* Round Trip */}
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            name="tripType"
            value="roundTrip"
            checked={formData.tripType === "roundTrip"}
            onChange={() => handleChange("tripType", "roundTrip")}
            className="h-4 w-4 text-[var(--primary)] focus:ring-[var(--primary)]"
          />
          <span className="text-gray-700">Round Trip</span>
        </label>

        {/* One Way */}
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            name="tripType"
            value="oneWay"
            checked={formData.tripType === "oneWay"}
            onChange={() => handleChange("tripType", "oneWay")}
            className="h-4 w-4 text-[var(--primary)] focus:ring-[var(--primary)]"
          />
          <span className="text-gray-700">One Way</span>
        </label>
      </div>

      {/* Row 2: All other elements - Responsive for mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-8 gap-3 items-start">
        {/* Travel Class */}
        <div className="sm:col-span-1">
          <div className="relative">
            <select
              name="travelClass"
              value={formData.travelClass}
              onChange={handleInputChange}
              className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--primary)] h-12"
            >
              <option value="ECONOMY">Economy</option>
              <option value="PREMIUM_ECONOMY">Premium Economy</option>
              <option value="BUSINESS">Business</option>
              <option value="FIRST">First Class</option>
            </select>
          </div>
        </div>

        {/* Flight Route Section */}
        <AirportDropdownProvider>
          <div className="sm:col-span-2 relative">
            <div className="grid grid-cols-2 gap-3 relative items-start">
              {/* From */}
              <div>
                <AirportSearchInput
                  name="origin"
                  value={formData.origin}
                  onChange={handleChange}
                  placeholder="From (e.g., JFK or New York)"
                  required={true}
                  className="h-12"
                />
                {validationErrors.origin && (
                  <p className="text-red-500 text-xs mt-1 absolute">
                    {validationErrors.origin}
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

              {/* To */}
              <div>
                <AirportSearchInput
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  placeholder="To (e.g., LAX or London)"
                  required={true}
                  className="h-12 bottom-0"
                />
                {validationErrors.destination && (
                  <p className="text-red-500 text-xs mt-1 absolute">
                    {validationErrors.destination}
                  </p>
                )}
              </div>

              {/* Shared Dropdown Container */}
              <AirportDropdownContainer />
            </div>
          </div>
        </AirportDropdownProvider>

        <div className="sm:col-span-2 relative">
          <div className="grid grid-cols-2 gap-3 relative">
            {/* Departure Date */}
            <div className="sm:col-span-1">
              <div className="relative">
                <input
                  type="date"
                  name="fromDate"
                  value={formData.fromDate}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--primary)] h-12"
                  required
                />
                {validationErrors.fromDate && (
                  <p className="text-red-500 text-xs mt-1 absolute">
                    {validationErrors.fromDate}
                  </p>
                )}
              </div>
            </div>

            {/* Return Date (only if roundTrip) */}
            {formData.tripType === "roundTrip" ? (
              <div className="sm:col-span-1">
                <div className="relative">
                  <input
                    type="date"
                    name="toDate"
                    value={formData.toDate}
                    onChange={handleInputChange}
                    min={
                      formData.fromDate ||
                      new Date().toISOString().split("T")[0]
                    }
                    className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--primary)] h-12"
                    required
                  />
                  {validationErrors.toDate && (
                    <p className="text-red-500 text-xs mt-1 absolute">
                      {validationErrors.toDate}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="sm:col-span-1 hidden sm:block"></div>
            )}
          </div>
        </div>

        {/* Guest Selector - Combined Display */}
        <div className="sm:col-span-2">
          <div className="relative">
            {/* Dropdown selector */}
            {isGuestSelectorOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-1 bg-white border border-gray-300 rounded-md shadow-lg z-50">
                {/* Adults Counter */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">Adults</div>
                      <div className="text-sm text-gray-500">Age 13+</div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={() =>
                          handleGuestChange(
                            "adults",
                            Math.max(1, formData.adults - 1)
                          )
                        }
                        disabled={formData.adults <= 1}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center font-medium">
                        {formData.adults}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          handleGuestChange("adults", formData.adults + 1)
                        }
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Children Counter */}
                <div className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">Children</div>
                      <div className="text-sm text-gray-500">Ages 2-12</div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={() =>
                          handleGuestChange(
                            "children",
                            Math.max(0, formData.children - 1)
                          )
                        }
                        disabled={formData.children <= 0}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center font-medium">
                        {formData.children}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          handleGuestChange("children", formData.children + 1)
                        }
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Close button */}
                <div className="p-3 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setIsGuestSelectorOpen(false)}
                    className="w-full py-2 text-sm font-medium text-[var(--primary)] hover:bg-gray-50 rounded"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
            {/* Main display that shows the selection */}
            <div
              className="w-full px-3 py-3 border bg-white border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--primary)] h-12 flex items-center justify-between cursor-pointer"
              onClick={() => setIsGuestSelectorOpen(!isGuestSelectorOpen)}
            >
              <span>
                {formData.adults} Adult{formData.adults > 1 ? "s" : ""}
                {formData.children > 0 &&
                  `, ${formData.children} Child${
                    formData.children !== 1 ? "ren" : ""
                  }`}
              </span>
              <ChevronDown
                className={`h-4 w-4 text-gray-400 transition-transform ${
                  isGuestSelectorOpen ? "rotate-180" : ""
                }`}
              />
            </div>
          </div>
        </div>

        {/* Search Button */}
        <div className="sm:col-span-1">
          <button
            type="submit"
            className="w-full bg-[var(--accent-dark)] hover:bg-[var(--accent)] text-white py-3 rounded-md font-medium transition-colors duration-200 h-12"
          >
            Search
          </button>
        </div>
      </div>
    </form>
  );
};

export default FlightForm;
