import { format, differenceInDays, parseISO, isAfter, isBefore, isValid } from 'date-fns';
import { APP_CONFIG } from '../config/appConfig';

export const formatPrice = (amount, currencyCode = 'INR') => {
  const currency = APP_CONFIG.CURRENCIES[currencyCode] || APP_CONFIG.CURRENCIES.INR;
  const converted = amount * currency.rate;
  
  if (currencyCode === 'INR') {
    return `₹${Math.round(converted).toLocaleString('en-IN')}`;
  }
  return `${currency.symbol}${converted.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};

export const formatDate = (dateStr, formatStr = 'dd MMM yyyy') => {
  if (!dateStr) return '';
  try {
    const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
    return format(date, formatStr);
  } catch {
    return dateStr;
  }
};

export const formatDuration = (nights) => {
  if (!nights || nights <= 0) return '';
  return nights === 1 ? '1 night' : `${nights} nights`;
};

export const formatDateRange = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return '';
  return `${formatDate(checkIn, 'dd MMM')} — ${formatDate(checkOut, 'dd MMM yyyy')}`;
};

export const formatDistance = (km) => {
  if (km < 1) return `${Math.round(km * 1000)}m`;
  return `${km.toFixed(1)} km`;
};

export const formatRating = (rating) => {
  return rating ? rating.toFixed(1) : '0.0';
};

export const formatCardNumber = (number) => {
  const cleaned = number.replace(/\D/g, '');
  const groups = cleaned.match(/.{1,4}/g) || [];
  return groups.join(' ');
};

export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};
