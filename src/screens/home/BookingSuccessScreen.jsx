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
import { useTranslation } from 'react-i18next';

const BookingSuccessScreen = ({ navigation, route }) => {
  const { bookingRef, bookingId } = route.params || {};
  const { colors } = useTheme();
  const { draft, clearDraft } = useBooking();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { t } = useTranslation();

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
      <ProgressSteps currentStep={3} steps={[t('booking.review'), t('booking.payment'), t('booking.confirmed')]} />

      <Animated.View style={[styles.checkContainer, { transform: [{ scale: scaleAnim }] }]}>
        <View style={[styles.checkCircle, { backgroundColor: colors.success }]}>
          <Ionicons name="checkmark" size={48} color="#fff" />
        </View>
      </Animated.View>

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Text style={[styles.title, { color: colors.text }]}>{t('booking.bookingConfirmed')}</Text>

        <View style={styles.refRow}>
          <Text style={[styles.refLabel, { color: colors.textSecondary }]}>{t('booking.bookingId')}</Text>
          <TouchableOpacity onPress={copyBookingRef} style={styles.refValueRow}>
            <Text style={[styles.refValue, { color: colors.text }]}>{bookingRef || 'GS-XXXXXX'}</Text>
            <Ionicons name="copy-outline" size={16} color={colors.primary} style={{ marginLeft: 6 }} />
          </TouchableOpacity>
        </View>

        <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>{t('booking.hotel')}</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>{draft.hotelName}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>{t('booking.room')}</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>{draft.roomType}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>{t('booking.checkIn')}</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>{formatDate(draft.checkIn)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>{t('booking.checkOut')}</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>{formatDate(draft.checkOut)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>{t('booking.totalPaid')}</Text>
            <Text style={[styles.summaryValue, { color: colors.primary, fontFamily: 'Inter_700Bold' }]}>
              {formatPrice(draft.priceBreakdown?.total || 0)}
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          <Button
            title={t('booking.viewBookings')}
            onPress={() => navigation.navigate('BookingsTab')}
            variant="secondary"
            style={styles.actionBtn}
          />
          <Button
            title={t('booking.backHome')}
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
  title: { fontSize: FONT_SIZES.xxl, fontFamily: 'Inter_800ExtraBold', marginBottom: SPACING.xl },
  refRow: { alignItems: 'center', marginBottom: SPACING.xl },
  refLabel: { fontSize: FONT_SIZES.sm, marginBottom: 4 },
  refValueRow: { flexDirection: 'row', alignItems: 'center' },
  refValue: { fontSize: FONT_SIZES.xl, fontFamily: 'Inter_700Bold', fontFamily: 'monospace' },
  summaryCard: { width: '100%', borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, marginBottom: SPACING.xl },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.sm },
  summaryLabel: { fontSize: FONT_SIZES.sm },
  summaryValue: { fontSize: FONT_SIZES.sm, fontFamily: 'Inter_500Medium' },
  actions: { width: '100%' },
  actionBtn: { marginBottom: SPACING.md },
});

export default BookingSuccessScreen;
