import React from 'react';
import { View, StyleSheet } from 'react-native';
import AmenityIcon from './AmenityIcon';
import { SPACING } from '../../utils/constants';

const AmenitiesGrid = ({ amenities = [], size = 'sm', style }) => {
  return (
    <View style={[styles.grid, style]}>
      {amenities.map((amenity, index) => (
        <AmenityIcon key={index} amenity={amenity} size={size} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SPACING.sm,
  },
});

export default AmenitiesGrid;
