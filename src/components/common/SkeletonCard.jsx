import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { BORDER_RADIUS, SPACING, SHADOWS } from '../../utils/constants';

const SkeletonCard = ({ style }) => {
  const { colors } = useTheme();
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  const opacity = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const SkeletonBlock = ({ width, height, borderRadius = 8, blockStyle }) => (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: colors.skeleton,
          opacity,
        },
        blockStyle,
      ]}
    />
  );

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.borderLight },
        style,
      ]}
    >
      <SkeletonBlock width="100%" height={180} borderRadius={BORDER_RADIUS.md} />
      <View style={styles.content}>
        <SkeletonBlock width="70%" height={16} blockStyle={{ marginBottom: 8 }} />
        <SkeletonBlock width="50%" height={12} blockStyle={{ marginBottom: 12 }} />
        <View style={styles.row}>
          <SkeletonBlock width="30%" height={14} />
          <SkeletonBlock width="25%" height={14} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: SPACING.lg,
    ...SHADOWS.sm,
  },
  content: {
    padding: SPACING.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default SkeletonCard;
