import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import Modal from '../common/Modal';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '../../utils/constants';
import { format, addDays, isSameDay, isWithinInterval, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths } from 'date-fns';

const DateRangePicker = ({ visible, onClose, checkIn, checkOut, onSelect }) => {
  const { colors } = useTheme();
  const [selectedStart, setSelectedStart] = useState(checkIn ? new Date(checkIn) : null);
  const [selectedEnd, setSelectedEnd] = useState(checkOut ? new Date(checkOut) : null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const handleDayPress = (date) => {
    if (!selectedStart || (selectedStart && selectedEnd)) {
      setSelectedStart(date);
      setSelectedEnd(null);
    } else {
      if (date > selectedStart) {
        setSelectedEnd(date);
      } else {
        setSelectedStart(date);
        setSelectedEnd(null);
      }
    }
  };

  const handleConfirm = () => {
    if (selectedStart && selectedEnd) {
      onSelect?.(
        format(selectedStart, 'yyyy-MM-dd'),
        format(selectedEnd, 'yyyy-MM-dd')
      );
      onClose();
    }
  };

  const renderMonth = (monthDate) => {
    const start = startOfMonth(monthDate);
    const end = endOfMonth(monthDate);
    const days = eachDayOfInterval({ start, end });
    const firstDayOffset = getDay(start);
    const blanks = Array.from({ length: firstDayOffset }, (_, i) => null);
    const allDays = [...blanks, ...days];

    return (
      <View style={styles.monthContainer}>
        <Text style={[styles.monthTitle, { color: colors.text }]}>
          {format(monthDate, 'MMMM yyyy')}
        </Text>
        <View style={styles.weekHeader}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <Text key={d} style={[styles.weekDay, { color: colors.textTertiary }]}>{d}</Text>
          ))}
        </View>
        <View style={styles.daysGrid}>
          {allDays.map((day, index) => {
            if (!day) return <View key={`blank-${index}`} style={styles.dayCell} />;

            const isPast = day < today;
            const isStart = selectedStart && isSameDay(day, selectedStart);
            const isEnd = selectedEnd && isSameDay(day, selectedEnd);
            const isRange = selectedStart && selectedEnd &&
              isWithinInterval(day, { start: selectedStart, end: selectedEnd });

            return (
              <TouchableOpacity
                key={day.toISOString()}
                onPress={() => !isPast && handleDayPress(day)}
                disabled={isPast}
                style={[
                  styles.dayCell,
                  isRange && !isStart && !isEnd && { backgroundColor: colors.primary + '15' },
                  (isStart || isEnd) && { backgroundColor: colors.primary, borderRadius: 20 },
                ]}
              >
                <Text
                  style={[
                    styles.dayText,
                    { color: isPast ? colors.textTertiary : colors.text },
                    (isStart || isEnd) && { color: '#fff', fontFamily: 'Inter_700Bold' },
                  ]}
                >
                  {format(day, 'd')}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <Modal visible={visible} onClose={onClose}>
      <Text style={[styles.title, { color: colors.text }]}>Select Dates</Text>
      <View style={styles.navRow}>
        <TouchableOpacity onPress={() => setCurrentMonth(addMonths(currentMonth, -1))}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCurrentMonth(addMonths(currentMonth, 1))}>
          <Ionicons name="chevron-forward" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderMonth(currentMonth)}
        {renderMonth(addMonths(currentMonth, 1))}
      </ScrollView>
      <View style={styles.footer}>
        <View>
          <Text style={[styles.dateLabel, { color: colors.textSecondary }]}>
            {selectedStart ? format(selectedStart, 'dd MMM') : 'Check-in'}
            {' → '}
            {selectedEnd ? format(selectedEnd, 'dd MMM') : 'Check-out'}
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleConfirm}
          disabled={!selectedStart || !selectedEnd}
          style={[styles.confirmBtn, { backgroundColor: selectedStart && selectedEnd ? colors.primary : colors.textTertiary }]}
        >
          <Text style={styles.confirmText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  title: { fontSize: FONT_SIZES.xl, fontFamily: 'Inter_700Bold', textAlign: 'center', marginBottom: SPACING.sm },
  navRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.sm, paddingHorizontal: 8 },
  monthContainer: { marginBottom: SPACING.xl },
  monthTitle: { fontSize: FONT_SIZES.lg, fontFamily: 'Inter_600SemiBold', textAlign: 'center', marginBottom: SPACING.sm },
  weekHeader: { flexDirection: 'row', marginBottom: 8 },
  weekDay: { flex: 1, textAlign: 'center', fontSize: FONT_SIZES.xs, fontFamily: 'Inter_600SemiBold' },
  daysGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: { width: '14.28%', aspectRatio: 1, alignItems: 'center', justifyContent: 'center' },
  dayText: { fontSize: FONT_SIZES.md },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: SPACING.md },
  dateLabel: { fontSize: FONT_SIZES.md, fontFamily: 'Inter_500Medium' },
  confirmBtn: { paddingHorizontal: 24, paddingVertical: 10, borderRadius: BORDER_RADIUS.md },
  confirmText: { color: '#fff', fontFamily: 'Inter_600SemiBold', fontSize: FONT_SIZES.md },
});

export default DateRangePicker;
