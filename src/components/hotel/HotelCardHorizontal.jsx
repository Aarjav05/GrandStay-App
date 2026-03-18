import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { BORDER_RADIUS, FONT_SIZES, SPACING, SHADOWS } from '../../utils/constants';
import { formatPrice, formatRating } from '../../utils/formatters';

const HotelCardHorizontal = ({ hotel, onPress, style }) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => onPress?.(hotel)}
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.borderLight }, style]}
    >
      <Image
        source={{ uri: hotel.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300' }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
          {hotel.name}
        </Text>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={12} color={colors.textSecondary} />
          <Text style={[styles.city, { color: colors.textSecondary }]} numberOfLines={1}>
            {hotel.city}
          </Text>
        </View>
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={12} color={colors.star} />
          <Text style={[styles.rating, { color: colors.text }]}>
            {formatRating(hotel.rating)}
          </Text>
        </View>
        <Text style={[styles.price, { color: colors.primary }]}>
          {formatPrice(hotel.price)}
          <Text style={[styles.perNight, { color: colors.textTertiary }]}>/night</Text>
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 260,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    overflow: 'hidden',
    marginRight: SPACING.md,
    ...SHADOWS.sm,
  },
  image: {
    width: '100%',
    height: 140,
  },
  content: {
    padding: SPACING.sm,
  },
  name: {
    fontSize: FONT_SIZES.md,
    fontFamily: 'Inter_700Bold',
    marginBottom: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  city: {
    fontSize: FONT_SIZES.xs,
    marginLeft: 3,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rating: {
    fontSize: FONT_SIZES.xs,
    fontFamily: 'Inter_600SemiBold',
    marginLeft: 3,
  },
  price: {
    fontSize: FONT_SIZES.lg,
    fontFamily: 'Inter_800ExtraBold',
  },
  perNight: {
    fontSize: FONT_SIZES.xs,
    fontFamily: 'Inter_400Regular',
  },
});

export default HotelCardHorizontal;
