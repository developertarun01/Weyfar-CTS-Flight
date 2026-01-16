import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigationType,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Results from "./pages/Results";
import Booking from "./pages/Booking";
import Payment from "./pages/Payment";
import ThankYou from "./pages/ThankYou";
import Contact from "./pages/Contact";

function GtagPageView() {
  const location = useLocation();

  useEffect(() => {
    const path = window.location.pathname + window.location.search;

    if (typeof window.gtag === "function") {
      window.gtag("event", "page_view", {
        page_path: path,
      });
    } else {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "page_view",
        page_path: path,
      });
    }
  }, [location]);

  return null;
}

function NavigationHandler() {
  const [loading, setLoading] = useState(false);
  const navigationType = useNavigationType();
  const location = useLocation();

  useEffect(() => {
    if (navigationType === "PUSH") {
      setLoading(true);
      const timer = setTimeout(() => setLoading(false), 800);
      return () => clearTimeout(timer);
    }
  }, [location, navigationType]);

  return loading ? <div className="page-loading-overlay"></div> : null;
}

function App() {
  const base = import.meta.env.BASE_URL || "/australia-flights/";
  return (
    <Router basename={base}>
      <div className="App flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <main className="flex-grow">
          <GtagPageView />

          <NavigationHandler />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/results" element={<Results />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/thank-you" element={<ThankYou />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
