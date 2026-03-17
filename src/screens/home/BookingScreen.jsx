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

const BookingScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { draft, setDraftField, updatePrice } = useBooking();
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
        <ProgressSteps currentStep={1} />

        <BookingSummaryCard booking={draft} style={styles.card} />

        <Input label="Guest Name" value={draft.guestName} onChangeText={(t) => setDraftField('guestName', t)} placeholder="Full name" autoCapitalize="words" />
        <Input label="Phone Number" value={draft.guestPhone} onChangeText={(t) => setDraftField('guestPhone', t)} placeholder="+91 9876543210" keyboardType="phone-pad" />
        <Input label="Special Requests (Optional)" value={draft.specialRequests} onChangeText={(t) => setDraftField('specialRequests', t)} placeholder="Any special requirements?" multiline numberOfLines={3} />

        <PromoCodeInput onApply={handlePromo} appliedCode={draft.promoCode} style={styles.card} />

        <PriceBreakdown breakdown={draft.priceBreakdown} style={styles.card} />

        <CancellationPolicy style={styles.card} />

        <Button title="Proceed to Payment" onPress={() => navigation.navigate('Payment')} icon="lock-closed" iconPosition="left" style={styles.cta} />

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
