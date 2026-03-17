import { useState, useEffect, useCallback } from 'react';
import * as wishlistService from '../services/wishlistService';
import { useAuthContext } from '../context/AuthContext';

export const useWishlist = () => {
  const { user } = useAuthContext();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadWishlist = useCallback(async () => {
    if (!user?.uid) return;
    setLoading(true);
    try {
      const data = await wishlistService.getWishlist(user.uid);
      setWishlist(data);
    } catch {
      // Silently fail — cache may still work
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  const toggleWishlist = useCallback(async (hotel) => {
    if (!user?.uid) return;
    const isLiked = wishlist.some(
      (item) => item.id === hotel.id || item.hotelId === hotel.id
    );

    if (isLiked) {
      await wishlistService.removeFromWishlist(user.uid, hotel.id);
      setWishlist((prev) =>
        prev.filter((item) => item.id !== hotel.id && item.hotelId !== hotel.id)
      );
    } else {
      await wishlistService.addToWishlist(user.uid, hotel);
      setWishlist((prev) => [...prev, { id: hotel.id, hotelId: hotel.id, ...hotel }]);
    }
  }, [user?.uid, wishlist]);

  const isInWishlist = useCallback(
    (hotelId) => {
      return wishlist.some(
        (item) => item.id === hotelId || item.hotelId === hotelId
      );
    },
    [wishlist]
  );

  return {
    wishlist,
    loading,
    toggleWishlist,
    isInWishlist,
    loadWishlist,
  };
};

export default useWishlist;
