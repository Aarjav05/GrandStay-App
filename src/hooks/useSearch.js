import { useState, useCallback, useRef, useEffect } from 'react';
import * as searchService from '../services/searchService';

export const useSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const debounceRef = useRef(null);

  const search = useCallback(async (searchQuery, searchFilters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await searchService.searchHotels(searchQuery, searchFilters);
      setResults(data);
    } catch (e) {
      setError(e.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedSearch = useCallback((searchQuery, searchFilters = {}) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      search(searchQuery, searchFilters);
    }, 300);
  }, [search]);

  const updateFilters = useCallback((newFilters) => {
    const merged = { ...filters, ...newFilters };
    setFilters(merged);
    search(query, merged);
  }, [filters, query, search]);

  const resetFilters = useCallback(() => {
    setFilters({});
    search(query, {});
  }, [query, search]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    filters,
    search,
    debouncedSearch,
    updateFilters,
    resetFilters,
  };
};

export default useSearch;
