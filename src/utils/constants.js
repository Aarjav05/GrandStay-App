export const COLORS = {
  // Brand
  primary: '#1B5E20',
  primaryLight: '#4CAF50',
  primaryDark: '#0D3B13',
  accent: '#FF6F00',
  accentLight: '#FFB300',

  // Neutrals
  white: '#FFFFFF',
  black: '#000000',
  gray50: '#FAFAFA',
  gray100: '#F5F5F5',
  gray200: '#EEEEEE',
  gray300: '#E0E0E0',
  gray400: '#BDBDBD',
  gray500: '#9E9E9E',
  gray600: '#757575',
  gray700: '#616161',
  gray800: '#424242',
  gray900: '#212121',

  // Semantic
  success: '#2E7D32',
  error: '#D32F2F',
  warning: '#F57C00',
  info: '#1976D2',

  // Backgrounds
  background: '#FFFFFF',
  surface: '#F8F9FA',
  card: '#FFFFFF',
  overlay: 'rgba(0,0,0,0.5)',

  // Status
  statusUpcoming: '#2E7D32',
  statusCompleted: '#424242',
  statusCancelled: '#D32F2F',

  // Rating
  star: '#FFB300',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
};

export const FONT_SIZES = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 20,
  xxxl: 24,
  title: 28,
  hero: 32,
};

export const FONT_WEIGHTS = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
};

export const BORDER_RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 999,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 12,
  },
};

export const AMENITY_ICONS = {
  wifi: { icon: 'wifi', label: 'WiFi' },
  pool: { icon: 'water', label: 'Pool' },
  gym: { icon: 'fitness', label: 'Gym' },
  parking: { icon: 'car', label: 'Parking' },
  ac: { icon: 'snow', label: 'AC' },
  restaurant: { icon: 'restaurant', label: 'Restaurant' },
  spa: { icon: 'flower', label: 'Spa' },
  bar: { icon: 'wine', label: 'Bar' },
  laundry: { icon: 'shirt', label: 'Laundry' },
  roomService: { icon: 'bed', label: 'Room Service' },
};

export const CATEGORIES = [
  { id: 'all', label: 'All', icon: 'apps' },
  { id: 'luxury', label: 'Luxury', icon: 'diamond' },
  { id: 'budget', label: 'Budget', icon: 'wallet' },
  { id: 'beach', label: 'Beach', icon: 'umbrella' },
  { id: 'city', label: 'City', icon: 'business' },
  { id: 'resort', label: 'Resort', icon: 'sunny' },
];

export const PAYMENT_METHODS = [
  { id: 'card', label: 'Credit / Debit Card', icon: 'card', emoji: '💳' },
  { id: 'upi', label: 'UPI', icon: 'phone-portrait', emoji: '📱' },
  { id: 'netbanking', label: 'Net Banking', icon: 'business', emoji: '🏦' },
  { id: 'wallet', label: 'Wallet', icon: 'wallet', emoji: '👛' },
];
