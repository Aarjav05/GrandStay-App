import { supabase } from '../config/supabase';

export const getReviews = async (hotelId) => {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('hotel_id', hotelId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data.map(r => ({
    id: r.id,
    hotelId: r.hotel_id,
    userId: r.user_id,
    userName: r.user_name,
    rating: r.rating,
    text: r.text,
    createdAt: new Date(r.created_at),
  }));
};

export const addReview = async (hotelId, userId, userName, rating, text) => {
  // First add review
  const { data, error } = await supabase
    .from('reviews')
    .insert({
      hotel_id: hotelId,
      user_id: userId,
      user_name: userName,
      rating,
      text,
    })
    .select()
    .single();

  if (error) throw error;

  // Then update hotel average (in prod, triggering this via DB is better, but this works)
  // Fetch existing
  const { data: hotel } = await supabase.from('hotels').select('rating, review_count').eq('id', hotelId).single();
  
  if (hotel) {
    const currentCount = hotel.review_count || 0;
    const currentRating = hotel.rating || 0;
    const newCount = currentCount + 1;
    const newTotalScore = (currentRating * currentCount) + rating;
    const newAvg = (newTotalScore / newCount).toFixed(2);

    await supabase.from('hotels').update({ 
      rating: parseFloat(newAvg), 
      review_count: newCount 
    }).eq('id', hotelId);
  }

  return {
    ...data,
    userName: data.user_name,
    createdAt: new Date(data.created_at)
  };
};
