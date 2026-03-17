import { supabase } from '../config/supabase';

// Helper to determine nights and pricing
export const calculatePrice = (pricePerNight, nights) => {
  const subtotal = pricePerNight * nights;
  const taxes = subtotal * 0.18; // 18% GST mock
  return {
    roomRate: pricePerNight,
    nights,
    subtotal,
    taxes,
    discount: 0,
    total: subtotal + taxes,
  };
};

export const applyPromoCode = (subtotal, code) => {
  if (code === 'SAVE10') {
    const discount = subtotal * 0.10;
    const taxes = (subtotal - discount) * 0.18;
    return { discount, taxes, total: subtotal - discount + taxes };
  }
  throw new Error('Invalid promo code');
};

export const createBooking = async (bookingData) => {
  // 1. Check availability via Postgres RPC before creating!
  const { data: isAvailable, error: rpcError } = await supabase.rpc('check_availability', {
    p_hotel_id: bookingData.hotelId,
    p_room_id: bookingData.roomId,
    p_check_in: bookingData.checkIn.toISOString().split('T')[0],
    p_check_out: bookingData.checkOut.toISOString().split('T')[0]
  });

  if (rpcError) throw rpcError;
  if (!isAvailable) {
    throw new Error('This room is no longer available for the selected dates.');
  }

  // 2. Generate Reference ID
  const bookingRef = `GS-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  // 3. Insert into Supabase
  const { data, error } = await supabase
    .from('bookings')
    .insert({
      user_id: bookingData.userId,
      hotel_id: bookingData.hotelId,
      room_id: bookingData.roomId,
      hotel_name: bookingData.hotelName,
      hotel_image: bookingData.hotelImage,
      room_type: bookingData.roomType,
      check_in: bookingData.checkIn.toISOString(),
      check_out: bookingData.checkOut.toISOString(),
      nights: bookingData.nights,
      guests: bookingData.guests,
      guest_name: bookingData.guestName,
      guest_phone: bookingData.guestPhone,
      special_requests: bookingData.specialRequests,
      promo_code: bookingData.promoCode,
      price_breakdown: bookingData.priceBreakdown,
      total_price: bookingData.totalPrice,
      payment_method: bookingData.paymentMethod,
      transaction_id: bookingData.transactionId,
      status: 'confirmed',
      booking_ref: bookingRef,
    })
    .select()
    .single();

  if (error) throw error;
  
  return {
    id: data.id,
    bookingRef: data.booking_ref
  };
};

export const getUserBookings = async (userId, statusFilter = null) => {
  let query = supabase
    .from('bookings')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (statusFilter === 'confirmed') {
    query = query.in('status', ['confirmed', 'pending']);
  } else if (statusFilter) {
    query = query.eq('status', statusFilter);
  }

  const { data, error } = await query;
  if (error) throw error;

  // Map snake_case back to camelCase for the UI
  return data.map(b => ({
    ...b,
    hotelId: b.hotel_id,
    roomId: b.room_id,
    hotelName: b.hotel_name,
    hotelImage: b.hotel_image,
    roomType: b.room_type,
    checkIn: new Date(b.check_in),
    checkOut: new Date(b.check_out),
    guestName: b.guest_name,
    guestPhone: b.guest_phone,
    specialRequests: b.special_requests,
    promoCode: b.promo_code,
    priceBreakdown: b.price_breakdown,
    totalPrice: b.total_price,
    paymentMethod: b.payment_method,
    transactionId: b.transaction_id,
    bookingRef: b.booking_ref,
  }));
};

export const getBookingById = async (bookingId) => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', bookingId)
    .single();

  if (error) throw error;

  return {
    ...data,
    hotelId: data.hotel_id,
    roomId: data.room_id,
    hotelName: data.hotel_name,
    hotelImage: data.hotel_image,
    roomType: data.room_type,
    checkIn: new Date(data.check_in),
    checkOut: new Date(data.check_out),
    guestName: data.guest_name,
    guestPhone: data.guest_phone,
    specialRequests: data.special_requests,
    promoCode: data.promo_code,
    priceBreakdown: data.price_breakdown,
    totalPrice: data.total_price,
    paymentMethod: data.payment_method,
    transactionId: data.transaction_id,
    bookingRef: data.booking_ref,
  };
};

export const cancelBooking = async (bookingId) => {
  const { error } = await supabase
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('id', bookingId);
  
  if (error) throw error;
};

export const getBookingStats = async (userId) => {
  const { data, error } = await supabase
    .from('bookings')
    .select('status, total_price')
    .eq('user_id', userId);

  if (error) throw error;

  const stats = { totalBookings: data.length, completedBookings: 0, totalSpent: 0 };
  data.forEach(b => {
    if (b.status === 'completed' || b.status === 'confirmed') {
      stats.completedBookings++;
      stats.totalSpent += Number(b.total_price || 0);
    }
  });

  return stats;
};

