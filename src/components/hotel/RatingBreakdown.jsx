import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { FONT_SIZES, SPACING } from '../../utils/constants';

const RatingBreakdown = ({ reviews = [], totalRating = 0, reviewCount = 0, style }) => {
  const { colors } = useTheme();

  const breakdown = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    const percentage = reviewCount > 0 ? (count / reviewCount) * 100 : 0;
    return { star, count, percentage };
  });

  return (
    <View style={[styles.container, style]}>
      <View style={styles.overallRow}>
        <Text style={[styles.overallRating, { color: colors.text }]}>
          {totalRating?.toFixed(1) || '0.0'}
        </Text>
        <View style={styles.overallInfo}>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Ionicons
                key={i}
                name={i <= Math.round(totalRating) ? 'star' : 'star-outline'}
                size={16}
                color={colors.star}
              />
            ))}
          </View>
          <Text style={[styles.reviewCount, { color: colors.textSecondary }]}>
            Based on {reviewCount} reviews
          </Text>
        </View>
      </View>
      {breakdown.map(({ star, count, percentage }) => (
        <View key={star} style={styles.barRow}>
          <Text style={[styles.starLabel, { color: colors.textSecondary }]}>{star}</Text>
          <Ionicons name="star" size={12} color={colors.star} />
          <View style={[styles.barBg, { backgroundColor: colors.surface }]}>
            <View
              style={[
                styles.barFill,
                { width: `${percentage}%`, backgroundColor: colors.star },
              ]}
            />
          </View>
          <Text style={[styles.barCount, { color: colors.textTertiary }]}>{count}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  overallRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  overallRating: {
    fontSize: 42,
    fontWeight: '800',
    marginRight: SPACING.md,
  },
  overallInfo: {},
  starsRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  reviewCount: {
    fontSize: FONT_SIZES.sm,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  starLabel: {
    fontSize: FONT_SIZES.sm,
    width: 14,
    textAlign: 'center',
    marginRight: 4,
  },
  barBg: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    marginHorizontal: SPACING.sm,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
  barCount: {
    fontSize: FONT_SIZES.xs,
    width: 24,
    textAlign: 'right',
  },
});

export default RatingBreakdown;
