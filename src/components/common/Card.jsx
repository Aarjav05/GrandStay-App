import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { BORDER_RADIUS, SPACING, SHADOWS } from '../../utils/constants';

const Card = ({ children, style, variant = 'default', onPress }) => {
  const { colors } = useTheme();
  const Component = onPress ? require('react-native').TouchableOpacity : View;

  return (
    <Component
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.borderLight },
        variant === 'elevated' && SHADOWS.md,
        style,
      ]}
    >
      {children}
    </Component>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    ...SHADOWS.sm,
  },
});

export default Card;
