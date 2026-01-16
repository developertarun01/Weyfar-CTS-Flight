// cruiseData.js
export const worldPorts = [
    // North America
    { code: "MIA", name: "Miami, Florida, USA", country: "USA", region: "North America" },
    { code: "FLL", name: "Fort Lauderdale, Florida, USA", country: "USA", region: "North America" },
    { code: "TPA", name: "Tampa, Florida, USA", country: "USA", region: "North America" },
    { code: "LAX", name: "Los Angeles, California, USA", country: "USA", region: "North America" },
    { code: "SEA", name: "Seattle, Washington, USA", country: "USA", region: "North America" },
    { code: "JFK", name: "New York, New York, USA", country: "USA", region: "North America" },
    { code: "YVR", name: "Vancouver, Canada", country: "Canada", region: "North America" },
    { code: "CUN", name: "Cancun, Mexico", country: "Mexico", region: "North America" },

    // Caribbean
    { code: "NAS", name: "Nassau, Bahamas", country: "Bahamas", region: "Caribbean" },
    { code: "SJU", name: "San Juan, Puerto Rico", country: "Puerto Rico", region: "Caribbean" },
    { code: "STT", name: "St. Thomas, USVI", country: "US Virgin Islands", region: "Caribbean" },
    { code: "FPO", name: "Freeport, Bahamas", country: "Bahamas", region: "Caribbean" },
    { code: "AUA", name: "Aruba", country: "Aruba", region: "Caribbean" },
    { code: "CZM", name: "Cozumel, Mexico", country: "Mexico", region: "Caribbean" },

    // Europe
    { code: "BCN", name: "Barcelona, Spain", country: "Spain", region: "Europe" },
    { code: "ROM", name: "Rome (Civitavecchia), Italy", country: "Italy", region: "Europe" },
    { code: "ATH", name: "Athens (Piraeus), Greece", country: "Greece", region: "Europe" },
    { code: "LON", name: "London (Southampton), UK", country: "UK", region: "Europe" },
    { code: "PAR", name: "Paris (Le Havre), France", country: "France", region: "Europe" },
    { code: "AMS", name: "Amsterdam, Netherlands", country: "Netherlands", region: "Europe" },
    { code: "VEN", name: "Venice, Italy", country: "Italy", region: "Europe" },

    // Asia
    { code: "SIN", name: "Singapore", country: "Singapore", region: "Asia" },
    { code: "HKG", name: "Hong Kong", country: "China", region: "Asia" },
    { code: "BKK", name: "Bangkok (Laem Chabang), Thailand", country: "Thailand", region: "Asia" },
    { code: "NRT", name: "Tokyo, Japan", country: "Japan", region: "Asia" },
    { code: "DXB", name: "Dubai, UAE", country: "UAE", region: "Asia" },

    // Add more ports as needed...
];

export const cruiseLines = [
    { code: "RCL", name: "Royal Caribbean International" },
    { code: "NCL", name: "Norwegian Cruise Line" },
    { code: "CCL", name: "Carnival Cruise Line" },
    { code: "MSC", name: "MSC Cruises" },
    { code: "PRC", name: "Princess Cruises" },
    { code: "CEL", name: "Celebrity Cruises" },
    { code: "DIS", name: "Disney Cruise Line" },
    { code: "HAL", name: "Holland America Line" },
    { code: "COSTA", name: "Costa Cruises" },
    { code: "VIR", name: "Virgin Voyages" },
];

export const popularShips = [
    { name: "Symphony of the Seas", cruiseLine: "Royal Caribbean" },
    { name: "Wonder of the Seas", cruiseLine: "Royal Caribbean" },
    { name: "Norwegian Escape", cruiseLine: "Norwegian Cruise Line" },
    { name: "Mardi Gras", cruiseLine: "Carnival Cruise Line" },
    { name: "MSC Seashore", cruiseLine: "MSC Cruises" },
    { name: "Discovery Princess", cruiseLine: "Princess Cruises" },
    { name: "Celebrity Beyond", cruiseLine: "Celebrity Cruises" },
    { name: "Disney Wish", cruiseLine: "Disney Cruise Line" },
    { name: "Rotterdam", cruiseLine: "Holland America Line" },
    { name: "Scarlet Lady", cruiseLine: "Virgin Voyages" },
];