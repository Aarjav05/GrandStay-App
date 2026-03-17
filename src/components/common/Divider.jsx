import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

const Divider = ({ style, vertical = false }) => {
  const { colors } = useTheme();
  return (
    <View
      style={[
        vertical ? styles.vertical : styles.horizontal,
        { backgroundColor: colors.border },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  horizontal: {
    height: 1,
    width: '100%',
    marginVertical: 12,
  },
  vertical: {
    width: 1,
    height: '100%',
    marginHorizontal: 12,
  },
});

export default Divider;
