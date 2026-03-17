import React, { createContext, useState, useContext, useCallback } from 'react';

const INITIAL_DRAFT = {
  hotelId: null,
  hotelName: '',
  hotelImage: '',
  roomId: null,
  roomType: '',
  roomPrice: 0,
  checkIn: null,
  checkOut: null,
  nights: 0,
  guests: { adults: 1, children: 0, rooms: 1 },
  guestName: '',
  guestPhone: '',
  specialRequests: '',
  promoCode: null,
  priceBreakdown: {},
  paymentMethod: '',
  transactionId: '',
};

const BookingContext = createContext(null);

export const BookingProvider = ({ children }) => {
  const [draft, setDraft] = useState({ ...INITIAL_DRAFT });

  const setDraftField = useCallback((key, value) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }, []);

  const setGuests = useCallback((guestsObj) => {
    setDraft((prev) => ({ ...prev, guests: { ...prev.guests, ...guestsObj } }));
  }, []);

  const setPriceBreakdown = useCallback((breakdown) => {
    setDraft((prev) => ({ ...prev, priceBreakdown: breakdown }));
  }, []);

  const setHotelInfo = useCallback((hotel) => {
    setDraft((prev) => ({
      ...prev,
      hotelId: hotel.id,
      hotelName: hotel.name,
      hotelImage: hotel.images?.[0] || '',
    }));
  }, []);

  const setRoomInfo = useCallback((room) => {
    setDraft((prev) => ({
      ...prev,
      roomId: room.id,
      roomType: room.type,
      roomPrice: room.price,
    }));
  }, []);

  const clearDraft = useCallback(() => {
    setDraft({ ...INITIAL_DRAFT });
  }, []);

  const calculateTotal = useCallback(() => {
    return draft.priceBreakdown?.total || 0;
  }, [draft.priceBreakdown]);

  return (
    <BookingContext.Provider
      value={{
        draft,
        setDraftField,
        setGuests,
        setPriceBreakdown,
        setHotelInfo,
        setRoomInfo,
        clearDraft,
        calculateTotal,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBookingContext = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBookingContext must be used within a BookingProvider');
  }
  return context;
};

export default BookingContext;
