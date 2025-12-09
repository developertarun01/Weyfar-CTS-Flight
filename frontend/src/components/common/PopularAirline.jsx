import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PopularAirline = ({ props }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [locationError, setLocationError] = useState("");

  // Function to get user's current location
  const getUserLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve({ latitude, longitude });
        },
        (error) => {
          let errorMessage = "Unable to retrieve your location";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage =
                "Location access denied. Please enable location services.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage = "Location request timed out.";
              break;
            default:
              errorMessage = "An unknown error occurred.";
              break;
          }
          reject(new Error(errorMessage));
        },
        {
          timeout: 10000,
          enableHighAccuracy: true,
        }
      );
    });
  };

  // Top 10 cities/capitals from each continent as fallback
  const getTopCitiesFallback = (latitude, longitude) => {
    // Major cities with coordinates
    const topCities = [
      // Asia
      {
        code: "DEL",
        name: "Delhi",
        lat: 28.6139,
        lon: 77.209,
        continent: "Asia",
      },
      {
        code: "BOM",
        name: "Mumbai",
        lat: 19.076,
        lon: 72.8777,
        continent: "Asia",
      },
      {
        code: "SIN",
        name: "Singapore",
        lat: 1.3521,
        lon: 103.8198,
        continent: "Asia",
      },
      {
        code: "BKK",
        name: "Bangkok",
        lat: 13.7563,
        lon: 100.5018,
        continent: "Asia",
      },
      {
        code: "KUL",
        name: "Kuala Lumpur",
        lat: 3.139,
        lon: 101.6869,
        continent: "Asia",
      },
      {
        code: "HKG",
        name: "Hong Kong",
        lat: 22.3193,
        lon: 114.1694,
        continent: "Asia",
      },
      {
        code: "ICN",
        name: "Seoul",
        lat: 37.5665,
        lon: 126.978,
        continent: "Asia",
      },
      {
        code: "HND",
        name: "Tokyo",
        lat: 35.6762,
        lon: 139.6503,
        continent: "Asia",
      },
      {
        code: "PVG",
        name: "Shanghai",
        lat: 31.2304,
        lon: 121.4737,
        continent: "Asia",
      },
      {
        code: "DXB",
        name: "Dubai",
        lat: 25.2048,
        lon: 55.2708,
        continent: "Asia",
      },

      // Europe
      {
        code: "LHR",
        name: "London",
        lat: 51.5074,
        lon: -0.1278,
        continent: "Europe",
      },
      {
        code: "CDG",
        name: "Paris",
        lat: 48.8566,
        lon: 2.3522,
        continent: "Europe",
      },
      {
        code: "FRA",
        name: "Frankfurt",
        lat: 50.1109,
        lon: 8.6821,
        continent: "Europe",
      },
      {
        code: "AMS",
        name: "Amsterdam",
        lat: 52.3676,
        lon: 4.9041,
        continent: "Europe",
      },
      {
        code: "FCO",
        name: "Rome",
        lat: 41.9028,
        lon: 12.4964,
        continent: "Europe",
      },
      {
        code: "MAD",
        name: "Madrid",
        lat: 40.4168,
        lon: -3.7038,
        continent: "Europe",
      },
      {
        code: "BCN",
        name: "Barcelona",
        lat: 41.3851,
        lon: 2.1734,
        continent: "Europe",
      },
      {
        code: "ZRH",
        name: "Zurich",
        lat: 47.3769,
        lon: 8.5417,
        continent: "Europe",
      },
      {
        code: "VIE",
        name: "Vienna",
        lat: 48.2082,
        lon: 16.3738,
        continent: "Europe",
      },
      {
        code: "CPH",
        name: "Copenhagen",
        lat: 55.6761,
        lon: 12.5683,
        continent: "Europe",
      },

      // North America
      {
        code: "JFK",
        name: "New York",
        lat: 40.7128,
        lon: -74.006,
        continent: "North America",
      },
      {
        code: "LAX",
        name: "Los Angeles",
        lat: 34.0522,
        lon: -118.2437,
        continent: "North America",
      },
      {
        code: "ORD",
        name: "Chicago",
        lat: 41.8781,
        lon: -87.6298,
        continent: "North America",
      },
      {
        code: "YYZ",
        name: "Toronto",
        lat: 43.6532,
        lon: -79.3832,
        continent: "North America",
      },
      {
        code: "MIA",
        name: "Miami",
        lat: 25.7617,
        lon: -80.1918,
        continent: "North America",
      },
      {
        code: "YVR",
        name: "Vancouver",
        lat: 49.2827,
        lon: -123.1207,
        continent: "North America",
      },
      {
        code: "DFW",
        name: "Dallas",
        lat: 32.7767,
        lon: -96.797,
        continent: "North America",
      },
      {
        code: "SFO",
        name: "San Francisco",
        lat: 37.7749,
        lon: -122.4194,
        continent: "North America",
      },
      {
        code: "BOS",
        name: "Boston",
        lat: 42.3601,
        lon: -71.0589,
        continent: "North America",
      },
      {
        code: "MEX",
        name: "Mexico City",
        lat: 19.4326,
        lon: -99.1332,
        continent: "North America",
      },

      // South America
      {
        code: "GRU",
        name: "São Paulo",
        lat: -23.5505,
        lon: -46.6333,
        continent: "South America",
      },
      {
        code: "EZE",
        name: "Buenos Aires",
        lat: -34.6037,
        lon: -58.3816,
        continent: "South America",
      },
      {
        code: "SCL",
        name: "Santiago",
        lat: -33.4489,
        lon: -70.6693,
        continent: "South America",
      },
      {
        code: "BOG",
        name: "Bogotá",
        lat: 4.711,
        lon: -74.0721,
        continent: "South America",
      },
      {
        code: "LIM",
        name: "Lima",
        lat: -12.0464,
        lon: -77.0428,
        continent: "South America",
      },
      {
        code: "GIG",
        name: "Rio de Janeiro",
        lat: -22.9068,
        lon: -43.1729,
        continent: "South America",
      },

      // Africa
      {
        code: "JNB",
        name: "Johannesburg",
        lat: -26.2041,
        lon: 28.0473,
        continent: "Africa",
      },
      {
        code: "CAI",
        name: "Cairo",
        lat: 30.0444,
        lon: 31.2357,
        continent: "Africa",
      },
      {
        code: "LOS",
        name: "Lagos",
        lat: 6.5244,
        lon: 3.3792,
        continent: "Africa",
      },
      {
        code: "NBO",
        name: "Nairobi",
        lat: -1.2921,
        lon: 36.8219,
        continent: "Africa",
      },
      {
        code: "CMN",
        name: "Casablanca",
        lat: 33.5731,
        lon: -7.5898,
        continent: "Africa",
      },
      {
        code: "CPT",
        name: "Cape Town",
        lat: -33.9249,
        lon: 18.4241,
        continent: "Africa",
      },

      // Oceania
      {
        code: "SYD",
        name: "Sydney",
        lat: -33.8688,
        lon: 151.2093,
        continent: "Oceania",
      },
      {
        code: "MEL",
        name: "Melbourne",
        lat: -37.8136,
        lon: 144.9631,
        continent: "Oceania",
      },
      {
        code: "AKL",
        name: "Auckland",
        lat: -36.8509,
        lon: 174.7645,
        continent: "Oceania",
      },
      {
        code: "BNE",
        name: "Brisbane",
        lat: -27.4698,
        lon: 153.0251,
        continent: "Oceania",
      },
    ];

    // Calculate distance using Haversine formula
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
      const R = 6371; // Earth radius in km
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLon = ((lon2 - lon1) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    let nearestCity = topCities[0];
    let shortestDistance = calculateDistance(
      latitude,
      longitude,
      nearestCity.lat,
      nearestCity.lon
    );

    topCities.forEach((city) => {
      const distance = calculateDistance(
        latitude,
        longitude,
        city.lat,
        city.lon
      );
      if (distance < shortestDistance) {
        shortestDistance = distance;
        nearestCity = city;
      }
    });

    // console.log(
    //   `Fallback: Nearest major city is ${nearestCity.name} (${
    //     nearestCity.code
    //   }) - ${shortestDistance.toFixed(1)} km`
    // );
    return nearestCity.code;
  };

  const getNearestAirport = async (latitude, longitude) => {
    try {
      // Use environment variable or direct API key
      const API_KEY = process.env.AVIATION_API_KEY;

      const response = await fetch(
        `https://api.aviationstack.com/v1/airports?access_key=${API_KEY}&lat=${latitude}&lon=${longitude}&limit=10`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.data && data.data.length > 0) {
        // Find first airport with valid IATA code
        const validAirport = data.data.find(
          (airport) =>
            airport.iata_code &&
            airport.iata_code !== "" &&
            airport.iata_code !== "\\N"
        );

        if (validAirport) {
          // console.log(
          //   `Aviation API found: ${validAirport.iata_code} - ${validAirport.airport_name}`
          // );
          return validAirport.iata_code;
        }
      }

      throw new Error("No valid airports found in API response");
    } catch (error) {
      console.error("Aviation API error, using fallback:", error.message);
      return getTopCitiesFallback(latitude, longitude);
    }
  };

  const handleBookNow = async () => {
    setIsLoading(true);
    setLocationError("");

    try {
      // Step 1: Get user's current location
      const location = await getUserLocation();
      // console.log("User location:", location);

      // Step 2: Convert location to nearest airport code
      const originAirport = await getNearestAirport(
        location.latitude,
        location.longitude
      );

      // Step 3: Prepare dates
      const today = new Date().toISOString().split("T")[0];
      const returnDate = new Date();
      returnDate.setDate(returnDate.getDate() + 5);
      const returnDateStr = returnDate.toISOString().split("T")[0];

      // Step 4: Prepare flight search data
      const airlineName = props.title.replace(" Airlines", "");
      const searchData = {
        tripType: "roundTrip",
        origin: originAirport,
        destination: "LHR",
        fromDate: today,
        toDate: returnDateStr,
        adults: 1,
        children: 0,
        travelClass: "ECONOMY",
        airline: airlineName,
      };

      // Step 5: Navigate to results page
      navigate("/results", {
        state: {
          searchType: "flights",
          formData: searchData,
          searchParams: {
            origin: searchData.origin,
            destination: searchData.destination,
            fromDate: searchData.fromDate,
            toDate: searchData.toDate,
            passengers: searchData.adults + searchData.children,
            airline: searchData.airline,
          },
        },
      });
    } catch (error) {
      console.error("Booking error:", error);

      // ❌ Do NOT set validation error, because we want silent fallback
      // setLocationError(error.message);

      // Step: Use fallback
      const today = new Date().toISOString().split("T")[0];
      const returnDate = new Date();
      returnDate.setDate(returnDate.getDate() + 5);
      const returnDateStr = returnDate.toISOString().split("T")[0];

      const airlineName = props.title.replace(" Airlines", "");

      const fallbackData = {
        tripType: "roundTrip",
        origin: "JFK",
        destination: "LHR",
        fromDate: today,
        toDate: returnDateStr,
        adults: 1,
        children: 0,
        travelClass: "ECONOMY",
        airline: airlineName,
      };

      navigate("/results", {
        state: {
          searchType: "flights",
          formData: fallbackData,
          searchParams: {
            origin: fallbackData.origin,
            destination: fallbackData.destination,
            fromDate: fallbackData.fromDate,
            toDate: fallbackData.toDate,
            passengers: fallbackData.adults + fallbackData.children,
            airline: fallbackData.airline,
            usedFallback: true,
          },
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`section2-card ${props.classes}`}>
      <h3 className="text-xl font-bold">{props.title}</h3>
      <div className="section2-card-bottom flex-mine">
        <div className="section2-card-bottom-left">
          <p className="text-sm">Save Big, Upto 40%</p>
          <h2>$99.99</h2>
        </div>
        <button
          onClick={handleBookNow}
          disabled={isLoading}
          className="section2-card-bottom-right bg-[var(--accent-dark)] hover:bg-[var(--accent)] text-white px-4 py-2 rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Locating...
            </span>
          ) : (
            "Book Now"
          )}
        </button>
      </div>
      {locationError && (
        <p className="text-red-500 text-xs mt-2 text-center">{locationError}</p>
      )}
    </div>
  );
};

export default PopularAirline;
