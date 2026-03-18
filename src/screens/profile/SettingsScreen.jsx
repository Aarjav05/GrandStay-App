import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useTranslation } from 'react-i18next';
import { LANGUAGES } from '../../i18n';
import Divider from '../../components/common/Divider';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '../../utils/constants';

const SettingsScreen = () => {
  const { colors, isDark, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const [notifications, setNotifications] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);

  const handleClearCache = () => {
    Alert.alert('Clear Cache', 'This will clear all cached data. Continue?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', onPress: () => { /* clear cache logic */ } },
    ]);
  };

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>APPEARANCE</Text>
      <SettingRow
        icon="moon-outline" label={t('settings.theme')} colors={colors}
        right={<Switch value={isDark} onValueChange={toggleTheme} trackColor={{ false: colors.border, true: colors.primary }} thumbColor="#fff" />}
      />

      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{t('settings.language').toUpperCase()}</Text>
      <View style={styles.langGrid}>
        {LANGUAGES.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            onPress={() => changeLanguage(lang.code)}
            style={[
              styles.langChip,
              {
                backgroundColor: i18n.language === lang.code ? colors.primary : colors.surface,
                borderColor: i18n.language === lang.code ? colors.primary : colors.border,
              },
            ]}
          >
            <Text style={[styles.langNative, { color: i18n.language === lang.code ? '#fff' : colors.text }]}>
              {lang.nativeLabel}
            </Text>
            <Text style={[styles.langLabel, { color: i18n.language === lang.code ? 'rgba(255,255,255,0.7)' : colors.textTertiary }]}>
              {lang.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{t('settings.notifications').toUpperCase()}</Text>
      <SettingRow icon="notifications-outline" label={t('settings.notifications')} colors={colors}
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
  label: { flex: 1, fontSize: FONT_SIZES.md, fontFamily: 'Inter_500Medium' },
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  sectionTitle: { fontSize: FONT_SIZES.xs, fontFamily: 'Inter_700Bold', letterSpacing: 1, paddingHorizontal: SPACING.lg, paddingTop: SPACING.xl, paddingBottom: SPACING.sm },
  langGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.lg,
    gap: 8,
  },
  langChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    alignItems: 'center',
    minWidth: 100,
  },
  langNative: {
    fontSize: FONT_SIZES.md,
    fontFamily: 'Inter_600SemiBold',
  },
  langLabel: {
    fontSize: FONT_SIZES.xs,
    marginTop: 2,
  },
});

export default SettingsScreen;

