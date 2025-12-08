import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      {/* Footer */}
      <footer className="footer mt-5">
        <div className="container footer-inner">
          {/* Newsletter */}
          <div className="footer-newsletter">
            <div className="flex-mine footer-newsletter-1">
              <i
                className="fa-solid fa-bell fa-shake fa-2xl"
                style={{ color: "var(--accent-dark)", marginRight: "20px" }}
              ></i>
              <div>
                <h2>Subscribe to our Newsletter</h2>
                <h3>Get latest offers from Weyfar</h3>
              </div>
            </div>

            <div className="flex-mine-column footer-newsletter-2">
              <form action="" className="flex-mine footer-newsletter-1">
                <input
                  type="email"
                  placeholder="Example@gmail.com"
                  className="rounded"
                />
                {/* <select>
                  <option value="United States">United States</option>
                  <option value="India">India</option>
                </select> */}
                <button type="submit">Submit</button>
              </form>

              <p>
                <input type="checkbox" defaultChecked /> I would like to receive
                email from weyfar.com with the latest offers and promotions. See
                our privacy policy
              </p>

              <p>
                <input type="checkbox" defaultChecked /> I have read and agree
                to the terms and conditions.
              </p>
            </div>
          </div>

          {/* Footer Links */}
          <div className="footer-links mt-40">
            <div className="footer-link">
              <p>
                <strong>BOOK</strong>
              </p>
              <p>
                <a href="">Cheap Flights</a>
              </p>
              <p>
                <a href="">Cheap Hotels</a>
              </p>
              <p>
                <a href="">Cheap Rentals</a>
              </p>
              <p>
                <a href="">Group Travel</a>
              </p>
            </div>

            <div className="footer-link">
              <p>
                <strong>ABOUT</strong>
              </p>
              <p>
                <Link to="/https://weyfar.com/our_team">Our Team</Link>
              </p>
              <p>
                <Link to="https://weyfar.com/about_us">About Us</Link>
              </p>
              <p>
                <Link to="https://weyfar.com/contact_us">Contact Us</Link>
              </p>
            </div>

            <div className="footer-link">
              <p>
                <strong>QUICK LINKS</strong>
              </p>
              <p>
                <a href="">Popular Airlines</a>
              </p>
              <p>
                <a href="">Popular Flight Routes</a>
              </p>
              <p>
                <a href="">Top U.S. Destinations</a>
              </p>
              <p>
                <a href="">Top International Destinations</a>
              </p>
              <p>
                <a href="">Top Airports</a>
              </p>
              <p>
                <a href="">Cruise</a>
              </p>
            </div>

            <div className="footer-link">
              <p>
                <strong>TRAVEL TOOLS</strong>
              </p>
              <p>
                <a href="https://weyfar.com/contact_us">Customer Support</a>
              </p>
              <p>
                <a href="">Online Check-in</a>
              </p>
              <p>
                <a href="">Airline Baggage Fees</a>
              </p>
              <p>
                <a href="">Travel Blog</a>
              </p>
              <p>
                <a href="">Customer Reviews</a>
              </p>
              <p>
                <a href="">Browser Compatibility</a>
              </p>
            </div>

            <div className="footer-link">
              <p>
                <strong>LEGAL</strong>
              </p>
              <p>
                <a href="https://weyfar.com/privacy_policy">Privacy Policy</a>
              </p>
              <p>
                <a href="https://weyfar.com/terms&conditions">
                  Terms & Conditions
                </a>
              </p>
              <p>
                <a href="">Taxes & Fees</a>
              </p>
              <p>
                <a href="">Post-Ticketing Fees</a>
              </p>
              <p>
                <a href="">Affiliate Program</a>
              </p>
              <p>
                <a href="">Your California Privacy Rights</a>
              </p>
              <p>
                <a href="">Travel Now, Pay Later</a>
              </p>
            </div>
          </div>

          {/* Social Follow */}
          <div className="footer-follow mt-40">
            <h3>Follow us on</h3>
            <div className="flex-mine footer-newsletter-1 footer-follow-icon">
              <i
                className="fa-brands fa-square-facebook fa-2xl"
                style={{ color: "var(--accent-dark)" }}
              ></i>
              <i
                className="fa-brands fa-square-x-twitter fa-2xl"
                style={{ color: "var(--accent-dark)" }}
              ></i>
              <i
                className="fa-brands fa-linkedin fa-2xl"
                style={{ color: "var(--accent-dark)" }}
              ></i>
              <i
                className="fa-brands fa-square-instagram fa-2xl"
                style={{ color: "var(--accent-dark)" }}
              ></i>
              <i
                className="fa-brands fa-square-pinterest fa-2xl"
                style={{ color: "var(--accent-dark)" }}
              ></i>
              <i
                className="fa-brands fa-youtube fa-2xl"
                style={{ color: "var(--accent-dark)" }}
              ></i>
            </div>
          </div>

          <p className="mt-40 mb-10">
            Weyfar is an independent travel portal with no third party
            association. By using weyfar.com, you agree that Weyfar is not
            accountable for any loss - direct or indirect, arising of offers,
            materials or links to other sites found on this website. In case of
            queries, reach us directly at our Contact Number +1 (888) 808-2182
            or, simply email at contact@weyfar.com
          </p>
        </div>
      </footer>

      {/* Section 9 */}
      <section className="section9">
        <div className="container section9-inner flex-mine-column">
          <div className="section9-icons">
            <div className="section9-icons-1">
              <img
                src={`${import.meta.env.BASE_URL}flights/images/IATA.webp`}
                alt="IATA"
                style={{ width: "100%", height: "40px" }}
              />
              <img
                src={`${import.meta.env.BASE_URL}flights/images/arc.png`}
                alt="ARC"
                style={{ width: "100%", height: "40px" }}
              />
              <img
                src={`${
                  import.meta.env.BASE_URL
                }flights/images/cloudflare.webp`}
                alt="Cloudflare"
                style={{ width: "100%", height: "40px" }}
              />
              <img
                src={`${import.meta.env.BASE_URL}flights/images/digicert.webp`}
                alt="Digicert"
                style={{ width: "100%", height: "40px" }}
              />
              <img
                src={`${import.meta.env.BASE_URL}flights/images/PCI.webp`}
                alt="PCI"
                style={{ width: "100%", height: "40px" }}
              />
            </div>
            <div>
              <img
                src={`${import.meta.env.BASE_URL}flights/images/payment.png`}
                alt="Payments"
                style={{ width: "100%" }}
              />
            </div>
          </div>

          <p className="mt-10">
            Copyright © 2013 - 2025 Weyfar | All Rights Reserved.
          </p>
        </div>
      </section>

      <Link to="tel:8888082182">
        <div className="sm:hidden fixed bottom-0 w-full bg-[var(--accent-dark)] text-white text-center h-14 flex justify-center items-center gap-2 text-xl">
          <span>
            <i className="fa-solid fa-phone-volume fa-shake fa-sm text-white"></i>
          </span>
          <b>Call Now</b>
        </div>
      </Link>
    </>
  );
};

export default Footer;
