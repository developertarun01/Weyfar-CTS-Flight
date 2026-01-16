import { useState, useCallback } from 'react';
import { createBooking, validatePromoCode, processPayment } from '../services/api';

export const useBooking = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [booking, setBooking] = useState(null);

  const create = useCallback(async (bookingData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await createBooking(bookingData);
      setBooking(result.data);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const validatePromo = useCallback(async (code, amount) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await validatePromoCode({ code, amount });
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const payment = useCallback(async (paymentData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await processPayment(paymentData);
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

  const clearBooking = useCallback(() => {
    setBooking(null);
  }, []);

  return {
    loading,
    error,
    booking,
    create,
    validatePromo,
    payment,
    clearError,
    clearBooking
  };
};