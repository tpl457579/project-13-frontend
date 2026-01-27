import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../components/apiFetch';

export const useDogs = () => {
  const [dogs, setDogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDogs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/dogs');
      setDogs(Array.isArray(data) ? data : data.dogs || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching dogs:', err);
      setError('Failed to load dogs.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDogs();
  }, [fetchDogs]);

  return { dogs, setDogs, loading, error, refetch: fetchDogs };
};