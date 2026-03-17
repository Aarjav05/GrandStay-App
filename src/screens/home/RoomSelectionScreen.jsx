import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import { useBooking } from '../../hooks/useBooking';
import * as hotelService from '../../services/hotelService';
import RoomCard from '../../components/hotel/RoomCard';
import GuestPicker from '../../components/booking/GuestPicker';
import DateRangePicker from '../../components/booking/DateRangePicker';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '../../utils/constants';
import { formatDate, formatDuration, formatPrice } from '../../utils/formatters';
import { calcNights } from '../../utils/helpers';

const RoomSelectionScreen = ({ navigation, route }) => {
  const { hotelId } = route.params;
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { draft, setDraftField, setGuests, setHotelInfo, setRoomInfo } = useBooking();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [hotel, setHotel] = useState(null);

  useEffect(() => {
    loadData();
  }, [hotelId]);

  const loadData = async () => {
    try {
      const [hotelData, roomsData] = await Promise.all([
        hotelService.fetchHotelById(hotelId),
        hotelService.fetchRooms(hotelId),
      ]);
      setHotel(hotelData);
      setRooms(roomsData);
      setHotelInfo(hotelData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (checkIn, checkOut) => {
    setDraftField('checkIn', checkIn);
    setDraftField('checkOut', checkOut);
    const nights = calcNights(checkIn, checkOut);
    setDraftField('nights', nights);
  };

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
    setRoomInfo(room);
  };

  const handleContinue = () => {
    if (!draft.checkIn || !draft.checkOut || !selectedRoom) return;
    navigation.navigate('Booking');
  };

  const nights = draft.checkIn && draft.checkOut ? calcNights(draft.checkIn, draft.checkOut) : 0;
  const total = selectedRoom ? selectedRoom.price * nights : 0;

  if (loading) return <Loader fullScreen />;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={rooms}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View>
            {hotel && (
              <Text style={[styles.hotelName, { color: colors.textSecondary }]}>{hotel.name}</Text>
            )}

            <Text style={[styles.sectionTitle, { color: colors.text }]}>Select Dates</Text>
            <View style={styles.dateRow}>
              <TouchableOpacity style={[styles.dateBox, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => setShowDatePicker(true)}>
                <Text style={[styles.dateLabel, { color: colors.textTertiary }]}>Check-in</Text>
                <Text style={[styles.dateValue, { color: colors.text }]}>{draft.checkIn ? formatDate(draft.checkIn, 'dd MMM yyyy') : 'Select'}</Text>
              </TouchableOpacity>
              <Ionicons name="arrow-forward" size={20} color={colors.textTertiary} style={{ marginHorizontal: 8 }} />
              <TouchableOpacity style={[styles.dateBox, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => setShowDatePicker(true)}>
                <Text style={[styles.dateLabel, { color: colors.textTertiary }]}>Check-out</Text>
                <Text style={[styles.dateValue, { color: colors.text }]}>{draft.checkOut ? formatDate(draft.checkOut, 'dd MMM yyyy') : 'Select'}</Text>
              </TouchableOpacity>
            </View>
            {nights > 0 && (
              <Text style={[styles.nightsText, { color: colors.primary }]}>{formatDuration(nights)}</Text>
            )}

            <Text style={[styles.sectionTitle, { color: colors.text }]}>Guests & Rooms</Text>
            <GuestPicker guests={draft.guests} onUpdate={setGuests} />

            <Text style={[styles.sectionTitle, { color: colors.text, marginTop: SPACING.xl }]}>
              Available Rooms
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <RoomCard room={item} selected={selectedRoom?.id === item.id} onSelect={handleRoomSelect} />
        )}
        ListFooterComponent={<View style={{ height: 100 }} />}
      />

      {selectedRoom && nights > 0 && (
        <View style={[styles.bottomBar, { backgroundColor: colors.card, borderColor: colors.border, paddingBottom: Math.max(insets.bottom, SPACING.md) }]}>
          <View>
            <Text style={[styles.summaryText, { color: colors.textSecondary }]}>
              {selectedRoom.type} · {formatPrice(selectedRoom.price)}/night
            </Text>
            <Text style={[styles.totalText, { color: colors.primary }]}>
              {formatDuration(nights)} = {formatPrice(total)}
            </Text>
          </View>
          <Button title="Continue" onPress={handleContinue} fullWidth={false} style={{ paddingHorizontal: 24 }} />
        </View>
      )}

      <DateRangePicker
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        checkIn={draft.checkIn}
        checkOut={draft.checkOut}
        onSelect={handleDateSelect}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: SPACING.lg },
  hotelName: { fontSize: FONT_SIZES.sm, fontWeight: '500', marginBottom: SPACING.md },
  sectionTitle: { fontSize: FONT_SIZES.xl, fontWeight: '700', marginBottom: SPACING.md },
  dateRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm },
  dateBox: { flex: 1, padding: SPACING.md, borderRadius: BORDER_RADIUS.md, borderWidth: 1 },
  dateLabel: { fontSize: FONT_SIZES.xs, marginBottom: 4 },
  dateValue: { fontSize: FONT_SIZES.md, fontWeight: '600' },
  nightsText: { fontSize: FONT_SIZES.sm, fontWeight: '600', marginBottom: SPACING.lg },
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, borderTopWidth: 1,
  },
  summaryText: { fontSize: FONT_SIZES.sm },
  totalText: { fontSize: FONT_SIZES.lg, fontWeight: '700' },
});

export default RoomSelectionScreen;
