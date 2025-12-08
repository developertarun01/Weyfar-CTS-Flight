import React from "react";

const TopFlights = ({ props }) => {
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
  return (
    <div className="flex-mine-column">
      <div className={`section3-header ${props.classes}`}>
        Top {props.type} Flight Details
      </div>
      {[
        {
          id: 1,
          image: `${import.meta.env.BASE_URL}flights/images/nk.gif`,
          route: "LAS - LAX",
          dates: "Aug 28 - Sep 01",
          price: "$48.60",
        },
        {
          id: 2,
          image: `${import.meta.env.BASE_URL}flights/images/nk.gif`,
          route: "LAS - LAX",
          dates: "Aug 28 - Sep 01",
          price: "$48.60",
        },
        {
          id: 3,
          image: `${import.meta.env.BASE_URL}flights/images/nk.gif`,
          route: "LAS - LAX",
          dates: "Aug 28 - Sep 01",
          price: "$48.60",
        },
        {
          id: 4,
          image: `${import.meta.env.BASE_URL}flights/images/nk.gif`,
          route: "LAS - LAX",
          dates: "Aug 28 - Sep 01",
          price: "$48.60",
        },
        {
          id: 5,
          image: `${import.meta.env.BASE_URL}flights/images/nk.gif`,
          route: "LAS - LAX",
          dates: "Aug 28 - Sep 01",
          price: "$48.60",
        },
      ].map((flight) => (
        <div key={flight.id} className="section3-list flex-mine">
          <img src={flight.image} alt="" width="50px" />
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
