// backend/routes/search.js
const express = require('express');
const router = express.Router();

// Mock data for search functionality
const mockPorts = [
  { code: "MIA", name: "Miami, Florida, USA", country: "USA", region: "North America" },
  { code: "FLL", name: "Fort Lauderdale, Florida, USA", country: "USA", region: "North America" },
  { code: "LAX", name: "Los Angeles, California, USA", country: "USA", region: "North America" },
  { code: "JFK", name: "New York, New York, USA", country: "USA", region: "North America" },
  { code: "YVR", name: "Vancouver, Canada", country: "Canada", region: "North America" },
  { code: "CUN", name: "Cancun, Mexico", country: "Mexico", region: "North America" },
  { code: "NAS", name: "Nassau, Bahamas", country: "Bahamas", region: "Caribbean" },
  { code: "SJU", name: "San Juan, Puerto Rico", country: "Puerto Rico", region: "Caribbean" },
  { code: "BCN", name: "Barcelona, Spain", country: "Spain", region: "Europe" },
  { code: "ROM", name: "Rome (Civitavecchia), Italy", country: "Italy", region: "Europe" },
  { code: "ATH", name: "Athens (Piraeus), Greece", country: "Greece", region: "Europe" },
  { code: "SIN", name: "Singapore", country: "Singapore", region: "Asia" },
  { code: "HKG", name: "Hong Kong", country: "China", region: "Asia" },
];

const mockCruiseLines = [
  { code: "RCL", name: "Royal Caribbean International" },
  { code: "NCL", name: "Norwegian Cruise Line" },
  { code: "CCL", name: "Carnival Cruise Line" },
  { code: "MSC", name: "MSC Cruises" },
  { code: "PRC", name: "Princess Cruises" },
  { code: "CEL", name: "Celebrity Cruises" },
  { code: "DIS", name: "Disney Cruise Line" },
  { code: "HAL", name: "Holland America Line" },
];

const mockShips = [
  { name: "Symphony of the Seas", cruiseLine: "Royal Caribbean International" },
  { name: "Wonder of the Seas", cruiseLine: "Royal Caribbean International" },
  { name: "Norwegian Escape", cruiseLine: "Norwegian Cruise Line" },
  { name: "Mardi Gras", cruiseLine: "Carnival Cruise Line" },
  { name: "MSC Seashore", cruiseLine: "MSC Cruises" },
  { name: "Discovery Princess", cruiseLine: "Princess Cruises" },
  { name: "Celebrity Beyond", cruiseLine: "Celebrity Cruises" },
  { name: "Disney Wish", cruiseLine: "Disney Cruise Line" },
];

// Search ports endpoint
router.post('/ports', (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ 
        success: false, 
        message: 'Query parameter is required' 
      });
    }

    console.log(`Searching ports for: "${query}"`);

    const filteredPorts = mockPorts.filter(port =>
      port.name.toLowerCase().includes(query.toLowerCase()) ||
      port.code.toLowerCase().includes(query.toLowerCase()) ||
      port.country.toLowerCase().includes(query.toLowerCase())
    );

    res.json({
      success: true,
      data: filteredPorts
    });
    
  } catch (error) {
    console.error('Error searching ports:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Search cruise lines endpoint
router.post('/cruise-lines', (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ 
        success: false, 
        message: 'Query parameter is required' 
      });
    }

    console.log(`Searching cruise lines for: "${query}"`);

    const filteredLines = mockCruiseLines.filter(line =>
      line.name.toLowerCase().includes(query.toLowerCase()) ||
      line.code.toLowerCase().includes(query.toLowerCase())
    );

    res.json({
      success: true,
      data: filteredLines
    });
    
  } catch (error) {
    console.error('Error searching cruise lines:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Search ships endpoint
router.post('/ships', (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ 
        success: false, 
        message: 'Query parameter is required' 
      });
    }

    console.log(`Searching ships for: "${query}"`);

    const filteredShips = mockShips.filter(ship =>
      ship.name.toLowerCase().includes(query.toLowerCase()) ||
      ship.cruiseLine.toLowerCase().includes(query.toLowerCase())
    );

    res.json({
      success: true,
      data: filteredShips
    });
    
  } catch (error) {
    console.error('Error searching ships:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Get popular ports
router.get('/popular-ports', (req, res) => {
  try {
    res.json({
      success: true,
      data: mockPorts.slice(0, 8) // Return first 8 as popular
    });
  } catch (error) {
    console.error('Error getting popular ports:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Get popular cruise lines
router.get('/popular-cruise-lines', (req, res) => {
  try {
    res.json({
      success: true,
      data: mockCruiseLines.slice(0, 6) // Return first 6 as popular
    });
  } catch (error) {
    console.error('Error getting popular cruise lines:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

module.exports = router;