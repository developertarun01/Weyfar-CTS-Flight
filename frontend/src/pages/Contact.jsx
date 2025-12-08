import { useState, useEffect } from "react";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage("");

    try {
      const API_BASE_URL =
        import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL;

      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (data.success) {
        setStatusMessage("Message sent successfully!");
        // Reset form
        setForm({
          name: "",
          mobile: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        setStatusMessage(data.message || "Failed to send message.");
      }
    } catch (error) {
      console.error("Error:", error);
      setStatusMessage("Network error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="callBanner container mx-auto px-4 py-8">
        <div className="text-center text-3xl font-bold text-teal-800 py-5">
          Contact Us
        </div>
        <div className="flex flex-col gap-5 sm:flex-row justify-between">
          <div className="flex-1 mt-4 shadow-xl p-5 rounded-md">
            <h3 className="text-xl font-bold text-teal-800">
              Get in Touch With Us
            </h3>
            <p className="mt-4">
              At Weyfar, we're dedicated to delivering exceptional travel
              experiences and personalized customer care. Whether you're
              organizing your next getaway, need help with a current
              reservation, or want details about our flight, hotel, car, or
              cruise services, our friendly team is always ready to assist.
            </p>
            <p className="mt-4">
              Our customer care professionals are available 24/7 to support you
              through every stage of your trip. From flight bookings and hotel
              stays to car rentals, cruise packages, or itinerary adjustments,
              Weyfar ensures your travel plans are handled smoothly and
              efficiently.
            </p>
            <p className="mt-4">
              With extensive experience in the global travel industry, our
              experts specialize in finding unbeatable deals and creating
              unforgettable journeys. We collaborate with major airlines, hotel
              chains, car rental partners, and cruise lines worldwide to bring
              you flexible options and the best prices for your travel needs.
            </p>
            <p className="mt-4">
              We understand that plans can change unexpectedly—that's why we
              provide complete support for rebookings, upgrades, and
              cancellations. Our mission is to make every aspect of your trip
              effortless, enjoyable, and stress-free.
            </p>

            <ul className="mt-4">
              <li>Phone: +1-888-808-2182</li>
              <li>Email: contact@weyfar.com</li>
              <li>Hours: 24/7 Customer Support</li>
              <li>Address: 123 Travel Plaza, Suite 456, New York, NY 10001</li>
            </ul>
          </div>
          <div className="flex-1 mt-4 shadow-xl p-5 rounded-md">
            <h3 className="text-xl font-bold text-teal-800">
              Send Us a Message
            </h3>
            <form className="space-y-6 mt-4" onSubmit={handleSubmit}>
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full h-11 px-4 rounded-md border border-gray-300 focus:ring-1 focus:ring-[var(--primary)] focus:border-transparent outline-none transition"
                  required
                />
              </div>

              <div>
                <input
                  type="tel"
                  name="mobile"
                  placeholder="Mobile Number"
                  value={form.mobile}
                  onChange={handleChange}
                  className="w-full h-11 px-4 rounded-md border border-gray-300 focus:ring-1 focus:ring-[var(--primary)] focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full h-11 px-4 rounded-md border border-gray-300 focus:ring-1 focus:ring-[var(--primary)] focus:border-transparent outline-none transition"
                  required
                />
              </div>

              <div>
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  value={form.subject}
                  onChange={handleChange}
                  className="w-full h-11 px-4 rounded-md border border-gray-300 focus:ring-1 focus:ring-[var(--primary)] focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <textarea
                  name="message"
                  rows="4"
                  placeholder="Your Message"
                  value={form.message}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-1 focus:ring-[var(--primary)] focus:border-transparent outline-none transition resize-none"
                  required
                ></textarea>
              </div>

              {statusMessage && (
                <div
                  className={`p-3 rounded-md text-center ${
                    statusMessage.includes("successfully")
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {statusMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-md bg-orange-500 text-white font-medium hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
