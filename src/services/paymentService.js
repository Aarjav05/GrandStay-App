import { generateBookingId } from '../utils/helpers';
import { isValidCardNumber, isValidExpiry, isValidCVV } from '../utils/validators';
import { APP_CONFIG } from '../config/appConfig';

export const processPayment = async (amount, method, details = {}) => {
  // MVP: Mock payment — always succeeds after delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        transactionId: 'TXN-' + Date.now().toString(36).toUpperCase(),
        timestamp: new Date().toISOString(),
        amount,
        method,
      });
    }, APP_CONFIG.PAYMENT_DELAY_MS);
  });
};

export const validateCard = (cardNumber, expiry, cvv) => {
  const errors = [];

  if (!isValidCardNumber(cardNumber)) {
    errors.push('Invalid card number');
  }
  if (!isValidExpiry(expiry)) {
    errors.push('Invalid or expired card');
  }
  if (!isValidCVV(cvv)) {
    errors.push('Invalid CVV');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

export const generateBookingRef = () => {
  return generateBookingId();
};

export const getPaymentMethods = () => {
  return [
    { id: 'card', label: 'Credit / Debit Card', icon: 'card', emoji: '💳' },
    { id: 'upi', label: 'UPI', icon: 'phone-portrait', emoji: '📱' },
    { id: 'netbanking', label: 'Net Banking', icon: 'business', emoji: '🏦' },
    { id: 'wallet', label: 'Wallet', icon: 'wallet', emoji: '👛' },
  ];
};

export default {
  processPayment,
  validateCard,
  generateBookingRef,
  getPaymentMethods,
};
