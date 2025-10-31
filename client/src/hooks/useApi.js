import { useState, useCallback } from 'react';
import { getErrorMessage } from '../constants/errors';

/**
 * Custom hook for API calls with loading and error handling
 * @param {Function} apiFunction - API function to call
 * @returns {object} { data, loading, error, execute, reset }
 */
export const useApi = (apiFunction) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await apiFunction(...args);
      setData(result);
      return { success: true, data: result };
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      console.error('API error:', err);
      return { success: false, error: errorMessage, originalError: err };
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
};

