import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Alert, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import * as bookingService from '../../services/bookingService';
import Loader from '../../components/common/Loader';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Divider from '../../components/common/Divider';
import PriceBreakdown from '../../components/booking/PriceBreakdown';
import { showToast } from '../../components/common/Toast';
import { SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../../utils/constants';
import { formatDate, formatDuration, formatPrice } from '../../utils/formatters';

const BookingDetailsScreen = ({ navigation, route }) => {
  const { bookingId } = route.params;
  const { colors } = useTheme();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    loadBooking();
  }, [bookingId]);

  const loadBooking = async () => {
    try {
      const data = await bookingService.getBookingById(bookingId);
      setBooking(data);
    } catch (e) {
      showToast?.('Failed to load booking', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking? Cancellation policy applies.',
      [
        { text: 'Keep Booking', style: 'cancel' },
        {
          text: 'Cancel Booking',
          style: 'destructive',
          onPress: async () => {
            setCancelling(true);
            try {
              await bookingService.cancelBooking(bookingId);
              showToast?.('Booking cancelled successfully', 'success');
              setBooking((prev) => ({ ...prev, status: 'cancelled' }));
            } catch (e) {
              showToast?.(e.message || 'Failed to cancel', 'error');
            } finally {
              setCancelling(false);
            }
          },
        },
      ]
    );
  };

  if (loading || !booking) return <Loader fullScreen />;

  const statusMap = {
    confirmed: { label: 'Confirmed', variant: 'info' },
    completed: { label: 'Completed', variant: 'success' },
    cancelled: { label: 'Cancelled', variant: 'error' },
    pending: { label: 'Pending', variant: 'warning' },
  };
  const status = statusMap[booking.status] || { label: booking.status, variant: 'default' };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Image
          source={{ uri: booking.hotelImage || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600' }}
          style={styles.heroImage}
          resizeMode="cover"
        />

        <View style={styles.headerRow}>
          <Text style={[styles.hotelName, { color: colors.text }]}>{booking.hotelName}</Text>
          <Badge label={status.label} variant={status.variant} />
        </View>

        {booking.bookingRef && (
          <Text style={[styles.ref, { color: colors.textTertiary }]}>Ref: {booking.bookingRef}</Text>
        )}

        <View style={[styles.detailCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
          <DetailRow icon="calendar" label="Check-in" value={formatDate(booking.checkIn)} colors={colors} />
          <DetailRow icon="calendar-outline" label="Check-out" value={formatDate(booking.checkOut)} colors={colors} />
          <DetailRow icon="moon" label="Duration" value={formatDuration(booking.nights)} colors={colors} />
          <DetailRow icon="bed" label="Room" value={booking.roomType} colors={colors} />
          <DetailRow icon="people" label="Guests" value={`${booking.guests?.adults || 1} adult(s), ${booking.guests?.children || 0} child(ren)`} colors={colors} />
          {booking.guestName && <DetailRow icon="person" label="Guest" value={booking.guestName} colors={colors} />}
          {booking.specialRequests && <DetailRow icon="chatbox" label="Requests" value={booking.specialRequests} colors={colors} />}
        </View>

        <PriceBreakdown breakdown={booking.priceBreakdown} style={styles.section} />

        {booking.status === 'confirmed' && (
          <Button
            title="Cancel Booking"
            onPress={handleCancel}
            variant="danger"
            loading={cancelling}
            icon="close-circle"
            style={styles.cancelBtn}
          />
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const DetailRow = ({ icon, label, value, colors }) => (
  <View style={detailStyles.row}>
    <Ionicons name={icon} size={18} color={colors.primary} style={detailStyles.icon} />
    <View style={detailStyles.info}>
      <Text style={[detailStyles.label, { color: colors.textTertiary }]}>{label}</Text>
      <Text style={[detailStyles.value, { color: colors.text }]}>{value}</Text>
    </View>
  </View>
);

const detailStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  icon: { marginRight: 12 },
  info: { flex: 1 },
  label: { fontSize: 12 },
  value: { fontSize: 14, fontWeight: '500', marginTop: 2 },
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: SPACING.lg },
  heroImage: { width: '100%', height: 200, borderRadius: BORDER_RADIUS.lg, marginBottom: SPACING.lg },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  hotelName: { fontSize: FONT_SIZES.xxl, fontWeight: '800', flex: 1, marginRight: 8 },
  ref: { fontSize: FONT_SIZES.sm, marginBottom: SPACING.lg, fontFamily: 'monospace' },
  detailCard: { borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, marginBottom: SPACING.lg },
  section: { marginBottom: SPACING.lg },
  cancelBtn: { marginTop: SPACING.lg },
});

export default BookingDetailsScreen;
