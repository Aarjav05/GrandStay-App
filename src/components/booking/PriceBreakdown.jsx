import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { FONT_SIZES, SPACING, BORDER_RADIUS } from '../../utils/constants';
import { formatPrice } from '../../utils/formatters';
import Divider from '../common/Divider';

const PriceBreakdown = ({ breakdown, style }) => {
  const { colors } = useTheme();
  if (!breakdown) return null;

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.borderLight }, style]}>
      <Text style={[styles.title, { color: colors.text }]}>Price Breakdown</Text>
      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          {formatPrice(breakdown.roomRate)} × {breakdown.nights} night{breakdown.nights > 1 ? 's' : ''}
        </Text>
        <Text style={[styles.value, { color: colors.text }]}>{formatPrice(breakdown.subtotal)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Taxes & Fees (18% GST)</Text>
        <Text style={[styles.value, { color: colors.text }]}>{formatPrice(breakdown.taxes)}</Text>
      </View>
      {breakdown.discount > 0 && (
        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.success }]}>Discount</Text>
          <Text style={[styles.value, { color: colors.success }]}>-{formatPrice(breakdown.discount)}</Text>
        </View>
      )}
      <Divider />
      <View style={styles.row}>
        <Text style={[styles.totalLabel, { color: colors.text }]}>Total</Text>
        <Text style={[styles.totalValue, { color: colors.primary }]}>{formatPrice(breakdown.total)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1 },
  title: { fontSize: FONT_SIZES.lg, fontFamily: 'Inter_700Bold', marginBottom: SPACING.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.sm },
  label: { fontSize: FONT_SIZES.md },
  value: { fontSize: FONT_SIZES.md, fontFamily: 'Inter_500Medium' },
  totalLabel: { fontSize: FONT_SIZES.lg, fontFamily: 'Inter_700Bold' },
  totalValue: { fontSize: FONT_SIZES.xl, fontFamily: 'Inter_800ExtraBold' },
});

export default PriceBreakdown;
