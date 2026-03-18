import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { useBooking } from '../../hooks/useBooking';
import { showToast } from '../../components/common/Toast';
import ProgressSteps from '../../components/common/ProgressSteps';
import BookingSummaryCard from '../../components/booking/BookingSummaryCard';
import PriceBreakdown from '../../components/booking/PriceBreakdown';
import PromoCodeInput from '../../components/booking/PromoCodeInput';
import CancellationPolicy from '../../components/booking/CancellationPolicy';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { SPACING } from '../../utils/constants';
import { applyPromoCode } from '../../services/bookingService';
import { useTranslation } from 'react-i18next';

const BookingScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { draft, setDraftField, updatePrice } = useBooking();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!draft.guestName && user?.name) setDraftField('guestName', user.name);
    if (!draft.guestPhone && user?.phone) setDraftField('guestPhone', user.phone);
    updatePrice();
  }, []);

  const handlePromo = async (code) => {
    try {
      applyPromoCode(draft.priceBreakdown?.subtotal || 0, code);
      setDraftField('promoCode', code);
      updatePrice(code);
      showToast?.('Promo code applied!', 'success');
    } catch {
      showToast?.('Invalid or expired promo code', 'error');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <ProgressSteps currentStep={1} steps={[t('booking.review'), t('booking.payment'), t('booking.confirmed')]} />

        <BookingSummaryCard booking={draft} style={styles.card} />

        <Input label={t('booking.guestName')} value={draft.guestName} onChangeText={(t2) => setDraftField('guestName', t2)} placeholder="Full name" autoCapitalize="words" />
        <Input label={t('booking.phone')} value={draft.guestPhone} onChangeText={(t2) => setDraftField('guestPhone', t2)} placeholder="+91 9876543210" keyboardType="phone-pad" />
        <Input label={t('booking.specialRequests')} value={draft.specialRequests} onChangeText={(t2) => setDraftField('specialRequests', t2)} placeholder="Any special requirements?" multiline numberOfLines={3} />

        <PromoCodeInput onApply={handlePromo} appliedCode={draft.promoCode} style={styles.card} />

        <PriceBreakdown breakdown={draft.priceBreakdown} style={styles.card} />

        <CancellationPolicy style={styles.card} />

        <Button title={t('booking.proceedPayment')} onPress={() => navigation.navigate('Payment')} icon="lock-closed" iconPosition="left" style={styles.cta} />

        <View style={{ height: 40 + insets.bottom }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: SPACING.lg },
  card: { marginBottom: SPACING.lg },
  cta: { marginTop: SPACING.lg },
});

export default BookingScreen;
