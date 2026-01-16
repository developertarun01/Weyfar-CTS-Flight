import { useEffect } from "react";

const About = () => {
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

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="callBanner text-center text-3xl font-bold text-teal-800 pt-6">
          About Us
        </div>
        <div className="shadow-xl p-5 rounded-md">
          {/* <h3 className="text-xl font-bold text-teal-800">About Us</h3> */}
          <p className="mt-5">
            Weyfar.com is your all-in-one travel companion, devoted to
            simplifying every part of your journey—whether it’s flights, hotels,
            car rentals, or cruise vacations. From last-minute escapes to
            international adventures, Weyfar helps you explore the world with
            confidence, comfort, and exceptional value.
          </p>
          <p>
            We know that planning a trip can sometimes feel
            overwhelming—especially when juggling different bookings or changing
            itineraries. That’s why Weyfar isn’t just another booking portal.
            It’s a comprehensive travel platform powered by real experts,
            available 24/7 to help you discover the best flight fares, top-rated
            hotels, reliable car rentals, and unforgettable cruise
            experiences—all in one seamless place.
          </p>
        </div>
        <div className="mt-4 shadow-xl p-5 rounded-md">
          <h3 className="text-xl font-bold text-teal-800">What We Do</h3>
          <ul className="list-disc pl-5 mt-5">
            <li>
              <b> Flight Reservations</b> — Book domestic and international
              flights with leading airlines.
            </li>
            <li>
              <b> Hotel Bookings</b> — Find stays that match your style and
              budget, from luxury resorts to city inns.
            </li>
            <li>
              <b> Car Rentals</b> — Reserve trusted vehicles for local travel,
              road trips, or airport pickups.
            </li>
            <li>
              <b> Cruise Packages</b> — Explore breathtaking destinations with
              exclusive cruise deals.
            </li>
            <li>
              <b> Changes & Cancellations </b>— Manage bookings effortlessly,
              including reschedules and refunds.
            </li>
            <li>
              <b> Unpublished Call-Only Offers</b>— Access limited-time deals
              not available on public listings.
            </li>
            <li>
              <b> All-Inclusive Travel Bundles</b> — Get custom packages with
              flights, hotels, cars, and cruises combined.
            </li>
            <li>
              <b> 24/7 Expert Assistance</b> — Speak directly with our
              experienced agents anytime.
            </li>
          </ul>
        </div>
        <div className="mt-4 shadow-xl p-5 rounded-md">
          <h3 className="text-xl font-bold text-teal-800">Why Choose Us?</h3>
          <ul className="list-disc pl-5 mt-5">
            <li>
              <b>24/7 Live Support: </b>We’re here around the clock because
              travel plans can change anytime.
            </li>
            <li>
              <b>Transparent Pricing:</b> What you see is what you pay—no hidden
              charges.
            </li>
            <li>
              <b>Human-Powered Help:</b> Real travel experts guide you every
              step of the way.
            </li>
            <li>
              <b>Flexibility & Ease:</b> Simple modifications, refunds, or
              upgrades whenever needed.
            </li>
            <li>
              <b>Trusted by Travelers:</b> Thousands of satisfied explorers rely
              on us every month.
            </li>
          </ul>
        </div>
        <div className="mt-4 shadow-xl p-5 rounded-md">
          <h3 className="text-xl font-bold text-teal-800">Our Mission</h3>
          <p className="mt-5">
            At Weyfar, our mission is to make travel—by air, land, or
            sea—accessible, transparent, and worry-free. We blend smart
            technology with human care to create a seamless travel experience
            that’s efficient, flexible, and tailored to your needs.
          </p>
        </div>
        <div className="mt-4 shadow-xl p-5 rounded-md">
          <h3 className="text-xl font-bold text-teal-800">Contact Us</h3>
          <p className="mt-5">
            Have a question? Need help planning your trip? Or looking for an
            unbeatable deal? Call our travel specialists anytime at (888)
            808-2182 or email us at support@weyfar.com .
          </p>
          <h3 className="text-xl font-bold text-teal-800 mt-5">
            Weyfar.com – Fly, Stay, Drive & Sail Smarter. Travel Easier.
          </h3>
        </div>
      </div>
    </>
  );
};

export default About;
