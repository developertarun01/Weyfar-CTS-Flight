import React, { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Download,
  Home,
  CreditCard,
  Calendar,
  MapPin,
  Users,
  Shield,
  Camera,
  FileText,
} from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const ThankYou = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { booking, payment } = location.state || {};
  const receiptRef = useRef();
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailProgress, setEmailProgress] = useState({
    customer: false,
    support: false,
    accounts: false,
  });

  if (!booking || !payment) {
    navigate("/");
    return null;
  }

  // Automatically send emails when component mounts
  useEffect(() => {
    if (booking && payment && !emailSent) {
      handleSendEmailAutomatically();
    }
  }, [booking, payment]);

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

  const handleDownloadPDF = async () => {
    if (receiptRef.current) {
      try {
        const pdf = await generatePDF();
        pdf.save(`receipt-${booking._id}.pdf`);
      } catch (error) {
        console.error("Error generating PDF:", error);
        alert("Error generating PDF. Please try again.");
      }
    }
  };

  const handleDownloadScreenshot = async () => {
    if (receiptRef.current) {
      try {
        const canvas = await html2canvas(receiptRef.current, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
        });

        const image = canvas.toDataURL("image/png", 1.0);
        downloadImage(image, `receipt-${booking._id}.png`);
      } catch (error) {
        console.error("Error generating screenshot:", error);
        alert("Error generating screenshot. Please try again.");
      }
    }
  };

  const generatePDF = async () => {
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 10; // mm margin
      const contentWidth = pageWidth - margin * 2;

      // Create a temporary container
      const tempContainer = document.createElement("div");
      tempContainer.style.position = "fixed";
      tempContainer.style.left = "-9999px";
      tempContainer.style.top = "0";
      tempContainer.style.width = `${contentWidth}mm`;
      tempContainer.style.maxWidth = "none";
      // tempContainer.style.backgroundColor = "orange";

      // Clone and prepare content
      const receiptContent = receiptRef.current.cloneNode(true);
      receiptContent.style.width = "100%";
      receiptContent.style.maxWidth = "none";
      // receiptContent.style.backgroundColor = "pink";
      receiptContent.style.margin = "0";
      receiptContent.style.padding = "20px";
      receiptContent.style.boxSizing = "border-box";

      tempContainer.appendChild(receiptContent);
      document.body.appendChild(tempContainer);

      // Split content into pages
      let currentPosition = 0;
      let pageNumber = 1;

      while (currentPosition < tempContainer.scrollHeight) {
        if (pageNumber > 1) {
          pdf.addPage();
        }

        // Create a viewport for the current page
        const pageContainer = document.createElement("div");
        pageContainer.style.width = `${contentWidth}mm`;
        pageContainer.style.height = `${pageHeight - margin * 2}mm`;
        pageContainer.style.overflow = "hidden";
        pageContainer.style.position = "relative";
        // pageContainer.style.backgroundColor = "red";

        // Clone the content for this page
        const pageContent = receiptContent.cloneNode(true);
        pageContent.style.marginTop = `-${currentPosition}px`;
        pageContent.style.position = "absolute";
        pageContent.style.top = "0";
        pageContent.style.left = "0";
        // pageContainer.style.backgroundColor = "blue";

        pageContainer.appendChild(pageContent);

        // Create a temporary container for this page
        const tempPageContainer = document.createElement("div");
        tempPageContainer.style.position = "fixed";
        tempPageContainer.style.left = "-9999px";
        tempPageContainer.style.top = "0";
        tempPageContainer.style.width = `${contentWidth}mm`;
        tempPageContainer.style.height = `${pageHeight - margin * 2}mm`;
        tempPageContainer.style.backgroundColor = "#ffffff";
        tempPageContainer.appendChild(pageContainer);

        document.body.appendChild(tempPageContainer);

        // Generate canvas for this page
        const canvas = await html2canvas(tempPageContainer, {
          scale: 2,
          useCORS: true,
          allowTaint: false,
          backgroundColor: "#ffffff",
          logging: false,
          width: contentWidth * 3.78, // Convert mm to pixels (96 DPI)
          height: (pageHeight - margin * 2) * 3.78,
          windowWidth: contentWidth * 3.78,
          windowHeight: (pageHeight - margin * 2) * 3.78,
        });

        // Add to PDF
        pdf.addImage(
          canvas.toDataURL("image/jpeg", 1.0),
          "JPEG",
          margin,
          margin,
          contentWidth,
          pageHeight - margin * 2
        );

        // Clean up
        document.body.removeChild(tempPageContainer);

        // Move to next page position
        currentPosition += (pageHeight - margin * 2) * 3.78; // Convert mm to pixels
        pageNumber++;

        // Safety break to prevent infinite loops
        if (pageNumber > 20) break;
      }

      // Clean up main container
      document.body.removeChild(tempContainer);

      return pdf;
    } catch (error) {
      console.error("Error generating PDF:", error);
      throw error;
    }
  };

  const downloadImage = (dataUrl, filename) => {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleSendEmailAutomatically = async () => {
    setIsSendingEmail(true);
    // console.log("Starting automatic email sending process...");

    try {
      // Generate PDF
      const pdf = await generatePDF();
      const pdfBlob = pdf.output("blob");
      const pdfBase64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(pdfBlob);
      });

      const emailRecipients = [
        {
          to: booking.contactInfo.email,
          type: "customer",
          subject: `Your Booking Confirmation - ${booking._id}`,
        },
        {
          to: "td739687@gmail.com",
          type: "agent",
          subject: `New Booking - ${booking._id} - Support Copy`,
        },
      ];

      // FIXED: Safe environment variable access
      const API_BASE_URL =
        (typeof process !== "undefined" && process.env.REACT_APP_API_URL) ||
        "https://complete-travel-solution-api.vercel.app";

      // console.log("Using API Base URL:", API_BASE_URL);
      // console.log(
      //   "Full API endpoint:",
      //   `${API_BASE_URL}/api/send-receipt-email`
      // );

      const emailPromises = emailRecipients.map(async (recipient) => {
        try {
          setEmailProgress((prev) => ({
            ...prev,
            [recipient.type]: "sending",
          }));

          // console.log(`Sending email to: ${recipient.to}`);

          const emailData = {
            to: [recipient.to],
            subject: recipient.subject,
            booking: booking,
            payment: payment,
            attachments: [
              {
                filename: `receipt-${booking._id}.pdf`,
                content: pdfBase64.split(",")[1],
                contentType: "application/pdf",
                encoding: "base64",
              },
            ],
          };

          const response = await fetch(
            `${API_BASE_URL}/api/send-receipt-email`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(emailData),
            }
          );

          if (!response.ok) {
            const errorText = await response.text();
            console.error("Error response:", errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const result = await response.json();
          // console.log("Success response:", result);

          if (result.success) {
            // console.log(`✅ Email sent successfully to: ${recipient.to}`);
            setEmailProgress((prev) => ({
              ...prev,
              [recipient.type]: "sent",
            }));
            return { success: true };
          } else {
            console.error(
              `❌ Failed to send email to: ${recipient.to}`,
              result
            );
            setEmailProgress((prev) => ({
              ...prev,
              [recipient.type]: "failed",
            }));
            return { success: false, error: result.message };
          }
        } catch (error) {
          console.error(`❌ Error sending email to ${recipient.to}:`, error);
          setEmailProgress((prev) => ({
            ...prev,
            [recipient.type]: "failed",
          }));
          return { success: false, error: error.message };
        }
      });

      const results = await Promise.allSettled(emailPromises);
      const allEmailsSent = results.every((result) => result.value?.success);

      if (allEmailsSent) {
        setEmailSent(true);
        // console.log("✅ All emails sent successfully!");
      } else {
        const failedCount = results.filter((r) => !r.value?.success).length;
        console.warn(`${failedCount} emails failed to send`);
      }
    } catch (error) {
      console.error("Email sending error:", error);
    } finally {
      setIsSendingEmail(false);
    }
  };

  const renderBookingDisplay = () => {
    switch (booking.type) {
      case "flights":
        return (
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Flight:</span>
              <span>
                {booking.details.airline} {booking.details.flightNumber}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Route:</span>
              <span>
                {booking.details.origin} → {booking.details.destination}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Departure:</span>
              <span>
                {new Date(booking.details.departure?.time).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Arrival:</span>
              <span>
                {new Date(booking.details.arrival?.time).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Class:</span>
              <span className="capitalize">
                {booking.details.travelClass || booking.details.class}
              </span>
            </div>
          </div>
        );

      // In ThankYou.jsx - Update the renderBookingDisplay() function for hotels
      case "hotels":
        return (
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Hotel:</span>
              <span>{booking.details.hotelName || booking.details.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Location:</span>
              <span>
                {booking.details.location ||
                  booking.details.address?.city ||
                  booking.details.destination}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Check-in:</span>
              <span>
                {new Date(
                  booking.details.checkInDate ||
                    booking.details.hotelDetails?.checkInDate ||
                    formData?.checkInDate
                ).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Check-out:</span>
              <span>
                {new Date(
                  booking.details.checkOutDate ||
                    booking.details.hotelDetails?.checkOutDate ||
                    formData?.checkOutDate
                ).toLocaleDateString()}
              </span>
            </div>
            {/* ADD THESE NEW FIELDS */}

            {booking.details.rooms && (
              <div className="flex justify-between">
                <span className="text-gray-600">Rooms:</span>
                <span>{booking.details.rooms}</span>
              </div>
            )}
            {booking.details.guests && (
              <div className="flex justify-between">
                <span className="text-gray-600">Guests:</span>
                <span>{booking.details.guests}</span>
              </div>
            )}
            {booking.details.nights && (
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span>{booking.details.nights} night(s)</span>
              </div>
            )}
          </div>
        );

      case "cars":
        return (
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Car Type:</span>
              <span>
                {booking.details.carType} - {booking.details.provider}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Model:</span>
              <span>{booking.details.model}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pick-up:</span>
              <span>
                {booking.details.pickupLocation} on{" "}
                {new Date(booking.details.fromDateTime).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Drop-off:</span>
              <span>
                {booking.details.dropLocation || "Same as pick-up"} on{" "}
                {new Date(booking.details.toDateTime).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Duration:</span>
              <span>{booking.details.duration}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Driver Age:</span>
              <span>{booking.details.driverAge} years</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Transmission:</span>
              <span className="capitalize">{booking.details.transmission}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Capacity:</span>
              <span>
                {booking.details.seats} seats, {booking.details.bags} bags
              </span>
            </div>
            {booking.details.features &&
              booking.details.features.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Features:</span>
                  <span className="text-sm">
                    {booking.details.features.slice(0, 3).join(", ")}
                    {booking.details.features.length > 3 && "..."}
                  </span>
                </div>
              )}
          </div>
        );

      // In ThankYou.jsx - Update the renderBookingDisplay() function for cruises
      case "cruises": // Changed from "cruise" to "cruises"
        return (
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Cruise Line:</span>
              <span>{booking.details.cruiseLine}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Ship:</span>
              <span>{booking.details.shipName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Destination:</span>
              <span>{booking.details.destination}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Departure Port:</span>
              <span>{booking.details.origin}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Duration:</span>
              <span>{booking.details.nights} nights</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Departure Date:</span>
              <span>
                {new Date(booking.details.departureDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Passengers:</span>
              <span>
                {booking.details.passengers || 1}{" "}
                {(booking.details.passengers || 1) === 1 ? "person" : "people"}
              </span>
            </div>
            {booking.details.itinerary &&
              booking.details.itinerary.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Itinerary:</span>
                  <span className="text-sm text-right">
                    {booking.details.itinerary.join(" → ")}
                  </span>
                </div>
              )}
          </div>
        );

      default:
        return (
          <div className="text-gray-600">
            Booking details will be sent to your email.
          </div>
        );
    }
  };

  return (
    <div className="callBanner min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="bg-green-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-green-600 mb-4">
              Booking Successful!
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              Thank you for your booking. Your {booking.type} has been
              confirmed.
            </p>
            <p className="text-lg text-gray-500">
              Booking Reference:{" "}
              <span className="font-mono font-bold">{booking._id}</span>
            </p>
          </div>

          {/* Email Status */}
          {/* <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4 text-center">
              Email Status
            </h3>

            {isSendingEmail && (
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span>Customer ({booking.contactInfo.email}):</span>
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      emailProgress.customer === "sent"
                        ? "bg-green-100 text-green-800"
                        : emailProgress.customer === "failed"
                        ? "bg-red-100 text-red-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {emailProgress.customer === "sent"
                      ? "✅ Sent"
                      : emailProgress.customer === "failed"
                      ? "❌ Failed"
                      : "⏳ Sending..."}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Support Team:</span>
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      emailProgress.support === "sent"
                        ? "bg-green-100 text-green-800"
                        : emailProgress.support === "failed"
                        ? "bg-red-100 text-red-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {emailProgress.support === "sent"
                      ? "✅ Sent"
                      : emailProgress.support === "failed"
                      ? "❌ Failed"
                      : "⏳ Sending..."}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Accounts Team:</span>
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      emailProgress.accounts === "sent"
                        ? "bg-green-100 text-green-800"
                        : emailProgress.accounts === "failed"
                        ? "bg-red-100 text-red-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {emailProgress.accounts === "sent"
                      ? "✅ Sent"
                      : emailProgress.accounts === "failed"
                      ? "❌ Failed"
                      : "⏳ Sending..."}
                  </span>
                </div>
              </div>
            )}

            {emailSent && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg text-center">
                <CheckCircle className="h-5 w-5 inline mr-2" />
                All emails sent successfully! Check your inbox for the receipt.
              </div>
            )}

            <p className="text-gray-600 text-sm text-center mt-4">
              Receipt has been automatically sent to your email and our teams.
            </p>
          </div> */}

          {/* Complete Receipt Section for Screenshot/PDF */}
          <div
            ref={receiptRef}
            className="bg-white rounded-xl shadow-lg p-8 mb-8 border-2 border-green-200"
          >
            {/* Header */}
            <div className="text-center mb-8 border-b pb-6">
              <h2 className="text-3xl font-bold text-green-700 mb-2">
                Complete Travel Solution
              </h2>
              <p className="text-xl text-gray-600">Booking Confirmation</p>
              <div className="w-32 h-1 bg-green-600 mx-auto mt-4"></div>
              <div className="mt-4 flex flex-col sm:flex-row justify-center space-x-6 text-sm text-gray-600">
                <div>📞 +1 (555) 123-4567</div>
                <div>📧 support@completetravel.com</div>
              </div>
            </div>

            {/* Booking & Payment Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-green-700 border-b pb-2">
                  Booking Information
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reference:</span>
                    <span className="font-mono font-semibold">
                      {booking._id}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span>
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="capitalize">{booking.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-semibold">
                      {booking.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-green-700 border-b pb-2">
                  Payment Details
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-bold">
                      ${payment.amount} {payment.currency}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Method:</span>
                    <span>{payment.method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Card Type:</span>
                    <span>{payment.cardType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Card Number:</span>
                    <span>{payment.cardDetails.number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cardholder:</span>
                    <span>{payment.cardDetails.holderName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expiry:</span>
                    <span>{payment.cardDetails.expiry}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div className="border-t pt-6 mb-8">
              <h3 className="text-lg font-semibold mb-4 text-green-700">
                Booking Details
              </h3>
              {renderBookingDisplay()}
            </div>

            {/* Passenger Information */}
            <div className="border-t pt-6 mb-8">
              <h3 className="text-lg font-semibold mb-4 text-green-700">
                Passenger Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {booking.passengers.map((passenger, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                  >
                    <h4 className="font-semibold mb-3 text-lg border-b pb-2">
                      Passenger {index + 1}
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-medium">
                          {passenger.firstName} {passenger.lastName}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date of Birth:</span>
                        <span>{passenger.dateOfBirth}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Gender:</span>
                        <span className="capitalize">{passenger.gender}</span>
                      </div>
                      {passenger.passportNumber && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Passport:</span>
                          <span>{passenger.passportNumber}</span>
                        </div>
                      )}
                      {passenger.nationality && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Nationality:</span>
                          <span>{passenger.nationality}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="border-t pt-6 mb-6">
              <h3 className="text-lg font-semibold mb-4 text-green-700">
                Price Breakdown
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Base Price:</span>
                    <span>${booking.pricing.basePrice.toFixed(2)}</span>
                  </div>
                  {booking.pricing.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount:</span>
                      <span>-${booking.pricing.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg border-t pt-3 mt-3">
                    <span>Total Paid:</span>
                    <span>${booking.pricing.finalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t pt-6">
              <div className="bg-green-50 rounded-lg p-4 text-center border border-green-200">
                <p className="text-green-800 font-semibold mb-2">
                  Thank you for choosing Complete Travel Solution!
                </p>
                <p className="text-green-600 text-sm">
                  This document is electronically generated and valid without
                  signature.
                </p>
                <p className="text-gray-500 text-xs mt-2">
                  Generated on {new Date().toLocaleDateString()} at{" "}
                  {new Date().toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4 text-center">
              Download Options
            </h3>
            <p className="text-gray-600 mb-6 text-center">
              You can also download your receipt in these formats:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <button
                onClick={handleDownloadPDF}
                className="flex space-x-2 items-center justify-center bg-red-600 hover:bg-red-700 text-white px-6 py-4 rounded-lg transition-colors"
              >
                <FileText className="h-6 w-6" />
                <span>Download PDF</span>
              </button>

              <button
                onClick={handleDownloadScreenshot}
                className="flex space-x-2 items-center justify-center bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-lg transition-colors"
              >
                <Camera className="h-6 w-6" />
                <span>Take Screenshot</span>
              </button>
            </div>
          </div>

          {/* Support Information */}
          <div className="text-center bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Need assistance?</h3>
            <p className="text-gray-600 mb-4">
              Our customer support team is here to help you 24/7
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-6 text-gray-700">
              <span>📧 support@completetravel.com</span>
              <span>📞 +1 (555) 123-4567</span>
            </div>
            <div className="text-center mt-6">
              <button
                onClick={() => navigate("/")}
                className="flex items-center justify-center space-x-2 bg-[var(--accent-dark)] hover:bg-[var(--accent)] text-white px-6 py-3 rounded-lg transition-colors mx-auto"
              >
                <Home className="h-5 w-5" />
                <span>Return to Home</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
