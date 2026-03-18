import React, { useEffect, useRef, useState } from 'react';
import { Animated, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BORDER_RADIUS, FONT_SIZES, SPACING, SHADOWS } from '../../utils/constants';

let toastRef = null;
export const showToast = (message, type = 'success', duration = 3000) => {
  toastRef?.show(message, type, duration);
};

const Toast = () => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState('success');
  const translateY = useRef(new Animated.Value(-100)).current;
  const insets = useSafeAreaInsets();
  const timeoutRef = useRef(null);

  useEffect(() => {
    toastRef = { show };
    return () => { toastRef = null; };
  }, []);

  const show = (msg, toastType = 'success', duration = 3000) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setMessage(msg);
    setType(toastType);
    setVisible(true);

    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      tension: 80,
      friction: 10,
    }).start();

    timeoutRef.current = setTimeout(hide, duration);
  };

  const hide = () => {
    Animated.timing(translateY, {
      toValue: -100,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setVisible(false));
  };

  const getConfig = () => {
    switch (type) {
      case 'success':
        return { bg: '#2E7D32', icon: 'checkmark-circle' };
      case 'error':
        return { bg: '#D32F2F', icon: 'alert-circle' };
      case 'info':
        return { bg: '#1976D2', icon: 'information-circle' };
      case 'warning':
        return { bg: '#F57C00', icon: 'warning' };
      default:
        return { bg: '#424242', icon: 'information-circle' };
    }
  };

  if (!visible) return null;

  const config = getConfig();

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: config.bg,
          transform: [{ translateY }],
          top: insets.top + 10,
        },
      ]}
    >
      <Ionicons name={config.icon} size={20} color="#fff" />
      <Text style={styles.message} numberOfLines={2}>{message}</Text>
      <TouchableOpacity onPress={hide}>
        <Ionicons name="close" size={18} color="#fff" />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: SPACING.lg,
    right: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    zIndex: 9999,
    ...SHADOWS.lg,
  },
  message: {
    flex: 1,
    color: '#fff',
    fontSize: FONT_SIZES.sm,
    fontFamily: 'Inter_500Medium',
    marginHorizontal: SPACING.sm,
  },
});

export default Toast;
