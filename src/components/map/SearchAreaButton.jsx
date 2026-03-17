import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../../utils/constants';

const SearchAreaButton = ({ onPress, style }) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, { backgroundColor: colors.card }, style]}
      activeOpacity={0.85}
    >
      <Text style={[styles.text, { color: colors.primary }]}>Search this area</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    top: 100,
    alignSelf: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    ...SHADOWS.lg,
  },
  text: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
});

export default SearchAreaButton;
