import React, { useState, useEffect } from "react";
import FlightForm from "../components/forms/FlightForm";
import HotelForm from "../components/forms/HotelForm";
import CarForm from "../components/forms/CarForm";
import CruiseForm from "../components/forms/CruiseForm";
import { Plane, Hotel, Car, Ship } from "lucide-react";
import PopularAirline from "../components/common/PopularAirline";
import TopFlights from "../components/common/TopFlights";
import HotelDeals from "../components/common/HotelDeals";

const Home = () => {
  const [activeTab, setActiveTab] = useState("flights");

  const tabs = [
    {
      id: "flights",
      label: "Flights",
      icon: Plane,
      bgImage: `${import.meta.env.BASE_URL}flights/images/bg-plane.jpg`,
    }
  ];

  const currentBg = tabs.find((tab) => tab.id === activeTab)?.bgImage;

  const renderForm = () => {
    switch (activeTab) {
      case "flights":
        return <FlightForm />;
      case "hotels":
        return <HotelForm />;
      case "cars":
        return <CarForm />;
      case "cruises":
        return <CruiseForm />;
      default:
        return <FlightForm />;
    }
  };

  useEffect(() => {
    if (window.innerWidth <= 655) {
      // For mobile - scroll to callBanner section
      const section1 = document.querySelector(".starting");
      if (section1) {
        const top = section1.offsetTop - 10; // 10px above section1
        window.scrollTo({ top, behavior: "smooth" });
      }
    } else {
      // For desktop - scroll to top of the page
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  const airlines = [
    { id: 1, title: "Delta Airlines", classes: "section2-card-1" },
    { id: 2, title: "United Airlines", classes: "section2-card-2" },
    { id: 3, title: "American Airlines", classes: "section2-card-3" },
    { id: 4, title: "Lufthansa Airlines", classes: "section2-card-4" },
    { id: 5, title: "Emirates Airlines", classes: "section2-card-5" },
    { id: 6, title: "Singapore Airlines", classes: "section2-card-6" },
  ];

  return (
    <>
      {/* Form Section 1 */}
      <section
        className="section1"
        style={{
          background: `linear-gradient(to bottom, transparent 75%, var(--text-light) 25%),
    url(${currentBg}) center/cover no-repeat`,
        }}
      >
        <div className="container section1-container flex-mine-column">
          <div className="section1-heading flex-mine-column">
            <h1 className="text-2xl font-semibold">Making Travel Easy</h1>
            <h3 className="text-xl font-medium mt-2 font-serif">
              Book Cheap Flights Online
            </h3>
          </div>
          <div className="w-full starting container">
            <div className="tabs w-full ">
              {/* Booking Tabs */}
              <div className="w-full">
                <div className="w-full grid justify-items-center">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center justify-center space-x-0 sm:space-x-2 px-auto py-3 border border-b-2 transition-all duration-200 ${
                          activeTab === tab.id
                            ? "bg-[var(--primary)] border-[var(--primary)] border-b-[var(--accent-dark)] text-white shadow-lg"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-b-[var(--accent-dark)]"
                        }`}
                      >
                        <Icon className="hidden sm:block h-5 w-5" />
                        <span className="font-medium">{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Booking Form */}
            <div>
              <div className="bg-slate-200 rounded-b-xl shadow-2xl p-4 md:p-4 mb-6">
                {/* Temporary test component - remove after testing */}
                {renderForm()}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="all-reviews">
        <div className="reviews">
          <div className="review-card">
            <div className="review-title">Google</div>
            <div className="flex-mine stars">
              <i
                className="fa-solid fa-star fa-lg"
                style={{ color: "orange" }}
              ></i>
              <i
                className="fa-solid fa-star fa-lg"
                style={{ color: "orange" }}
              ></i>
              <i
                className="fa-solid fa-star fa-lg"
                style={{ color: "orange" }}
              ></i>
              <i
                className="fa-solid fa-star fa-lg"
                style={{ color: "orange" }}
              ></i>
              <i
                className="fa-regular fa-star fa-lg"
                style={{ color: "orange" }}
              ></i>
            </div>
            <div className="review-rating" style={{ color: "orange" }}>
              Score 4.1/5
            </div>
            <div className="review-count">1,605 Reviews</div>
          </div>
          <div className="review-card">
            <div className="review-title">Reviews.io</div>
            <div className="flex-mine stars">
              <i
                className="fa-solid fa-star  fa-lg"
                style={{ color: "black" }}
              ></i>
              <i
                className="fa-solid fa-star  fa-lg"
                style={{ color: "black" }}
              ></i>
              <i
                className="fa-solid fa-star  fa-lg"
                style={{ color: "black" }}
              ></i>
              <i
                className="fa-solid fa-star  fa-lg"
                style={{ color: "black" }}
              ></i>
              <i
                className="fa-solid fa-star-half-stroke -fade fa-lg"
                style={{ color: "black" }}
              ></i>
            </div>
            <div className="review-rating" style={{ color: "black" }}>
              Reviews 4.7/5
            </div>
            <div className="review-count">4,585 Reviews</div>
          </div>
          <div className="review-card">
            <div className="review-title">Trustpilot</div>
            <div className="flex-mine stars">
              <i
                className="fa-solid fa-star  fa-lg"
                style={{ color: "green" }}
              ></i>
              <i
                className="fa-solid fa-star  fa-lg"
                style={{ color: "green" }}
              ></i>
              <i
                className="fa-solid fa-star  fa-lg"
                style={{ color: "green" }}
              ></i>
              <i
                className="fa-solid fa-star  fa-lg"
                style={{ color: "green" }}
              ></i>
              <i
                className="fa-solid fa-star-half-stroke -fade fa-lg"
                style={{ color: "green" }}
              ></i>
            </div>
            <div className="review-rating" style={{ color: "green" }}>
              Trustscore 4.3/5
            </div>
            <div className="review-count">9,431 reviews</div>
          </div>
          <div className="review-card">
            <div className="review-title">Sitejobber</div>
            <div className="flex-mine stars">
              <i
                className="fa-solid fa-star  fa-lg"
                style={{ color: "orangered" }}
              ></i>
              <i
                className="fa-solid fa-star  fa-lg"
                style={{ color: "orangered" }}
              ></i>
              <i
                className="fa-solid fa-star  fa-lg"
                style={{ color: "orangered" }}
              ></i>
              <i
                className="fa-solid fa-star  fa-lg"
                style={{ color: "orangered" }}
              ></i>
              <i
                className="fa-solid fa-star-half-stroke -fade fa-lg"
                style={{ color: "orangered" }}
              ></i>
            </div>
            <div className="review-rating" style={{ color: "orangered" }}>
              Feedback 4.5/5
            </div>
            <div className="review-count">22,801 Reviews</div>
          </div>
        </div>
        <div className="good-cards-outer container mt-5">
          <div className="good-cards row flex-mine">
            <div className="good-card-1 col flex-mine-column px-5 text-center ">
              <img
                src={`${import.meta.env.BASE_URL}flights/images/flexpay-logo.webp`}
                alt=""
                width="150px"
                height="50px"
              />
              <h3 className="mt-10">Buy now, pay over time</h3>
              <p className="mt-10">Make monthly payments with no hidden fees</p>
            </div>
            <div className="good-card-2 col flex-mine-column px-5  text-center">
              <img
  src={`${import.meta.env.BASE_URL}flights/images/customer-icon.webp`}
  alt=""
  width="50"
  height="50"
/>
              <h3 className="mt-10">Customer Support</h3>
              <p className="mt-10">
                Happy to help our customers with queries round the clock
              </p>
            </div>
            <div className="good-card-3 col flex-mine-column px-5 text-center">
              <img
                src={`${import.meta.env.BASE_URL}flights/images/happy-cutomer.svg`}
                alt=""
                width="50px"
                height="50px"
              />
              <h3 className="mt-10">2 Million+ Happy Travelers</h3>
              <p className="mt-10">
                Check out Reviews of our 2 Million+ Happy Travellers
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2 */}
      <section className="section2">
        <div className="container section2-inner">
          <h2 className="text-2xl font-semibold">
            Most Popular Airlines Deals
          </h2>
          <div className="grid-mine sm:grid sm:grid-cols-3 sm:grid-rows-2 sm:gap-10 mt-20">
            {airlines.map((airline) => (
              <PopularAirline key={airline.id} props={airline} />
            ))}
          </div>
        </div>
      </section>

      {/* Section 3 */}
      <section className="section3">
        <div className="section3-inner container">
          <TopFlights
            key="national"
            props={{ type: "National", classes: "section3-header-1" }}
          />
          <TopFlights
            key="international"
            props={{ type: "International", classes: "section3-header-2" }}
          />
        </div>
      </section>

      {/* Section 4 */}
      <section className="section4">
        <div className="container section4-inner">
          <p>
            <span>*Note: All fares are quoted in USD.</span>
          </p>
          <p>
            Last updated on <span>Monday 08/25/2025 at 05:00 AM,</span> the
            fares mentioned above are for flight tickets and inclusive of fuel
            surcharges, service fee and taxes . Based on historical data, these
            fares are subject to change without prior notice and cannot be
            guaranteed at the time of booking. Kindly go through our terms and
            conditions before booking.
          </p>

          <div className="section4-banner">
            <div className="flex-mine section4-banner-img">
              <img src={`${import.meta.env.BASE_URL}flights/images/airplane.png`} alt="" width="220px" />
            </div>
            <div className="section4-banner-text">
              <h1>Heavily Discounted Fares!!</h1>
              <p>Speak to our agents for exclusive deals</p>
              <div className="call-now">Call Now</div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5 */}
      <section className="section5">
        <div className="container section5-inner">
          <div className="section5-card">
            <h2 className="text-xl font-semibold">Last Minute Deals</h2>
            <div className="section5-card-image card-image-1"></div>
            <div className="view-more">
              <a href="">+ View More</a>
            </div>
          </div>
          <div className="section5-card">
            <h2 className="text-xl font-semibold">Deal Under $199</h2>
            <div className="section5-card-image card-image-2"></div>
            <div className="view-more">
              <a href="">+ View More</a>
            </div>
          </div>
          <div className="section5-card">
            <h2 className="text-xl font-semibold">Student Travel Deals</h2>
            <div className="section5-card-image card-image-3"></div>
            <div className="view-more">
              <a href="">+ View More</a>
            </div>
          </div>
          <div className="section5-card">
            <h2 className="text-xl font-semibold">Top Airline Deals</h2>
            <div className="section5-card-image card-image-4"></div>
            <div className="view-more">
              <a href="">+ View More</a>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6 */}
      <section className="section3 container">
        <h2 className="mb-15 text-2xl font-semibold">
          Deals from Top Rated Hotels
        </h2>
        <div className="section3-inner">
          <HotelDeals
            key="domestic"
            props={{ title: "Domestic", classes: "section3-header-3" }}
          />
          <HotelDeals
            key="International"
            props={{ title: "International", classes: "section3-header-4" }}
          />
        </div>
      </section>

      {/* Section 7 */}
      <section className="section7">
        <div className="container section7-inner flex-mine-column">
          <h1>Customers Review</h1>
          <div className="flex-mine section7-favicon ">
            <img
              src={`${import.meta.env.BASE_URL}flights/images/tp-logo.webp`}
              alt=""
              width="150px"
              height="30px"
            />
            <img
              src={`${import.meta.env.BASE_URL}flights/images/stars-4.5.svg`}
              alt=""
              width="150px"
              height="30px"
            />
          </div>
        </div>
      </section>

      {/* Section 8 */}
      <section className="section8">
        <div className="section8-inner container">
          <div>
            <p>
              <strong>Find Cheap Flights & Travel Deals at Document</strong>
            </p>
            <p>
              Looking for the cheapest flights to your dream destination? You've
              come to the right place! At Document, we specialize in finding you
              the best travel deals on airline tickets to destinations across
              the globe. Whether planning a quick weekend getaway, a
              long-awaited vacation, or a business trip, we help you book
              affordable flights hassle-free. Our cutting-edge technology
              ensures a fast, safe, and seamless flight booking experience,
              allowing you to find the best airfares with just a few clicks.
            </p>
            <p>
              We take pride in offering world-class customer service and
              providing assistance at every step of your booking journey.
              Whether you need help finding the right flight, understanding
              airline policies, or managing changes to your itinerary, our
              dedicated support team is available 24/7 to help.
            </p>
            <p>
              At Document, we curate the cheapest flight options by partnering
              with top airlines and travel providers, ensuring that you get
              access to exclusive discounts and unbeatable fares. With our
              extensive network of travel partners, we bring you the most
              affordable and convenient flight deals so you can travel more and
              spend less.
            </p>
            <p>
              <strong>When to Buy Airline Tickets</strong>
            </p>
            <p>
              Timing is key when booking flights. Based on recent travel trends,
              the best time to book domestic flights is 28 days before
              departure, while international airfare is typically cheaper when
              purchased 60 to 120 days in advance. Additionally, Sundays are
              often the most budget-friendly day to book tickets, making it
              easier to find cheap flights and secure the lowest fares.
            </p>
            <p>
              <strong>How to Find the Best Flight Deals</strong>
            </p>
            <p>
              Scoring the best airfare isn't just about booking in advance—it's
              also about knowing where to look and what to consider. Here are
              some expert tips:
            </p>
            <ul>
              <li>
                <strong>Compare Multiple Airlines</strong> - Different airlines
                offer varying ticket prices, amenities, and baggage policies. We
                make it easy to compare them all in one place.
              </li>
            </ul>
          </div>
          <div>
            <ul>
              <li>
                <strong>Be flex-mineible with Dates</strong> - Midweek flights
                (Tuesdays and Wednesdays) are more affordable than weekend
                travel.
              </li>
              <li>
                <strong>Consider Alternate Airports</strong> - Flying out of or
                into nearby airports could save you big.
              </li>
              <li>
                <strong>Use Travel Deals & Discounts</strong> - Stay updated
                with our latest promotions and exclusive airline deals to
                maximize savings.
              </li>
            </ul>
            <p>
              <strong>Top Destinations to Explore</strong>
            </p>
            <p>
              We have flight deals that fit your budget no matter where you're
              headed. Popular destinations among travelers include New York
              City, where you can experience the energy of the Big Apple; Las
              Vegas, the world's entertainment capital; and Orlando, a perfect
              destination for theme park lovers and family vacations. Los
              Angeles offers sun-soaked beaches and Hollywood glamour, while
              Cancun invites travelers to relax on pristine beaches with
              stunning ocean views. London is a must-visit for those looking to
              explore internationally for history, culture, and vibrant city
              life.
            </p>
            <p>
              <strong>Understanding Flight Cancellations & Refunds</strong>
            </p>
            <p>
              Plans change, and sometimes, you may need to cancel your flight.
              Many airlines allow cancellations or modifications depending on
              the fare type and airline policy. Before booking, always check the
              cancellation policy to know your options. Some flights may be
              eligible for refunds, while others may offer travel credits for
              future bookings.
            </p>
            <p>
              <strong>Why Book with Document?</strong>
            </p>
            <p>
              At Document, we take the stress out of booking flights by
              offering:
            </p>

            <ul>
              <li>A vast selection of airlines with competitive fares.</li>
              <li>
                24/7 customer support to assist with all your travel needs.
              </li>
              <li>
                flex-mineible search filters to help you find flights that fit
                your schedule and budget.
              </li>
              <li>
                Exclusive discounts and last-minute deals to make travel more
                affordable.
              </li>
            </ul>
            <p>
              Don't overpay for airline tickets-find your cheap flight today
              with Document and start your journey for less!
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
