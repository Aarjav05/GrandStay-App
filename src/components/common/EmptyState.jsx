import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import Button from './Button';
import { FONT_SIZES, SPACING } from '../../utils/constants';

const EmptyState = ({ icon = 'folder-open-outline', title, subtitle, actionLabel, onAction, style }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, style]}>
      <Ionicons name={icon} size={64} color={colors.textTertiary} />
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {subtitle && (
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {subtitle}
        </Text>
      )}
      {actionLabel && onAction && (
        <Button
          title={actionLabel}
          onPress={onAction}
          variant="primary"
          size="sm"
          fullWidth={false}
          style={{ marginTop: SPACING.lg }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xxxl,
    minHeight: 300,
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '600',
    marginTop: SPACING.lg,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    marginTop: SPACING.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default EmptyState;
