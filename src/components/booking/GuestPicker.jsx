import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '../../utils/constants';

const GuestPicker = ({ guests, onUpdate, style }) => {
  const { colors } = useTheme();

  const items = [
    { key: 'adults', label: 'Adults', min: 1, max: 10, subtitle: '13+ years' },
    { key: 'children', label: 'Children', min: 0, max: 6, subtitle: '2-12 years' },
    { key: 'rooms', label: 'Rooms', min: 1, max: 5, subtitle: '' },
  ];

  const update = (key, delta) => {
    const item = items.find((i) => i.key === key);
    const newVal = Math.max(item.min, Math.min(item.max, (guests[key] || 0) + delta));
    onUpdate?.({ ...guests, [key]: newVal });
  };

  return (
    <View style={[styles.container, style]}>
      {items.map((item) => (
        <View key={item.key} style={[styles.row, { borderColor: colors.border }]}>
          <View>
            <Text style={[styles.label, { color: colors.text }]}>{item.label}</Text>
            {item.subtitle ? (
              <Text style={[styles.subtitle, { color: colors.textTertiary }]}>{item.subtitle}</Text>
            ) : null}
          </View>
          <View style={styles.controls}>
            <TouchableOpacity
              onPress={() => update(item.key, -1)}
              disabled={guests[item.key] <= item.min}
              style={[styles.btn, { borderColor: guests[item.key] <= item.min ? colors.border : colors.primary }]}
            >
              <Ionicons name="remove" size={18} color={guests[item.key] <= item.min ? colors.textTertiary : colors.primary} />
            </TouchableOpacity>
            <Text style={[styles.count, { color: colors.text }]}>{guests[item.key] || 0}</Text>
            <TouchableOpacity
              onPress={() => update(item.key, 1)}
              disabled={guests[item.key] >= item.max}
              style={[styles.btn, { borderColor: guests[item.key] >= item.max ? colors.border : colors.primary }]}
            >
              <Ionicons name="add" size={18} color={guests[item.key] >= item.max ? colors.textTertiary : colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: SPACING.md, borderBottomWidth: 1 },
  label: { fontSize: FONT_SIZES.md, fontFamily: 'Inter_600SemiBold' },
  subtitle: { fontSize: FONT_SIZES.xs, marginTop: 2 },
  controls: { flexDirection: 'row', alignItems: 'center' },
  btn: { width: 32, height: 32, borderRadius: 16, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  count: { fontSize: FONT_SIZES.lg, fontFamily: 'Inter_600SemiBold', marginHorizontal: SPACING.lg, minWidth: 24, textAlign: 'center' },
});

export default GuestPicker;
