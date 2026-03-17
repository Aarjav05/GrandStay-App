import { useState, useEffect, useCallback } from 'react';
import * as mapService from '../services/mapService';

export const useLocation = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const getLocation = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const loc = await mapService.getUserLocation();
      setLocation(loc);
      setPermissionDenied(false);
      return loc;
    } catch (e) {
      if (e.code === 'location/denied') {
        setPermissionDenied(true);
      }
      setError(e.message || 'Failed to get location');
      // Fallback to default city
      const defaultRegion = mapService.getDefaultRegion();
      setLocation({
        latitude: defaultRegion.latitude,
        longitude: defaultRegion.longitude,
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  return {
    location,
    loading,
    error,
    permissionDenied,
    getLocation,
  };
};

export default useLocation;
