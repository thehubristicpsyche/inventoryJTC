import { useState, useCallback, useEffect, useRef } from 'react';

/**
 * Custom hook for async operations with loading and error states
 * @param {Function} asyncFunction - Async function to execute
 * @param {boolean} immediate - Execute immediately on mount (default: false)
 * @returns {object} { data, loading, error, execute, reset }
 */
export const useAsync = (asyncFunction, immediate = false) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);
      setData(null);

      try {
        const result = await asyncFunction(...args);
        if (mountedRef.current) {
          setData(result);
          setLoading(false);
        }
        return { success: true, data: result };
      } catch (err) {
        if (mountedRef.current) {
          setError(err);
          setLoading(false);
        }
        return { success: false, error: err };
      }
    },
    [asyncFunction]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
};

