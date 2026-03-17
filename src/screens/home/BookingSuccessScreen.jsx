import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useBooking } from '../../hooks/useBooking';
import ProgressSteps from '../../components/common/ProgressSteps';
import Button from '../../components/common/Button';
import { SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../../utils/constants';
import { formatDate, formatPrice } from '../../utils/formatters';
import * as Clipboard from 'expo-clipboard';
import { CommonActions } from '@react-navigation/native';

const BookingSuccessScreen = ({ navigation, route }) => {
  const { bookingRef, bookingId } = route.params || {};
  const { colors } = useTheme();
  const { draft, clearDraft } = useBooking();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 5, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();

    return () => clearDraft();
  }, []);

  const copyBookingRef = async () => {
    try {
      await Clipboard.setStringAsync(bookingRef || 'GS-XXXXXX');
    } catch {}
  };

  const goHome = () => {
    navigation.dispatch(
      CommonActions.reset({ index: 0, routes: [{ name: 'Home' }] })
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ProgressSteps currentStep={3} />

      <Animated.View style={[styles.checkContainer, { transform: [{ scale: scaleAnim }] }]}>
        <View style={[styles.checkCircle, { backgroundColor: colors.success }]}>
          <Ionicons name="checkmark" size={48} color="#fff" />
        </View>
      </Animated.View>

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Text style={[styles.title, { color: colors.text }]}>Booking Confirmed! 🎉</Text>

        <View style={styles.refRow}>
          <Text style={[styles.refLabel, { color: colors.textSecondary }]}>Booking ID</Text>
          <TouchableOpacity onPress={copyBookingRef} style={styles.refValueRow}>
            <Text style={[styles.refValue, { color: colors.text }]}>{bookingRef || 'GS-XXXXXX'}</Text>
            <Ionicons name="copy-outline" size={16} color={colors.primary} style={{ marginLeft: 6 }} />
          </TouchableOpacity>
        </View>

        <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Hotel</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>{draft.hotelName}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Room</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>{draft.roomType}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Check-in</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>{formatDate(draft.checkIn)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Check-out</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>{formatDate(draft.checkOut)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Total Paid</Text>
            <Text style={[styles.summaryValue, { color: colors.primary, fontWeight: '700' }]}>
              {formatPrice(draft.priceBreakdown?.total || 0)}
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          <Button
            title="View My Bookings"
            onPress={() => navigation.navigate('BookingsTab')}
            variant="secondary"
            style={styles.actionBtn}
          />
          <Button
            title="Back to Home"
            onPress={goHome}
            style={styles.actionBtn}
          />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: SPACING.lg },
  checkContainer: { alignItems: 'center', marginTop: SPACING.xxl },
  checkCircle: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center' },
  content: { alignItems: 'center', marginTop: SPACING.xl },
  title: { fontSize: FONT_SIZES.xxl, fontWeight: '800', marginBottom: SPACING.xl },
  refRow: { alignItems: 'center', marginBottom: SPACING.xl },
  refLabel: { fontSize: FONT_SIZES.sm, marginBottom: 4 },
  refValueRow: { flexDirection: 'row', alignItems: 'center' },
  refValue: { fontSize: FONT_SIZES.xl, fontWeight: '700', fontFamily: 'monospace' },
  summaryCard: { width: '100%', borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, marginBottom: SPACING.xl },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.sm },
  summaryLabel: { fontSize: FONT_SIZES.sm },
  summaryValue: { fontSize: FONT_SIZES.sm, fontWeight: '500' },
  actions: { width: '100%' },
  actionBtn: { marginBottom: SPACING.md },
});

export default BookingSuccessScreen;
