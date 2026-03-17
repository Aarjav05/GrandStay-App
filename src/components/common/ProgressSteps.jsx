import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { FONT_SIZES, SPACING, BORDER_RADIUS } from '../../utils/constants';

const ProgressSteps = ({ currentStep = 1, steps = ['Review', 'Payment', 'Confirmed'] }) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {steps.map((step, index) => {
        const stepNum = index + 1;
        const isActive = stepNum === currentStep;
        const isDone = stepNum < currentStep;
        const dotColor = isDone || isActive ? colors.primary : colors.border;
        const textColor = isDone || isActive ? colors.primary : colors.textTertiary;
        const lineColor = isDone ? colors.primary : colors.border;

        return (
          <View key={index} style={styles.stepWrapper}>
            <View style={styles.stepRow}>
              <View
                style={[
                  styles.dot,
                  {
                    backgroundColor: dotColor,
                    borderColor: dotColor,
                  },
                ]}
              >
                {isDone && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
                {isActive && (
                  <View style={[styles.innerDot, { backgroundColor: '#fff' }]} />
                )}
              </View>
              {index < steps.length - 1 && (
                <View style={[styles.line, { backgroundColor: lineColor }]} />
              )}
            </View>
            <Text style={[styles.label, { color: textColor }]}>{step}</Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
  },
  stepWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
  },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  line: {
    flex: 1,
    height: 2,
    marginHorizontal: 4,
  },
  label: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '500',
    marginTop: SPACING.xs,
  },
});

export default ProgressSteps;
