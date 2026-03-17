import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, Dimensions, Platform, Text } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useHotels } from '../../hooks/useHotels';
import { useLocation } from '../../hooks/useLocation';
import HotelMarker from '../../components/hotel/HotelMarker';
import MapBottomSheet from '../../components/map/MapBottomSheet';
import SearchAreaButton from '../../components/map/SearchAreaButton';
import Loader from '../../components/common/Loader';
import { filterByRegion, getDefaultRegion } from '../../services/mapService';
import { SPACING } from '../../utils/constants';

let MapView, Marker;
try {
  const Maps = require('react-native-maps');
  MapView = Maps.default;
  Marker = Maps.Marker;
} catch {
  MapView = null;
  Marker = null;
}

const { width, height } = Dimensions.get('window');

const MapScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { hotels, loadHotels } = useHotels();
  const { location, loading: locLoading } = useLocation();
  const [visibleHotels, setVisibleHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [region, setRegion] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    loadHotels();
  }, []);

  useEffect(() => {
    if (location) {
      setRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.06,
        longitudeDelta: 0.06,
      });
    } else {
      setRegion(getDefaultRegion());
    }
  }, [location]);

  useEffect(() => {
    if (hotels.length > 0 && region) {
      filterByRegion(region.latitude, region.longitude).then(filtered => {
        setVisibleHotels(filtered);
      }).catch(err => {
        console.warn('Map filter error:', err);
      });
    }
  }, [hotels, region]);

  const handleRegionChange = useCallback((newRegion) => {
    setRegion(newRegion);
  }, []);

  const handleSearchArea = async () => {
    if (region) {
      try {
        const filtered = await filterByRegion(region.latitude, region.longitude);
        setVisibleHotels(filtered);
      } catch (err) {
        console.warn('Search area error:', err);
      }
    }
  };

  const handleMarkerPress = (hotel) => {
    setSelectedHotel(hotel);
  };

  const handleViewDetails = (hotel) => {
    navigation.navigate('HotelDetails', { hotelId: hotel.id });
  };

  if (locLoading || !region) return <Loader fullScreen />;

  if (!MapView) {
    return (
      <View style={[styles.fallback, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text, fontSize: 16, textAlign: 'center' }}>
          Map is not available in Expo Go.{'\n'}Please use a development build.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={region}
        onRegionChangeComplete={handleRegionChange}
        showsUserLocation
        showsMyLocationButton
      >
        {visibleHotels.map((hotel) => (
          <Marker
            key={hotel.id}
            coordinate={{
              latitude: hotel.coordinates?.latitude || hotel.lat || 0,
              longitude: hotel.coordinates?.longitude || hotel.lng || 0,
            }}
            onPress={() => handleMarkerPress(hotel)}
          >
            <HotelMarker selected={selectedHotel?.id === hotel.id} />
          </Marker>
        ))}
      </MapView>

      <SearchAreaButton onPress={handleSearchArea} />

      {selectedHotel && (
        <View style={[styles.bottomSheet, { backgroundColor: colors.card }]}>
          <MapBottomSheet hotel={selectedHotel} onViewDetails={handleViewDetails} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width, height },
  fallback: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  bottomSheet: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 10,
  },
});

export default MapScreen;
