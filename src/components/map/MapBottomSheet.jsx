import React from 'react';
import { View, StyleSheet } from 'react-native';
import HotelPreviewCard from '../hotel/HotelPreviewCard';
import AmenitiesGrid from '../hotel/AmenitiesGrid';
import { SPACING } from '../../utils/constants';

const MapBottomSheet = ({ hotel, onViewDetails, expanded = false, style }) => {
  if (!hotel) return null;

  return (
    <View style={[styles.container, style]}>
      <HotelPreviewCard hotel={hotel} onViewDetails={onViewDetails} />
      {expanded && hotel.amenities && (
        <View style={styles.extras}>
          <AmenitiesGrid amenities={hotel.amenities.slice(0, 6)} size="sm" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.md,
  },
  extras: {
    marginTop: SPACING.md,
  },
});

export default MapBottomSheet;
