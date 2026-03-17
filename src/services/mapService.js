import * as Location from 'expo-location';
import { supabase } from '../config/supabase';

export const getUserLocation = async () => {
  try {
    let { status } = await Location.requestForegroundPermissionsAsync();
    // Default to Mumbai if permission denied
    if (status !== 'granted') {
      return { latitude: 19.0760, longitude: 72.8777 }; 
    }

    let location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    return location.coords;
  } catch (error) {
    return { latitude: 19.0760, longitude: 72.8777 };
  }
};

export const watchLocation = async (callback) => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') return null;

  return await Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.Balanced,
      timeInterval: 5000,
      distanceInterval: 10,
    },
    (loc) => callback(loc.coords)
  );
};

export const getDefaultRegion = () => ({
  latitude: 19.0760,
  longitude: 72.8777,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
});

/**
 * NEW PostGIS Filter
 * Uses the `get_nearby_hotels` RPC created in schema.sql to do actual distance filtering in Postgres.
 * No radius math needed on the client anymore!
 * 
 * If region is very large, it increases radius. 0.1 degree is roughly 11km.
 */
export const filterByRegion = async (centerLat, centerLng, radiusInMeters = 15000) => {
  try {
    const { data, error } = await supabase.rpc('get_nearby_hotels', {
      p_lat: centerLat,
      p_lng: centerLng,
      p_radius_meters: radiusInMeters
    });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.warn("PostGIS filter failed, returning empty", error.message);
    return [];
  }
};

export const calcDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c;
};
