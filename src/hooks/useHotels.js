import { useState, useEffect, useCallback } from 'react';
import * as hotelService from '../services/hotelService';
import { useHotelContext } from '../context/HotelContext';

export const useHotels = () => {
  const context = useHotelContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHotel = useCallback(async (hotelId) => {
    setLoading(true);
    setError(null);
    try {
      const hotel = await hotelService.fetchHotelById(hotelId);
      return hotel;
    } catch (e) {
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRooms = useCallback(async (hotelId) => {
    setLoading(true);
    try {
      const rooms = await hotelService.fetchRooms(hotelId);
      return rooms;
    } catch (e) {
      setError(e.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    ...context,
    fetchHotel,
    fetchRooms,
    loading: context.loading || loading,
    error: context.error || error,
  };
};

export default useHotels;
