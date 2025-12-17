const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Simple transporter for local testing
const createTransporter = () => {
  return nodemailer.createTransport({
    host: "smtp.hostinger.com",
    port: 465,            // or 587
    secure: true,         // true for 465, false for 587
    auth: {
      user: process.env.EMAIL_USER,      // full email address
      pass: process.env.EMAIL_PASSWORD   // email password or SMTP password
    }
  });
};


const transporter = createTransporter();

// Contact form endpoint
router.post('/contact', async (req, res) => {
  try {
    const { name, mobile, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required fields',
      });
    }

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'tarunbusinessmail@gmail.com', // Your company email
      subject: subject || `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0d9488;">New Contact Form Submission</h2>
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Mobile:</strong> ${mobile || 'Not provided'}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject || 'No subject'}</p>
            <p><strong>Message:</strong></p>
            <div style="background-color: white; padding: 15px; border-radius: 5px; margin-top: 10px;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
          <p style="color: #64748b; font-size: 12px; margin-top: 20px;">
            This email was sent from your website contact form.
          </p>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: 'Message sent successfully!',
    });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again later.',
    });
  }
});

// Helper function to render booking details based on type
const renderBookingDetails = (booking) => {
  switch (booking.type) {
    case "flights":
      return `
        <div style="margin-bottom: 15px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span style="color: #6b7280;">Flight:</span>
            <span>${booking.details.airline} ${booking.details.flightNumber}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span style="color: #6b7280;">Route:</span>
            <span>${booking.details.origin} → ${booking.details.destination}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span style="color: #6b7280;">Departure:</span>
            <span>${new Date(booking.details.departure?.time).toLocaleString()}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span style="color: #6b7280;">Arrival:</span>
            <span>${new Date(booking.details.arrival?.time).toLocaleString()}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #6b7280;">Class:</span>
            <span style="text-transform: capitalize;">${booking.details.travelClass || booking.details.class}</span>
          </div>
        </div>
      `;

    // In Email.js - Update the hotel case in renderBookingDetails()
    case "hotels":
      return `
    <div style="margin-bottom: 15px;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
        <span style="color: #6b7280;">Hotel:</span>
        <span>${booking.details.hotelName || booking.details.name}</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
        <span style="color: #6b7280;">Location:</span>
        <span>${booking.details.location || booking.details.address?.city || booking.details.destination}</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
        <span style="color: #6b7280;">Check-in:</span>
        <span>${new Date(booking.details.checkInDate || booking.details.hotelDetails?.checkInDate).toLocaleDateString()}</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
        <span style="color: #6b7280;">Check-out:</span>
        <span>${new Date(booking.details.checkOutDate || booking.details.hotelDetails?.checkOutDate).toLocaleDateString()}</span>
      </div>
      ${booking.details.rooms ? `
        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
          <span style="color: #6b7280;">Rooms:</span>
          <span>${booking.details.rooms}</span>
        </div>
      ` : ''}
      ${booking.details.guests ? `
        <div style="display: flex; justify-content: space-between;">
          <span style="color: #6b7280;">Guests:</span>
          <span>${booking.details.guests}</span>
        </div>
      ` : ''}
      ${booking.details.nights ? `
        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
          <span style="color: #6b7280;">Duration:</span>
          <span>${booking.details.nights} night(s)</span>
        </div>
      ` : ''}
    </div>
  `;

    case "cars":
      return `
    <div style="margin-bottom: 15px;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
        <span style="color: #6b7280;">Car Type:</span>
        <span>${booking.details.carType} - ${booking.details.provider}</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
        <span style="color: #6b7280;">Model:</span>
        <span>${booking.details.model}</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
        <span style="color: #6b7280;">Pick-up:</span>
        <span>${booking.details.pickupLocation} on ${new Date(booking.details.fromDateTime).toLocaleDateString()}</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
        <span style="color: #6b7280;">Drop-off:</span>
        <span>${booking.details.dropLocation || "Same as pick-up"} on ${new Date(booking.details.toDateTime).toLocaleDateString()}</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
        <span style="color: #6b7280;">Duration:</span>
        <span>${booking.details.duration}</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
        <span style="color: #6b7280;">Driver Age:</span>
        <span>${booking.details.driverAge} years</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
        <span style="color: #6b7280;">Transmission:</span>
        <span style="text-transform: capitalize;">${booking.details.transmission}</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
        <span style="color: #6b7280;">Capacity:</span>
        <span>${booking.details.seats} seats, ${booking.details.bags} bags</span>
      </div>
      ${booking.details.features && booking.details.features.length > 0 ? `
        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
          <span style="color: #6b7280;">Features:</span>
          <span style="font-size: 13px;">
            ${booking.details.features.slice(0, 3).join(", ")}
            ${booking.details.features.length > 3 ? "..." : ""}
          </span>
        </div>
      ` : ''}
    </div>
  `;

    // In email.js - Update the cruise case in renderBookingDetails()
    case "cruises":  // Changed from "cruise" to "cruises"
      return `
    <div style="margin-bottom: 15px;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
        <span style="color: #6b7280;">Cruise Line:</span>
        <span>${booking.details.cruiseLine}</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
        <span style="color: #6b7280;">Ship:</span>
        <span>${booking.details.shipName}</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
        <span style="color: #6b7280;">Destination:</span>
        <span>${booking.details.destination}</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
        <span style="color: #6b7280;">Departure Port:</span>
        <span>${booking.details.origin}</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
        <span style="color: #6b7280;">Duration:</span>
        <span>${booking.details.nights} nights</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
        <span style="color: #6b7280;">Departure Date:</span>
        <span>${new Date(booking.details.departureDate).toLocaleDateString()}</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
        <span style="color: #6b7280;">Passengers:</span>
        <span>
          ${booking.details.passengers || 1} 
          ${(booking.details.passengers || 1) === 1 ? "person" : "people"}
        </span>
      </div>
      ${booking.details.itinerary && booking.details.itinerary.length > 0 ? `
        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
          <span style="color: #6b7280;">Itinerary:</span>
          <span style="font-size: 13px;">
            ${booking.details.itinerary.join(" → ")}
          </span>
        </div>
      ` : ''}
    </div>
  `;

    default:
      return `
        <div style="margin-bottom: 15px;">
          <div style="color: #6b7280;">
            Booking details will be sent to your email.
          </div>
        </div>
      `;
  }
};

// In your email.js - optimize attachment processing
const processAttachments = (attachments) => {
  if (!attachments || !Array.isArray(attachments)) {
    return [];
  }

  return attachments.map(attachment => {
    if (attachment.content && attachment.filename) {
      return {
        filename: attachment.filename,
        content: attachment.content,
        encoding: 'base64', // Already base64 from frontend
        contentType: attachment.contentType || 'application/pdf'
      };
    }
    return null;
  }).filter(Boolean); // Remove null entries
};

// Add a test route
router.get('/send-receipt-email', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Email API is working! Use POST to send emails.'
  });
});

router.post('/send-receipt-email', async (req, res) => {
  try {
    console.log('Received email request:', {
      to: req.body.to,
      subject: req.body.subject,
      hasAttachments: !!req.body.attachments
    });

    const { to, subject, booking, payment, attachments } = req.body;

    // Validate required fields
    if (!to || !subject || !booking || !payment) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }



    // Verify connection configuration
    console.log('Testing email configuration...');
    await transporter.verify();
    console.log('Email server connection verified');

    // Process attachments
    const emailAttachments = processAttachments(attachments);
    console.log(`Processed ${emailAttachments.length} attachments`);

    // Enhanced email content with all booking information
    const emailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Details</title>
        <style>
          @media only screen and (max-width: 600px) {
            .container {
              width: 100% !important;
              padding: 10px !important;
            }
            .section {
              padding: 15px !important;
            }
            .grid-2 {
              grid-template-columns: 1fr !important;
            }
          }
        </style>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc;">
        <div class="container" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #059669, #10b981); color: white; padding: 30px 20px; text-align: center;">
            <h1 style="margin: 0 0 10px 0; font-size: 28px; font-weight: bold;">Weyfar Travel Solution</h1>
            <p style="margin: 0; font-size: 18px; opacity: 0.9;">Booking Details</p>
            <p style="margin: 0; font-size: 15px; opacity: 0.9;">Reach us out for any flight related concerns</p>

<div style="margin-top:16px; display:flex; justify-content: center; gap:20px; font-size:15px;">
  
  <a href="tel:8888082182" style="display:inline-flex; text-decoration:none; color:inherit;">
    <div>📞 +1 (888) 808-2182</div>
  </a>

  <a href="mailto:bookingdesk@weyfar.com" style="display:inline-flex; text-decoration:none; color:inherit;">
    <div>📧 bookingdesk@weyfar.com</div>
  </a>

</div>

            <div style="width: 80px; height: 3px; background: white; margin: 20px auto 0 auto; opacity: 0.7;"></div>
          </div>

          <!-- Main Content -->
          <div style="padding: 30px;">
            <!-- Greeting -->
            <p style="margin-bottom: 25px; font-size: 16px; color: #4b5563;">
              Thank you for your booking with Weyfar Travel Solution. Your ${booking.type} booking is in <b>process</b>.
            </p>

            <!-- Booking & Payment Info Grid -->
            <div class="grid-2" style="display: grid; grid-template-columns: 1fr 1fr; gap: 25px; margin-bottom: 30px;">
              <!-- Booking Information -->
              <div class="section" style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; background-color: #f9fafb;">
                <h3 style="color: #059669; margin-top: 0; margin-bottom: 15px; font-size: 18px; font-weight: bold; border-bottom: 2px solid #059669; padding-bottom: 8px;">
                  Booking Information
                </h3>
                <div style="space-y-2;">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="color: #6b7280; font-size: 14px;">Reference:</span>
                    <span style="font-family: monospace; font-weight: bold; font-size: 14px;">${booking._id}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="color: #6b7280; font-size: 14px;">Date:</span>
                    <span style="font-size: 14px;">${new Date(booking.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="color: #6b7280; font-size: 14px;">Type:</span>
                    <span style="font-size: 14px; text-transform: capitalize;">${booking.type}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between;">
                    <span style="color: #6b7280; font-size: 14px;">Status:</span>
                    <span style="background: #fefcbf; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; text-transform: uppercase;">
                      PENDING
                    </span>
                  </div>
                </div>
              </div>

              <!-- Payment Details -->
              <div class="section" style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; background-color: #f9fafb;">
                <h3 style="color: #059669; margin-top: 0; margin-bottom: 15px; font-size: 18px; font-weight: bold; border-bottom: 2px solid #059669; padding-bottom: 8px;">
                  Payment Details
                </h3>
                <div style="space-y-2;">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="color: #6b7280; font-size: 14px;">Amount:</span>
                    <span style="font-weight: bold; font-size: 14px;">$${payment.amount} ${payment.currency}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="color: #6b7280; font-size: 14px;">Method:</span>
                    <span style="font-size: 14px;">${payment.method}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="color: #6b7280; font-size: 14px;">Card Type:</span>
                    <span style="font-size: 14px;">${payment.cardType}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="color: #6b7280; font-size: 14px;">Card Number:</span>
                    <span style="font-size: 14px;">${payment.cardDetails.number}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between;">
                    <span style="color: #6b7280; font-size: 14px;">Cardholder:</span>
                    <span style="font-size: 14px;">${payment.cardDetails.holderName}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Booking Details -->
            <div class="section" style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 25px; background-color: #f9fafb;">
              <h3 style="color: #059669; margin-top: 0; margin-bottom: 15px; font-size: 18px; font-weight: bold; border-bottom: 2px solid #059669; padding-bottom: 8px;">
                Booking Details
              </h3>
              ${renderBookingDetails(booking)}
            </div>

            <!-- Passenger Information -->
            <div class="section" style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 25px; background-color: #f9fafb;">
              <h3 style="color: #059669; margin-top: 0; margin-bottom: 15px; font-size: 18px; font-weight: bold; border-bottom: 2px solid #059669; padding-bottom: 8px;">
                Passenger Information
              </h3>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                ${booking.passengers.map((passenger, index) => `
                  <div style="border: 1px solid #e5e7eb; border-radius: 6px; padding: 15px; background-color: #ffffff;">
                    <h4 style="margin: 0 0 12px 0; font-size: 16px; font-weight: bold; color: #374151; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px;">
                      Passenger ${index + 1}
                    </h4>
                    <div style="space-y-2;">
                      <div style="display: flex; justify-content: space-between;">
                        <span style="color: #6b7280; font-size: 13px;">Name:</span>
                        <span style="font-weight: 500; font-size: 13px;">${passenger.firstName} ${passenger.lastName}</span>
                      </div>
                      <div style="display: flex; justify-content: space-between;">
                        <span style="color: #6b7280; font-size: 13px;">Date of Birth:</span>
                        <span style="font-size: 13px;">${passenger.dateOfBirth}</span>
                      </div>
                      <div style="display: flex; justify-content: space-between;">
                        <span style="color: #6b7280; font-size: 13px;">Gender:</span>
                        <span style="font-size: 13px; text-transform: capitalize;">${passenger.gender}</span>
                      </div>
                      ${passenger.passportNumber ? `
                        <div style="display: flex; justify-content: space-between;">
                          <span style="color: #6b7280; font-size: 13px;">Passport:</span>
                          <span style="font-size: 13px;">${passenger.passportNumber}</span>
                        </div>
                      ` : ''}
                      ${passenger.nationality ? `
                        <div style="display: flex; justify-content: space-between;">
                          <span style="color: #6b7280; font-size: 13px;">Nationality:</span>
                          <span style="font-size: 13px;">${passenger.nationality}</span>
                        </div>
                      ` : ''}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Contact Info -->
            <div class="section" style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; background-color: #f9fafb;">
              <h3 style="color: #059669; margin-top: 0; margin-bottom: 15px; font-size: 18px; font-weight: bold; border-bottom: 2px solid #059669; padding-bottom: 8px;">
                Contact Info
              </h3>
              <div style="background: #ffffff; padding: 15px; border-radius: 6px;">
                <div style="space-y-2;">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="color: #6b7280;">Phone:</span>
                    <span>${booking.contactInfo.phone}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="color: #6b7280;">Email:</span>
                    <span>${booking.contactInfo.email}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Price Breakdown -->
            <div class="section" style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; background-color: #f9fafb;">
              <h3 style="color: #059669; margin-top: 0; margin-bottom: 15px; font-size: 18px; font-weight: bold; border-bottom: 2px solid #059669; padding-bottom: 8px;">
                Price Breakdown
              </h3>
              <div style="background: #ffffff; padding: 15px; border-radius: 6px;">
                <div style="space-y-2;">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="color: #6b7280;">Base Price:</span>
                    <span>$${booking.pricing.basePrice.toFixed(2)}</span>
                  </div>
                  ${booking.pricing.discount > 0 ? `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px; color: #059669;">
                      <span>Discount:</span>
                      <span>-$${booking.pricing.discount.toFixed(2)}</span>
                    </div>
                  ` : ''}
                  <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 18px; border-top: 2px solid #e5e7eb; padding-top: 12px; margin-top: 8px;">
                    <span>Total Paid:</span>
                    <span>$${booking.pricing.finalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Attachments Note -->
            ${emailAttachments.length > 0 ? `
              <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 15px; margin-top: 25px; text-align: center;">
                <p style="margin: 0; color: #1e40af; font-size: 14px;">
                  📎 Your detailed receipt is attached to this email in ${emailAttachments.length} format(s).
                </p>
              </div>
            ` : ''}
          </div>

          <!-- Footer -->
          <div style="background: #f7fafc; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0 0 10px 0; font-weight: bold; color: #059669;">
              Thank you for choosing Weyfar Travel Solution!
            </p>
            <p style="margin: 0 0 10px 0; font-size: 12px; color: #6b7280;">
              This document is electronically generated and valid without signature.
            </p>
            <div style="font-size: 11px; color: #9ca3af;">
              <p style="margin: 5px 0;">📧 bookingdesk@weyfar.com | 📞 +1 (888) 808-2182</p>
              <p style="margin: 5px 0;">Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: {
        name: 'Weyfar Travel Solution',
        address: process.env.EMAIL_USER
      },
      to: to.join(', '),
      subject: subject,
      html: emailContent,
      attachments: emailAttachments
    };

    console.log('Attempting to send email...');
    console.log('From:', mailOptions.from);
    console.log('To:', mailOptions.to);
    console.log('Subject:', mailOptions.subject);
    console.log('Attachments:', emailAttachments.length);

    const result = await transporter.sendMail(mailOptions);

    console.log('Email sent successfully!');
    console.log('Message ID:', result.messageId);

    res.status(200).json({
      success: true,
      message: 'Email sent successfully',
      messageId: result.messageId
    });

  } catch (error) {
    console.error('Email sending failed:', error);

    let errorMessage = 'Failed to send email';

    if (error.code === 'EAUTH') {
      errorMessage = 'Authentication failed. Check your email credentials.';
    } else if (error.code === 'EENVELOPE') {
      errorMessage = 'Invalid email addresses.';
    } else if (error.response) {
      errorMessage = `SMTP Error: ${error.response}`;
    }

    res.status(500).json({
      success: false,
      message: errorMessage,
      error: error.toString(),
      errorCode: error.code
    });
  }
});

module.exports = router;