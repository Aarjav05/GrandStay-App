import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { useBooking } from '../../hooks/useBooking';
import { showToast } from '../../components/common/Toast';
import ProgressSteps from '../../components/common/ProgressSteps';
import PaymentMethodCard from '../../components/booking/PaymentMethodCard';
import CardInputForm from '../../components/booking/CardInputForm';
import Button from '../../components/common/Button';
import { SPACING, FONT_SIZES, PAYMENT_METHODS } from '../../utils/constants';
import { formatPrice } from '../../utils/formatters';
import * as paymentService from '../../services/paymentService';
import * as bookingService from '../../services/bookingService';
import { useTranslation } from 'react-i18next';

const PaymentScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { draft, setDraftField, calculateTotal } = useBooking();
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [cardDetails, setCardDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const total = calculateTotal();

  const handlePayment = async () => {
    if (!selectedMethod) {
      showToast?.('Please select a payment method', 'warning');
      return;
    }

    setLoading(true);
    try {
      const result = await paymentService.processPayment(total, selectedMethod.id, cardDetails);

      if (result.success) {
        setDraftField('paymentMethod', selectedMethod.id);
        setDraftField('transactionId', result.transactionId);

        // Create booking in Firestore
        const bookingResult = await bookingService.createBooking({
          userId: user.uid,
          hotelId: draft.hotelId,
          roomId: draft.roomId,
          hotelName: draft.hotelName,
          hotelImage: draft.hotelImage,
          roomType: draft.roomType,
          checkIn: draft.checkIn,
          checkOut: draft.checkOut,
          nights: draft.nights,
          guests: draft.guests,
          guestName: draft.guestName,
          guestPhone: draft.guestPhone,
          specialRequests: draft.specialRequests,
          promoCode: draft.promoCode,
          priceBreakdown: draft.priceBreakdown,
          totalPrice: total,
          paymentMethod: selectedMethod.id,
          transactionId: result.transactionId,
        });

        navigation.navigate('BookingSuccess', {
          bookingRef: bookingResult.bookingRef,
          bookingId: bookingResult.id,
        });
      }
    } catch (error) {
      showToast?.(error.message || 'Payment failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <ProgressSteps currentStep={2} steps={[t('booking.review'), t('booking.payment'), t('booking.confirmed')]} />

        <Text style={[styles.amountLabel, { color: colors.textSecondary }]}>{t('booking.amountDue')}</Text>
        <Text style={[styles.amount, { color: colors.text }]}>{formatPrice(total)}</Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('booking.paymentMethod')}</Text>
        {PAYMENT_METHODS.map((method) => (
          <PaymentMethodCard
            key={method.id}
            method={method}
            selected={selectedMethod?.id === method.id}
            onSelect={setSelectedMethod}
          />
        ))}

        {selectedMethod?.id === 'card' && (
          <View style={styles.cardForm}>
            <CardInputForm
              cardNumber={cardDetails.cardNumber}
              expiry={cardDetails.expiry}
              cvv={cardDetails.cvv}
              name={cardDetails.name}
              onUpdate={(key, value) => setCardDetails((prev) => ({ ...prev, [key]: value }))}
            />
          </View>
        )}

        {selectedMethod?.id === 'upi' && (
          <View style={styles.cardForm}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Ionicons name="information-circle" size={16} color={colors.info} />
              <Text style={[{ color: colors.textSecondary, marginLeft: 4, fontSize: 12 }]}>
                Enter your UPI ID (e.g., name@upi)
              </Text>
            </View>
          </View>
        )}

        <View style={styles.securityNote}>
          <Ionicons name="lock-closed" size={16} color={colors.success} />
          <Text style={[styles.securityText, { color: colors.textTertiary }]}>
            {t('booking.security')}
          </Text>
        </View>

        <Button
          title={`${t('booking.payButton')} ${formatPrice(total)}`}
          onPress={handlePayment}
          loading={loading}
          disabled={!selectedMethod}
          icon="card"
          style={styles.payBtn}
        />

        <View style={{ height: 40 + insets.bottom }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: SPACING.lg },
  amountLabel: { textAlign: 'center', fontSize: FONT_SIZES.sm, marginTop: SPACING.sm },
  amount: { textAlign: 'center', fontSize: 36, fontFamily: 'Inter_800ExtraBold', marginBottom: SPACING.xl },
  sectionTitle: { fontSize: FONT_SIZES.xl, fontFamily: 'Inter_700Bold', marginBottom: SPACING.md },
  cardForm: { marginTop: SPACING.md, marginBottom: SPACING.lg },
  securityNote: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: SPACING.lg },
  securityText: { fontSize: FONT_SIZES.xs, marginLeft: 6 },
  payBtn: { marginTop: SPACING.sm },
});

export default PaymentScreen;
