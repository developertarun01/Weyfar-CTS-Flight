import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [locationError, setLocationError] = useState("");

  useEffect(() => {
    // Hamburger menu functionality
    const hamMenu = document.querySelector(".ham-menu");
    const details = document.querySelector(".header-details");
    const allDeals = document.getElementById("all-deals");

    if (hamMenu && details && allDeals) {
      const toggleMenu = () => {
        hamMenu.classList.toggle("active");
        details.classList.toggle("active");
        allDeals.style.display = "none";
      };

      hamMenu.addEventListener("click", toggleMenu);

      // Deals dropdown functionality
      const dealsElement = document.getElementById("deals");
      if (dealsElement) {
        const toggleDealsDropdown = (e) => {
          e.preventDefault();
          const currentDisplay = window.getComputedStyle(allDeals).display;

          if (currentDisplay === "none") {
            allDeals.style.display = "grid";
          } else {
            allDeals.style.display = "none";
          }
        };

        dealsElement.addEventListener("click", toggleDealsDropdown);

        // Cleanup to avoid duplicate listeners
        return () => {
          hamMenu.removeEventListener("click", toggleMenu);
          dealsElement.removeEventListener("click", toggleDealsDropdown);
        };
      }

      return () => hamMenu.removeEventListener("click", toggleMenu);
    }
  }, []);

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

  // Top cities fallback function (same as in PopularAirline)
  const getTopCitiesFallback = (latitude, longitude) => {
    const topCities = [
      // North America
      { code: "JFK", name: "New York", lat: 40.7128, lon: -74.006 },
      { code: "LAX", name: "Los Angeles", lat: 34.0522, lon: -118.2437 },
      { code: "ORD", name: "Chicago", lat: 41.8781, lon: -87.6298 },
      { code: "YYZ", name: "Toronto", lat: 43.6532, lon: -79.3832 },
      { code: "MIA", name: "Miami", lat: 25.7617, lon: -80.1918 },
      { code: "YVR", name: "Vancouver", lat: 49.2827, lon: -123.1207 },
      { code: "DFW", name: "Dallas", lat: 32.7767, lon: -96.797 },
      { code: "SFO", name: "San Francisco", lat: 37.7749, lon: -122.4194 },
      { code: "BOS", name: "Boston", lat: 42.3601, lon: -71.0589 },
      { code: "MEX", name: "Mexico City", lat: 19.4326, lon: -99.1332 },
      // Asia
      { code: "DEL", name: "Delhi", lat: 28.6139, lon: 77.209 },
      { code: "BOM", name: "Mumbai", lat: 19.076, lon: 72.8777 },
      // Add more as needed...
    ];

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
      const R = 6371;
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

    return nearestCity.code;
  };

  const getNearestAirport = async (latitude, longitude) => {
    try {
      const API_KEY = process.env.AVIATION_API_KEY;
      const response = await fetch(
        `https://api.aviationstack.com/v1/airports?access_key=${API_KEY}&lat=${latitude}&lon=${longitude}&limit=10`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.data && data.data.length > 0) {
        const validAirport = data.data.find(
          (airport) =>
            airport.iata_code &&
            airport.iata_code !== "" &&
            airport.iata_code !== "\\N"
        );

        if (validAirport) {
          return validAirport.iata_code;
        }
      }

      throw new Error("No valid airports found in API response");
    } catch (error) {
      console.error("Aviation API error, using fallback:", error.message);
      return getTopCitiesFallback(latitude, longitude);
    }
  };

  const handleDestinationClick = async (destination) => {
    setIsLoading(true);
    setLocationError("");

    // ADD THIS: Hide the dropdown immediately when destination is clicked
    const allDeals = document.getElementById("all-deals");
    if (allDeals) {
      allDeals.style.display = "none";
    }

    try {
      // Get user's current location
      const location = await getUserLocation();

      // Convert location to nearest airport code
      const originAirport = await getNearestAirport(
        location.latitude,
        location.longitude
      );

      // Prepare dates
      const today = new Date().toISOString().split("T")[0];
      const returnDate = new Date();
      returnDate.setDate(returnDate.getDate() + 5);
      const returnDateStr = returnDate.toISOString().split("T")[0];

      // Prepare flight search data
      const searchData = {
        tripType: "roundTrip",
        origin: originAirport,
        destination: destination,
        fromDate: today,
        toDate: returnDateStr,
        adults: 1,
        children: 0,
        travelClass: "ECONOMY",
      };

      // Navigate to results page
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
          },
        },
      });
    } catch (error) {
      console.error("Location error:", error);
      setLocationError(error.message);

      // Fallback with default origin
      const today = new Date().toISOString().split("T")[0];
      const returnDate = new Date();
      returnDate.setDate(returnDate.getDate() + 5);
      const returnDateStr = returnDate.toISOString().split("T")[0];

      const searchData = {
        tripType: "roundTrip",
        origin: "JFK", // Default fallback
        destination: destination,
        fromDate: today,
        toDate: returnDateStr,
        adults: 1,
        children: 0,
        travelClass: "ECONOMY",
        usedFallback: true,
      };

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
            usedFallback: true,
          },
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Destination mappings
  const usDestinations = {
    Dallas: "DFW",
    Orlando: "MCO",
    "West Palm Beach": "PBI",
    "San Diego": "SAN",
    "New Orleans": "MSY",
    Baltimore: "BWI",
    Philadelphia: "PHL",
    Seattle: "SEA",
  };

  const internationalDestinations = {
    "India Flights": "DEL",
    "Mexico City": "MEX",
    Guadalajara: "GDL",
    "San Juan": "SJU",
    Delhi: "DEL",
    Mumbai: "BOM",
    Bengaluru: "BLR",
    Vancouver: "YVR",
    Cancun: "CUN",
    "Punta Cana": "PUJ",
  };

  return (
    <>
      <header>
        <Link to="tel:8888082182">
          <div className="flex-mine header container">
            <i
              className="fa-solid fa-headset fa-beat fa-xl header-call-button"
              style={{ color: "var(--primary)", marginRight: "10px" }}
            ></i>
            <h2
              className="text-2xl font-semibold"
              style={{ color: "var(--primary)" }}
            >
              +1 (888) 808-2182
            </h2>
          </div>
        </Link>
      </header>
    </>
  );
};

export default Navbar;
