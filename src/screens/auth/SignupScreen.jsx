import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { showToast } from '../../components/common/Toast';
import { isValidEmail, isValidPassword, getPasswordStrength } from '../../utils/validators';
import { Ionicons } from '@expo/vector-icons';
import { SPACING, FONT_SIZES } from '../../utils/constants';

const SignupScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const strength = getPasswordStrength(password);

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = 'Full name is required';
    if (!email.trim()) e.email = 'Email is required';
    else if (!isValidEmail(email)) e.email = 'Enter a valid email';
    if (!password) e.password = 'Password is required';
    else if (!isValidPassword(password)) e.password = 'Password must be at least 8 characters';
    if (password !== confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSignup = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const result = await signup(name.trim(), email.trim(), password);
      
      if (result?.requiresVerification) {
        showToast?.('Account created! Please check your email to verify.', 'success');
        navigation.goBack();
      } else {
        showToast?.('Account created successfully!', 'success');
      }
    } catch (error) {
      showToast?.(error.message, 'error');
    } finally {
      setLoading(false);
    }
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
            <Ionicons name="person-add" size={36} color={colors.primary} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>Create Account</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Join GrandStay to discover your perfect stay
          </Text>
        </View>

        <Input label="Full Name" value={name} onChangeText={setName} placeholder="John Doe" autoCapitalize="words" leftIcon="person-outline" error={errors.name} />
        <Input label="Email Address" value={email} onChangeText={setEmail} placeholder="you@email.com" keyboardType="email-address" leftIcon="mail-outline" error={errors.email} />
        <Input label="Password" value={password} onChangeText={setPassword} placeholder="Minimum 8 characters" variant="password" leftIcon="lock-closed-outline" error={errors.password} />

        {password.length > 0 && (
          <View style={styles.strengthRow}>
            <View style={[styles.strengthBar, { backgroundColor: colors.border }]}>
              <View style={[styles.strengthFill, { width: `${(strength.score / 5) * 100}%`, backgroundColor: strength.color }]} />
            </View>
            <Text style={[styles.strengthLabel, { color: strength.color }]}>{strength.label}</Text>
          </View>
        )}

        <Input label="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Re-enter password" variant="password" leftIcon="lock-closed-outline" error={errors.confirmPassword} />

        <Button title="Create Account" onPress={handleSignup} loading={loading} style={styles.signupBtn} />

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>Already have an account? </Text>
          <Button title="Login" onPress={() => navigation.goBack()} variant="ghost" size="sm" fullWidth={false} />
        </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flexGrow: 1, justifyContent: 'center', padding: SPACING.xxl },
  header: { alignItems: 'center', marginBottom: SPACING.xxl },
  iconBg: { width: 80, height: 80, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  title: { fontSize: FONT_SIZES.title, fontWeight: '800', marginBottom: 6 },
  subtitle: { fontSize: FONT_SIZES.md, textAlign: 'center' },
  strengthRow: { flexDirection: 'row', alignItems: 'center', marginTop: -12, marginBottom: SPACING.lg },
  strengthBar: { flex: 1, height: 4, borderRadius: 2, marginRight: 8, overflow: 'hidden' },
  strengthFill: { height: '100%', borderRadius: 2 },
  strengthLabel: { fontSize: 11, fontWeight: '600' },
  signupBtn: { marginTop: SPACING.sm },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: SPACING.xxl },
  footerText: { fontSize: FONT_SIZES.md },
});

export default SignupScreen;
