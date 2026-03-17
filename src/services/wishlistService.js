import { supabase } from '../config/supabase';
import * as offlineService from './offlineService';

const CACHE_KEY = 'grandstay_wishlist';

export const getWishlist = async (userId) => {
  // 1. Return offline cache immediately
  const cached = await offlineService.getCache(CACHE_KEY);
  
  // 2. Fetch from Supabase in background
  if (userId) {
    supabase
      .from('wishlists')
      .select('hotel_id, hotels(*)')
      .eq('user_id', userId)
      .then(async ({ data, error }) => {
        if (!error && data) {
          const formatted = data.map(item => ({
            ...item.hotels,
            // Re-apply camelCase formatting for UI
            hotelId: item.hotels.id,
            reviewCount: item.hotels.review_count,
            isFeatured: item.hotels.is_featured
          }));
          await offlineService.setCache(CACHE_KEY, formatted);
        }
      });
  }

  return cached || [];
};

export const addToWishlist = async (userId, hotel) => {
  // 1. Optimistic Cache Update
  const current = await offlineService.getCache(CACHE_KEY) || [];
  if (!current.some(h => h.id === hotel.id)) {
    const updated = [...current, hotel];
    await offlineService.setCache(CACHE_KEY, updated);
  }

  // 2. Network write
  if (userId) {
    const { error } = await supabase
      .from('wishlists')
      .insert({ user_id: userId, hotel_id: hotel.id });

    if (error && error.code !== '23505') { // Ignore unique violation if already exists
      // If offline or failed, queue it
      await offlineService.queueWrite('wishlists', `${userId}_${hotel.id}`, {
        user_id: userId,
        hotel_id: hotel.id,
        _action: 'insert'
      });
    }
  }
};

export const removeFromWishlist = async (userId, hotelId) => {
  // 1. Optimistic Cache Update
  const current = await offlineService.getCache(CACHE_KEY) || [];
  const updated = current.filter(h => h.id !== hotelId);
  await offlineService.setCache(CACHE_KEY, updated);

  // 2. Network write
  if (userId) {
    const { error } = await supabase
      .from('wishlists')
      .delete()
      .match({ user_id: userId, hotel_id: hotelId });

    if (error) {
      await offlineService.queueWrite('wishlists', `${userId}_${hotelId}`, {
        user_id: userId,
        hotel_id: hotelId,
        _action: 'delete'
      });
    }
  }
};

export const isInWishlist = async (hotelId) => {
  const current = await offlineService.getCache(CACHE_KEY) || [];
  return current.some(h => h.id === hotelId);
};
