import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { formatPrice } from '../../utils/formatters';

const HotelMarker = ({ selected = false }) => {
  const { colors } = useTheme();
  return (
    <View style={[
      styles.markerWrapper, 
      selected ? { transform: [{ scale: 1.2 }] } : {}
    ]}>
      <Ionicons 
        name="location" 
        size={selected ? 44 : 36} 
        color={selected ? colors.primary : '#E53935'} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  markerWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
});

export default HotelMarker;
