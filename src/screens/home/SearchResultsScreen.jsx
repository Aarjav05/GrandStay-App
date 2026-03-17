import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useSearch } from '../../hooks/useSearch';
import { useWishlist } from '../../hooks/useWishlist';
import Input from '../../components/common/Input';
import HotelCard from '../../components/hotel/HotelCard';
import EmptyState from '../../components/common/EmptyState';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '../../utils/constants';

const SORT_OPTIONS = [
  { id: 'relevance', label: 'Relevance' },
  { id: 'price_asc', label: 'Price: Low to High' },
  { id: 'price_desc', label: 'Price: High to Low' },
  { id: 'rating', label: 'Top Rated' },
];

const AMENITY_OPTIONS = ['wifi', 'pool', 'gym', 'parking', 'ac', 'restaurant', 'spa'];

const SearchResultsScreen = ({ navigation, route }) => {
  const { colors } = useTheme();
  const { query, setQuery, results, loading, filters, search, updateFilters, resetFilters } = useSearch();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [showFilters, setShowFilters] = useState(false);
  const [tempFilters, setTempFilters] = useState({});

  useEffect(() => {
    const initialQuery = route.params?.query || '';
    if (initialQuery) {
      setQuery(initialQuery);
      search(initialQuery);
    } else {
      search('');
    }
  }, []);

  const handleSearch = () => {
    search(query, filters);
  };

  const toggleAmenity = (amenity) => {
    const current = tempFilters.amenities || [];
    const updated = current.includes(amenity)
      ? current.filter((a) => a !== amenity)
      : [...current, amenity];
    setTempFilters({ ...tempFilters, amenities: updated });
  };

  const applyFilters = () => {
    updateFilters(tempFilters);
    setShowFilters(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.searchRow}>
        <View style={styles.searchInput}>
          <Input
            value={query}
            onChangeText={setQuery}
            placeholder="Search hotels, cities..."
            variant="search"
            style={{ marginBottom: 0 }}
          />
        </View>
        <TouchableOpacity onPress={handleSearch} style={[styles.searchBtn, { backgroundColor: colors.primary }]}>
          <Ionicons name="search" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.filterRow}>
        <Text style={[styles.resultCount, { color: colors.textSecondary }]}>
          {results.length} hotel{results.length !== 1 ? 's' : ''} found
        </Text>
        <TouchableOpacity style={[styles.filterChip, { borderColor: colors.border }]} onPress={() => { setTempFilters(filters); setShowFilters(true); }}>
          <Ionicons name="options" size={16} color={colors.text} />
          <Text style={[styles.filterChipText, { color: colors.text }]}>Filters</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <Loader />
      ) : results.length === 0 ? (
        <EmptyState icon="search-outline" title="No hotels found" subtitle="Try adjusting your search or filters" />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <HotelCard
                hotel={item}
                onPress={(h) => navigation.navigate('HotelDetails', { hotelId: h.id })}
                onWishlistToggle={toggleWishlist}
                isWishlisted={isInWishlist(item.id)}
              />
            </View>
          )}
        />
      )}

      <Modal visible={showFilters} onClose={() => setShowFilters(false)}>
        <Text style={[styles.filterTitle, { color: colors.text }]}>Filters & Sort</Text>

        <Text style={[styles.filterLabel, { color: colors.text }]}>Sort By</Text>
        {SORT_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.id}
            onPress={() => setTempFilters({ ...tempFilters, sortBy: opt.id })}
            style={[styles.sortOption, { borderColor: tempFilters.sortBy === opt.id ? colors.primary : colors.border }]}
          >
            <Text style={{ color: tempFilters.sortBy === opt.id ? colors.primary : colors.text }}>{opt.label}</Text>
          </TouchableOpacity>
        ))}

        <Text style={[styles.filterLabel, { color: colors.text, marginTop: SPACING.lg }]}>Star Rating</Text>
        <View style={styles.ratingRow}>
          {[3, 3.5, 4, 4.5].map((r) => (
            <TouchableOpacity
              key={r}
              onPress={() => setTempFilters({ ...tempFilters, minRating: r })}
              style={[styles.ratingChip, { backgroundColor: tempFilters.minRating === r ? colors.primary : colors.surface }]}
            >
              <Text style={{ color: tempFilters.minRating === r ? '#fff' : colors.text }}>⭐ {r}+</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.filterLabel, { color: colors.text, marginTop: SPACING.lg }]}>Amenities</Text>
        <View style={styles.amenitiesRow}>
          {AMENITY_OPTIONS.map((a) => (
            <TouchableOpacity
              key={a}
              onPress={() => toggleAmenity(a)}
              style={[styles.amenityChip, { backgroundColor: (tempFilters.amenities || []).includes(a) ? colors.primary : colors.surface }]}
            >
              <Text style={{ color: (tempFilters.amenities || []).includes(a) ? '#fff' : colors.text, fontSize: 12, textTransform: 'capitalize' }}>{a}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.filterActions}>
          <Button title="Reset" variant="ghost" onPress={() => { setTempFilters({}); resetFilters(); setShowFilters(false); }} fullWidth={false} />
          <Button title="Apply Filters" onPress={applyFilters} fullWidth={false} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchRow: { flexDirection: 'row', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, alignItems: 'center' },
  searchInput: { flex: 1, marginRight: SPACING.sm },
  searchBtn: { width: 48, height: 48, borderRadius: BORDER_RADIUS.md, alignItems: 'center', justifyContent: 'center' },
  filterRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.lg, paddingBottom: SPACING.sm },
  resultCount: { fontSize: FONT_SIZES.sm },
  filterChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  filterChipText: { fontSize: FONT_SIZES.sm, marginLeft: 4 },
  list: { paddingBottom: 100 },
  cardWrapper: { paddingHorizontal: SPACING.lg },
  filterTitle: { fontSize: FONT_SIZES.xl, fontWeight: '700', textAlign: 'center', marginBottom: SPACING.lg },
  filterLabel: { fontSize: FONT_SIZES.md, fontWeight: '600', marginBottom: SPACING.sm },
  sortOption: { padding: SPACING.md, borderWidth: 1, borderRadius: BORDER_RADIUS.sm, marginBottom: SPACING.sm },
  ratingRow: { flexDirection: 'row', flexWrap: 'wrap' },
  ratingChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginRight: 8, marginBottom: 8 },
  amenitiesRow: { flexDirection: 'row', flexWrap: 'wrap' },
  amenityChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginRight: 8, marginBottom: 8 },
  filterActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: SPACING.xl },
});

export default SearchResultsScreen;
