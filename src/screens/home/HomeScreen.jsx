import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { useHotels } from '../../hooks/useHotels';
import { useLocation } from '../../hooks/useLocation';
import { useWishlist } from '../../hooks/useWishlist';
import HotelCard from '../../components/hotel/HotelCard';
import HotelCardHorizontal from '../../components/hotel/HotelCardHorizontal';
import SearchBar from '../../components/home/SearchBar';
import CategoryFilter from '../../components/home/CategoryFilter';
import PromoBanner from '../../components/home/PromoBanner';
import SkeletonCard from '../../components/common/SkeletonCard';
import { SPACING, FONT_SIZES } from '../../utils/constants';
import { getGreeting } from '../../utils/formatters';
import { searchHotels } from '../../services/searchService';

const HomeScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { hotels, featuredHotels, loadHotels, loadFeatured, loading } = useHotels();
  const { location } = useLocation();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadHotels();
    loadFeatured();
  }, []);

  useEffect(() => {
    filterByCategory(selectedCategory);
  }, [hotels, selectedCategory]);

  const filterByCategory = async (category) => {
    if (category === 'all') {
      setFilteredHotels(hotels);
    } else {
      const filtered = await searchHotels('', { category });
      setFilteredHotels(filtered);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadHotels();
    await loadFeatured();
    setRefreshing(false);
  }, []);

  const handleHotelPress = (hotel) => {
    navigation.navigate('HotelDetails', { hotelId: hotel.id });
  };

  const renderHeader = () => (
    <View>
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.greeting, { color: colors.textSecondary }]}>
            {getGreeting()},
          </Text>
          <Text style={[styles.name, { color: colors.text }]}>
            {user?.name || 'Traveler'} 👋
          </Text>
        </View>
      </View>

      <SearchBar
        onPress={() => navigation.navigate('SearchResults')}
        style={styles.searchBar}
      />

      <PromoBanner />

      <CategoryFilter
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {featuredHotels.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Featured Hotels</Text>
          <FlatList
            data={featuredHotels}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.featuredList}
            renderItem={({ item }) => (
              <HotelCardHorizontal hotel={item} onPress={handleHotelPress} />
            )}
          />
        </View>
      )}

      <Text style={[styles.sectionTitle, { color: colors.text, paddingHorizontal: SPACING.lg }]}>
        {selectedCategory === 'all' ? 'Popular Hotels' : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Hotels`}
      </Text>
    </View>
  );

  if (loading && hotels.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {renderHeader()}
        <View style={styles.skeletonContainer}>
          <SkeletonCard />
          <SkeletonCard />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={filteredHotels}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <HotelCard
              hotel={item}
              onPress={handleHotelPress}
              onWishlistToggle={toggleWishlist}
              isWishlisted={isInWishlist(item.id)}
            />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.lg, marginBottom: SPACING.md },
  greeting: { fontSize: FONT_SIZES.md },
  name: { fontSize: FONT_SIZES.xxl, fontWeight: '800' },
  searchBar: { marginHorizontal: SPACING.lg },
  section: { marginBottom: SPACING.sm },
  sectionTitle: { fontSize: FONT_SIZES.xl, fontWeight: '700', paddingHorizontal: SPACING.lg, marginBottom: SPACING.sm },
  featuredList: { paddingHorizontal: SPACING.lg },
  listContent: { paddingBottom: 100 },
  cardWrapper: { paddingHorizontal: SPACING.lg },
  skeletonContainer: { paddingHorizontal: SPACING.lg },
});

export default HomeScreen;
