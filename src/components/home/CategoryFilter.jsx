import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { CATEGORIES, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../utils/constants';

const CategoryFilter = ({ selected = 'all', onSelect, style }) => {
  const { colors } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={[styles.container, style]}
      contentContainerStyle={styles.content}
    >
      {CATEGORIES.map((cat) => {
        const isActive = cat.id === selected;
        return (
          <TouchableOpacity
            key={cat.id}
            onPress={() => onSelect?.(cat.id)}
            style={[
              styles.chip,
              {
                backgroundColor: isActive ? colors.primary : colors.surface,
                borderColor: isActive ? colors.primary : colors.border,
              },
            ]}
          >
            <Ionicons
              name={cat.icon}
              size={16}
              color={isActive ? '#fff' : colors.textSecondary}
              style={styles.icon}
            />
            <Text style={[styles.label, { color: isActive ? '#fff' : colors.textSecondary }]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: SPACING.md },
  content: { paddingHorizontal: SPACING.lg },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.full,
    marginRight: SPACING.sm,
    borderWidth: 1,
  },
  icon: { marginRight: 6 },
  label: { fontSize: FONT_SIZES.sm, fontFamily: 'Inter_500Medium' },
});

export default CategoryFilter;
