import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Ship,
  Moon,
  Calendar,
  Minus,
  Plus,
  ChevronDown,
} from "lucide-react";
import { worldPorts, cruiseLines, popularShips } from "./cruiseData";
import {
  searchPortsAPI,
  searchCruiseLinesAPI,
  searchShipsAPI,
} from "../../services/cruiseSearchApi";

const CruiseForm = () => {
  const navigate = useNavigate();
  const guestSelectorRef = useRef(null);
  const departureRef = useRef(null);
  const destinationRef = useRef(null);
  const cruiseLineRef = useRef(null);
  const shipRef = useRef(null);

  const [isGuestSelectorOpen, setIsGuestSelectorOpen] = useState(false);
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    cruiseLine: "",
    shipName: "",
    departureDate: getDefaultDepartureDate(),
    nights: 7,
    adults: 1,
    children: 0,
  });

  // Search states for all fields
  const [departureSearch, setDepartureSearch] = useState("");
  const [destinationSearch, setDestinationSearch] = useState("");
  const [cruiseLineSearch, setCruiseLineSearch] = useState("");
  const [shipSearch, setShipSearch] = useState("");

  const [showDepartureDropdown, setShowDepartureDropdown] = useState(false);
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);
  const [showCruiseLineDropdown, setShowCruiseLineDropdown] = useState(false);
  const [showShipDropdown, setShowShipDropdown] = useState(false);

  const [loading, setLoading] = useState(false);

  // API loading states
  const [apiLoading, setApiLoading] = useState({
    ports: false,
    cruiseLines: false,
    ships: false,
  });

  // Filtered results state
  const [filteredDeparturePorts, setFilteredDeparturePorts] = useState({});
  const [filteredDestinationPorts, setFilteredDestinationPorts] = useState({});
  const [filteredCruiseLines, setFilteredCruiseLines] = useState([]);
  const [filteredShips, setFilteredShips] = useState([]);

  // Cruise line mapping to Amadeus codes
  const cruiseLineMap = {
    "Royal Caribbean International": "RCL",
    "Norwegian Cruise Line": "NCL",
    "Carnival Cruise Line": "CCL",
    "MSC Cruises": "MSC",
    "Princess Cruises": "PRC",
    "Celebrity Cruises": "CEL",
    "Disney Cruise Line": "DIS",
    "Holland America Line": "HAL",
    "Costa Cruises": "COSTA",
    "Virgin Voyages": "VIR",
  };

  function getDefaultDepartureDate() {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toISOString().split("T")[0];
  }

  // Load popular data on component mount
  useEffect(() => {
    const loadPopularData = async () => {
      try {
        // You can load popular ports from API if needed
        // const popularPorts = await getPopularPorts();
        // const popularCruiseLines = await getPopularCruiseLines();
      } catch (error) {
        console.error("Error loading popular data:", error);
      }
    };

    loadPopularData();
  }, []);

  // In CruiseForm.jsx - update the search functions
  const searchPorts = async (query, useAPI = false) => {
    // First, search in local dataset
    let localResults = [];

    if (!query.trim()) {
      localResults = worldPorts;
    } else {
      localResults = worldPorts.filter(
        (port) =>
          port.name.toLowerCase().includes(query.toLowerCase()) ||
          port.code.toLowerCase().includes(query.toLowerCase()) ||
          port.country.toLowerCase().includes(query.toLowerCase())
      );
    }

    // If we need more results or want fresh data, use backend API
    let apiResults = [];
    if (useAPI && query.trim().length >= 3) {
      try {
        setApiLoading((prev) => ({ ...prev, ports: true }));
        apiResults = await searchPortsAPI(query);
        // console.log(`API returned ${apiResults.length} port results`);
      } catch (error) {
        console.error(
          "Backend API search failed, using local data only:",
          error
        );
      } finally {
        setApiLoading((prev) => ({ ...prev, ports: false }));
      }
    }

    // Combine and deduplicate results
    const allResults = [...localResults, ...apiResults];
    const uniqueResults = allResults.reduce((acc, current) => {
      const exists = acc.find((item) => item.code === current.code);
      if (!exists) {
        acc.push(current);
      }
      return acc;
    }, []);

    // Group by region for better organization
    const groupedResults = uniqueResults.reduce((acc, port) => {
      const region = port.region || "Other";
      if (!acc[region]) {
        acc[region] = [];
      }
      acc[region].push(port);
      return acc;
    }, {});

    return groupedResults;
  };

  const searchCruiseLines = async (query, useAPI = false) => {
    // First, search in local dataset
    let localResults = [];

    if (!query.trim()) {
      localResults = cruiseLines;
    } else {
      localResults = cruiseLines.filter(
        (line) =>
          line.name.toLowerCase().includes(query.toLowerCase()) ||
          line.code.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Use backend API for additional results
    let apiResults = [];
    if (useAPI && query.trim().length >= 3) {
      try {
        setApiLoading((prev) => ({ ...prev, cruiseLines: true }));
        apiResults = await searchCruiseLinesAPI(query);
      } catch (error) {
        console.error("Backend API search failed:", error);
      } finally {
        setApiLoading((prev) => ({ ...prev, cruiseLines: false }));
      }
    }

    // Combine and deduplicate
    return [...localResults, ...apiResults].reduce((acc, current) => {
      const exists = acc.find((item) => item.code === current.code);
      if (!exists) {
        acc.push(current);
      }
      return acc;
    }, []);
  };

  const searchShips = async (query, useAPI = false) => {
    // First, search in local dataset
    let localResults = [];

    if (!query.trim()) {
      localResults = popularShips;
    } else {
      localResults = popularShips.filter(
        (ship) =>
          ship.name.toLowerCase().includes(query.toLowerCase()) ||
          ship.cruiseLine.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Use backend API for additional results
    let apiResults = [];
    if (useAPI && query.trim().length >= 3) {
      try {
        setApiLoading((prev) => ({ ...prev, ships: true }));
        apiResults = await searchShipsAPI(query);
      } catch (error) {
        console.error("Backend API search failed:", error);
      } finally {
        setApiLoading((prev) => ({ ...prev, ships: false }));
      }
    }

    // Combine and deduplicate
    return [...localResults, ...apiResults].reduce((acc, current) => {
      const exists = acc.find((item) => item.name === current.name);
      if (!exists) {
        acc.push(current);
      }
      return acc;
    }, []);
  };

  // Search handlers with debouncing
  useEffect(() => {
    const departureTimer = setTimeout(async () => {
      if (departureSearch.trim().length >= 3) {
        const results = await searchPorts(departureSearch, true);
        setFilteredDeparturePorts(results);
      } else {
        const results = await searchPorts(departureSearch, false);
        setFilteredDeparturePorts(results);
      }
    }, 300);

    return () => clearTimeout(departureTimer);
  }, [departureSearch]);

  useEffect(() => {
    const destinationTimer = setTimeout(async () => {
      if (destinationSearch.trim().length >= 3) {
        const results = await searchPorts(destinationSearch, true);
        setFilteredDestinationPorts(results);
      } else {
        const results = await searchPorts(destinationSearch, false);
        setFilteredDestinationPorts(results);
      }
    }, 300);

    return () => clearTimeout(destinationTimer);
  }, [destinationSearch]);

  useEffect(() => {
    const cruiseLineTimer = setTimeout(async () => {
      if (cruiseLineSearch.trim().length >= 3) {
        const results = await searchCruiseLines(cruiseLineSearch, true);
        setFilteredCruiseLines(results);
      } else {
        const results = await searchCruiseLines(cruiseLineSearch, false);
        setFilteredCruiseLines(results);
      }
    }, 300);

    return () => clearTimeout(cruiseLineTimer);
  }, [cruiseLineSearch]);

  useEffect(() => {
    const shipTimer = setTimeout(async () => {
      if (shipSearch.trim().length >= 3) {
        const results = await searchShips(shipSearch, true);
        setFilteredShips(results);
      } else {
        const results = await searchShips(shipSearch, false);
        setFilteredShips(results);
      }
    }, 300);

    return () => clearTimeout(shipTimer);
  }, [shipSearch]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        guestSelectorRef.current &&
        !guestSelectorRef.current.contains(event.target)
      ) {
        setIsGuestSelectorOpen(false);
      }
      if (
        departureRef.current &&
        !departureRef.current.contains(event.target)
      ) {
        setShowDepartureDropdown(false);
      }
      if (
        destinationRef.current &&
        !destinationRef.current.contains(event.target)
      ) {
        setShowDestinationDropdown(false);
      }
      if (
        cruiseLineRef.current &&
        !cruiseLineRef.current.contains(event.target)
      ) {
        setShowCruiseLineDropdown(false);
      }
      if (shipRef.current && !shipRef.current.contains(event.target)) {
        setShowShipDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Sync search values with form data
  useEffect(() => {
    // Set departure search value when formData.origin changes
    if (formData.origin) {
      const departurePort = worldPorts.find(
        (port) => port.code === formData.origin
      );
      if (departurePort) {
        setDepartureSearch(departurePort.name);
      }
    }

    // Set destination search value when formData.destination changes
    if (formData.destination) {
      const destinationPort = worldPorts.find(
        (port) => port.code === formData.destination
      );
      if (destinationPort) {
        setDestinationSearch(destinationPort.name);
      }
    }

    // Set cruise line search value when formData.cruiseLine changes
    if (formData.cruiseLine) {
      const cruiseLine = cruiseLines.find(
        (line) => line.code === cruiseLineMap[formData.cruiseLine]
      );
      if (cruiseLine) {
        setCruiseLineSearch(cruiseLine.name);
      }
    }

    // Set ship search value when formData.shipName changes
    if (formData.shipName) {
      setShipSearch(formData.shipName);
    }
  }, [
    formData.origin,
    formData.destination,
    formData.cruiseLine,
    formData.shipName,
  ]);

  const handleGuestChange = (type, value) => {
    setFormData((prev) => ({
      ...prev,
      [type]: Math.max(0, value),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePortSelect = (type, port) => {
    setFormData((prev) => ({
      ...prev,
      [type]: port.code,
    }));
    if (type === "origin") {
      setDepartureSearch(port.name);
      setShowDepartureDropdown(false);
    } else {
      setDestinationSearch(port.name);
      setShowDestinationDropdown(false);
    }
  };

  const handleCruiseLineSelect = (cruiseLine) => {
    setFormData((prev) => ({
      ...prev,
      cruiseLine: cruiseLine.name,
    }));
    setCruiseLineSearch(cruiseLine.name);
    setShowCruiseLineDropdown(false);
  };

  const handleShipSelect = (ship) => {
    setFormData((prev) => ({
      ...prev,
      shipName: ship.name,
    }));
    setShipSearch(ship.name);
    setShowShipDropdown(false);
  };

  // Enhanced dropdown rendering with regions for ports
  const renderPortsDropdown = (ports, onSelect, isLoading) => {
    const hasResults = Object.keys(ports).length > 0;

    return (
      <>
        {isLoading && (
          <div className="px-4 py-2 text-sm text-gray-500 bg-gray-50 border-b">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-500 mr-2"></div>
              Searching...
            </div>
          </div>
        )}

        {hasResults
          ? Object.entries(ports).map(([region, regionPorts]) => (
              <div key={region}>
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-50 uppercase border-b">
                  {region}
                </div>
                {regionPorts.map((port) => (
                  <div
                    key={`${port.code}-${port.source || "local"}`}
                    onClick={() => onSelect(port)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <div className="font-medium flex items-center">
                      {port.name}
                      {port.source === "api" && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-1 rounded">
                          Live
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {port.code} • {port.country}
                    </div>
                  </div>
                ))}
              </div>
            ))
          : !isLoading && (
              <div className="px-4 py-2 text-gray-500">No ports found</div>
            )}
      </>
    );
  };

  const renderCruiseLinesDropdown = (cruiseLines, onSelect, isLoading) => {
    return (
      <>
        {isLoading && (
          <div className="px-4 py-2 text-sm text-gray-500 bg-gray-50 border-b">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-500 mr-2"></div>
              Searching...
            </div>
          </div>
        )}

        {cruiseLines.length > 0
          ? cruiseLines.map((line) => (
              <div
                key={`${line.code}-${line.source || "local"}`}
                onClick={() => onSelect(line)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
              >
                <div className="font-medium flex items-center">
                  {line.name}
                  {line.source === "api" && (
                    <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-1 rounded">
                      Live
                    </span>
                  )}
                </div>
              </div>
            ))
          : !isLoading && (
              <div className="px-4 py-2 text-gray-500">
                No cruise lines found
              </div>
            )}
      </>
    );
  };

  const renderShipsDropdown = (ships, onSelect, isLoading) => {
    return (
      <>
        {isLoading && (
          <div className="px-4 py-2 text-sm text-gray-500 bg-gray-50 border-b">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-500 mr-2"></div>
              Searching...
            </div>
          </div>
        )}

        {ships.length > 0
          ? ships.map((ship) => (
              <div
                key={`${ship.name}-${ship.source || "local"}`}
                onClick={() => onSelect(ship)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
              >
                <div className="font-medium flex items-center">
                  {ship.name}
                  {ship.source === "api" && (
                    <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-1 rounded">
                      Live
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-500">{ship.cruiseLine}</div>
              </div>
            ))
          : !isLoading && (
              <div className="px-4 py-2 text-gray-500">No ships found</div>
            )}
      </>
    );
  };

  // Validate required fields
  const validateForm = () => {
    const requiredFields = ["origin", "destination", "departureDate"];
    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(", ")}`);
      return false;
    }

    if (formData.adults + formData.children === 0) {
      alert("Please select at least one guest");
      return false;
    }

    return true;
  };

  const searchCruises = async (params) => {
    try {
      // Use your existing searchCruises API call
      const response = await api.post("/travel/cruises", params);
      return response.data || [];
    } catch (error) {
      console.error("Error searching cruises:", error);
      // Fallback to mock data
      return {
        data: [
          {
            id: "1",
            cruiseLine: formData.cruiseLine || "Royal Caribbean International",
            shipName: formData.shipName || "Symphony of the Seas",
            departureDate: formData.departureDate,
            duration: formData.nights,
            price: { amount: "899", currency: "USD" },
            itinerary: [
              { port: formData.origin, date: formData.departureDate },
              { port: formData.destination, date: "2024-03-17" },
            ],
          },
        ],
      };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const amadeusParams = {
        origin: formData.origin,
        destination: formData.destination.toUpperCase(),
        departureDate: formData.departureDate,
        duration: formData.nights,
        adults: formData.adults,
        children: formData.children,
        ...(formData.cruiseLine && {
          cruiseLine: cruiseLineMap[formData.cruiseLine],
        }),
        ...(formData.shipName && { shipName: formData.shipName }),
      };

      const apiResponse = await searchCruises(amadeusParams);

      navigate("/results", {
        state: {
          searchType: "cruises",
          formData,
          searchParams: amadeusParams,
          results: apiResponse.data || apiResponse,
        },
      });
    } catch (error) {
      console.error("Search failed:", error);
      alert("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const totalGuests = formData.adults + formData.children;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Cruise Search Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        {/* Departure and Destination Ports */}
        <div className="sm:col-span-2 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 relative">
            {/* Departure Port - Searchable */}
            <div className="relative" ref={departureRef}>
              <Ship className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
              <input
                type="text"
                placeholder="Search departure port..."
                value={departureSearch}
                onChange={(e) => setDepartureSearch(e.target.value)}
                onFocus={() => setShowDepartureDropdown(true)}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                required
              />
              {showDepartureDropdown && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {renderPortsDropdown(
                    filteredDeparturePorts,
                    (port) => handlePortSelect("origin", port),
                    apiLoading.ports
                  )}
                </div>
              )}
            </div>

            {/* Destination Port - Searchable */}
            <div className="relative" ref={destinationRef}>
              <MapPin className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
              <input
                type="text"
                placeholder="Search destination port..."
                value={destinationSearch}
                onChange={(e) => setDestinationSearch(e.target.value)}
                onFocus={() => setShowDestinationDropdown(true)}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                required
              />
              {showDestinationDropdown && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {renderPortsDropdown(
                    filteredDestinationPorts,
                    (port) => handlePortSelect("destination", port),
                    apiLoading.ports
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Departure Date */}
        <div className="sm:col-span-2 relative">
          <div className="grid grid-cols-2 gap-3 relative">
            <div className="relative">
              <Calendar className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                id="departureDate"
                type="date"
                name="departureDate"
                value={formData.departureDate}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                required
              />
            </div>

            {/* Cruise Duration */}
            <div className="relative">
              <Moon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                id="nights"
                name="nights"
                value={formData.nights}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--primary)] appearance-none"
              >
                <option value="3">3 Nights</option>
                <option value="4">4 Nights</option>
                <option value="5">5 Nights</option>
                <option value="7">7 Nights</option>
                <option value="10">10 Nights</option>
                <option value="14">14 Nights</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Search Fields */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        {/* Cruise Line and Ship Name */}
        <div className="sm:col-span-2 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 relative">
            {/* Cruise Line - Searchable */}
            <div className="relative" ref={cruiseLineRef}>
              <Ship className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
              <input
                type="text"
                placeholder="Search cruise line..."
                value={cruiseLineSearch}
                onChange={(e) => setCruiseLineSearch(e.target.value)}
                onFocus={() => setShowCruiseLineDropdown(true)}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
              />
              {showCruiseLineDropdown && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {renderCruiseLinesDropdown(
                    filteredCruiseLines,
                    handleCruiseLineSelect,
                    apiLoading.cruiseLines
                  )}
                </div>
              )}
            </div>

            {/* Ship Name - Searchable */}
            <div className="relative" ref={shipRef}>
              <Ship className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
              <input
                type="text"
                placeholder="Search specific ship..."
                value={shipSearch}
                onChange={(e) => setShipSearch(e.target.value)}
                onFocus={() => setShowShipDropdown(true)}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
              />
              {showShipDropdown && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {renderShipsDropdown(
                    filteredShips,
                    handleShipSelect,
                    apiLoading.ships
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Guest Selector */}
        <div className="w-full">
          <div className="relative" ref={guestSelectorRef}>
            {isGuestSelectorOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                {/* Adults Counter */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-gray-900">Adults</div>
                      <div className="text-sm text-gray-500">Age 13+</div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={() =>
                          handleGuestChange("adults", formData.adults - 1)
                        }
                        disabled={formData.adults <= 1}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center font-medium text-gray-900">
                        {formData.adults}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          handleGuestChange("adults", formData.adults + 1)
                        }
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
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
                      <div className="font-medium text-gray-900">Children</div>
                      <div className="text-sm text-gray-500">Ages 2-12</div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={() =>
                          handleGuestChange("children", formData.children - 1)
                        }
                        disabled={formData.children <= 0}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center font-medium text-gray-900">
                        {formData.children}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          handleGuestChange("children", formData.children + 1)
                        }
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Main display */}
            <button
              type="button"
              onClick={() => setIsGuestSelectorOpen(!isGuestSelectorOpen)}
              className="w-full px-3 py-3 border bg-white border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--primary)] h-12 flex items-center justify-between cursor-pointer hover:border-gray-400 transition-colors"
            >
              <span className="text-gray-900">
                {totalGuests} Guest{totalGuests !== 1 ? "s" : ""}
                {formData.children > 0 &&
                  ` (${formData.children} child${
                    formData.children !== 1 ? "ren" : ""
                  })`}
              </span>
              <ChevronDown
                className={`h-4 w-4 text-gray-400 transition-transform ${
                  isGuestSelectorOpen ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Search Button */}
        <div className="w-full">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--accent-dark)] hover:bg-[var(--accent)] disabled:bg-gray-400 text-white px-6 py-3 rounded-md font-medium transition-colors duration-200 flex items-center justify-center h-12"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Searching...
              </>
            ) : (
              "Search Cruises"
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CruiseForm;
