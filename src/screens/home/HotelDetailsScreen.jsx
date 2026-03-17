import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import { useWishlist } from '../../hooks/useWishlist';
import { useReviews } from '../../hooks/useReviews';
import * as hotelService from '../../services/hotelService';
import ImageCarousel from '../../components/hotel/ImageCarousel';
import AmenitiesGrid from '../../components/hotel/AmenitiesGrid';
import ReviewCard from '../../components/hotel/ReviewCard';
import RatingBreakdown from '../../components/hotel/RatingBreakdown';
import Loader from '../../components/common/Loader';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '../../utils/constants';
import { formatPrice, formatRating } from '../../utils/formatters';

const HotelDetailsScreen = ({ navigation, route }) => {
  const { hotelId } = route.params;
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { reviews, loadReviews } = useReviews(hotelId);
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [descExpanded, setDescExpanded] = useState(false);

  useEffect(() => {
    loadHotel();
    loadReviews();
  }, [hotelId]);

  const loadHotel = async () => {
    try {
      const data = await hotelService.fetchHotelById(hotelId);
      setHotel(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({ message: `Check out ${hotel?.name} on GrandStay! 🏨` });
    } catch {}
  };

  if (loading || !hotel) return <Loader fullScreen />;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ImageCarousel images={hotel.images} height={280} />

        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={[styles.name, { color: colors.text }]}>{hotel.name}</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location" size={16} color={colors.textSecondary} />
            <Text style={[styles.address, { color: colors.textSecondary }]}>{hotel.address || hotel.city}</Text>
          </View>

          <View style={styles.ratingRow}>
            <Ionicons name="star" size={16} color={colors.star} />
            <Text style={[styles.ratingText, { color: colors.text }]}>
              {formatRating(hotel.rating)}
            </Text>
            <Text style={[styles.reviewCount, { color: colors.textTertiary }]}>
              · {hotel.reviewCount || 0} reviews
            </Text>
            {hotel.distance && (
              <Badge label={`${hotel.distance} km away`} variant="info" style={{ marginLeft: 8 }} />
            )}
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity onPress={handleShare} style={[styles.actionBtn, { backgroundColor: colors.surface }]}>
              <Ionicons name="share-outline" size={20} color={colors.text} />
              <Text style={[styles.actionLabel, { color: colors.text }]}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => toggleWishlist(hotel)} style={[styles.actionBtn, { backgroundColor: colors.surface }]}>
              <Ionicons name={isInWishlist(hotel.id) ? 'heart' : 'heart-outline'} size={20} color={isInWishlist(hotel.id) ? '#EF5350' : colors.text} />
              <Text style={[styles.actionLabel, { color: colors.text }]}>Save</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>Amenities</Text>
          <AmenitiesGrid amenities={hotel.amenities || []} />

          <Text style={[styles.sectionTitle, { color: colors.text }]}>About</Text>
          <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={descExpanded ? undefined : 3}>
            {hotel.description || 'A wonderful hotel experience awaits you.'}
          </Text>
          {hotel.description?.length > 120 && (
            <TouchableOpacity onPress={() => setDescExpanded(!descExpanded)}>
              <Text style={[styles.readMore, { color: colors.primary }]}>
                {descExpanded ? 'Show less' : 'Read more'}
              </Text>
            </TouchableOpacity>
          )}

          {reviews.length > 0 && (
            <>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Guest Reviews</Text>
              <RatingBreakdown reviews={reviews} totalRating={hotel.rating} reviewCount={hotel.reviewCount} />
              {reviews.slice(0, 3).map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </>
          )}

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, { backgroundColor: colors.card, borderColor: colors.border, paddingBottom: Math.max(insets.bottom, SPACING.md) }]}>
        <View>
          <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>From</Text>
          <Text style={[styles.price, { color: colors.primary }]}>
            {formatPrice(hotel.price)}
            <Text style={[styles.perNight, { color: colors.textTertiary }]}>/night</Text>
          </Text>
        </View>
        <Button
          title="Check Availability"
          onPress={() => navigation.navigate('RoomSelection', { hotelId: hotel.id })}
          fullWidth={false}
          style={styles.checkBtn}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  backBtn: { position: 'absolute', top: 50, left: 16, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 20, padding: 8, zIndex: 10 },
  content: { padding: SPACING.lg },
  name: { fontSize: FONT_SIZES.xxl, fontWeight: '800', marginBottom: 6 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  address: { fontSize: FONT_SIZES.sm, marginLeft: 4, flex: 1 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.lg },
  ratingText: { fontSize: FONT_SIZES.md, fontWeight: '700', marginLeft: 4 },
  reviewCount: { fontSize: FONT_SIZES.sm, marginLeft: 4 },
  actionRow: { flexDirection: 'row', marginBottom: SPACING.xl },
  actionBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: BORDER_RADIUS.md, marginRight: 12 },
  actionLabel: { fontSize: FONT_SIZES.sm, fontWeight: '500', marginLeft: 6 },
  sectionTitle: { fontSize: FONT_SIZES.xl, fontWeight: '700', marginTop: SPACING.xl, marginBottom: SPACING.md },
  description: { fontSize: FONT_SIZES.md, lineHeight: 22 },
  readMore: { fontSize: FONT_SIZES.sm, fontWeight: '600', marginTop: 6 },
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md,
    borderTopWidth: 1,
  },
  priceLabel: { fontSize: FONT_SIZES.xs },
  price: { fontSize: FONT_SIZES.xxl, fontWeight: '800' },
  perNight: { fontSize: FONT_SIZES.sm, fontWeight: '400' },
  checkBtn: { paddingHorizontal: 24 },
});

export default HotelDetailsScreen;
