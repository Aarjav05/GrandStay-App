import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import * as authService from '../services/authService';
import { getErrorMessage } from '../utils/errorMessages';
import { supabase } from '../config/supabase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Check active session immediately
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) {
        if (session?.user) {
          fetchAndSetProfile(session.user);
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          fetchAndSetProfile(session.user);
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchAndSetProfile = async (supabaseUser) => {
    try {
      const profile = await authService.getUserProfile(supabaseUser.id);
      setUser(profile || {
        uid: supabaseUser.id,
        name: supabaseUser.user_metadata?.name || '',
        email: supabaseUser.email || '',
      });
    } catch {
      setUser({
        uid: supabaseUser.id,
        name: supabaseUser.user_metadata?.name || '',
        email: supabaseUser.email || '',
      });
    } finally {
      setLoading(false);
    }
  };

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      await authService.login(email, password);
    } catch (error) {
      setLoading(false);
      throw new Error(getErrorMessage(error));
    }
  }, []);

  const signup = useCallback(async (name, email, password) => {
    setLoading(true);
    try {
      const result = await authService.signup(name, email, password);
      setLoading(false);
      return result;
    } catch (error) {
      setLoading(false);
      throw new Error(getErrorMessage(error));
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }, []);

  const updateUser = useCallback(async (data) => {
    if (!user?.uid) return;
    try {
      await authService.updateUserProfile(user.uid, data);
      setUser((prev) => ({ ...prev, ...data }));
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }, [user?.uid]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        updateUser,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
