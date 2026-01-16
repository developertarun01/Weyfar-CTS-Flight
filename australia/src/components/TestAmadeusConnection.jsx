import React, { useState } from 'react';
import airportSearchService from '../services/airportSearchService';

const TestAmadeusConnection = () => {
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('DEL');

  const testApi = async () => {
    setLoading(true);
    setTestResults(null);
    
    try {
      const results = await airportSearchService.searchLocations(query);
      setTestResults(results);
      // console.log('API Test Results:', results);
    } catch (error) {
      console.error('API Test Error:', error);
      setTestResults({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50 mb-4">
      <h3 className="font-semibold mb-2">Amadeus API Connection Test</h3>
      
      <div className="flex space-x-2 mb-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter search term (e.g., DEL)"
          className="flex-1 px-3 py-2 border rounded"
        />
        <button 
          onClick={testApi} 
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          {loading ? 'Testing...' : 'Test API'}
        </button>
      </div>
      
      {testResults && (
        <div className="mt-4">
          <h4 className="font-medium mb-2">
            Results ({Array.isArray(testResults) ? testResults.length : 'N/A'})
          </h4>
          
          {Array.isArray(testResults) ? (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {testResults.slice(0, 5).map((result, index) => (
                <div key={index} className="p-2 bg-white rounded border text-sm">
                  <div className="font-medium">{result.name} ({result.code})</div>
                  <div className="text-gray-600">{result.city}, {result.country}</div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Type: {result.type}</span>
                    <span>Source: {result.source}</span>
                    <span>Relevance: {result.relevance}</span>
                  </div>
                </div>
              ))}
              {testResults.length > 5 && (
                <div className="text-center text-gray-500 text-sm">
                  ... and {testResults.length - 5} more results
                </div>
              )}
            </div>
          ) : (
            <div className="p-3 bg-red-100 text-red-700 rounded">
              Error: {testResults.error}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TestAmadeusConnection;