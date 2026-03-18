import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { showToast } from '../../components/common/Toast';
import { isValidEmail } from '../../utils/validators';
import { Ionicons } from '@expo/vector-icons';
import { SPACING, FONT_SIZES } from '../../utils/constants';
import * as authService from '../../services/authService';
import { useTranslation } from 'react-i18next';

const LoginScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { t } = useTranslation();

  const validate = () => {
    const e = {};
    if (!email.trim()) e.email = 'Email is required';
    else if (!isValidEmail(email)) e.email = 'Enter a valid email';
    if (!password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await login(email.trim(), password);
      showToast?.('Welcome back!', 'success');
    } catch (error) {
      showToast?.(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    if (!email.trim()) {
      Alert.alert('Enter Email', 'Please enter your email address first.');
      return;
    }
    Alert.alert(
      'Reset Password',
      `Send password reset email to ${email}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send',
          onPress: async () => {
            try {
              await authService.resetPassword(email.trim());
              showToast?.('Password reset email sent!', 'success');
            } catch (error) {
              showToast?.('Failed to send reset email', 'error');
            }
          },
        },
      ]
    );
  };

  return (
    <KeyboardAwareScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid={true}
      extraScrollHeight={Platform.OS === 'ios' ? 20 : 60}
    >
        <View style={styles.header}>
          <View style={[styles.iconBg, { backgroundColor: colors.primary + '15' }]}>
            <Ionicons name="bed" size={40} color={colors.primary} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>{t('auth.welcomeBack')}</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {t('auth.signInSubtitle')}
          </Text>
        </View>

        <Input
          label="Email Address"
          value={email}
          onChangeText={(t) => { setEmail(t); setErrors(prev => ({...prev, email: ''})); }}
          placeholder="you@email.com"
          keyboardType="email-address"
          leftIcon="mail-outline"
          error={errors.email}
        />
        <Input
          label="Password"
          value={password}
          onChangeText={(t) => { setPassword(t); setErrors(prev => ({...prev, password: ''})); }}
          placeholder="Enter your password"
          variant="password"
          leftIcon="lock-closed-outline"
          error={errors.password}
        />

        <Button
          title="Forgot Password?"
          onPress={handleForgotPassword}
          variant="ghost"
          size="sm"
          fullWidth={false}
          style={styles.forgotBtn}
        />

        <Button title={t('auth.login')} onPress={handleLogin} loading={loading} style={styles.loginBtn} />

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            {t('auth.noAccount')}{' '}
          </Text>
          <Button
            title={t('auth.signup')}
            onPress={() => navigation.navigate('Signup')}
            variant="ghost"
            size="sm"
            fullWidth={false}
          />
        </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flexGrow: 1, justifyContent: 'center', padding: SPACING.xxl },
  header: { alignItems: 'center', marginBottom: SPACING.xxxl },
  iconBg: { width: 80, height: 80, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  title: { fontSize: FONT_SIZES.title, fontFamily: 'Inter_800ExtraBold', marginBottom: 6 },
  subtitle: { fontSize: FONT_SIZES.md, textAlign: 'center' },
  forgotBtn: { alignSelf: 'flex-end', marginBottom: SPACING.lg },
  loginBtn: { marginTop: SPACING.sm },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: SPACING.xxl },
  footerText: { fontSize: FONT_SIZES.md },
});

export default LoginScreen;
