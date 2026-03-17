import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { BORDER_RADIUS, FONT_SIZES, SPACING } from '../../utils/constants';

const Badge = ({ label, variant = 'default', size = 'sm', style }) => {
  const { colors } = useTheme();

  const getVariantColors = () => {
    switch (variant) {
      case 'success':
        return { bg: '#E8F5E9', text: '#2E7D32' };
      case 'error':
        return { bg: '#FFEBEE', text: '#D32F2F' };
      case 'warning':
        return { bg: '#FFF3E0', text: '#F57C00' };
      case 'info':
        return { bg: '#E3F2FD', text: '#1976D2' };
      case 'primary':
        return { bg: colors.primary + '15', text: colors.primary };
      default:
        return { bg: colors.surface, text: colors.textSecondary };
    }
  };

  const badgeColors = getVariantColors();

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: badgeColors.bg,
          paddingVertical: size === 'sm' ? 3 : 6,
          paddingHorizontal: size === 'sm' ? 8 : 12,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: badgeColors.text,
            fontSize: size === 'sm' ? FONT_SIZES.xs : FONT_SIZES.sm,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: BORDER_RADIUS.full,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '600',
  },
});

export default Badge;
