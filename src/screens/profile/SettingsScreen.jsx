import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import Divider from '../../components/common/Divider';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '../../utils/constants';

const SettingsScreen = () => {
  const { colors, isDark, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);

  const handleClearCache = () => {
    Alert.alert('Clear Cache', 'This will clear all cached data. Continue?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', onPress: () => { /* clear cache logic */ } },
    ]);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>APPEARANCE</Text>
      <SettingRow
        icon="moon-outline" label="Dark Mode" colors={colors}
        right={<Switch value={isDark} onValueChange={toggleTheme} trackColor={{ false: colors.border, true: colors.primary }} thumbColor="#fff" />}
      />

      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>NOTIFICATIONS</Text>
      <SettingRow icon="notifications-outline" label="Push Notifications" colors={colors}
        right={<Switch value={notifications} onValueChange={setNotifications} trackColor={{ false: colors.border, true: colors.primary }} thumbColor="#fff" />}
      />

      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>PRIVACY</Text>
      <SettingRow icon="location-outline" label="Location Services" colors={colors}
        right={<Switch value={locationEnabled} onValueChange={setLocationEnabled} trackColor={{ false: colors.border, true: colors.primary }} thumbColor="#fff" />}
      />

      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>STORAGE</Text>
      <TouchableOpacity onPress={handleClearCache}>
        <SettingRow icon="trash-outline" label="Clear Cache" colors={colors} right={<Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />} />
      </TouchableOpacity>

      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>ABOUT</Text>
      <SettingRow icon="document-text-outline" label="Terms of Service" colors={colors} right={<Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />} />
      <SettingRow icon="shield-outline" label="Privacy Policy" colors={colors} right={<Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />} />
      <SettingRow icon="information-circle-outline" label="App Version" colors={colors} right={<Text style={{ color: colors.textTertiary }}>1.0.0</Text>} />

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const SettingRow = ({ icon, label, colors, right }) => (
  <View style={[rowStyles.row, { backgroundColor: colors.card, borderColor: colors.borderLight }]}>
    <Ionicons name={icon} size={20} color={colors.primary} style={rowStyles.icon} />
    <Text style={[rowStyles.label, { color: colors.text }]}>{label}</Text>
    {right}
  </View>
);

const rowStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md, marginHorizontal: SPACING.lg, marginBottom: 2, borderRadius: BORDER_RADIUS.md, borderWidth: 1 },
  icon: { marginRight: 12 },
  label: { flex: 1, fontSize: FONT_SIZES.md, fontWeight: '500' },
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  sectionTitle: { fontSize: FONT_SIZES.xs, fontWeight: '700', letterSpacing: 1, paddingHorizontal: SPACING.lg, paddingTop: SPACING.xl, paddingBottom: SPACING.sm },
});

export default SettingsScreen;
