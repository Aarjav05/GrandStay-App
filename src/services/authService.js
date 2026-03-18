import { supabase } from '../config/supabase';

// Subscribe to auth state changes
export const onAuthChange = (callback) => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user || null);
  });
  return () => subscription.unsubscribe();
};

export const login = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.user;
};

export const signup = async (name, email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
    },
  });
  if (error) throw error;
  
  return {
    user: data.user,
    session: data.session,
    requiresVerification: !data.session
  };
};

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const resetPassword = async (email) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) throw error;
};

export const getUserProfile = async (uid) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', uid)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error; // ignore no rows
  
  const authUser = (await supabase.auth.getUser()).data.user;
  const profileName = data?.name;
  const metaName = authUser?.user_metadata?.name;
  const emailName = authUser?.email?.split('@')[0];
  const displayName = profileName || metaName || emailName || '';
  
  return {
    uid: data?.id || uid,
    name: displayName,
    email: authUser?.email || '',
    avatar: data?.avatar,
    phone: data?.phone,
    walletBalance: data?.wallet_balance || 0,
  };
};

export const updateUserProfile = async (uid, updates) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', uid)
    .select()
    .single();

  if (error) throw error;
  return data;
};
