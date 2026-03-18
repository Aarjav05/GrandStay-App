import React, { useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { BORDER_RADIUS, FONT_SIZES, SPACING, SHADOWS } from '../../utils/constants';
import { formatPrice, formatRating } from '../../utils/formatters';

const { width } = Dimensions.get('window');

const HotelCard = ({ hotel, onPress, onWishlistToggle, isWishlisted = false, style }) => {
  const { colors } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleWishlistPress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.4, duration: 100, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 3, tension: 40, useNativeDriver: true })
    ]).start();
    onWishlistToggle?.(hotel);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => onPress?.(hotel)}
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.borderLight }, style]}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: hotel.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400' }}
          style={styles.image}
          resizeMode="cover"
        />
        <TouchableOpacity
          style={styles.heartButton}
          onPress={handleWishlistPress}
        >
          <View style={styles.heartBg}>
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <Ionicons
                name={isWishlisted ? 'heart' : 'heart-outline'}
                size={20}
                color={isWishlisted ? '#EF5350' : '#fff'}
              />
            </Animated.View>
          </View>
        </TouchableOpacity>
        {hotel.featured && (
          <View style={[styles.featuredBadge, { backgroundColor: colors.accent }]}>
            <Text style={styles.featuredText}>Featured</Text>
          </View>
        )}
        {hotel.distance !== undefined && (
          <View style={[styles.distanceBadge, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
            <Ionicons name="location" size={12} color="#fff" />
            <Text style={styles.distanceText}>{hotel.distance} km</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
          {hotel.name}
        </Text>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
          <Text style={[styles.city, { color: colors.textSecondary }]} numberOfLines={1}>
            {hotel.city}
          </Text>
        </View>
        <View style={styles.bottomRow}>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={14} color={colors.star} />
            <Text style={[styles.rating, { color: colors.text }]}>
              {formatRating(hotel.rating)}
            </Text>
            <Text style={[styles.reviews, { color: colors.textTertiary }]}>
              ({hotel.reviewCount || 0})
            </Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={[styles.price, { color: colors.primary }]}>
              {formatPrice(hotel.price)}
            </Text>
            <Text style={[styles.perNight, { color: colors.textTertiary }]}>/night</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: SPACING.lg,
    ...SHADOWS.md,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 180,
  },
  heartButton: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
  },
  heartBg: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    padding: 6,
  },
  featuredBadge: {
    position: 'absolute',
    top: SPACING.sm,
    left: SPACING.sm,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
  },
  featuredText: {
    color: '#fff',
    fontSize: FONT_SIZES.xs,
    fontFamily: 'Inter_700Bold',
  },
  distanceBadge: {
    position: 'absolute',
    bottom: SPACING.sm,
    right: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BORDER_RADIUS.sm,
  },
  distanceText: {
    color: '#fff',
    fontSize: FONT_SIZES.xs,
    fontFamily: 'Inter_600SemiBold',
    marginLeft: 3,
  },
  content: {
    padding: SPACING.md,
  },
  name: {
    fontSize: FONT_SIZES.lg,
    fontFamily: 'Inter_700Bold',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  city: {
    fontSize: FONT_SIZES.sm,
    marginLeft: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: FONT_SIZES.sm,
    fontFamily: 'Inter_600SemiBold',
    marginLeft: 4,
  },
  reviews: {
    fontSize: FONT_SIZES.xs,
    marginLeft: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: FONT_SIZES.xl,
    fontFamily: 'Inter_800ExtraBold',
  },
  perNight: {
    fontSize: FONT_SIZES.xs,
  },
});

export default HotelCard;
