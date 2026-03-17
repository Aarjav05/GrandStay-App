import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '../../utils/constants';

const SearchBar = ({ onPress, style }) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.container, { backgroundColor: colors.searchBar, borderColor: colors.border }, style]}
    >
      <Ionicons name="search" size={20} color={colors.textTertiary} />
      <Text style={[styles.placeholder, { color: colors.textTertiary }]}>Where to?</Text>
      <Ionicons name="options-outline" size={20} color={colors.textTertiary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
  },
  placeholder: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    marginLeft: SPACING.sm,
  },
});

export default SearchBar;
