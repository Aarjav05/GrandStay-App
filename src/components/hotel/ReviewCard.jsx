import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Avatar from '../common/Avatar';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { FONT_SIZES, SPACING, BORDER_RADIUS } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';

const ReviewCard = ({ review, style }) => {
  const { colors } = useTheme();

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Ionicons
        key={i}
        name={i < rating ? 'star' : 'star-outline'}
        size={14}
        color={colors.star}
      />
    ));
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.borderLight }, style]}>
      <View style={styles.header}>
        <Avatar uri={review.userAvatar} name={review.userName} size={40} />
        <View style={styles.headerInfo}>
          <Text style={[styles.name, { color: colors.text }]}>{review.userName}</Text>
          <Text style={[styles.date, { color: colors.textTertiary }]}>
            {formatDate(review.createdAt?.toDate?.() || review.createdAt)}
          </Text>
        </View>
        <View style={styles.stars}>{renderStars(review.rating)}</View>
      </View>
      {review.comment && (
        <Text style={[styles.comment, { color: colors.textSecondary }]}>
          {review.comment}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    marginBottom: SPACING.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
    marginLeft: SPACING.sm,
  },
  name: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  date: {
    fontSize: FONT_SIZES.xs,
  },
  stars: {
    flexDirection: 'row',
  },
  comment: {
    fontSize: FONT_SIZES.sm,
    lineHeight: 20,
    marginTop: SPACING.sm,
  },
});

export default ReviewCard;
