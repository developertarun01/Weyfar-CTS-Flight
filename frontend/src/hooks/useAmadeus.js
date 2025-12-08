import { useState, useCallback } from 'react';
import { searchFlights, searchHotels, searchCars, searchCruises } from '../services/api';

export const useAmadeus = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const search = useCallback(async (type, params) => {
    setLoading(true);
    setError(null);
    
    try {
      let result;
      switch (type) {
        case 'flights':
          result = await searchFlights(params);
          break;
        case 'hotels':
          result = await searchHotels(params);
          break;
        case 'cars':
          result = await searchCars(params);
          break;
        case 'cruises':
          result = await searchCruises(params);
          break;
        default:
          throw new Error('Invalid search type');
      }
      
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearData = useCallback(() => {
    setData(null);
  }, []);

  return {
    loading,
    error,
    data,
    search,
    clearError,
    clearData
  };
};