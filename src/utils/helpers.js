import { differenceInDays, parseISO } from 'date-fns';

export const calcNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  const startDate = typeof checkIn === 'string' ? parseISO(checkIn) : checkIn;
  const endDate = typeof checkOut === 'string' ? parseISO(checkOut) : checkOut;
  const nights = differenceInDays(endDate, startDate);
  return Math.max(0, nights);
};

export const calcDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
};

const toRad = (deg) => deg * (Math.PI / 180);

export const generateBookingId = () => {
  return 'GS-' + Date.now().toString(36).toUpperCase();
};

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};

export const datesOverlap = (start1, end1, start2, end2) => {
  return start1 < end2 && end1 > start2;
};

export const getTimeOfDay = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
};

export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
