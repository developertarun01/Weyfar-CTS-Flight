const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const travelRoutes = require('./routes/travel');
const bookingRoutes = require('./routes/booking');
const paymentRoutes = require('./routes/payment');
const emailRoutes = require('./routes/email');
const searchRoutes = require('./routes/search');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration - simplified for Vercel
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://complete-travel-solution.vercel.app',
    'https://weyfar.com'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
// Increase payload size limit (50MB)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/travel-booking', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    console.log('Note: Application will continue but booking data will not be persisted');
  });

// Routes
app.use('/api/travel', travelRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/search', searchRoutes);
// Use email routes
app.use('/api', emailRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running successfully',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Error handling middleware
app.use(require('./middleware/errorHandler'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Handle 404 for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// Handle all other routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);

  // Check if Amadeus API keys are configured
  if (!process.env.AMADEUS_API_KEY || !process.env.AMADEUS_API_SECRET) {
    console.log('Note: Amadeus API keys not configured. Using mock data for travel search.');
  }
});

// In your server.js or app.js

console.log('Environment check:');
console.log('EMAIL_USER exists:', !!process.env.EMAIL_USER);
console.log('EMAIL_PASSWORD exists:', !!process.env.EMAIL_PASSWORD);

// check-nodemailer.js
const nodemailer = require('nodemailer');
console.log('Nodemailer version:', nodemailer.version);
console.log('Available methods:', Object.keys(nodemailer));
module.exports = app;