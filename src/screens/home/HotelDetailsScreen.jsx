import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Share, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { useWishlist } from '../../hooks/useWishlist';
import { useReviews } from '../../hooks/useReviews';
import { useTranslation } from 'react-i18next';
import * as hotelService from '../../services/hotelService';
import ImageCarousel from '../../components/hotel/ImageCarousel';
import AmenitiesGrid from '../../components/hotel/AmenitiesGrid';
import ReviewCard from '../../components/hotel/ReviewCard';
import RatingBreakdown from '../../components/hotel/RatingBreakdown';
import Loader from '../../components/common/Loader';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { showToast } from '../../components/common/Toast';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '../../utils/constants';
import { formatPrice, formatRating } from '../../utils/formatters';

const HotelDetailsScreen = ({ navigation, route }) => {
  const { hotelId } = route.params;
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { reviews, loadReviews, addReview } = useReviews(hotelId);
  const { t } = useTranslation();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [descExpanded, setDescExpanded] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

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
      await Share.share({ message: `Check out ${hotel?.name} on अतिथि! 🏨` });
    } catch {}
  };

  const handleSubmitReview = async () => {
    if (!reviewText.trim()) {
      showToast?.('Please write a review', 'warning');
      return;
    }
    setSubmittingReview(true);
    try {
      await addReview(user?.uid, user?.name || t('common.traveler'), reviewRating, reviewText.trim());
      showToast?.('Review submitted!', 'success');
      setShowReviewForm(false);
      setReviewText('');
      setReviewRating(5);
      // Reload hotel to get updated rating
      loadHotel();
    } catch (e) {
      showToast?.(e.message || 'Failed to submit review', 'error');
    } finally {
      setSubmittingReview(false);
    }
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
              · {hotel.reviewCount || 0} {t('details.reviews').toLowerCase()}
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
              <Text style={[styles.actionLabel, { color: colors.text }]}>{t('common.save')}</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('details.amenities')}</Text>
          <AmenitiesGrid amenities={hotel.amenities || []} />

          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('details.description')}</Text>
          <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={descExpanded ? undefined : 3}>
            {hotel.description || 'A wonderful hotel experience awaits you.'}
          </Text>
          {hotel.description?.length > 120 && (
            <TouchableOpacity onPress={() => setDescExpanded(!descExpanded)}>
              <Text style={[styles.readMore, { color: colors.primary }]}>
                {descExpanded ? t('details.readLess') : t('details.readMore')}
              </Text>
            </TouchableOpacity>
          )}

          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('details.reviews')}</Text>

          {reviews.length > 0 && (
            <>
              <RatingBreakdown reviews={reviews} totalRating={hotel.rating} reviewCount={hotel.reviewCount} />
              {reviews.slice(0, 3).map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </>
          )}

          {!showReviewForm ? (
            <Button
              title="✍️ Write a Review"
              variant="secondary"
              onPress={() => setShowReviewForm(true)}
              style={{ marginTop: SPACING.md }}
            />
          ) : (
            <View style={[styles.reviewForm, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
              <Text style={[styles.reviewFormTitle, { color: colors.text }]}>Your Rating</Text>
              <View style={styles.starRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity key={star} onPress={() => setReviewRating(star)}>
                    <Ionicons
                      name={star <= reviewRating ? 'star' : 'star-outline'}
                      size={32}
                      color={colors.star}
                      style={{ marginHorizontal: 4 }}
                    />
                  </TouchableOpacity>
                ))}
              </View>
              <TextInput
                style={[styles.reviewInput, { color: colors.text, backgroundColor: colors.card, borderColor: colors.border }]}
                placeholder="Share your experience..."
                placeholderTextColor={colors.textTertiary}
                value={reviewText}
                onChangeText={setReviewText}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
              <View style={styles.reviewActions}>
                <Button title={t('common.cancel')} variant="ghost" onPress={() => setShowReviewForm(false)} fullWidth={false} />
                <Button title="Submit Review" onPress={handleSubmitReview} loading={submittingReview} fullWidth={false} />
              </View>
            </View>
          )}

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, { backgroundColor: colors.card, borderColor: colors.border, paddingBottom: Math.max(insets.bottom, SPACING.md) }]}>
        <View>
          <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>From</Text>
          <Text style={[styles.price, { color: colors.primary }]}>
            {formatPrice(hotel.price)}
            <Text style={[styles.perNight, { color: colors.textTertiary }]}>{t('common.perNight')}</Text>
          </Text>
        </View>
        <Button
          title={t('details.checkAvailability')}
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
  name: { fontSize: FONT_SIZES.xxl, fontFamily: 'Inter_800ExtraBold', marginBottom: 6 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  address: { fontSize: FONT_SIZES.sm, marginLeft: 4, flex: 1 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.lg },
  ratingText: { fontSize: FONT_SIZES.md, fontFamily: 'Inter_700Bold', marginLeft: 4 },
  reviewCount: { fontSize: FONT_SIZES.sm, marginLeft: 4 },
  actionRow: { flexDirection: 'row', marginBottom: SPACING.xl },
  actionBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: BORDER_RADIUS.md, marginRight: 12 },
  actionLabel: { fontSize: FONT_SIZES.sm, fontFamily: 'Inter_500Medium', marginLeft: 6 },
  sectionTitle: { fontSize: FONT_SIZES.xl, fontFamily: 'Inter_700Bold', marginTop: SPACING.xl, marginBottom: SPACING.md },
  description: { fontSize: FONT_SIZES.md, lineHeight: 22 },
  readMore: { fontSize: FONT_SIZES.sm, fontFamily: 'Inter_600SemiBold', marginTop: 6 },
  reviewForm: {
    marginTop: SPACING.md,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
  },
  reviewFormTitle: {
    fontSize: FONT_SIZES.md,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: SPACING.sm,
  },
  starRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  reviewInput: {
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: FONT_SIZES.md,
    minHeight: 100,
    marginBottom: SPACING.md,
  },
  reviewActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md,
    borderTopWidth: 1,
  },
  priceLabel: { fontSize: FONT_SIZES.xs },
  price: { fontSize: FONT_SIZES.xxl, fontFamily: 'Inter_800ExtraBold' },
  perNight: { fontSize: FONT_SIZES.sm, fontFamily: 'Inter_400Regular' },
  checkBtn: { paddingHorizontal: 24 },
});

export default HotelDetailsScreen;
