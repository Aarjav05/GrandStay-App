import { supabase } from '../config/supabase';

export const fetchHotels = async () => {
  const { data, error } = await supabase
    .from('hotels')
    .select('*')
    .order('rating', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const fetchFeatured = async () => {
  const { data, error } = await supabase
    .from('hotels')
    .select('*')
    .eq('is_featured', true)
    .order('rating', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const fetchById = async (id) => {
  const { data, error } = await supabase
    .from('hotels')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

// Kept old signature to not break UI, but now maps to Supabase
export const fetchHotelById = fetchById;

export const fetchRooms = async (hotelId) => {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('hotel_id', hotelId)
    .order('price', { ascending: true });

  if (error) throw error;
  
  // Format for UI (convert hotel_id to hotelId, bed_type to bedType)
  return (data || []).map(r => ({
    ...r,
    hotelId: r.hotel_id,
    bedType: r.bed_type
  }));
};
