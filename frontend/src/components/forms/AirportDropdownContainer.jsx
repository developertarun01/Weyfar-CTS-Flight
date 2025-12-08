// AirportDropdownContainer.jsx
import React from "react";
import { useAirportDropdown } from "./AirportDropdownContext";
import { Plane, MapPin, ChevronDown, ChevronRight } from "lucide-react";
import airportSearchService from "../../services/airportSearchService";

const AirportDropdownContainer = () => {
  const { activeDropdown, closeDropdown } = useAirportDropdown();

  if (!activeDropdown.isOpen) return null;

  const { suggestions, searchTerm, isLoading, onSelect } = activeDropdown;

  // Group suggestions by city - FIXED VERSION
  const groupedSuggestions = suggestions.reduce((groups, location) => {
    if (location.type === "city") {
      groups.push({
        type: "city",
        data: location,
        airports: [],
      });
    } else if (location.type === "airport") {
      // Get city name safely - use the normalized city property
      const cityName = location.city;
      
      if (cityName) {
        // Find if this city already exists in groups
        const cityGroup = groups.find(
          (group) => group.type === "city" && 
          // Compare using the city name from the data object
          (group.data.city === cityName || group.data.name === cityName)
        );

        if (cityGroup) {
          cityGroup.airports.push(location);
        } else {
          // Create a new city group for this airport's city
          groups.push({
            type: "city",
            data: {
              id: `city-${cityName}-${location.id}`,
              name: cityName,
              city: cityName, // Add city property for consistency
              country: location.country,
              type: "city",
              code: location.cityCode || cityName.substring(0, 3).toUpperCase(),
            },
            airports: [location],
          });
        }
      } else {
        // Handle standalone airports without city information
        groups.push({
          type: "airport",
          data: location,
          airports: [],
        });
      }
    } else {
      // Handle other types
      groups.push({
        type: "airport",
        data: location,
        airports: [],
      });
    }
    return groups;
  }, []);

  // Sort groups: cities first, then standalone airports
  groupedSuggestions.sort((a, b) => {
    if (a.type === "city" && b.type !== "city") return -1;
    if (a.type !== "city" && b.type === "city") return 1;
    return 0;
  });

  // Debug: Log the grouped structure
  React.useEffect(() => {
    // console.log('Grouped suggestions:', groupedSuggestions);
    // console.log('Original suggestions:', suggestions);
  }, [groupedSuggestions, suggestions]);

  return (
    <div className="absolute sm:w-[550px] top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-80 overflow-y-auto">
      {groupedSuggestions.length === 0 && !isLoading ? (
        <div className="p-3 text-gray-500 text-sm text-center">
          No locations found for "{searchTerm}"
        </div>
      ) : (
        <div className="py-2">
          {groupedSuggestions.map((group, index) => {
            if (group.type === "city") {
              const cityDisplay = airportSearchService.getDisplayLabel(group.data);
              return (
                <div
                  key={`city-${group.data.id}-${index}`}
                  className="border-b border-gray-100 last:border-b-0"
                >
                  {/* City Header */}
                  <button
                    type="button"
                    onClick={() => onSelect(group.data)}
                    className="w-full px-3 py-3 text-left hover:bg-green-50 focus:bg-green-50 focus:outline-none transition-colors border-b border-gray-50"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        <MapPin className="h-4 w-4 text-green-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900 truncate">
                            {cityDisplay.primary}
                          </span>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                              City
                            </span>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          {cityDisplay.secondary}
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Airports under this city */}
                  {group.airports.length > 0 && (
                    <div className="bg-gray-50">
                      {group.airports.map((airport, airportIndex) => {
                        const airportDisplay = airportSearchService.getDisplayLabel(airport);
                        return (
                          <button
                            key={`airport-${airport.id}-${airportIndex}`}
                            type="button"
                            onClick={() => onSelect(airport)}
                            className="w-full px-3 py-2 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors border-b border-gray-100 last:border-b-0"
                          >
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0 mt-1">
                                <Plane className="h-4 w-4 text-blue-500" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <span className="font-medium text-gray-900 truncate">
                                    {airportDisplay.primary}
                                  </span>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                                      Airport
                                    </span>
                                  </div>
                                </div>
                                <div className="text-sm text-gray-600 truncate">
                                  {airportDisplay.secondary}
                                </div>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            } else {
              // Standalone airport without city grouping
              const airportDisplay = airportSearchService.getDisplayLabel(group.data);
              return (
                <button
                  key={`airport-${group.data.id}-${index}`}
                  type="button"
                  onClick={() => onSelect(group.data)}
                  className="w-full px-3 py-2 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      <Plane className="h-4 w-4 text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900 truncate">
                          {airportDisplay.primary}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                            Airport
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 truncate">
                        {airportDisplay.secondary}
                      </div>
                    </div>
                  </div>
                </button>
              );
            }
          })}
        </div>
      )}

      {groupedSuggestions.length > 0 && (
        <div className="px-3 py-2 bg-gray-50 border-t text-xs text-gray-500">
          {suggestions.length} locations found • Search by airport code, name, or city
        </div>
      )}
    </div>
  );
};

export default AirportDropdownContainer;