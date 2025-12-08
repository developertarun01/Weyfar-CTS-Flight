import { Link } from "react-router-dom";

const CallBanner = () => {
  return (
    <div className="bg-[var(--primary)] bg-[url('/flights/images/travel.png')] bg-repeat bg-top bg-[length:110px_110px] bg-blend-screen flex flex-col sm:grid sm:grid-rows-1 sm:grid-cols-2 px-0 sm:px-16 py-0 sm:py-5 rounded-xl callBanner">
      <div className="flex justify-center items-center my-2 sm:my-0">
        <img src={`${import.meta.env.BASE_URL}flights/images/airplane.png`} alt="airplane image" width="250px" />
      </div>
      <div className="px-4 sm:px-0 mb-5 sm:mb-0">
        <h2 className="text-white text-2xl font-semibold">
          Enjoy Hastle Free Booking - Call Us Now
        </h2>
        <p className="text-white text-xs mt-1">
          Our Customer Support Team is available 24/7 to help you book your
          dream package
        </p>
        <Link to="tel:8888082182" >
          <div className="bg-[var(--accent-dark)] p-3 text-center rounded-lg mt-3">
            <i className="fa-lg fa-solid fa-headset fa-beat text-[var(--primary)] mr-2 "></i>
            <span className="text-white font-medium"> Make a Call</span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default CallBanner;
