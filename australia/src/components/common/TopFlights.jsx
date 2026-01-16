import React from "react";
import { useNavigate } from "react-router-dom";

const TopFlights = ({ props }) => {
  const navigate = useNavigate();

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
    });
  };

  const date = new Date();
  const today = date.toISOString().split("T")[0];
  const todayFormatted = formatDate(date);

  // Create a new date object for 5 days later
  const fiveDaysLaterDate = new Date(date);
  fiveDaysLaterDate.setDate(date.getDate() + 5);
  const fiveDaysLater = fiveDaysLaterDate.toISOString().split("T")[0];
  const fiveDaysLaterFormatted = formatDate(fiveDaysLaterDate);

  // Filter flights based on type
  const flights = [
    {
      id: 1,
      image: `${
        import.meta.env.BASE_URL
      }australia-flights/images/australia4.jpg`,
      route: "SFO – MEL",
      price: "$699",
      from: "SFO",
      to: "MEL",
    },
    {
      id: 2,
      image: `${
        import.meta.env.BASE_URL
      }australia-flights/images/australia4.jpg`,
      route: "LAX – MEL",
      price: "$699",
      from: "LAX",
      to: "MEL",
    },
    {
      id: 3,
      image: `${
        import.meta.env.BASE_URL
      }australia-flights/images/australia4.jpg`,
      route: "LAX – BNE",
      price: "$699",
      from: "LAX",
      to: "BNE",
    },
    {
      id: 4,
      image: `${
        import.meta.env.BASE_URL
      }australia-flights/images/australia4.jpg`,
      route: "DFW – SYD",
      price: "$699",
      from: "DFW",
      to: "SYD",
    },
    {
      id: 5,

      image: `${
        import.meta.env.BASE_URL
      }australia-flights/images/australia4.jpg`,
      route: "LAX – SYD",
      price: "$699",
      from: "LAX",
      to: "SYD",
    },
    {
      id: 6,
      image: `${
        import.meta.env.BASE_URL
      }australia-flights/images/australia4.jpg`,
      route: "SFO – SYD",
      price: "$699",
      from: "SFO",
      to: "SYD",
    },
    {
      id: 7,
      image: `${
        import.meta.env.BASE_URL
      }australia-flights/images/australia4.jpg`,
      route: "SEA – SYD",
      price: "$699",
      from: "SEA",
      to: "SYD",
    },
    {
      id: 8,
      image: `${
        import.meta.env.BASE_URL
      }australia-flights/images/australia4.jpg`,
      route: "ORD – SYD",
      price: "$699",
      from: "ORD",
      to: "SYD",
    },
    {
      id: 9,
      image: `${
        import.meta.env.BASE_URL
      }australia-flights/images/australia4.jpg`,
      route: "IAH – SYD",
      price: "$699",
      from: "IAH",
      to: "SYD",
    },
    {
      id: 10,
      image: `${
        import.meta.env.BASE_URL
      }australia-flights/images/australia4.jpg`,
      route: "JFK – SYD",
      price: "$699",
      from: "JFK",
      to: "SYD",
    },
  ];

  // Filter flights based on type
  const filteredFlights =
    props.type === "Melbourne"
      ? flights.filter((flight) => flight.id >= 1 && flight.id <= 5)
      : props.type === "Sydney"
      ? flights.filter((flight) => flight.id >= 6 && flight.id <= 10)
      : flights;

  const handleFlightClick = (flight) => {
    // Create search data similar to PopularAirline.jsx
    const searchData = {
      tripType: "roundTrip",
      origin: flight.from,
      destination: flight.to,
      fromDate: today,
      toDate: fiveDaysLater,
      adults: 1,
      children: 0,
      travelClass: "ECONOMY",
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
        },
      },
    });
  };

  return (
    <div className="flex-mine-column">
      <div className={`section3-header ${props.classes}`}>
        Top Flights to {props.type}
      </div>
      {filteredFlights.map((flight) => (
        <div
          key={flight.id}
          className="section3-list flex-mine"
          onClick={() => handleFlightClick(flight)}
          style={{
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#f5f5f5";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "";
            e.currentTarget.style.transform = "";
          }}
        >
          <img src={flight.image} alt="" />
          <h4>{flight.route}</h4>
          <p>
            {todayFormatted} - {fiveDaysLaterFormatted}
          </p>
          <h4>{flight.price}</h4>
        </div>
      ))}
    </div>
  );
};

export default TopFlights;
