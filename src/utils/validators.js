import { APP_CONFIG } from '../config/appConfig';

export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password) => {
  return password && password.length >= APP_CONFIG.MIN_PASSWORD_LENGTH;
};

export const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: '', color: '#E0E0E0' };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const levels = [
    { score: 0, label: '', color: '#E0E0E0' },
    { score: 1, label: 'Weak', color: '#D32F2F' },
    { score: 2, label: 'Fair', color: '#F57C00' },
    { score: 3, label: 'Good', color: '#FFB300' },
    { score: 4, label: 'Strong', color: '#2E7D32' },
    { score: 5, label: 'Very Strong', color: '#1B5E20' },
  ];
  return levels[Math.min(score, 5)];
};

export const isValidPhone = (phone) => {
  const phoneRegex = /^[+]?[\d\s-]{10,15}$/;
  return phoneRegex.test(phone);
};

export const isValidCardNumber = (number) => {
  const cleaned = number.replace(/\D/g, '');
  if (cleaned.length < 13 || cleaned.length > 19) return false;
  // Luhn algorithm
  let sum = 0;
  let isEven = false;
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    isEven = !isEven;
  }
  return sum % 10 === 0;
};

export const isValidExpiry = (expiry) => {
  const match = expiry.match(/^(\d{2})\/(\d{2})$/);
  if (!match) return false;
  const month = parseInt(match[1], 10);
  const year = parseInt('20' + match[2], 10);
  if (month < 1 || month > 12) return false;
  const now = new Date();
  const expiryDate = new Date(year, month, 0);
  return expiryDate > now;
};

export const isValidCVV = (cvv) => {
  return /^\d{3,4}$/.test(cvv);
};

export const isValidUPI = (upiId) => {
  return /^[a-zA-Z0-9._-]+@[a-zA-Z]{2,}$/.test(upiId);
};

export const getCardType = (number) => {
  const cleaned = number.replace(/\D/g, '');
  if (/^4/.test(cleaned)) return 'visa';
  if (/^5[1-5]/.test(cleaned)) return 'mastercard';
  if (/^3[47]/.test(cleaned)) return 'amex';
  if (/^6(?:011|5)/.test(cleaned)) return 'discover';
  if (/^(?:2131|1800|35)/.test(cleaned)) return 'jcb';
  return 'unknown';
};
