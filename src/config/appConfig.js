export const APP_CONFIG = {
  APP_NAME: 'GrandStay',
  APP_VERSION: '1.0.0',
  DEFAULT_CITY: {
    name: 'Mumbai',
    latitude: 19.076,
    longitude: 72.8777,
  },
  DEFAULT_RADIUS_KM: 10,
  ITEMS_PER_PAGE: 20,
  SEARCH_DEBOUNCE_MS: 300,
  MAP_DEBOUNCE_MS: 600,
  PAYMENT_DELAY_MS: 1500,
  TAX_RATE: 0.18,
  MIN_PASSWORD_LENGTH: 8,
  MAX_AVATAR_SIZE_MB: 2,
  PROMO_CODES: {
    SAVE10: { discount: 0.10, label: '10% OFF' },
    SAVE20: { discount: 0.20, label: '20% OFF' },
    WELCOME: { discount: 0.15, label: '15% OFF' },
  },
  CURRENCIES: {
    INR: { symbol: '₹', code: 'INR', rate: 1 },
    USD: { symbol: '$', code: 'USD', rate: 0.012 },
    EUR: { symbol: '€', code: 'EUR', rate: 0.011 },
    GBP: { symbol: '£', code: 'GBP', rate: 0.0095 },
  },
  LANGUAGES: ['English', 'Hindi', 'Spanish'],
};

export default APP_CONFIG;
