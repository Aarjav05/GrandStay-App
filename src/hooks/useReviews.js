import { useState, useCallback } from 'react';
import * as reviewService from '../services/reviewService';

export const useReviews = (hotelId) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadReviews = useCallback(async (limitCount = 10) => {
    if (!hotelId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await reviewService.getReviews(hotelId, limitCount);
      setReviews(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [hotelId]);

  const addReview = useCallback(async (userId, userName, rating, text) => {
    try {
      await reviewService.addReview(hotelId, userId, userName, rating, text);
      await loadReviews();
    } catch (e) {
      throw e;
    }
  }, [hotelId, loadReviews]);

  return {
    reviews,
    loading,
    error,
    loadReviews,
    addReview,
  };
};

export default useReviews;
