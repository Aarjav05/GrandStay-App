import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { BORDER_RADIUS, SPACING, FONT_SIZES, SHADOWS } from '../../utils/constants';
import { formatDate, formatDuration } from '../../utils/formatters';

const BookingSummaryCard = ({ booking, style }) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.borderLight }, style]}>
      <View style={styles.row}>
        <Image
          source={{ uri: booking.hotelImage || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200' }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.info}>
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>{booking.hotelName}</Text>
          <Text style={[styles.room, { color: colors.textSecondary }]}>{booking.roomType}</Text>
          <Text style={[styles.dates, { color: colors.textSecondary }]}>
            {formatDate(booking.checkIn, 'dd MMM')} → {formatDate(booking.checkOut, 'dd MMM yyyy')}
          </Text>
          <Text style={[styles.details, { color: colors.textTertiary }]}>
            {formatDuration(booking.nights)} · {booking.guests?.adults || 1} adult{(booking.guests?.adults || 1) > 1 ? 's' : ''}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, borderWidth: 1, ...SHADOWS.sm },
  row: { flexDirection: 'row' },
  image: { width: 80, height: 80, borderRadius: BORDER_RADIUS.md },
  info: { flex: 1, marginLeft: SPACING.md, justifyContent: 'center' },
  name: { fontSize: FONT_SIZES.lg, fontWeight: '700', marginBottom: 2 },
  room: { fontSize: FONT_SIZES.sm, marginBottom: 2 },
  dates: { fontSize: FONT_SIZES.sm, marginBottom: 2 },
  details: { fontSize: FONT_SIZES.xs },
});

export default BookingSummaryCard;
