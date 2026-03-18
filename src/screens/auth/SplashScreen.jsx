import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';

const SplashScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { isAuthenticated, loading } = useAuth();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => {
      if (!loading) {
        if (isAuthenticated) {
          // Auth context will handle the switch via AppNavigator
        } else {
          navigation.replace('Login');
        }
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [loading, isAuthenticated]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      const timer = setTimeout(() => navigation.replace('Login'), 2000);
      return () => clearTimeout(timer);
    }
  }, [loading, isAuthenticated]);

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.logoContainer}>
          <Ionicons name="bed" size={64} color="#fff" />
        </View>
        <Text style={styles.appName}>अतिथि</Text>
        <Text style={styles.tagline}>Your Perfect Stay Awaits</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { alignItems: 'center' },
  logoContainer: {
    width: 120, height: 120, borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 20,
  },
  appName: { fontSize: 36, fontFamily: 'Inter_800ExtraBold', color: '#fff', letterSpacing: 1 },
  tagline: { fontSize: 16, color: 'rgba(255,255,255,0.8)', marginTop: 8 },
});

export default SplashScreen;
