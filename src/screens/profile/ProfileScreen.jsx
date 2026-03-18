import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import Avatar from '../../components/common/Avatar';
import Divider from '../../components/common/Divider';
import { showToast } from '../../components/common/Toast';
import * as bookingService from '../../services/bookingService';
import { SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../../utils/constants';
import { useTranslation } from 'react-i18next';

const getMenuItems = (t) => [
  { id: 'wishlist', icon: 'heart-outline', label: t('profile.wishlist'), screen: 'Wishlist' },
  { id: 'settings', icon: 'settings-outline', label: t('profile.settings'), screen: 'Settings' },
  { id: 'help', icon: 'help-circle-outline', label: t('profile.help') },
  { id: 'about', icon: 'information-circle-outline', label: t('profile.about') },
];

const ProfileScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const [stats, setStats] = useState({ totalBookings: 0, totalSpent: 0, completedBookings: 0 });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    if (!user?.uid) return;
    try {
      const s = await bookingService.getBookingStats(user.uid);
      setStats(s);
    } catch {}
  };

  const handleLogout = async () => {
    try {
      await logout();
      showToast?.('Logged out successfully', 'info');
    } catch (error) {
      showToast?.(error.message, 'error');
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Avatar uri={user?.avatar} name={user?.name} size={80} />
        <Text style={styles.name}>{user?.name || t('common.traveler')}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <View style={styles.statsRow}>
        <StatBox label={t('profile.bookings')} value={stats.totalBookings} colors={colors} />
        <StatBox label={t('profile.completed')} value={stats.completedBookings} colors={colors} />
        <StatBox label={t('profile.spent')} value={`₹${Math.round(stats.totalSpent / 1000)}k`} colors={colors} />
      </View>

      <View style={styles.menu}>
        {getMenuItems(t).map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.menuItem, { borderColor: colors.borderLight }]}
            onPress={() => item.screen && navigation.navigate(item.screen)}
          >
            <View style={[styles.menuIcon, { backgroundColor: colors.primary + '12' }]}>
              <Ionicons name={item.icon} size={22} color={colors.primary} />
            </View>
            <Text style={[styles.menuLabel, { color: colors.text }]}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity onPress={handleLogout} style={[styles.logoutBtn, { borderColor: colors.error }]}>
        <Ionicons name="log-out-outline" size={20} color={colors.error} />
        <Text style={[styles.logoutText, { color: colors.error }]}>{t('profile.logout')}</Text>
      </TouchableOpacity>

      <Text style={[styles.version, { color: colors.textTertiary }]}>अतिथि v1.0.0</Text>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const StatBox = ({ label, value, colors }) => (
  <View style={[statStyles.box, { backgroundColor: colors.card, borderColor: colors.borderLight }]}>
    <Text style={[statStyles.value, { color: colors.primary }]}>{value}</Text>
    <Text style={[statStyles.label, { color: colors.textSecondary }]}>{label}</Text>
  </View>
);

const statStyles = StyleSheet.create({
  box: { flex: 1, alignItems: 'center', padding: SPACING.md, borderRadius: BORDER_RADIUS.md, borderWidth: 1, marginHorizontal: 4, ...SHADOWS.sm },
  value: { fontSize: FONT_SIZES.xxl, fontFamily: 'Inter_800ExtraBold' },
  label: { fontSize: FONT_SIZES.xs, marginTop: 4 },
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { alignItems: 'center', paddingTop: 60, paddingBottom: 30, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  name: { fontSize: FONT_SIZES.xxl, fontFamily: 'Inter_800ExtraBold', color: '#fff', marginTop: SPACING.md },
  email: { fontSize: FONT_SIZES.sm, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  statsRow: { flexDirection: 'row', paddingHorizontal: SPACING.lg, marginTop: -20, marginBottom: SPACING.lg },
  menu: { paddingHorizontal: SPACING.lg },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.md,
    borderBottomWidth: 1,
  },
  menuIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  menuLabel: { flex: 1, fontSize: FONT_SIZES.md, fontFamily: 'Inter_500Medium' },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    marginHorizontal: SPACING.lg, marginTop: SPACING.xxl,
    paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.md, borderWidth: 1.5,
  },
  logoutText: { fontSize: FONT_SIZES.md, fontFamily: 'Inter_600SemiBold', marginLeft: 8 },
  version: { textAlign: 'center', fontSize: FONT_SIZES.xs, marginTop: SPACING.lg },
});

export default ProfileScreen;
