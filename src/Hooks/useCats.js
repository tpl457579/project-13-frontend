import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../components/apiFetch';

export const useCats = () => {
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCats = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/cats');
      setCats(Array.isArray(data) ? data : data.cats || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching cats:', err);
      setError('Failed to load cats.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCats();
  }, [fetchCats]);

  return { cats, setCats, loading, error, refetch: fetchCats };
};