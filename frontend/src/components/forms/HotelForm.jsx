import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Calendar,
  Bed,
  Users,
  ChevronDown,
  Plus,
  Minus,
} from "lucide-react";
import AirportSearchInput from "./AirportSearchInput"; // Adjust import path as needed
import { AirportDropdownProvider } from "./AirportDropdownContext"; // Adjust import path as needed
import AirportDropdownContainer from "./AirportDropdownContainer"; // Adjust import path as needed

const HotelForm = () => {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  // Add to your component state
  const [isGuestSelectorOpen, setIsGuestSelectorOpen] = useState(false);

  const today5 = new Date();
  today5.setDate(today5.getDate() + 5);
  const fiveDaysLater = today5.toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    destination: "",
    checkInDate: today,
    checkOutDate: fiveDaysLater,
    rooms: 1,
    adults: 1,
    children: 0,
  });

  // Add this handler function
  const handleGuestChange = (type, value) => {
    setFormData((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ADD THIS NEW HANDLER FUNCTION
  const handleDestinationChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.destination ||
      !formData.checkInDate ||
      !formData.checkOutDate
    ) {
      alert("Please fill in all required fields");
      return;
    }

    navigate("/results", {
      state: {
        searchType: "hotels",
        formData,
        searchParams: {
          destination: formData.destination,
          checkInDate: formData.checkInDate,
          checkOutDate: formData.checkOutDate,
          guests: formData.adults + formData.children,
        },
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-7 gap-3 items-start">
        <AirportDropdownProvider>
          {/* Destination - Now using AirportSearchInput with cities only */}
          <div className="sm:col-span-2">
            <div className="relative">
              <MapPin className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
              <AirportSearchInput
                name="destination"
                value={formData.destination}
                onChange={handleDestinationChange} // CHANGE THIS LINE
                placeholder="City or Destination"
                required={true}
                className="pl-10" // Add padding to accommodate the icon
                showOnlyCities={true} // New prop to show only cities
              />
              {/* Shared Dropdown Container */}
              <AirportDropdownContainer />
            </div>
          </div>
        </AirportDropdownProvider>

        <div className="sm:col-span-2 relative">
          <div className="grid grid-cols-2 gap-3 relative">
            {/* Check-in Date */}

            <div>
              <input
                type="date"
                name="checkInDate"
                value={formData.checkInDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split("T")[0]}
                className="w-full pl-3 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--primary)] h-12"
                required
              />
            </div>

            {/* Check-out Date */}

            <div>
              <input
                type="date"
                name="checkOutDate"
                value={formData.checkOutDate}
                onChange={handleInputChange}
                min={
                  formData.checkInDate || new Date().toISOString().split("T")[0]
                }
                className="w-full pl-3 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--primary)] h-12"
                required
              />
            </div>
          </div>
        </div>

        {/* Rooms */}
        <div className="w-full flex-1">
          <div className="relative">
            <Bed className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              name="rooms"
              value={formData.rooms}
              onChange={handleInputChange}
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--primary)] appearance-none h-12"
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num} Room{num > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Guest Selector - Combined Display */}
        <div className="sm:col-span-1">
          <div className="relative">
            {/* Dropdown selector */}
            {isGuestSelectorOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 sm:w-[298px]">
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
        <div className="w-full flex-1">
          <button
            type="submit"
            className="w-full bg-[var(--accent-dark)] hover:bg-[var(--accent)] text-white px-6 py-3 rounded-md font-medium transition-colors duration-200"
          >
            Search
          </button>
        </div>
      </div>
    </form>
  );
};

export default HotelForm;
