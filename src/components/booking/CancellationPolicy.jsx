import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '../../utils/constants';

const CancellationPolicy = ({ style }) => {
  const { colors } = useTheme();
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.borderLight }, style]}>
      <TouchableOpacity onPress={() => setExpanded(!expanded)} style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Cancellation Policy</Text>
        <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={20} color={colors.textSecondary} />
      </TouchableOpacity>
      {expanded && (
        <View style={styles.content}>
          <Text style={[styles.text, { color: colors.textSecondary }]}>
            • Free cancellation up to 24 hours before check-in{'\n'}
            • 50% refund for cancellations within 24 hours{'\n'}
            • No refund for no-shows{'\n'}
            • Refunds are processed within 5-7 business days
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { borderRadius: BORDER_RADIUS.md, borderWidth: 1, overflow: 'hidden' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.md },
  title: { fontSize: FONT_SIZES.md, fontFamily: 'Inter_600SemiBold' },
  content: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.md },
  text: { fontSize: FONT_SIZES.sm, lineHeight: 22 },
});

export default CancellationPolicy;
