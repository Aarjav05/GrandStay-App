import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { BORDER_RADIUS, FONT_SIZES, SPACING, SHADOWS } from '../../utils/constants';
import { formatPrice } from '../../utils/formatters';

const RoomCard = ({ room, onSelect, selected = false, style }) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => onSelect?.(room)}
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: selected ? colors.primary : colors.borderLight,
          borderWidth: selected ? 2 : 1,
        },
        style,
      ]}
    >
      <Image
        source={{ uri: room.images?.[0] || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400' }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={[styles.type, { color: colors.text }]}>{room.type}</Text>
          {selected && (
            <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
          )}
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Ionicons name="people" size={14} color={colors.textSecondary} />
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              Max {room.capacity} guests
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="bed" size={14} color={colors.textSecondary} />
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              {room.bedType}
            </Text>
          </View>
          {room.size && (
            <View style={styles.infoItem}>
              <Ionicons name="resize" size={14} color={colors.textSecondary} />
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                {room.size}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.amenityRow}>
          {room.amenities?.slice(0, 4).map((amenity, index) => (
            <View key={index} style={[styles.amenityChip, { backgroundColor: colors.surface }]}>
              <Text style={[styles.amenityText, { color: colors.textSecondary }]}>
                {amenity}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.bottomRow}>
          <View>
            <Text style={[styles.price, { color: colors.primary }]}>
              {formatPrice(room.price)}
            </Text>
            <Text style={[styles.perNight, { color: colors.textTertiary }]}>per night</Text>
          </View>
          <TouchableOpacity
            onPress={() => onSelect?.(room)}
            style={[styles.selectBtn, { backgroundColor: selected ? colors.primary : colors.primary + '15' }]}
          >
            <Text style={[styles.selectText, { color: selected ? '#fff' : colors.primary }]}>
              {selected ? 'Selected' : 'Select Room'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    marginBottom: SPACING.lg,
    ...SHADOWS.sm,
  },
  image: {
    width: '100%',
    height: 160,
  },
  content: {
    padding: SPACING.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  type: {
    fontSize: FONT_SIZES.xl,
    fontFamily: 'Inter_700Bold',
  },
  infoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.sm,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.lg,
    marginBottom: 4,
  },
  infoText: {
    fontSize: FONT_SIZES.sm,
    marginLeft: 4,
  },
  amenityRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.md,
  },
  amenityChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BORDER_RADIUS.sm,
    marginRight: 6,
    marginBottom: 4,
  },
  amenityText: {
    fontSize: FONT_SIZES.xs,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: FONT_SIZES.xxl,
    fontFamily: 'Inter_800ExtraBold',
  },
  perNight: {
    fontSize: FONT_SIZES.xs,
  },
  selectBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: BORDER_RADIUS.sm,
  },
  selectText: {
    fontSize: FONT_SIZES.sm,
    fontFamily: 'Inter_600SemiBold',
  },
});

export default RoomCard;
