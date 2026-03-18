import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import * as bookingService from '../../services/bookingService';
import BookingSummaryCard from '../../components/booking/BookingSummaryCard';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import Loader from '../../components/common/Loader';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '../../utils/constants';
import { formatPrice } from '../../utils/formatters';

const TAB_OPTIONS = [
  { id: 'all', label: 'All' },
  { id: 'confirmed', label: 'Upcoming' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
];

const MyBookingsScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    loadBookings();
  }, [activeTab]);

  const loadBookings = async () => {
    if (!user?.uid) return;
    setLoading(true);
    try {
      const status = activeTab === 'all' ? null : activeTab;
      const data = await bookingService.getUserBookings(user.uid, status);
      setBookings(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadBookings();
    setRefreshing(false);
  }, [activeTab]);

  const getStatusBadge = (status) => {
    const map = {
      confirmed: { label: 'Upcoming', variant: 'info' },
      completed: { label: 'Completed', variant: 'success' },
      cancelled: { label: 'Cancelled', variant: 'error' },
      pending: { label: 'Pending', variant: 'warning' },
    };
    return map[status] || { label: status, variant: 'default' };
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.tabs}>
        {TAB_OPTIONS.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            onPress={() => setActiveTab(tab.id)}
            style={[styles.tab, { backgroundColor: activeTab === tab.id ? colors.primary : colors.surface }]}
          >
            <Text style={[styles.tabText, { color: activeTab === tab.id ? '#fff' : colors.textSecondary }]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <Loader />
      ) : bookings.length === 0 ? (
        <EmptyState
          icon="calendar-outline"
          title="No bookings yet"
          subtitle="Your booking history will appear here"
          actionLabel="Find Hotels"
          onAction={() => navigation.navigate('HomeTab')}
        />
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
          renderItem={({ item }) => {
            const badge = getStatusBadge(item.status);
            return (
              <TouchableOpacity onPress={() => navigation.navigate('BookingDetails', { bookingId: item.id })}>
                <View style={styles.bookingItem}>
                  <BookingSummaryCard booking={item} />
                  <View style={styles.bookingFooter}>
                    <Badge label={badge.label} variant={badge.variant} />
                    <Text style={[styles.total, { color: colors.primary }]}>{formatPrice(item.totalPrice)}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabs: { flexDirection: 'row', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm },
  tab: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: BORDER_RADIUS.full, marginRight: 8 },
  tabText: { fontSize: FONT_SIZES.sm, fontFamily: 'Inter_500Medium' },
  list: { paddingHorizontal: SPACING.lg, paddingBottom: 100 },
  bookingItem: { marginBottom: SPACING.md },
  bookingFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  total: { fontSize: FONT_SIZES.lg, fontFamily: 'Inter_700Bold' },
});

export default MyBookingsScreen;
