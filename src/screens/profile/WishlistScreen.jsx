import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useWishlist } from '../../hooks/useWishlist';
import HotelCard from '../../components/hotel/HotelCard';
import EmptyState from '../../components/common/EmptyState';
import Loader from '../../components/common/Loader';
import { SPACING } from '../../utils/constants';

const WishlistScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { wishlist, loading, toggleWishlist, isInWishlist, loadWishlist } = useWishlist();

  useEffect(() => {
    loadWishlist();
  }, []);

  if (loading) return <Loader fullScreen />;

  if (wishlist.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <EmptyState
          icon="heart-outline"
          title="No saved hotels"
          subtitle="Hotels you save will appear here"
          actionLabel="Explore Hotels"
          onAction={() => navigation.navigate('HomeTab')}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={wishlist}
        keyExtractor={(item) => item.id || item.hotelId}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <HotelCard
              hotel={item}
              onPress={(h) => navigation.navigate('HomeTab', { screen: 'HotelDetails', params: { hotelId: h.id || h.hotelId } })}
              onWishlistToggle={toggleWishlist}
              isWishlisted={true}
            />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { paddingBottom: 100 },
  cardWrapper: { paddingHorizontal: SPACING.lg },
});

export default WishlistScreen;
