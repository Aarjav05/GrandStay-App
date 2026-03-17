import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { AMENITY_ICONS, SPACING, FONT_SIZES } from '../../utils/constants';

const AmenityIcon = ({ amenity, size = 'sm', style }) => {
  const { colors } = useTheme();
  const config = AMENITY_ICONS[amenity] || { icon: 'help-circle', label: amenity };
  const iconSize = size === 'sm' ? 18 : 24;

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.iconBg, { backgroundColor: colors.primary + '12' }]}>
        <Ionicons name={config.icon} size={iconSize} color={colors.primary} />
      </View>
      <Text style={[styles.label, { color: colors.textSecondary, fontSize: size === 'sm' ? 10 : 12 }]}>
        {config.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginRight: SPACING.md,
    marginBottom: SPACING.sm,
  },
  iconBg: {
    padding: 10,
    borderRadius: 12,
    marginBottom: 4,
  },
  label: {
    fontWeight: '500',
  },
});

export default AmenityIcon;
