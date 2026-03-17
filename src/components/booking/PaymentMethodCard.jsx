import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../../utils/constants';

const PaymentMethodCard = ({ method, selected, onSelect, style }) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      onPress={() => onSelect?.(method)}
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: selected ? colors.primary : colors.borderLight,
          borderWidth: selected ? 2 : 1,
        },
        style,
      ]}
    >
      <Text style={styles.emoji}>{method.emoji}</Text>
      <Text style={[styles.label, { color: colors.text }]}>{method.label}</Text>
      <View style={[styles.radio, { borderColor: selected ? colors.primary : colors.border }]}>
        {selected && <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
    ...SHADOWS.sm,
  },
  emoji: { fontSize: 24, marginRight: SPACING.md },
  label: { flex: 1, fontSize: FONT_SIZES.md, fontWeight: '500' },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  radioInner: { width: 12, height: 12, borderRadius: 6 },
});

export default PaymentMethodCard;
