import React, { createContext, useState, useContext, useCallback } from 'react';
import * as hotelService from '../services/hotelService';

const HotelContext = createContext(null);

export const HotelProvider = ({ children }) => {
  const [hotels, setHotels] = useState([]);
  const [featuredHotels, setFeaturedHotels] = useState([]);
  const [nearbyHotels, setNearbyHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadHotels = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await hotelService.fetchHotels();
      setHotels(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadFeatured = useCallback(async () => {
    try {
      const data = await hotelService.fetchFeaturedHotels();
      setFeaturedHotels(data);
    } catch (e) {
      console.warn('Failed to load featured hotels:', e);
    }
  }, []);

  const loadNearby = useCallback(async (lat, lng, radius) => {
    try {
      const data = await hotelService.fetchNearbyHotels(lat, lng, radius);
      setNearbyHotels(data);
    } catch (e) {
      console.warn('Failed to load nearby hotels:', e);
    }
  }, []);

  const clearSelectedHotel = useCallback(() => {
    setSelectedHotel(null);
  }, []);

  return (
    <HotelContext.Provider
      value={{
        hotels,
        featuredHotels,
        nearbyHotels,
        selectedHotel,
        loading,
        error,
        loadHotels,
        loadFeatured,
        loadNearby,
        setSelectedHotel,
        clearSelectedHotel,
      }}
    >
      {children}
    </HotelContext.Provider>
  );
};

export const useHotelContext = () => {
  const context = useContext(HotelContext);
  if (!context) {
    throw new Error('useHotelContext must be used within a HotelProvider');
  }
  return context;
};

export default HotelContext;
