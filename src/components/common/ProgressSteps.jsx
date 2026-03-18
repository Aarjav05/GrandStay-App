import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { FONT_SIZES, SPACING } from '../../utils/constants';

const ProgressSteps = ({ currentStep = 1, steps = ['Review', 'Payment', 'Confirmed'] }) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {/* Dots and lines row */}
      <View style={styles.dotsRow}>
        {steps.map((_, index) => {
          const stepNum = index + 1;
          const isActive = stepNum === currentStep;
          const isDone = stepNum < currentStep;
          const dotColor = isDone || isActive ? colors.primary : colors.border;
          const lineColor = isDone ? colors.primary : colors.border;
          const nextDone = stepNum < currentStep;

          return (
            <React.Fragment key={index}>
              <View
                style={[
                  styles.dot,
                  { backgroundColor: dotColor, borderColor: dotColor },
                ]}
              >
                {isDone && <Text style={styles.checkmark}>✓</Text>}
                {isActive && <View style={[styles.innerDot, { backgroundColor: '#fff' }]} />}
              </View>
              {index < steps.length - 1 && (
                <View style={[styles.line, { backgroundColor: lineColor }]} />
              )}
            </React.Fragment>
          );
        })}
      </View>

      {/* Labels row */}
      <View style={styles.labelsRow}>
        {steps.map((step, index) => {
          const stepNum = index + 1;
          const isActive = stepNum === currentStep;
          const isDone = stepNum < currentStep;
          const textColor = isDone || isActive ? colors.primary : colors.textTertiary;

          return (
            <Text key={index} style={[styles.label, { color: textColor }]}>
              {step}
            </Text>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontFamily: 'Inter_700Bold',
  },
  line: {
    flex: 1,
    height: 2,
    marginHorizontal: 4,
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.xs,
  },
  label: {
    fontSize: FONT_SIZES.xs,
    fontFamily: 'Inter_500Medium',
    textAlign: 'center',
  },
});

export default ProgressSteps;
