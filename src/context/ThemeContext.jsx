import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme } from '../utils/theme';

const THEME_KEY = '@grandstay_theme';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const saved = await AsyncStorage.getItem(THEME_KEY);
      if (saved !== null) {
        setIsDark(JSON.parse(saved));
      }
    } catch {
      // Default to light
    }
  };

  const toggleTheme = useCallback(async () => {
    const newValue = !isDark;
    setIsDark(newValue);
    try {
      await AsyncStorage.setItem(THEME_KEY, JSON.stringify(newValue));
    } catch {
      // Silently fail
    }
  }, [isDark]);

  const setDarkMode = useCallback(async (value) => {
    setIsDark(value);
    try {
      await AsyncStorage.setItem(THEME_KEY, JSON.stringify(value));
    } catch {
      // Silently fail
    }
  }, []);

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        theme,
        colors: theme.colors,
        toggleTheme,
        setDarkMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
