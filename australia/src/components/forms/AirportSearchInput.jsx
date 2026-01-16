import React, { useState, useRef, useEffect } from "react";
import { Search, Plane, MapPin, Loader, X } from "lucide-react";
import airportSearchService from "../../services/airportSearchService";
import { useAirportDropdown } from "./AirportDropdownContext";

const AirportSearchInput = ({
  name,
  value,
  onChange,
  placeholder = "Search airport or city...",
  required = false,
  className = "",
  showOnlyAirports = false, // Add this new prop
  showOnlyCities = false, // Add this new prop
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const inputRef = useRef(null);

  const { openDropdown, closeDropdown, activeDropdown } = useAirportDropdown();

  // Debounced search
  useEffect(() => {
    // Don't search if we have a selected location or if search term is empty
    if (selectedLocation || searchTerm.length < 3) {
      if (searchTerm.length < 3) {
        closeDropdown();
      }
      return;
    }

    // In the useEffect, update the filtering logic:
    const searchLocations = async () => {
      setIsLoading(true);
      try {
        const results = await airportSearchService.searchLocations(searchTerm);

        // Filter results based on props
        let filteredResults = results;
        if (showOnlyAirports) {
          filteredResults = results.filter(
            (location) => location.type === "airport"
          );
        } else if (showOnlyCities) {
          filteredResults = results.filter(
            (location) => location.type === "city"
          );
        }

        setSuggestions(filteredResults);

        // Open dropdown in the shared container only if we have results and no selected location
        if (!selectedLocation) {
          openDropdown(
            filteredResults,
            searchTerm,
            false,
            handleSelectLocation,
            inputRef
          );
        }
      } catch (error) {
        console.error("Search error:", error);
        setSuggestions([]);
        closeDropdown();
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(searchLocations, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedLocation, showOnlyAirports, showOnlyCities]); // Add showOnlyAirports to dependencies

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setSelectedLocation(null);

    if (value.length === 0) {
      closeDropdown();
      onChange(name, "");
      return;
    }

    // Only update form with uppercase when it's exactly 3 letters AND user is done typing
    // Don't automatically convert during typing to allow backspace
    if (value.length === 3 && /^[A-Za-z]{3}$/.test(value)) {
      // Update form with uppercase, but keep the display value as user typed
      onChange(name, value.toUpperCase());
    } else {
      // For other cases, just update the search term normally
      onChange(name, value);
    }
  };

  const handleSelectLocation = (location) => {
    setSelectedLocation(location);
    setSearchTerm(""); // Clear the search term to prevent re-search
    onChange(name, location.code);
    closeDropdown();
  };

  const handleFocus = () => {
    // Only show dropdown if we have search term and no selected location
    if (searchTerm.length >= 3 && !selectedLocation) {
      openDropdown(
        suggestions,
        searchTerm,
        isLoading,
        handleSelectLocation,
        inputRef
      );
    }
  };

  const handleClear = () => {
    setSearchTerm("");
    setSelectedLocation(null);
    onChange(name, "");
    closeDropdown();
    inputRef.current?.focus();
  };

  const getDisplayValue = () => {
    if (selectedLocation) {
      return selectedLocation.code;
    }
    // Always show what the user is typing, not the uppercase version
    return searchTerm || value || "";
  };

  return (
    <div className="relative">
      
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          name={name}
          value={getDisplayValue()}
          onChange={handleInputChange}
          onFocus={handleFocus}
          placeholder={placeholder}
          className={`w-full px-3 py-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--primary)] h-12 ${className}`}
          required={required}
          autoComplete="off"
        />

        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {searchTerm && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-3 w-3 text-gray-400" />
            </button>
          )}

          {isLoading ? (
            <Loader className="h-4 w-4 animate-spin text-gray-400" />
          ) : (
            <Search className="h-4 w-4 text-gray-400" />
          )}
        </div>
      </div>
      {/* Selected Location Info */}
      {selectedLocation && !activeDropdown.isOpen && (
        <div className="mt-1 text-xs text-gray-600 flex items-center">
          {selectedLocation.type === "city" ? (
            <MapPin className="h-3 w-3 mr-1 text-green-500" />
          ) : (
            <Plane className="h-3 w-3 mr-1 text-blue-500" />
          )}
          <span className="truncate">
            {airportSearchService.formatLocation(selectedLocation)}
          </span>
        </div>
      )}
    </div>
  );
};

export default AirportSearchInput;
