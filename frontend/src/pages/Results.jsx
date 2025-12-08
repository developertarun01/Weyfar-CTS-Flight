import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  searchFlights,
  searchHotels,
  searchCars,
  searchCruises,
} from "../services/api";
import {
  Filter,
  Plane,
  Hotel,
  Car,
  Ship,
  Clock,
  MapPin,
  Users,
  Star,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import CallBanner from "../components/CallBanner";

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { searchType, formData, searchParams } = location.state || {};

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [allResults, setAllResults] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    // Common filters
    sortBy: "price",
    minPrice: 0,
    maxPrice: 10000,

    // Flight specific filters
    airlines: [],
    stops: "any",
    duration: 24,

    // Hotel specific filters
    rating: 0,
    amenities: [],
    hotelChains: [],

    // Car specific filters
    carTypes: [],
    providers: [],
    transmission: "any",

    // Cruise specific filters
    cruiseLines: [],
    durationRange: [1, 30],
  });

  const RESULTS_PER_PAGE = 10;

  // Filter options
  const filterOptions = {
    airlines: [
      "Delta Air Lines",
      "American Airlines",
      "United Airlines",
      "Southwest Airlines",
      "JetBlue Airways",
      "Frontier Airlines",
    ],
    stops: [
      { value: "any", label: "Any stops" },
      { value: "0", label: "Non-stop" },
      { value: "1", label: "1 stop" },
      { value: "2", label: "2+ stops" },
    ],
    amenities: ["Pool", "Spa", "Gym", "WiFi", "Breakfast", "Parking"],
    hotelChains: ["Marriott", "Hilton", "Hyatt", "IHG", "Accor"],
    carTypes: ["Economy", "Compact", "Mid-size", "Full-size", "SUV", "Luxury"],
    providers: ["Hertz", "Avis", "Enterprise", "Budget", "Alamo"],
    transmission: [
      { value: "any", label: "Any transmission" },
      { value: "automatic", label: "Automatic" },
      { value: "manual", label: "Manual" },
    ],
    cruiseLines: [
      "Royal Caribbean",
      "Carnival",
      "Norwegian",
      "MSC",
      "Princess",
    ],
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

  // Function to calculate discounted price
  const calculateDiscountedPrice = (originalPrice) => {
    const price = parseFloat(originalPrice) || 0;
    const discounted = price * 0.8; // 20% discount
    return discounted.toFixed(2);
  };

  // Function to get original price for display
  const getOriginalPrice = (item) => {
    return parseFloat(
      item.price?.total ||
        item.price ||
        (searchType === "flights"
          ? "299"
          : searchType === "hotels"
          ? "199"
          : searchType === "cars"
          ? "45"
          : "899")
    );
  };

  // Apply filters to results
  const applyFilters = (data) => {
    return data
      .filter((item) => {
        const price =
          parseFloat(item.discountedPrice) || parseFloat(item.originalPrice);

        // Price filter
        if (price < filters.minPrice || price > filters.maxPrice) {
          return false;
        }

        switch (searchType) {
          case "flights":
            // Airline filter
            if (
              filters.airlines.length > 0 &&
              !filters.airlines.includes(item.airline)
            ) {
              return false;
            }

            // Stops filter
            if (filters.stops !== "any") {
              const stops = item.stops || 0;
              if (filters.stops === "0" && stops !== 0) return false;
              if (filters.stops === "1" && stops !== 1) return false;
              if (filters.stops === "2" && stops < 2) return false;
            }

            // Duration filter
            if (filters.duration) {
              const durationHours = parseFloat(
                item.duration?.replace("PT", "").replace("H", ".") || 3
              );
              if (durationHours > filters.duration) return false;
            }
            break;

          case "hotels":
            // Rating filter
            if (filters.rating > 0 && (item.rating || 0) < filters.rating) {
              return false;
            }

            // Amenities filter
            if (filters.amenities.length > 0) {
              const itemAmenities = item.amenities || [];
              if (
                !filters.amenities.every((amenity) =>
                  itemAmenities.includes(amenity)
                )
              ) {
                return false;
              }
            }

            // Hotel chains filter
            if (
              filters.hotelChains.length > 0 &&
              !filters.hotelChains.includes(item.chain)
            ) {
              return false;
            }
            break;

          case "cars":
            // Car type filter
            if (
              filters.carTypes.length > 0 &&
              !filters.carTypes.includes(item.carType)
            ) {
              return false;
            }

            // Provider filter
            if (
              filters.providers.length > 0 &&
              !filters.providers.includes(item.provider)
            ) {
              return false;
            }

            // Transmission filter
            if (
              filters.transmission !== "any" &&
              item.transmission !== filters.transmission
            ) {
              return false;
            }
            break;

          case "cruises":
            // Cruise line filter
            if (
              filters.cruiseLines.length > 0 &&
              !filters.cruiseLines.includes(item.cruiseLine)
            ) {
              return false;
            }

            // Duration filter
            const nights = item.nights || 7;
            if (
              nights < filters.durationRange[0] ||
              nights > filters.durationRange[1]
            ) {
              return false;
            }
            break;
        }

        return true;
      })
      .sort((a, b) => {
        // Sorting
        const priceA = parseFloat(a.discountedPrice);
        const priceB = parseFloat(b.discountedPrice);

        switch (filters.sortBy) {
          case "price":
            return priceA - priceB;
          case "price-desc":
            return priceB - priceA;
          case "rating":
            return (b.rating || 0) - (a.rating || 0);
          case "duration":
            const durationA = a.duration
              ? parseFloat(a.duration.replace("PT", "").replace("H", "."))
              : 0;
            const durationB = b.duration
              ? parseFloat(b.duration.replace("PT", "").replace("H", "."))
              : 0;
            return durationA - durationB;
          default:
            return 0;
        }
      });
  };

  useEffect(() => {
    const fetchResults = async () => {
      if (!searchType || !formData) {
        navigate("/");
        return;
      }

      try {
        setLoading(true);
        setError(null);
        let data;

        switch (searchType) {
          case "flights":
            data = await searchFlights(formData);
            break;
          case "hotels":
            data = await searchHotels(formData);
            break;
          case "cars":
            data = await searchCars(formData);
            break;
          case "cruises":
            data = await searchCruises(formData);
            break;
          default:
            data = [];
        }

        // Ensure data is always an array
        let processedData = [];
        if (data && Array.isArray(data)) {
          processedData = data;
        } else if (data && data.data && Array.isArray(data.data)) {
          processedData = data.data;
        } else if (data && data.success && Array.isArray(data.data)) {
          processedData = data.data;
        } else {
          console.warn("Unexpected API response format:", data);
          processedData = [];
        }

        // Add discounted prices to results
        const resultsWithDiscount = processedData.map((item) => ({
          ...item,
          originalPrice: getOriginalPrice(item),
          discountedPrice: calculateDiscountedPrice(getOriginalPrice(item)),
        }));

        setAllResults(resultsWithDiscount);

        // Apply initial filters
        const filteredResults = applyFilters(resultsWithDiscount);
        const initialResults = filteredResults.slice(0, RESULTS_PER_PAGE);
        setResults(initialResults);

        setHasMore(filteredResults.length > RESULTS_PER_PAGE);
      } catch (error) {
        console.error("Error fetching results:", error);
        setError(error.message || "Failed to fetch results");
        setResults([]);
        setAllResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchType, formData, navigate]);

  // Update results when filters change
  useEffect(() => {
    if (allResults.length > 0) {
      const filteredResults = applyFilters(allResults);
      const initialResults = filteredResults.slice(0, RESULTS_PER_PAGE);
      setResults(initialResults);
      setCurrentPage(1);
      setHasMore(filteredResults.length > RESULTS_PER_PAGE);
    }
  }, [filters]);

  const loadMoreResults = () => {
    setLoadingMore(true);

    const nextPage = currentPage + 1;
    const filteredResults = applyFilters(allResults);
    const nextResults = filteredResults.slice(0, nextPage * RESULTS_PER_PAGE);

    setResults(nextResults);
    setCurrentPage(nextPage);
    setHasMore(nextPage * RESULTS_PER_PAGE < filteredResults.length);

    setLoadingMore(false);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleArrayFilterChange = (key, value, checked) => {
    setFilters((prev) => ({
      ...prev,
      [key]: checked
        ? [...prev[key], value]
        : prev[key].filter((item) => item !== value),
    }));
  };

  const resetFilters = () => {
    setFilters({
      sortBy: "price",
      minPrice: 0,
      maxPrice: 10000,
      airlines: [],
      stops: "any",
      duration: 24,
      rating: 0,
      amenities: [],
      hotelChains: [],
      carTypes: [],
      providers: [],
      transmission: "any",
      cruiseLines: [],
      durationRange: [1, 30],
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.minPrice > 0) count++;
    if (filters.maxPrice < 10000) count++;
    if (filters.sortBy !== "price") count++;

    switch (searchType) {
      case "flights":
        if (filters.airlines.length > 0) count += filters.airlines.length;
        if (filters.stops !== "any") count++;
        if (filters.duration < 24) count++;
        break;
      case "hotels":
        if (filters.rating > 0) count++;
        if (filters.amenities.length > 0) count += filters.amenities.length;
        if (filters.hotelChains.length > 0) count += filters.hotelChains.length;
        break;
      case "cars":
        if (filters.carTypes.length > 0) count += filters.carTypes.length;
        if (filters.providers.length > 0) count += filters.providers.length;
        if (filters.transmission !== "any") count++;
        break;
      case "cruises":
        if (filters.cruiseLines.length > 0) count += filters.cruiseLines.length;
        if (filters.durationRange[0] > 1 || filters.durationRange[1] < 30)
          count++;
        break;
    }

    return count;
  };

  // Enhanced handleSelect function for all search types
  const handleSelect = (item) => {
    // Calculate nights for hotels
    const nights =
      searchType === "hotels"
        ? Math.ceil(
            (new Date(formData?.checkOutDate) -
              new Date(formData?.checkInDate)) /
              (1000 * 60 * 60 * 24)
          )
        : 1;

    // Calculate days for cars
    const days =
      searchType === "cars"
        ? Math.ceil(
            (new Date(formData?.toDateTime) -
              new Date(formData?.fromDateTime)) /
              (1000 * 60 * 60 * 24)
          )
        : 1;

    const itemWithDetails = {
      ...item,
      price: item.discountedPrice,
      originalPrice: item.originalPrice,

      // ENHANCED: Hotel-specific booking details
      ...(searchType === "hotels" && {
        name: item.name,
        address: item.address,
        rating: item.rating,
        amenities: item.amenities || [],
        roomType: item.roomType,
        coordinates: item.coordinates,
        checkInDate: formData?.checkInDate,
        checkOutDate: formData?.checkOutDate,
        nights: nights,
        rooms: formData?.rooms || 1,
        adults: formData?.adults || 1,
        children: formData?.children || 0,
        guests: (formData?.adults || 1) + (formData?.children || 0),
      }),

      // ENHANCED: Car-specific booking details
      ...(searchType === "cars" && {
        carType: item.carType,
        model: item.model,
        provider: item.provider,
        features: item.features || [],
        transmission: item.transmission,
        seats: item.seats,
        bags: item.bags,
        pickupLocation: item.pickupLocation || formData?.pickupLocation,
        dropLocation:
          item.dropLocation ||
          formData?.dropLocation ||
          formData?.pickupLocation,
        fromDateTime: formData?.fromDateTime,
        toDateTime: formData?.toDateTime,
        duration: `${days} day${days > 1 ? "s" : ""}`,
        driverAge: formData?.age,
        fuelPolicy: item.fuelPolicy || "Full to Full",
        mileage: item.mileage || "Unlimited",
      }),

      // ENHANCED: Flight-specific booking details
      ...(searchType === "flights" && {
        airline: item.airline,
        flightNumber: item.flightNumber,
        origin: formData?.origin,
        destination: formData?.destination,
        departure: item.departure,
        arrival: item.arrival,
        duration: item.duration,
        stops: item.stops,
        class: item.class,
        travelers: (formData?.adults || 1) + (formData?.children || 0),
      }),

      // ENHANCED: Cruise-specific booking details
      ...(searchType === "cruises" && {
        cruiseLine: item.cruiseLine,
        shipName: item.shipName,
        destination: item.destination || searchParams?.destination,
        nights: item.nights || searchParams?.nights,
        departureDate: item.departureDate || searchParams?.departureDate,
        itinerary: item.itinerary || [],
        amenities: item.amenities || [],
        // Add passenger count
        passengers: formData?.adults || 1,
      }),
    };

    navigate("/booking", {
      state: {
        type: searchType,
        selectedItem: itemWithDetails,
        searchParams: {
          ...searchParams,
          // ENHANCED: Include search-specific params
          ...(searchType === "hotels" && {
            nights: nights,
            rooms: formData?.rooms || 1,
            guests: (formData?.adults || 1) + (formData?.children || 0),
            checkInDate: formData?.checkInDate,
            checkOutDate: formData?.checkOutDate,
          }),
          ...(searchType === "cars" && {
            days: days,
            driverAge: formData?.age,
            pickupLocation: formData?.pickupLocation,
            dropLocation: formData?.dropLocation,
            fromDateTime: formData?.fromDateTime,
            toDateTime: formData?.toDateTime,
          }),
          ...(searchType === "flights" && {
            travelers: (formData?.adults || 1) + (formData?.children || 0),
            travelClass: formData?.travelClass,
          }),
        },
        formData,
      },
    });
  };

  // Render filter sidebar
  const renderFilters = () => (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Filters</h3>
        <button
          onClick={resetFilters}
          className="text-sm text-[var(--accent-dark)] hover:text-[var(--accent)]"
        >
          Reset All
        </button>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Price Range (${filters.minPrice} - ${filters.maxPrice})
        </label>
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="10000"
            step="100"
            value={filters.maxPrice}
            onChange={(e) =>
              handleFilterChange("maxPrice", parseInt(e.target.value))
            }
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>$0</span>
            <span>${filters.maxPrice}</span>
          </div>
        </div>
      </div>

      {/* Sort By */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sort By
        </label>
        <select
          value={filters.sortBy}
          onChange={(e) => handleFilterChange("sortBy", e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        >
          <option value="price">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
          {searchType === "flights" && (
            <option value="duration">Shortest Duration</option>
          )}
        </select>
      </div>

      {/* Search Type Specific Filters */}
      {searchType === "flights" && (
        <>
          {/* Airlines */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Airlines
            </label>
            <div className="space-y-2">
              {filterOptions.airlines.map((airline) => (
                <label key={airline} className="flex items-center">
                  {/* <input
                    type="checkbox"
                    checked={filters.airlines.includes(airline)}
                    onChange={(e) =>
                      handleArrayFilterChange(
                        "airlines",
                        airline,
                        e.target.checked
                      )
                    }
                    className="rounded border-gray-300 text-[var(--primary)] focus:ring-[var(--primary)]"
                  /> */}
                  <input
                    type="radio"
                    name="airline"
                    checked={filters.airlines.includes(airline)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        // Replace the entire array with just this airline
                        setFilters((prev) => ({
                          ...prev,
                          airlines: [airline],
                        }));
                      }
                    }}
                    className="rounded border-gray-300 text-[var(--primary)] focus:ring-[var(--primary)]"
                  />
                  <span className="ml-2 text-sm">{airline}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Stops */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stops
            </label>
            <div className="space-y-2">
              {filterOptions.stops.map((stop) => (
                <label key={stop.value} className="flex items-center">
                  <input
                    type="radio"
                    name="stops"
                    value={stop.value}
                    checked={filters.stops === stop.value}
                    onChange={(e) =>
                      handleFilterChange("stops", e.target.value)
                    }
                    className="border-gray-300 text-[var(--primary)] focus:ring-[var(--primary)]"
                  />
                  <span className="ml-2 text-sm">{stop.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Max Duration */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Duration: {filters.duration}h
            </label>
            <input
              type="range"
              min="1"
              max="24"
              value={filters.duration}
              onChange={(e) =>
                handleFilterChange("duration", parseInt(e.target.value))
              }
              className="w-full"
            />
          </div>
        </>
      )}

      {searchType === "hotels" && (
        <>
          {/* Rating */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Rating
            </label>
            <div className="grid grid-cols-2 grid-rows-2 gap-4">
              {[1, 2, 3, 4].map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleFilterChange("rating", rating)}
                  className={`flex items-center px-3 py-1 rounded-lg border ${
                    filters.rating === rating
                      ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                      : "bg-white text-gray-700 border-gray-300"
                  }`}
                >
                  <Star className="h-3 w-3 mr-1" />
                  {rating}+
                </button>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amenities
            </label>
            <div className="space-y-2">
              {filterOptions.amenities.map((amenity) => (
                <label key={amenity} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.amenities.includes(amenity)}
                    onChange={(e) =>
                      handleArrayFilterChange(
                        "amenities",
                        amenity,
                        e.target.checked
                      )
                    }
                    className="rounded border-gray-300 text-[var(--primary)] focus:ring-[var(--primary)]"
                  />
                  <span className="ml-2 text-sm">{amenity}</span>
                </label>
              ))}
            </div>
          </div>
        </>
      )}

      {searchType === "cars" && (
        <>
          {/* Car Types */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Car Types
            </label>
            <div className="space-y-2">
              {filterOptions.carTypes.map((type) => (
                <label key={type} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.carTypes.includes(type)}
                    onChange={(e) =>
                      handleArrayFilterChange(
                        "carTypes",
                        type,
                        e.target.checked
                      )
                    }
                    className="rounded border-gray-300 text-[var(--primary)] focus:ring-[var(--primary)]"
                  />
                  <span className="ml-2 text-sm">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Providers */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Providers
            </label>
            <div className="space-y-2">
              {filterOptions.providers.map((provider) => (
                <label key={provider} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.providers.includes(provider)}
                    onChange={(e) =>
                      handleArrayFilterChange(
                        "providers",
                        provider,
                        e.target.checked
                      )
                    }
                    className="rounded border-gray-300 text-[var(--primary)] focus:ring-[var(--primary)]"
                  />
                  <span className="ml-2 text-sm">{provider}</span>
                </label>
              ))}
            </div>
          </div>
        </>
      )}

      {searchType === "cruises" && (
        <>
          {/* Cruise Lines */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cruise Lines
            </label>
            <div className="space-y-2">
              {filterOptions.cruiseLines.map((line) => (
                <label key={line} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.cruiseLines.includes(line)}
                    onChange={(e) =>
                      handleArrayFilterChange(
                        "cruiseLines",
                        line,
                        e.target.checked
                      )
                    }
                    className="rounded border-gray-300 text-[var(--primary)] focus:ring-[var(--primary)]"
                  />
                  <span className="ml-2 text-sm">{line}</span>
                </label>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderFlightCard = (flight, index) => (
    <div
      key={flight.id || index}
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold">{flight.airline}</h3>
          <p className="text-gray-600">
            {flight.flightNumber} - {flight.class}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-[var(--primary)]">
            ${flight.discountedPrice}
          </p>
          <p className="text-sm text-gray-600">
            20% Off - <strike>${flight.originalPrice}</strike>
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="text-center">
          <p className="text-lg font-semibold">
            {flight.departure?.time
              ? flight.departure.time.split("T")[1].substring(0, 5)
              : "08:00"}
          </p>
          <p className="text-sm text-gray-600">
            {flight.departure?.airport || formData?.origin}
          </p>
        </div>

        <div className="flex-1 mx-4">
          <div className="flex items-center">
            <div className="flex-1 border-t-2 border-gray-300"></div>
            <Plane className="h-4 w-4 mx-2 text-gray-400 transform rotate-90" />
            <div className="flex-1 border-t-2 border-gray-300"></div>
          </div>
          <p className="text-xs text-center text-gray-500 mt-1">
            <p className="text-xs text-center text-gray-500">
              {flight.duration
                ?.replace("PT", "")
                .replace(/(\d+)h(\d+)m/, "$1h $2m")
                .toLowerCase() || "3h 30m"}
            </p>
          </p>
          <p className="text-xs text-center text-gray-500">
            {flight.stops || 0} stop{flight.stops !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="text-center">
          <p className="text-lg font-semibold">
            {flight.arrival?.time
              ? flight.arrival.time.split("T")[1].substring(0, 5)
              : "11:30"}
          </p>
          <p className="text-sm text-gray-600">
            {flight.arrival?.airport || formData?.destination}
          </p>
        </div>
      </div>

      <button
        onClick={() => handleSelect(flight)}
        className="w-full bg-[var(--accent-dark)] hover:bg-[var(--accent)] text-white py-2 px-4 rounded-lg transition-colors"
      >
        Select Flight
      </button>
    </div>
  );

  // In Results.jsx - Enhanced hotel card display (optional improvement)

  const renderHotelCard = (hotel, index) => (
    <div
      key={hotel.id || index}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="h-48 bg-gray-200 flex items-center justify-center">
        <Hotel className="h-12 w-12 text-gray-400" />
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold">
            {hotel.name || "Luxury Hotel"}
          </h3>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="ml-1">{hotel.rating || 4.5}</span>
          </div>
        </div>

        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">
            {hotel.address?.line1 && `${hotel.address.line1}, `}
            {hotel.address?.city || searchParams?.destination},{" "}
            {hotel.address?.country || "US"}
          </span>
        </div>

        {/* ENHANCED: Hotel details section */}
        <div className="space-y-2 mb-4 text-sm text-gray-600">
          {hotel.roomType && (
            <div className="flex justify-between">
              <span>Room Type:</span>
              <span className="font-medium">{hotel.roomType}</span>
            </div>
          )}
          {hotel.amenities && hotel.amenities.length > 0 && (
            <div>
              <span>Amenities:</span>
              <span className="ml-2 font-medium">
                {hotel.amenities.slice(0, 3).join(", ")}
                {hotel.amenities.length > 3 && "..."}
              </span>
            </div>
          )}
          {hotel.distance && (
            <div className="flex justify-between">
              <span>Distance:</span>
              <span className="font-medium">
                {hotel.distance.value} {hotel.distance.unit} to{" "}
                {hotel.distance.to}
              </span>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-2xl font-bold text-[var(--primary)]">
              ${hotel.discountedPrice}
            </p>
            <p className="text-sm text-gray-600">
              20% Off - <strike>${hotel.originalPrice}</strike> for{" "}
              {searchParams?.nights ||
                Math.ceil(
                  (new Date(formData?.checkOutDate) -
                    new Date(formData?.checkInDate)) /
                    (1000 * 60 * 60 * 24)
                ) ||
                1}{" "}
              night(s)
            </p>
          </div>
        </div>

        <button
          onClick={() => handleSelect(hotel)}
          className="w-full bg-[var(--accent-dark)] hover:bg-[var(--accent)] text-white py-2 px-4 rounded-lg transition-colors"
        >
          Select Hotel
        </button>
      </div>
    </div>
  );

  const renderCarCard = (car, index) => {
    // Calculate days for display
    const days = Math.ceil(
      (new Date(formData?.toDateTime) - new Date(formData?.fromDateTime)) /
        (1000 * 60 * 60 * 24)
    );

    return (
      <div
        key={car.id || index}
        className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
      >
        <div className="flex items-center mb-4">
          <Car className="h-12 w-12 text-[var(--primary)] mr-4" />
          <div>
            <h3 className="text-xl font-semibold">
              {car.carType || "Economy Car"}
            </h3>
            <p className="text-gray-600">
              {car.model || "Standard Model"} - {car.provider}
            </p>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Provider:</span>
            <span className="font-semibold">{car.provider || "Hertz"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Pickup:</span>
            <span>{car.pickupLocation || searchParams?.pickupLocation}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Drop-off:</span>
            <span>
              {car.dropLocation ||
                car.pickupLocation ||
                searchParams?.pickupLocation}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Duration:</span>
            <span>
              {days} day{days > 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Transmission:</span>
            <span className="capitalize">
              {car.transmission || "automatic"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Capacity:</span>
            <span>
              {car.seats || 5} seats, {car.bags || 2} bags
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Features:</span>
            <span className="text-sm">
              {(car.features || ["Automatic", "Air Conditioning"])
                .slice(0, 3)
                .join(", ")}
              {car.features && car.features.length > 3 && "..."}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-2xl font-bold text-[var(--primary)]">
              ${car.discountedPrice}
            </p>
            <p className="text-sm text-gray-600">
              20% Off - <strike>${car.originalPrice}</strike> total for {days}{" "}
              day{days > 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <button
          onClick={() => handleSelect(car)}
          className="w-full bg-[var(--accent-dark)] hover:bg-[var(--accent)] text-white py-2 px-4 rounded-lg transition-colors"
        >
          Rent Car
        </button>
      </div>
    );
  };

  const renderCruiseCard = (cruise, index) => (
    <div
      key={cruise.id || index}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="h-48 bg-gray-200 flex items-center justify-center">
        <Ship className="h-12 w-12 text-gray-400" />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">
          {cruise.cruiseLine || "Royal Caribbean"}
        </h3>
        <p className="text-gray-600 mb-3">
          {cruise.shipName || "Premium Cruise Ship"}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Destination:</span>
            <span className="font-semibold">
              {cruise.destination || searchParams?.destination}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Duration:</span>
            <span>{cruise.nights || 7} nights</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Departure:</span>
            <span>
              {new Date(
                cruise.departureDate || new Date().toISOString()
              ).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Itinerary:</span>
            <span className="text-sm">
              {(cruise.itinerary || ["Port 1", "Port 2"]).join(" → ")}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-2xl font-bold text-[var(--primary)]">
              ${cruise.discountedPrice}
            </p>
            <p className="text-sm text-gray-600">
              20% Off - <strike>${cruise.originalPrice}</strike> per person
            </p>
          </div>
        </div>

        <button
          onClick={() => handleSelect(cruise)}
          className="w-full bg-[var(--accent-dark)] hover:bg-[var(--accent)] text-white py-2 px-4 rounded-lg transition-colors"
        >
          Book Cruise
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <CallBanner />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
          <span className="ml-4 text-gray-600">
            Searching for the best deals...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="bg-red-100 rounded-lg p-8 max-w-md mx-auto">
            <Clock className="h-12 w-12 mx-auto text-red-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-red-800">
              Search Error
            </h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => navigate("/")}
              className="bg-[var(--accent-dark)] hover:bg-[var(--accent)] text-white px-6 py-2 rounded-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!searchType) {
    navigate("/");
    return null;
  }

  const displayResults = Array.isArray(results) ? results : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <CallBanner />
      <div className="flex justify-between items-center mb-6 my-4">
        <div>
          <h2 className="text-xl sm:text-3xl font-bold text-gray-800">
            {searchType.charAt(0).toUpperCase() + searchType.slice(1)} Search
            Results
          </h2>
          <p className="text-gray-600 mt-1 sm:mt-2">
            {searchType === "flights" &&
              `Flights from ${searchParams?.origin} to ${searchParams?.destination}`}
            {searchType === "hotels" &&
              `Hotels in ${searchParams?.destination}`}
            {searchType === "cars" &&
              `Car rentals in ${searchParams?.pickupLocation}`}
            {searchType === "cruises" &&
              `Cruises to ${searchParams?.destination}`}
          </p>
          <p className="text-gray-600 ">
            Showing {results.length} of {applyFilters(allResults).length}{" "}
            {applyFilters(allResults).length === 1 ? "result" : "results"}
          </p>
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 relative"
        >
          <Filter className="h-4 w-4" />
          <span>Filters</span>
          {getActiveFilterCount() > 0 && (
            <span className="absolute -top-2 -right-2 bg-[var(--primary)] text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
              {getActiveFilterCount()}
            </span>
          )}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters Sidebar */}
        <div
          className={`lg:w-1/4 ${showFilters ? "block" : "hidden lg:block"}`}
        >
          {renderFilters()}
        </div>

        {/* Results */}
        <div className="lg:w-3/4">
          {Array.isArray(results) && results.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-lg p-8 max-w-md mx-auto">
                <Clock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No results found</h3>
                <p className="text-gray-600 mb-4">
                  No results match your current filters. Try adjusting your
                  criteria.
                </p>
                <button
                  onClick={resetFilters}
                  className="bg-[var(--accent-dark)] hover:bg-[var(--accent)] text-white px-6 py-2 rounded-lg mr-2"
                >
                  Reset Filters
                </button>
                <a href="/">
                  <button className="bg-[var(--accent-dark)] hover:bg-[var(--accent)] text-white px-6 py-2 rounded-lg ml-2">
                    Return Home
                  </button>
                </a>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6 mb-5">
                {Array.isArray(results) &&
                  results.map((item, index) => {
                    switch (searchType) {
                      case "flights":
                        return renderFlightCard(item, index);
                      case "hotels":
                        return renderHotelCard(item, index);
                      case "cars":
                        return renderCarCard(item, index);
                      case "cruises":
                        return renderCruiseCard(item, index);
                      default:
                        return null;
                    }
                  })}
              </div>

              {/* Show More Results Button */}
              {hasMore && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={loadMoreResults}
                    disabled={loadingMore}
                    className="bg-[var(--accent-dark)] hover:bg-[var(--accent)] text-white px-8 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center mb-7"
                  >
                    {loadingMore ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Loading...
                      </>
                    ) : (
                      `Show More Results`
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <CallBanner />
    </div>
  );
};

export default Results;
