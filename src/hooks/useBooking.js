import { useBookingContext } from '../context/BookingContext';
import { calculatePrice } from '../services/bookingService';

export const useBooking = () => {
  const context = useBookingContext();

  const updatePrice = (promoCode = null) => {
    if (context.draft.roomPrice && context.draft.nights) {
      const breakdown = calculatePrice(
        context.draft.roomPrice,
        context.draft.nights,
        promoCode || context.draft.promoCode
      );
      context.setPriceBreakdown(breakdown);
      return breakdown;
    }
    return null;
  };

  return {
    ...context,
    updatePrice,
  };
};

export default useBooking;
