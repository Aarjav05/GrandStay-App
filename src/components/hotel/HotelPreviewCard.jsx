import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { BORDER_RADIUS, FONT_SIZES, SPACING, SHADOWS } from '../../utils/constants';
import { formatPrice, formatRating } from '../../utils/formatters';

const HotelPreviewCard = ({ hotel, onViewDetails, style }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.card }, style]}>
      <Image
        source={{ uri: hotel?.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300' }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
          {hotel?.name}
        </Text>
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={14} color={colors.star} />
          <Text style={[styles.ratingText, { color: colors.text }]}>
            {formatRating(hotel?.rating)} · {hotel?.reviewCount} reviews
          </Text>
        </View>
        <View style={styles.bottomRow}>
          <Text style={[styles.price, { color: colors.primary }]}>
            {formatPrice(hotel?.price)}/night
          </Text>
          <TouchableOpacity
            onPress={() => onViewDetails?.(hotel)}
            style={[styles.viewBtn, { backgroundColor: colors.primary }]}
          >
            <Text style={styles.viewBtnText}>View Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.md,
  },
  image: {
    width: 100,
    height: 100,
  },
  content: {
    flex: 1,
    padding: SPACING.sm,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: FONT_SIZES.xs,
    marginLeft: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
  },
  viewBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BORDER_RADIUS.sm,
  },
  viewBtnText: {
    color: '#fff',
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
  },
});

export default HotelPreviewCard;
