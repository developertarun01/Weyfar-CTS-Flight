import React from "react";

const HotelDeals = ({ props }) => {
  return (
    <div className="flex-mine-column">
      <div className={`section3-header ${props.classes} `}>
        {props.title} Hotels
      </div>
      {[
        {
          id: 1,
          name: "Quality Hotel Ulstein",
          address: "Sjøgata 10, Ulsteinvik , NO, 6065",
          price: "$175.03",
        },
        {
          id: 2,
          name: "Grand Plaza Hotel",
          address: "Main Street 25, Oslo, NO, 0123",
          price: "$220.50",
        },
        {
          id: 3,
          name: "Seaside Resort",
          address: "Beach Road 45, Bergen, NO, 4567",
          price: "$189.99",
        },
        {
          id: 4,
          name: "Mountain View Inn",
          address: "Hilltop Avenue 12, Trondheim, NO, 7890",
          price: "$155.75",
        },
      ].map((hotel) => (
        <div key={hotel.id} className="section3-list flex-mine">
          <div className="section3-list-details">
            <h3>{hotel.name}</h3>
            <p className="mt-10">
              <i
                className="fa-solid fa-location-dot fa-sm"
                style={{ color: "var(--primary)" }}
              ></i>
              {hotel.address}
            </p>
          </div>
          <div className="section3-list-price">
            <p>Staring From</p>
            <h2>{hotel.price}</h2>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HotelDeals;
